import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';

const LOG_PREFIX = '[meta-leads-webhook]';

function getMetaVerifyToken(): string | undefined {
  return process.env.META_VERIFY_TOKEN?.trim();
}

function getMetaAppSecret(): string | undefined {
  return process.env.META_APP_SECRET?.trim();
}

/**
 * Meta sends `X-Hub-Signature-256: sha256=<hex>` over the raw request body.
 */
function verifyMetaSignature(rawBody: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader?.startsWith('sha256=')) return false;
  const expectedHex = signatureHeader.slice('sha256='.length);
  let expectedBuf: Buffer;
  try {
    expectedBuf = Buffer.from(expectedHex, 'hex');
  } catch {
    return false;
  }
  const hmac = createHmac('sha256', appSecret);
  hmac.update(rawBody, 'utf8');
  const digest = hmac.digest();
  if (expectedBuf.length !== digest.length) return false;
  return timingSafeEqual(expectedBuf, digest);
}

function logPostPayloadSummary(body: unknown): void {
  if (typeof body !== 'object' || body === null) {
    console.log(`${LOG_PREFIX} POST payload: non-object`);
    return;
  }
  const root = body as Record<string, unknown>;
  const objectType = typeof root.object === 'string' ? root.object : '(missing)';
  const entries = Array.isArray(root.entry) ? root.entry : [];
  let leadgenCount = 0;
  const leadgenIds: string[] = [];
  const formIds: string[] = [];
  const pageIds: string[] = [];

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) continue;
    const ent = entry as Record<string, unknown>;
    const entryId = ent.id;
    if (typeof entryId === 'string' || typeof entryId === 'number') {
      pageIds.push(String(entryId));
    }
    const changes = Array.isArray(ent.changes) ? ent.changes : [];
    for (const ch of changes) {
      if (typeof ch !== 'object' || ch === null) continue;
      const change = ch as Record<string, unknown>;
      if (change.field !== 'leadgen') continue;
      leadgenCount += 1;
      const value = change.value;
      if (value && typeof value === 'object' && value !== null) {
        const v = value as Record<string, unknown>;
        const id = v.leadgen_id;
        if (typeof id === 'string' || typeof id === 'number') {
          leadgenIds.push(String(id));
        }
        const formId = v.form_id;
        if (typeof formId === 'string' || typeof formId === 'number') {
          formIds.push(String(formId));
        }
        const pageId = v.page_id;
        if (typeof pageId === 'string' || typeof pageId === 'number') {
          pageIds.push(String(pageId));
        }
      }
    }
  }

  console.log(`${LOG_PREFIX} POST received`, {
    object: objectType,
    entryCount: entries.length,
    leadgenChangeCount: leadgenCount,
    leadgenIdsSample: leadgenIds.slice(0, 5),
    formIdsSample: formIds.slice(0, 5),
    pageIdsSample: [...new Set(pageIds)].slice(0, 5),
  });
}

/** GET — Meta webhook subscription verification */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get('hub.mode');
  const verifyToken = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const expectedToken = getMetaVerifyToken();

  if (!expectedToken) {
    console.error(`${LOG_PREFIX} GET verification failed: META_VERIFY_TOKEN is not configured`);
    return new NextResponse('Verification token not configured', { status: 503 });
  }

  if (mode !== 'subscribe' || !challenge) {
    console.warn(`${LOG_PREFIX} GET verification rejected: invalid query`, {
      modePresent: mode !== null,
      challengePresent: challenge !== null,
    });
    return new NextResponse('Bad Request', { status: 400 });
  }

  if (verifyToken !== expectedToken) {
    console.warn(`${LOG_PREFIX} GET verification failed: verify_token mismatch`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  console.log(`${LOG_PREFIX} GET verification succeeded`);
  return new NextResponse(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/** POST — Meta webhook events (e.g. leadgen); responds quickly without syncing to Brevo yet */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const appSecret = getMetaAppSecret();
  const signatureHeader = request.headers.get('x-hub-signature-256');
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    if (!appSecret) {
      console.error(`${LOG_PREFIX} POST rejected: META_APP_SECRET is not configured`);
      return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 503 });
    }
    if (!signatureHeader || !verifyMetaSignature(rawBody, signatureHeader, appSecret)) {
      console.warn(`${LOG_PREFIX} POST rejected: invalid or missing signature`);
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
  } else {
    if (appSecret) {
      if (!signatureHeader || !verifyMetaSignature(rawBody, signatureHeader, appSecret)) {
        console.warn(`${LOG_PREFIX} POST rejected: invalid or missing signature`);
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    } else {
      console.warn(
        `${LOG_PREFIX} POST: META_APP_SECRET not set — skipping signature verification (development only)`
      );
    }
  }

  let parsed: unknown;
  try {
    parsed = rawBody.trim() ? JSON.parse(rawBody) : {};
  } catch {
    console.warn(`${LOG_PREFIX} POST rejected: malformed JSON`);
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  logPostPayloadSummary(parsed);

  return NextResponse.json({ success: true, received: true }, { status: 200 });
}

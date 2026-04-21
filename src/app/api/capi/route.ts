import { NextRequest, NextResponse } from 'next/server';
import { sendCAPIEvent } from '@/lib/capi';
import type { CAPICustomData, CAPIUserData } from '@/lib/capi';

// Force Node.js runtime — required for the crypto module used in capi.ts hashing.
export const runtime = 'nodejs';

const LOG_PREFIX = '[api/capi]';

const ALLOWED_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Lead',
  'InitiateCheckout',
  'Purchase',
  'Contact',
]);

interface CAPIRequestBody {
  event_name: string;
  event_id: string;
  event_source_url: string;
  custom_data?: CAPICustomData;
  /** Optional PII from the browser — hashed server-side before forwarding. */
  user_data?: Pick<CAPIUserData, 'em' | 'ph' | 'fn' | 'ln'>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: CAPIRequestBody;
  try {
    body = (await req.json()) as CAPIRequestBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { event_name, event_id, event_source_url, custom_data, user_data } = body;

  if (!event_name || !ALLOWED_EVENTS.has(event_name)) {
    return NextResponse.json({ error: 'invalid_event_name' }, { status: 400 });
  }

  if (!event_id || !event_source_url) {
    return NextResponse.json({ error: 'missing_required_fields' }, { status: 400 });
  }

  // IP extraction — x-forwarded-for is set by Vercel's edge; take the first (leftmost) address.
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = xForwardedFor ? (xForwardedFor.split(',')[0]?.trim() ?? undefined) : undefined;
  const userAgent = req.headers.get('user-agent') ?? undefined;

  // Meta browser cookies improve attribution quality.
  const fbc = req.cookies.get('_fbc')?.value;
  const fbp = req.cookies.get('_fbp')?.value;

  // Fire-and-forget — return 200 immediately; CAPI call settles in the background.
  // sendCAPIEvent never throws, so no uncaught rejections.
  void sendCAPIEvent({
    event_name,
    event_id,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url,
    action_source: 'website',
    user_data: {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
      fbc,
      fbp,
      em: user_data?.em,
      ph: user_data?.ph,
      fn: user_data?.fn,
      ln: user_data?.ln,
    },
    custom_data,
  }).catch((err: unknown) => {
    console.error(`${LOG_PREFIX} unhandled rejection:`, err);
  });

  return NextResponse.json({ ok: true });
}

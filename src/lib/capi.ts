import { createHash } from 'crypto';

/**
 * Meta Conversions API (CAPI) — server-only event forwarding utility.
 *
 * Deduplication strategy: every browser fbq() call includes { eventID: id }, and the
 * matching CAPI event carries the same event_id. Meta uses this shared id to suppress
 * duplicate counting in reports while retaining the higher-quality server signal for
 * attribution — recovering events lost to ad blockers and iOS restrictions.
 *
 * PII (email, phone, name) is SHA-256 hashed after normalization. Raw PII is never logged
 * or forwarded.
 */

const GRAPH_API_VERSION =
  process.env.META_GRAPH_API_VERSION?.trim() || 'v21.0';

const LOG_PREFIX = '[meta-capi]';

// ---------------------------------------------------------------------------
// PII hashing — Meta normalization rules
// ---------------------------------------------------------------------------

/** Lowercase + trim, then SHA-256. Used for email and name fields. */
function hashPII(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

/** Strip all non-digit characters (preserve country code digits), then SHA-256. */
function hashPhone(phone: string): string {
  return createHash('sha256').update(phone.replace(/\D/g, '')).digest('hex');
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CAPIUserData {
  /** Raw email — will be normalized and hashed before sending. */
  em?: string;
  /** Raw phone — will be stripped to digits and hashed before sending. */
  ph?: string;
  /** Raw first name — will be lowercased, trimmed, and hashed. */
  fn?: string;
  /** Raw last name — will be lowercased, trimmed, and hashed. */
  ln?: string;
  /** Client IP address — not hashed; passed as-is. */
  client_ip_address?: string;
  /** Browser user-agent string — not hashed; passed as-is. */
  client_user_agent?: string;
  /** Value of the _fbc browser cookie (Meta click ID). */
  fbc?: string;
  /** Value of the _fbp browser cookie (Meta browser ID). */
  fbp?: string;
}

export interface CAPICustomData {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface CAPIPayload {
  event_name: string;
  /** UUID shared with the browser fbq() call for deduplication. */
  event_id: string;
  /** Unix timestamp in seconds. */
  event_time: number;
  event_source_url: string;
  /** Must be 'website' for all web-originated events. */
  action_source: 'website';
  user_data: CAPIUserData;
  custom_data?: CAPICustomData;
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------

/**
 * Send a single CAPI event to Meta's Graph API.
 * Never throws — CAPI failures must not interrupt the user flow.
 * Silently no-ops when NEXT_PUBLIC_META_PIXEL_ID or META_CAPI_ACCESS_TOKEN are unset.
 */
export async function sendCAPIEvent(payload: CAPIPayload): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();

  if (!pixelId || !accessToken) {
    // No-op in dev/staging when env vars are not configured.
    return;
  }

  // Build hashed user_data — strip undefined keys so Meta doesn't receive empty fields.
  const rawUd: Record<string, string | undefined> = {
    client_ip_address: payload.user_data.client_ip_address,
    client_user_agent: payload.user_data.client_user_agent,
    fbc: payload.user_data.fbc,
    fbp: payload.user_data.fbp,
  };
  if (payload.user_data.em) rawUd.em = hashPII(payload.user_data.em);
  if (payload.user_data.ph) rawUd.ph = hashPhone(payload.user_data.ph);
  if (payload.user_data.fn) rawUd.fn = hashPII(payload.user_data.fn);
  if (payload.user_data.ln) rawUd.ln = hashPII(payload.user_data.ln);

  const cleanUd = Object.fromEntries(
    Object.entries(rawUd).filter(([, v]) => v != null && v !== '')
  );

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: payload.event_name,
        event_id: payload.event_id,
        event_time: payload.event_time,
        event_source_url: payload.event_source_url,
        action_source: payload.action_source,
        user_data: cleanUd,
        ...(payload.custom_data ? { custom_data: payload.custom_data } : {}),
      },
    ],
    access_token: accessToken,
  };

  // Include test_event_code only when set — remove from Vercel env in production.
  const testCode = process.env.META_CAPI_TEST_CODE?.trim();
  if (testCode) body.test_event_code = testCode;

  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`${LOG_PREFIX} HTTP ${res.status}:`, text.slice(0, 300));
    }
  } catch (err) {
    // Network or timeout — log only, never bubble.
    console.error(
      `${LOG_PREFIX} fetch error:`,
      err instanceof Error ? err.message : String(err)
    );
  }
}

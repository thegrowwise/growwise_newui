/**
 * Environment validation for chatbot + Supabase server usage (GWA-163).
 * Fails fast when required variables are missing or use obsolete contact domains.
 */

function hasObsoleteGrowwiseComDomain(email: string): boolean {
  return /@(?:the)?growwise\.com\s*$/i.test(email.trim());
}

function normalizeUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, '');
}

export type ChatbotSupabaseEnv = {
  url: string;
  serviceRoleKey: string;
  /** Outbound / reply contact for chatbot-related flows; must use growwiseschool.org (not thegrowwise.com). */
  contactEmail: string;
};

let cached: ChatbotSupabaseEnv | null = null;

/**
 * Required for `getSupabaseAdmin()` and any server route that persists chatbot data.
 *
 * - `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL` — project URL
 * - `SUPABASE_SERVICE_ROLE_KEY` — server-only; never expose to the client
 * - `GROWWISE_CONTACT_EMAIL` — e.g. `contact@growwiseschool.org` (legacy growwise.com domains rejected)
 */
export function getChatbotSupabaseEnv(): ChatbotSupabaseEnv {
  if (cached) return cached;

  const urlRaw =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const contactEmail = process.env.GROWWISE_CONTACT_EMAIL?.trim();

  if (!urlRaw) {
    throw new Error(
      '[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL for chatbot infrastructure.',
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      '[supabase] Missing SUPABASE_SERVICE_ROLE_KEY (server-only). Do not use the anon key here.',
    );
  }
  if (!contactEmail) {
    throw new Error(
      '[supabase] Missing GROWWISE_CONTACT_EMAIL (use contact@growwiseschool.org for Grow Wise School flows).',
    );
  }
  if (hasObsoleteGrowwiseComDomain(contactEmail)) {
    throw new Error(
      '[supabase] GROWWISE_CONTACT_EMAIL must not use legacy growwise.com; use contact@growwiseschool.org.',
    );
  }
  if (!contactEmail.includes('growwiseschool.org')) {
    throw new Error(
      '[supabase] GROWWISE_CONTACT_EMAIL must be a growwiseschool.org address (e.g. contact@growwiseschool.org).',
    );
  }

  let url: string;
  try {
    const parsed = new URL(urlRaw);
    if (parsed.protocol !== 'https:') {
      throw new Error('HTTPS required');
    }
    url = normalizeUrl(parsed.toString());
  } catch {
    throw new Error(`[supabase] Invalid Supabase URL: ${urlRaw}`);
  }

  cached = { url, serviceRoleKey, contactEmail };
  return cached;
}

/** @internal — tests */
export function __resetChatbotSupabaseEnvCacheForTests(): void {
  cached = null;
}

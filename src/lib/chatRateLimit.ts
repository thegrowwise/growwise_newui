/**
 * In-memory sliding-window rate limiter for public JSON APIs (`/api/chat`, lead forms).
 *
 * Namespaces isolate budgets: `chat` vs `contact` vs `assessment` vs `enroll`.
 * Uses Vercel's x-vercel-forwarded-for header (injected by Vercel, cannot be spoofed by client).
 * Resets on cold start, but email deduplication (C-4) provides the real abuse protection.
 */

export type RateLimitNamespace = 'chat' | 'contact' | 'assessment' | 'enroll';

const CHAT_DEFAULT_MAX = 20;
const CHAT_DEFAULT_WINDOW_MS = 15 * 60_000;
const FORM_DEFAULT_MAX = 5;
const FORM_DEFAULT_WINDOW_MS = 60 * 60_000;

const MAX_TRACKED_IPS = 10_000;

type Bucket = number[];

const buckets: Map<string, Bucket> = new Map();

function getLimits(namespace: RateLimitNamespace): { max: number; windowMs: number } {
  if (namespace === 'chat') {
    return {
      max: Number(process.env.CHAT_RATE_LIMIT_MAX) || CHAT_DEFAULT_MAX,
      windowMs: Number(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || CHAT_DEFAULT_WINDOW_MS,
    };
  }
  return {
    max: Number(process.env.FORM_RATE_LIMIT_MAX) || FORM_DEFAULT_MAX,
    windowMs: Number(process.env.FORM_RATE_LIMIT_WINDOW_MS) || FORM_DEFAULT_WINDOW_MS,
  };
}

/**
 * Returns true if allowed, false → caller should respond HTTP 429.
 */
export function isAllowed(namespace: RateLimitNamespace, clientIp: string): boolean {
  if (!clientIp) return true;
  const key = `${namespace}:${clientIp}`;
  const { max, windowMs } = getLimits(namespace);
  const now = Date.now();
  const cutoff = now - windowMs;

  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_TRACKED_IPS) {
      const firstKey = buckets.keys().next().value;
      if (firstKey !== undefined) buckets.delete(firstKey);
    }
    bucket = [];
    buckets.set(key, bucket);
  }

  let writeIdx = 0;
  for (let readIdx = 0; readIdx < bucket.length; readIdx++) {
    if (bucket[readIdx] >= cutoff) {
      bucket[writeIdx++] = bucket[readIdx];
    }
  }
  bucket.length = writeIdx;

  if (bucket.length >= max) return false;
  bucket.push(now);
  return true;
}

export function clientIpFrom(req: Request): string {
  // Use Vercel-injected x-vercel-forwarded-for (cannot be spoofed by client)
  const vff = req.headers.get('x-vercel-forwarded-for');
  if (vff) {
    const first = vff.split(',')[0]?.trim();
    if (first) return first;
  }

  // Fallback: x-real-ip from Vercel Functions
  const xri = req.headers.get('x-real-ip');
  if (xri) return xri.trim();

  // Fallback: X-Forwarded-For (spoofable, but better than nothing)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }

  return 'unknown';
}

export function __resetForTests(): void {
  buckets.clear();
}

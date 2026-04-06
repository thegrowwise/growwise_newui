/**
 * Real API base (Express backend). Default port 3001 matches `growwise_backend` (`PORT` default).
 * Do not set this to the Next.js dev URL (e.g. :3000) — `/api/pricing-config` would proxy to itself.
 */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Returns the configured backend base URL (trimmed), or null when unset.
 * Use when you must not guess (e.g. logging, debug).
 */
export function getBackendBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

/**
 * Base URL for Next Route Handlers that proxy to Express (server-side only).
 * Checks private server env first (`BACKEND_URL` on Vercel), then `NEXT_PUBLIC_BACKEND_URL`,
 * then in **development** defaults to `http://localhost:3001` so local dev works without env.
 */
export function getBackendBaseUrlForProxy(): string | null {
  const raw =
    process.env.BACKEND_URL?.trim() ||
    process.env.BACKEND_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  return null;
}

/**
 * Real API base (Express backend). Default port 3001 matches `growwise_backend` (`PORT` default).
 * Do not set this to the Next.js dev URL (e.g. :3000) — `/api/pricing-config` would proxy to itself.
 */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

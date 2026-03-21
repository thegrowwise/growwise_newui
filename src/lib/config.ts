/** Default matches typical `next dev` (port 3000). Override with NEXT_PUBLIC_BACKEND_URL for a separate API host. */
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

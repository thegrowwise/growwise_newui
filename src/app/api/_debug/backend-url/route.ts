import { NextResponse } from 'next/server';
import { getBackendBaseUrl, getBackendBaseUrlForProxy } from '@/lib/config';

/**
 * Safe runtime check: which backend base URL this deployment resolves for proxy routes.
 * No secrets; useful to verify Vercel Preview has NEXT_PUBLIC_BACKEND_URL set.
 */
export async function GET() {
  const explicit = getBackendBaseUrl();
  const proxy = getBackendBaseUrlForProxy();

  return NextResponse.json({
    configured: explicit !== null,
    nextPublicBackendUrl: explicit,
    /** URL used by proxy Route Handlers (dev may fall back to localhost:3001). */
    resolvedForProxy: proxy,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}

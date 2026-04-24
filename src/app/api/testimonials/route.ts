import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

/** Slightly above Express axios timeout to backend Google call so the proxy does not hang indefinitely. */
const PROXY_TO_BACKEND_MS = 12_000;

/**
 * Proxies GET /api/testimonials → Express backend (same-origin from the browser).
 */
export async function GET(request: Request) {
  try {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json(
        {
          success: false,
          error: 'Backend is not configured',
          message: 'Set NEXT_PUBLIC_BACKEND_URL or run the backend on port 3001.',
        },
        { status: 503 },
      );
    }
    const { search } = new URL(request.url);
    const res = await fetch(`${base}/api/testimonials${search}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(PROXY_TO_BACKEND_MS),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const isTimeout =
      error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
    const message = isTimeout
      ? 'Backend request timed out. Is the API server running and reachable?'
      : error instanceof Error
        ? error.message
        : 'Proxy failed';
    return NextResponse.json({ success: false, error: message }, { status: isTimeout ? 504 : 502 });
  }
}

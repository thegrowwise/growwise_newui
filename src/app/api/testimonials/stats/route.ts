import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

const PROXY_TO_BACKEND_MS = 12_000;

export async function GET() {
  try {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json(
        { success: false, error: 'Backend is not configured' },
        { status: 503 },
      );
    }
    const res = await fetch(`${base}/api/testimonials/stats`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(PROXY_TO_BACKEND_MS),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const isTimeout =
      error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
    const message = isTimeout
      ? 'Backend request timed out. Is the API server running?'
      : error instanceof Error
        ? error.message
        : 'Proxy failed';
    return NextResponse.json({ success: false, error: message }, { status: isTimeout ? 504 : 502 });
  }
}

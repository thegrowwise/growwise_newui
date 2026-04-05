import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

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
    const res = await fetch(`${base}/api/testimonials${search}`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy failed';
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

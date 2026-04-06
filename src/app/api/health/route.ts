import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

/** Proxies GET /api/health → Express GET /health (for browser-side checks without CORS). */
export async function GET() {
  try {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json({ ok: false, error: 'Backend not configured' }, { status: 503 });
    }
    const res = await fetch(`${base}/health`, { cache: 'no-store' });
    const ct = res.headers.get('Content-Type') || '';
    if (ct.includes('application/json')) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    const text = await res.text();
    return new NextResponse(text, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy failed';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

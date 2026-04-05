import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

export async function GET() {
  try {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json(
        { success: false, error: 'Backend is not configured' },
        { status: 503 },
      );
    }
    const res = await fetch(`${base}/api/testimonials/stats`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy failed';
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

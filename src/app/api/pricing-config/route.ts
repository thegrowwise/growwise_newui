import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

export async function GET() {
  try {
    const base = BACKEND_URL.replace(/\/$/, '');
    const res = await fetch(`${base}/api/pricing-config`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Backend responded with HTTP ${res.status}`);

    const backendJson = (await res.json()) as unknown as
      | { success?: boolean; data?: unknown; error?: string }
      | { data?: unknown };

    // Backend returns: { success: true, data: { programs, last_updated, ... } }
    // Forward the inner config so the client gets json.data.programs (see usePricingConfig).
    const raw = backendJson as Record<string, unknown>;
    const inner = raw?.data as Record<string, unknown> | undefined;
    const data =
      inner && Array.isArray(inner.programs)
        ? inner
        : inner && typeof inner.data === 'object' && inner.data !== null && Array.isArray((inner.data as Record<string, unknown>).programs)
          ? (inner.data as Record<string, unknown>)
          : raw?.data;

    if (!data || typeof data !== 'object' || !Array.isArray((data as { programs?: unknown }).programs)) {
      throw new Error('Backend returned empty pricing config');
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load pricing config';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

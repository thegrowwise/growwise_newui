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

    // Express backend serves the JSON file as-is: { programs, last_updated, ... } at root.
    // Some deployments may wrap { data: { programs } }; keep both shapes.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- backend JSON shape varies
    const b = backendJson as any;
    const data =
      Array.isArray(b?.programs)
        ? b
        : b?.data?.programs !== undefined
          ? b.data
          : b?.data?.data?.programs !== undefined
            ? b.data.data
            : b.data;

    if (!data || !Array.isArray(data.programs)) {
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

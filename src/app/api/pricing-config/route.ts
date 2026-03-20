import { NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    // In local/dev we can serve deterministic pricing from mock JSON files.
    // This is enabled via NEXT_PUBLIC_USE_MOCK=true in `growwise_newui/.env.local`.
    const useMock = (process.env.NEXT_PUBLIC_USE_MOCK || 'false') === 'true';
    if (useMock) {
      const mockPath = join(
        process.cwd(),
        'public',
        'api',
        'mock',
        'en',
        'pricing-config.json',
      );
      const raw = await readFile(mockPath, 'utf8');
      const json = JSON.parse(raw);
      return NextResponse.json({ success: true, data: json });
    }

    const base = BACKEND_URL.replace(/\/$/, '');
    const res = await fetch(`${base}/api/pricing-config`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Backend responded with HTTP ${res.status}`);

    const backendJson = (await res.json()) as unknown as
      | { success?: boolean; data?: unknown; error?: string }
      | { data?: unknown };

    // Backend returns: { success: true, data: { programs, last_updated, ... } }
    // This route must forward that `data` shape to the frontend.
    const data =
      // common case: backendJson.data is the pricing config
      (backendJson as any)?.data?.programs !== undefined
        ? (backendJson as any).data
        : // fallback: if the backend response was already double-wrapped
          (backendJson as any)?.data?.data?.programs !== undefined
          ? (backendJson as any).data.data
          : (backendJson as any).data;

    if (!data) {
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


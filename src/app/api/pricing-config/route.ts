import { readFileSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';
import type { PricingConfig } from '@/hooks/usePricingConfig';
import { applyLadderToPrograms } from '@/lib/pricingConfigLadder';

export const runtime = 'nodejs';

const COMMITTED_CONFIG_PATH = join(
  process.cwd(),
  'public',
  'api',
  'mock',
  'en',
  'pricing-config.json',
);

/**
 * Default: serve the committed `public/api/mock/en/pricing-config.json` with the same
 * journey-level ladder as growwise_backend (local = source of truth for the website).
 *
 * Set `PRICING_CONFIG_PROXY_BACKEND=true` to fetch from `NEXT_PUBLIC_BACKEND_URL` instead
 * (debug / compare only).
 */
export async function GET() {
  if (process.env.PRICING_CONFIG_PROXY_BACKEND === 'true') {
    return getPricingFromBackendProxy();
  }

  try {
    const raw = readFileSync(COMMITTED_CONFIG_PATH, 'utf8');
    const config = JSON.parse(raw) as PricingConfig;
    if (!Array.isArray(config.programs)) {
      throw new Error('Invalid pricing config: missing programs array');
    }
    const data: PricingConfig = {
      ...config,
      programs: applyLadderToPrograms([...config.programs]),
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load pricing config';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

async function getPricingFromBackendProxy() {
  try {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json(
        {
          success: false,
          error: 'Backend is not configured',
          message:
            'PRICING_CONFIG_PROXY_BACKEND is true but NEXT_PUBLIC_BACKEND_URL is not set.',
        },
        { status: 503 },
      );
    }
    const res = await fetch(`${base}/api/pricing-config`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Backend responded with HTTP ${res.status}`);

    const backendJson = (await res.json()) as unknown as
      | { success?: boolean; data?: unknown; error?: string }
      | { data?: unknown };

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
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

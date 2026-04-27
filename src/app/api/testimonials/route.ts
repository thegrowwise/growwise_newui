import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

/** Slightly above Express axios timeout to backend Google call so the proxy does not hang indefinitely. */
const PROXY_TO_BACKEND_MS = 12_000;

/**
 * When Express returns 5xx, the browser still shows a red 500 on /api/testimonials.
 * Return 200 + empty `source: 'unavailable'` so `testimonialsApi` can swap in default copy (see testimonialsApi).
 */
function unavailablePayload(requestUrl: string) {
  const url = new URL(requestUrl);
  const limitParam = url.searchParams.get('limit');
  const offsetParam = url.searchParams.get('offset') ?? '0';
  const limit =
    limitParam !== null && limitParam !== '' && !Number.isNaN(parseInt(limitParam, 10))
      ? parseInt(limitParam, 10)
      : null;
  const offset = Math.max(0, parseInt(offsetParam, 10) || 0);
  if (limit === null) {
    return {
      success: true,
      data: {
        testimonials: [] as const,
        pagination: { total: 0, limit: null as null, offset, hasMore: false },
        cached: false,
        fallback: true,
        source: 'unavailable' as const,
      },
      meta: {
        count: 0,
        limit: null as null,
        offset,
        cached: false,
        timestamp: new Date().toISOString(),
      },
    };
  }
  return {
    success: true,
    data: {
      testimonials: [] as const,
      pagination: { total: 0, limit, offset, hasMore: false },
      cached: false,
      fallback: true,
      source: 'unavailable' as const,
    },
    meta: {
      count: 0,
      limit,
      offset,
      cached: false,
      timestamp: new Date().toISOString(),
    },
  };
}

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
    const text = await res.text();
    let data: unknown = {};
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = {};
      }
    }
    if (!res.ok && res.status >= 500) {
      return NextResponse.json(unavailablePayload(request.url), { status: 200 });
    }
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    const isTimeout =
      error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
    if (isTimeout) {
      return NextResponse.json(unavailablePayload(request.url), { status: 200 });
    }
    const message = error instanceof Error ? error.message : 'Proxy failed';
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}

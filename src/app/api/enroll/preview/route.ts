import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';
import type { EnrollPreviewRequestBody } from '@/lib/enrollCheckout';
import { buildEnrollPreviewLocal } from '@/lib/enrollPreviewLocal';

export const maxDuration = 30;

function parseEnrollPreviewBody(body: unknown): EnrollPreviewRequestBody | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const program_id = typeof b.program_id === 'string' ? b.program_id : '';
  const tier_name = typeof b.tier_name === 'string' ? b.tier_name : '';
  const delivery_mode = typeof b.delivery_mode === 'string' ? b.delivery_mode : '';
  if (!program_id || !tier_name || !delivery_mode) return null;

  const addon_ids = Array.isArray(b.addon_ids)
    ? b.addon_ids.filter((x): x is string => typeof x === 'string')
    : [];

  const child_count =
    typeof b.child_count === 'number' && Number.isFinite(b.child_count)
      ? Math.max(1, Math.floor(b.child_count))
      : 1;

  return {
    program_id,
    tier_name,
    delivery_mode,
    addon_ids,
    child_count,
  };
}

function isSameOriginAsRequest(request: Request, baseUrl: string): boolean {
  try {
    return new URL(request.url).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', message: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = parseEnrollPreviewBody(body);
  if (!parsed) {
    return NextResponse.json(
      { error: 'Invalid body', message: 'program_id, tier_name, and delivery_mode are required.' },
      { status: 400 },
    );
  }

  const baseUrl = getBackendBaseUrlForProxy();

  // No backend URL, or backend points at this same Next origin (avoids infinite self-proxy when
  // NEXT_PUBLIC_BACKEND_URL is mistakenly set to the app URL, e.g. localhost:3000).
  const useLocalFirst = !baseUrl || isSameOriginAsRequest(request, baseUrl);

  if (useLocalFirst) {
    const local = buildEnrollPreviewLocal(parsed);
    if (local) {
      return NextResponse.json(local);
    }
    return NextResponse.json(
      {
        error: 'Preview unavailable',
        message: 'Could not build enrollment preview for this selection.',
      },
      { status: 422 },
    );
  }

  try {
    const upstream = await fetch(`${baseUrl}/api/enroll/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(parsed),
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    if (!upstream.ok && (upstream.status === 502 || upstream.status === 503)) {
      const local = buildEnrollPreviewLocal(parsed);
      if (local) {
        return NextResponse.json(local);
      }
    }

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (err) {
    const local = buildEnrollPreviewLocal(parsed);
    if (local) {
      return NextResponse.json(local);
    }
    const message = err instanceof Error ? err.message : 'Upstream request failed';
    return NextResponse.json({ error: message, message }, { status: 502 });
  }
}

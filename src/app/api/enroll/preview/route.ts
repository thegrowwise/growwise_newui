import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

export const maxDuration = 30;

export async function POST(request: Request) {
  const baseUrl = getBackendBaseUrlForProxy();
  if (!baseUrl) {
    return NextResponse.json(
      {
        error: 'Backend is not configured',
        message: 'Set NEXT_PUBLIC_BACKEND_URL in the server environment.',
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON', message: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${baseUrl}/api/enroll/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      // Do not cache; AOV should be live.
      cache: 'no-store',
    });

    const contentType = upstream.headers.get('content-type') ?? 'application/json';
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upstream request failed';
    return NextResponse.json({ error: message, message }, { status: 502 });
  }
}


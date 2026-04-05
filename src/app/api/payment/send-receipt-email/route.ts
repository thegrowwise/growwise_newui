import { NextResponse } from 'next/server';
import { getBackendBaseUrlForProxy } from '@/lib/config';

export const maxDuration = 30;

/**
 * Proxies to backend POST /api/payment/send-receipt-email (triggers payment receipt emails).
 */
export async function POST(request: Request) {
  const base = getBackendBaseUrlForProxy();
  if (!base) {
    return NextResponse.json(
      {
        error: 'Backend not configured',
        message:
          'Set BACKEND_URL or NEXT_PUBLIC_BACKEND_URL to your API (e.g. https://api.growwiseschool.org).',
      },
      { status: 503 }
    );
  }

  const body = await request.text();
  try {
    const res = await fetch(`${base}/api/payment/send-receipt-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
    });
  } catch (e) {
    console.error('[send-receipt-email] proxy failed', e);
    return NextResponse.json(
      { error: 'Backend unreachable', message: 'Could not reach the payment API.' },
      { status: 503 }
    );
  }
}

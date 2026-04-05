import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getBackendBaseUrlForProxy } from '@/lib/config';

export const maxDuration = 60;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await context.params;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    const base = getBackendBaseUrlForProxy();
    if (!base) {
      return NextResponse.json(
        { error: 'Stripe is not configured', message: 'Set STRIPE_SECRET_KEY or NEXT_PUBLIC_BACKEND_URL.' },
        { status: 503 }
      );
    }
    try {
      const res = await fetch(
        `${base}/api/payment/session/${encodeURIComponent(sessionId)}`,
        { method: 'GET', headers: { Accept: 'application/json' } }
      );
      const text = await res.text();
      return new NextResponse(text, {
        status: res.status,
        headers: { 'Content-Type': res.headers.get('content-type') || 'application/json' },
      });
    } catch (e) {
      console.error('[checkout proxy] session GET failed', e);
      return NextResponse.json(
        { error: 'Backend unreachable', message: 'Could not reach the payment API.' },
        { status: 503 }
      );
    }
  }

  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      session: {
        id: s.id,
        payment_status: s.payment_status,
        amount_total: s.amount_total,
        currency: s.currency,
        customer_email: s.customer_details?.email ?? s.customer_email ?? null,
        customer_details: s.customer_details?.email
          ? { email: s.customer_details.email }
          : undefined,
      },
    });
  } catch (e) {
    console.error('[stripe] checkout.sessions.retrieve', e);
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
}

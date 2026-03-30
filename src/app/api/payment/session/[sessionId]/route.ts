import { NextResponse } from 'next/server';
import Stripe from 'stripe';

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
    return NextResponse.json(
      { error: 'Stripe is not configured', message: 'Set STRIPE_SECRET_KEY on the server.' },
      { status: 503 }
    );
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

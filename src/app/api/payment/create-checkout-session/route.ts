import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CheckoutSessionRequest } from '@/lib/paymentService';

export const maxDuration = 60;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

function originFromRequest(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (env) return env;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';
  if (host) return `${proto}://${host}`;
  return 'http://localhost:3000';
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured',
        message: 'Set STRIPE_SECRET_KEY in the server environment.',
      },
      { status: 503 }
    );
  }

  let body: CheckoutSessionRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: 'Cart is empty', message: 'No line items' }, { status: 400 });
  }

  const localeRaw = typeof body.locale === 'string' ? body.locale : 'en';
  const locale = localeRaw.replace(/[^a-z-]/gi, '').slice(0, 10) || 'en';
  const origin = originFromRequest(request);

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = body.items.map((item) => ({
    quantity: Math.max(1, item.quantity),
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name.slice(0, 120),
        ...(item.description ? { description: item.description.slice(0, 500) } : {}),
      },
      unit_amount: Math.max(50, Math.round(item.price * 100)),
    },
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      allow_promotion_codes: true,
      success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${locale}/cart`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'No checkout URL', message: 'Stripe did not return a session URL.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('[stripe] checkout.sessions.create', err);
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message, message }, { status: 502 });
  }
}

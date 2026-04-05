import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CheckoutSessionRequest } from '@/lib/paymentService';
import { publicPath } from '@/lib/publicPath';

export const maxDuration = 60;

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2025-02-24.acacia' });
}

/** Server-side API base (Stripe + orders live here). Prefer non-public env on Vercel. */
function getBackendBaseUrl(): string | null {
  const raw =
    process.env.BACKEND_URL?.trim() ||
    process.env.BACKEND_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  if (!raw) return null;
  return raw.replace(/\/$/, '');
}

/**
 * When STRIPE_SECRET_KEY is not set in Next (e.g. local dev), forward to the Express/Lambda API
 * so checkout uses the same Stripe key as backend/.env.
 */
async function proxyCreateCheckoutToBackend(request: Request): Promise<Response> {
  const base = getBackendBaseUrl();
  if (!base) {
    return NextResponse.json(
      {
        error: 'Stripe is not configured',
        message:
          'Set STRIPE_SECRET_KEY here, or set NEXT_PUBLIC_BACKEND_URL (or BACKEND_URL) so checkout can use the API server.',
      },
      { status: 503 }
    );
  }

  const target = `${base}/api/payment/create-checkout-session`;
  const body = await request.text();

  try {
    const res = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
      },
      body,
    });
    const resBody = await res.text();
    const contentType = res.headers.get('content-type') || 'application/json';
    return new NextResponse(resBody, {
      status: res.status,
      headers: { 'Content-Type': contentType },
    });
  } catch (err) {
    console.error('[checkout proxy] fetch to backend failed', base, err);
    return NextResponse.json(
      {
        error: 'Backend unreachable',
        message: 'Could not reach the payment API. Is the backend running and NEXT_PUBLIC_BACKEND_URL correct?',
      },
      { status: 503 }
    );
  }
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
    return proxyCreateCheckoutToBackend(request);
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
      success_url: `${origin}${publicPath('/checkout/success', locale)}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${publicPath('/cart', locale)}`,
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

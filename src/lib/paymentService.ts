const CHECKOUT_MAX_ATTEMPTS = 3;
const CHECKOUT_RETRY_DELAYS_MS = [400, 900];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Transient failures — safe to retry once or twice. */
function isRetryableHttpStatus(status: number): boolean {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function isRetryableNetworkError(error: unknown): boolean {
  if (!(error instanceof TypeError)) return false;
  const m = error.message;
  return m.includes('fetch') || m.includes('Failed to fetch') || m.includes('NetworkError') || m.includes('Load failed');
}

export interface CheckoutSessionRequest {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    description?: string;
    category?: string;
    level?: string;
    image?: string;
  }>;
  customerEmail?: string;
  customerName?: string;
  locale?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  // Same-origin Route Handlers (`src/app/api/payment/*`) — avoids 404 when NEXT_PUBLIC_BACKEND_URL points at a host without these routes.
  const url = '/api/payment/create-checkout-session';

  console.log('Creating checkout session:', { url });

  let lastFailure: { status: number; statusText: string; serverError: string; url: string } | null = null;

  for (let attempt = 0; attempt < CHECKOUT_MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return response.json() as Promise<CheckoutSessionResponse>;
      }

      let serverError = '';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorBody = (await response.json()) as Record<string, unknown>;
          serverError =
            (typeof errorBody.message === 'string' && errorBody.message) ||
            (typeof errorBody.error === 'string' && errorBody.error) ||
            (Object.keys(errorBody).length > 0 ? JSON.stringify(errorBody) : '');
        } else {
          serverError = (await response.text()) || response.statusText;
        }
      } catch {
        serverError = response.statusText;
      }

      lastFailure = {
        status: response.status,
        statusText: response.statusText,
        serverError: serverError || '(empty body)',
        url,
      };

      const willRetry =
        attempt < CHECKOUT_MAX_ATTEMPTS - 1 && isRetryableHttpStatus(response.status);

      console.error('Checkout session creation failed:', {
        attempt: attempt + 1,
        of: CHECKOUT_MAX_ATTEMPTS,
        willRetry,
        ...lastFailure,
      });

      if (willRetry) {
        await sleep(CHECKOUT_RETRY_DELAYS_MS[attempt] ?? CHECKOUT_RETRY_DELAYS_MS[CHECKOUT_RETRY_DELAYS_MS.length - 1]);
        continue;
      }

      const userMessage =
        response.status === 503
          ? "We're having a temporary issue. Please try again in a few minutes."
          : 'Something went wrong. Please try again.';
      throw new Error(userMessage);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("We're having") ||
          error.message === 'Something went wrong. Please try again.')
      ) {
        throw error;
      }

      if (isRetryableNetworkError(error) && attempt < CHECKOUT_MAX_ATTEMPTS - 1) {
        console.warn('Checkout session network error, retrying:', {
          attempt: attempt + 1,
          error: error instanceof Error ? error.message : error,
        });
        await sleep(CHECKOUT_RETRY_DELAYS_MS[attempt] ?? 900);
        continue;
      }

      if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        console.error('Network error when creating checkout session:', {
          url,
          error: error.message,
          errorType: error.constructor.name,
        });
        throw new Error(
          'Unable to reach the checkout service. Check your connection and try again.'
        );
      }
      throw error;
    }
  }

  if (lastFailure) {
    console.error('Checkout session creation failed after retries:', lastFailure);
  }
  throw new Error('Something went wrong. Please try again.');
}

export async function getCheckoutSession(sessionId: string) {
  const response = await fetch(
    `/api/payment/session/${encodeURIComponent(sessionId)}`,
    {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        console.error('Session retrieval failed:', { status: response.status, serverError: error.message || error.error });
      }
    } catch {
      /* ignore */
    }
    const userMessage =
      response.status === 503
        ? "We're having a temporary issue. Please try again in a few minutes."
        : 'Something went wrong. Please try again.';
    throw new Error(userMessage);
  }

  return response.json();
}



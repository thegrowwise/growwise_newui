const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Debug: Log the backend URL (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Backend URL:', BACKEND_URL);
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
  const url = `${BACKEND_URL}/api/payment/create-checkout-session`;
  
  // Debug logging
  console.log('Creating checkout session:', { url, backendUrl: BACKEND_URL });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let serverError = '';
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          serverError = error.message || error.error || '';
        } else {
          serverError = await response.text() || response.statusText;
        }
      } catch {
        serverError = response.statusText;
      }
      // Log full details for debugging; never show technical messages to the user
      console.error('Checkout session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        serverError,
        url,
      });
      // User-friendly message only (503 = temporary, 5xx = generic)
      const userMessage =
        response.status === 503
          ? "We're having a temporary issue. Please try again in a few minutes."
          : 'Something went wrong. Please try again.';
      throw new Error(userMessage);
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      console.error('Network error when creating checkout session:', {
        url,
        error: error.message,
        backendUrl: BACKEND_URL,
        errorType: error.constructor.name,
      });
      throw new Error(`Unable to connect to the server at ${BACKEND_URL}. Please ensure the backend is running.`);
    }
    // Re-throw other errors
    throw error;
  }
}

export async function getCheckoutSession(sessionId: string) {
  const response = await fetch(`${BACKEND_URL}/api/payment/session/${sessionId}`, {
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



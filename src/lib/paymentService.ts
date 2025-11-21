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
      let errorMessage = 'Failed to create checkout session';
      let errorDetails = '';
      
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
          errorDetails = error.message || error.details || '';
        } else {
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
      } catch (parseError) {
        // If parsing fails, use status text
        errorMessage = response.statusText || errorMessage;
      }
      
      // Include status code in error message for debugging
      const fullErrorMessage = errorDetails 
        ? `${errorMessage} (Status: ${response.status}) - ${errorDetails}`
        : `${errorMessage} (Status: ${response.status})`;
      
      console.error('Checkout session creation failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorMessage,
        url,
      });
      
      throw new Error(fullErrorMessage);
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
    let errorMessage = 'Failed to retrieve session';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.error || error.message || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
    } catch (parseError) {
      // If parsing fails, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}



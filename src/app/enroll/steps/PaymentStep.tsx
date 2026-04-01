'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

interface PaymentStepProps {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number | '';
}

type LineItemType = 'recurring' | 'one_time';

interface LineItem {
  label: string;
  amount: number;
  type: LineItemType;
}

interface EnrollPreviewData {
  program_id: string;
  tier_name: string;
  delivery_mode: string;
  line_items: LineItem[];
  first_purchase_aov: number;
  recurring_monthly_aov: number;
  aov_to_asp_ratio: number;
}

interface EnrollPreviewResponse {
  success: boolean;
  data: EnrollPreviewData;
}

interface EnrollPreviewError {
  message: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

function PaymentForm(props: {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number | '';
  preview: EnrollPreviewData | null;
}) {
  const { parentName, parentEmail, parentPhone, childName, childAge, preview } = props;
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [processing, setProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const requestBody = useMemo(() => {
    const program_id = searchParams.get('program') || '';
    const tier_name = searchParams.get('tier') || '';
    const delivery_mode = searchParams.get('mode') || '';
    const rawAddons = searchParams.get('addons');
    const childCountParam = searchParams.get('children');

    if (!program_id || !tier_name || !delivery_mode) {
      return null;
    }

    const addon_ids = rawAddons ? rawAddons.split(',').filter(Boolean) : [];
    const child_count = childCountParam ? Number(childCountParam) || 1 : 1;

    return {
      program_id,
      tier_name,
      delivery_mode,
      addon_ids,
      child_count,
    };
  }, [searchParams]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStripeError(null);
    setSubmitError(null);

    if (!stripe || !elements) {
      setStripeError('Payment system is not ready. Please try again in a moment.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setStripeError('Card input is not available. Please refresh and try again.');
      return;
    }

    setProcessing(true);

    try {
      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: parentName || undefined,
          email: parentEmail || undefined,
          phone: parentPhone || undefined,
        },
      });

      if (result.error) {
        setStripeError(result.error.message ?? 'Your card could not be processed.');
        setProcessing(false);
        return;
      }

      if (!result.paymentMethod) {
        setStripeError('Payment method was not created. Please try again.');
        setProcessing(false);
        return;
      }

      const query = searchParams.toString();
      const payload: Record<string, unknown> = {
        payment_method_id: result.paymentMethod.id,
        parent_name: parentName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
        child_name: childName,
        child_age: childAge,
        enrollment_selection: requestBody,
        pricing_preview: preview,
      };

      const response = await fetch('/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let json: { success?: boolean; error?: string; message?: string } = {};
      if (raw.trim()) {
        try {
          json = JSON.parse(raw) as typeof json;
        } catch {
          // If backend returns non-JSON, treat as generic error
        }
      }

      if (!response.ok || json.success === false) {
        const msg = json.error || json.message || `Payment failed (${response.status}). Please try again.`;
        setSubmitError(msg);
        setProcessing(false);
        return;
      }

      router.push(query ? `/enroll/confirmation?${query}` : '/enroll/confirmation');
    } catch (error) {
      setSubmitError('Network error while processing payment. Please try again.');
      // eslint-disable-next-line no-console
      console.error('Payment submit error', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="enroll-card-element"
          className="block text-sm font-medium text-gray-700"
        >
          Card details
        </label>
        <div className="rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm">
          <CardElement
            id="enroll-card-element"
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#111827',
                  '::placeholder': {
                    color: '#9CA3AF',
                  },
                },
                invalid: {
                  color: '#DC2626',
                },
              },
            }}
          />
        </div>
        {stripeError && (
          <p className="text-xs text-red-600" role="alert">
            {stripeError}
          </p>
        )}
      </div>

      {submitError && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={processing || !stripe || !elements}
        className="inline-flex w-full items-center justify-center rounded-lg bg-[#F16112] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d4520c] disabled:cursor-not-allowed disabled:bg-gray-300"
        data-testid="enroll-payment-submit"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Processing…</span>
          </span>
        ) : (
          <span>Pay now</span>
        )}
      </button>
    </form>
  );
}

export function PaymentStep(props: PaymentStepProps) {
  const { parentName, parentEmail, parentPhone, childName, childAge } = props;
  const searchParams = useSearchParams();
  const [preview, setPreview] = useState<EnrollPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<EnrollPreviewError | null>(null);
  const [renderElements, setRenderElements] = useState(false);

  const requestBody = useMemo(() => {
    const program_id = searchParams.get('program') || '';
    const tier_name = searchParams.get('tier') || '';
    const delivery_mode = searchParams.get('mode') || '';
    const rawAddons = searchParams.get('addons');
    const childCountParam = searchParams.get('children');

    if (!program_id || !tier_name || !delivery_mode) {
      return null;
    }

    const addon_ids = rawAddons ? rawAddons.split(',').filter(Boolean) : [];
    const child_count = childCountParam ? Number(childCountParam) || 1 : 1;

    return {
      program_id,
      tier_name,
      delivery_mode,
      addon_ids,
      child_count,
    };
  }, [searchParams]);

  useEffect(() => {
    let isCancelled = false;

    if (!requestBody) {
      setError({ message: 'Missing enrollment selection. Please start again.' });
      return;
    }

    const fetchPreview = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/enroll/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          let message = 'Unable to load summary. Please try again.';

          if (contentType.includes('application/json')) {
            try {
              const json = await response.json();
              if (typeof json === 'object' && json && 'message' in json && typeof json.message === 'string') {
                message = json.message;
              }
            } catch {
              // Ignore JSON parse errors and fall back to generic message
            }
          }

          if (!isCancelled) {
            setError({ message });
          }
          return;
        }

        const data: EnrollPreviewResponse = await response.json();
        if (!isCancelled) {
          setPreview(data);
        }
      } catch {
        if (!isCancelled) {
          setError({ message: 'Network error while loading summary. Please try again.' });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchPreview();

    return () => {
      isCancelled = true;
    };
  }, [requestBody]);

  useEffect(() => {
    // Defer Elements render to client to avoid SSR issues
    setRenderElements(true);
  }, []);

  const programName = useMemo(() => {
    const first = preview?.data.line_items?.[0]?.label;
    if (!first) return preview?.data.program_id ?? '';
    return first.split(' — ')[0] || preview?.data.program_id || '';
  }, [preview]);

  const programLabel = useMemo(() => {
    if (!preview) return '';
    const { tier_name, delivery_mode } = preview.data;
    const tierLabel = tier_name.charAt(0).toUpperCase() + tier_name.slice(1);
    const modeLabel =
      delivery_mode === 'live' || delivery_mode === 'studio'
        ? delivery_mode.charAt(0).toUpperCase() + delivery_mode.slice(1)
        : delivery_mode;
    return `${tierLabel} · ${modeLabel}`;
  }, [preview]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Payment</h2>
        <p className="text-sm text-gray-600">
          Review your total and enter your card details to complete enrollment.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12" data-testid="enroll-payment-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#F16112]" />
        </div>
      )}

      {!loading && error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p>{error.message}</p>
        </div>
      )}

      {!loading && !error && preview && (
        <div className="space-y-6" data-testid="enroll-payment-summary">
          <div className="rounded-xl border border-gray-200 bg-white/60 p-4 sm:p-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Program
                </p>
                <p className="text-sm font-semibold text-gray-900">{programName}</p>
              </div>
              <p className="text-xs font-medium text-gray-600">{programLabel}</p>
            </div>

            <div className="mt-4 space-y-2">
              {preview.data.line_items.map((item) => (
                <div
                  key={`${item.label}-${item.type}-${item.amount}`}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                      {item.type === 'recurring' ? 'Recurring' : 'One-time'}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {currencyFormatter.format(item.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-4 border-t border-gray-200 pt-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total charged today
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {currencyFormatter.format(preview.data.first_purchase_aov)}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Monthly recurring
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {currencyFormatter.format(preview.data.recurring_monthly_aov)}
                  <span className="ml-1 text-sm font-normal text-gray-600">/month after</span>
                </p>
              </div>
            </div>
          </div>

          {stripePromise ? (
            renderElements && (
              <Elements stripe={stripePromise}>
                <PaymentForm
                  parentName={parentName}
                  parentEmail={parentEmail}
                  parentPhone={parentPhone}
                  childName={childName}
                  childAge={childAge}
                  preview={preview.data}
                />
              </Elements>
            )
          ) : (
            <div
              className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
              role="alert"
            >
              Stripe is not configured. Ask an administrator to set
              {' '}
              <code className="rounded bg-yellow-100 px-1 py-0.5 text-xs">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
              {' '}
              in the environment before collecting payments.
            </div>
          )}
        </div>
      )}
    </div>
  );
}


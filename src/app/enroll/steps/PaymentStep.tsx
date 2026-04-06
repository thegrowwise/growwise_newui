'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useCart } from '@/components/gw/CartContext';
import {
  buildJourneyEnrollCartItem,
  type EnrollPreviewData,
  type EnrollPreviewResponse,
} from '@/lib/enrollCheckout';
import { publicPath } from '@/lib/publicPath';

interface PaymentStepProps {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number | '';
}

interface EnrollPreviewError {
  message: string;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function PaymentStep(props: PaymentStepProps) {
  void props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { addItem, removeItem } = useCart();

  const [preview, setPreview] = useState<EnrollPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<EnrollPreviewError | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
    const ac = new AbortController();

    if (!requestBody) {
      setLoading(false);
      setError({ message: 'Missing enrollment selection. Please start again.' });
      return () => ac.abort();
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
          signal: ac.signal,
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

          setError({ message });
          return;
        }

        const data: EnrollPreviewResponse = await response.json();
        if (!data.success || !data.data) {
          setError({ message: 'Invalid preview response. Please try again.' });
          return;
        }
        setPreview(data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError({ message: 'Network error while loading summary. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    void fetchPreview();

    return () => ac.abort();
  }, [requestBody]);

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

  const handleContinueToCheckout = () => {
    if (!preview?.success || !preview.data || !requestBody) return;

    setCheckoutError(null);
    setCheckoutLoading(true);
    try {
      const cartItem = buildJourneyEnrollCartItem(preview.data, requestBody);
      removeItem(cartItem.id);
      addItem(cartItem);
      router.push(publicPath('/checkout', locale));
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Payment</h2>
        <p className="text-sm text-gray-600">
          Review your total and continue to our secure checkout (same as other courses).
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

          {checkoutError && (
            <div
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {checkoutError}
            </div>
          )}

          <button
            type="button"
            data-testid="enroll-payment-submit"
            disabled={checkoutLoading}
            onClick={() => handleContinueToCheckout()}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#F16112] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d4520c] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {checkoutLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Redirecting…</span>
              </span>
            ) : (
              <span>Continue to secure checkout</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

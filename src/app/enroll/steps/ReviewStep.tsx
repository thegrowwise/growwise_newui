'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePricingConfig } from '@/hooks/usePricingConfig';

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

interface ReviewStepProps {
  onContinue: () => void;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function ReviewStep({ onContinue }: ReviewStepProps) {
  const searchParams = useSearchParams();
  const [preview, setPreview] = useState<EnrollPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<EnrollPreviewError | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const { getProgramById } = usePricingConfig();

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

  const editHref = useMemo(() => {
    const programId = searchParams.get('program') || '';
    const base = (() => {
      if (!programId) return '/coding';
      const program = getProgramById(programId);
      if (program?.track === 'game-dev') return '/game-dev';
      return '/coding';
    })();

    const query = searchParams.toString();
    if (!query) return `${base}#programs`;
    return `${base}?${query}#programs`;
  }, [getProgramById, searchParams]);

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
          let message = 'Unable to load preview. Please try again.';

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
      } catch (err) {
        if (!isCancelled) {
          setError({ message: 'Network error while loading preview. Please try again.' });
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
  }, [requestBody, reloadKey]);

  const handleRetry = () => {
    setPreview(null);
    setError(null);
    setReloadKey((prev) => prev + 1);
  };

  const programLabel = useMemo(() => {
    if (!preview) return '';
    const { tier_name, delivery_mode } = preview.data;
    const tierLabel = tier_name.charAt(0).toUpperCase() + tier_name.slice(1);
    const modeLabel = delivery_mode === 'live' || delivery_mode === 'studio'
      ? delivery_mode.charAt(0).toUpperCase() + delivery_mode.slice(1)
      : delivery_mode;
    return `${tierLabel} · ${modeLabel}`;
  }, [preview]);

  const programName = useMemo(() => {
    const first = preview?.data.line_items?.[0]?.label;
    if (!first) return preview?.data.program_id ?? '';
    return first.split(' — ')[0] || preview?.data.program_id || '';
  }, [preview]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Review your enrollment</h2>
          <p className="mt-1 text-sm text-gray-600">
            Confirm your selection and pricing before continuing.
          </p>
        </div>

        <Link
          href={editHref}
          className="text-sm font-medium text-[#F16112] hover:text-[#d4520c] underline-offset-2 hover:underline"
        >
          Edit selection
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12" data-testid="enroll-review-loading">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#F16112]" />
        </div>
      )}

      {!loading && error && (
        <div
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p>{error.message}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 text-xs font-medium underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && preview && (
        <div className="space-y-6" data-testid="enroll-review-content">
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
                    <span
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600"
                    >
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
                  Total due today
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
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  {preview.data.aov_to_asp_ratio.toFixed(2)}× the base price
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="inline-flex w-full items-center justify-center rounded-lg bg-[#F16112] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d4520c]"
            data-testid="enroll-review-continue"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}


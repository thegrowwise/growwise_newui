'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

export default function EnrollConfirmationPage() {
  const searchParams = useSearchParams();
  const [preview, setPreview] = useState<EnrollPreviewResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<EnrollPreviewError | null>(null);

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
          if (!isCancelled) {
            setError({ message: 'Unable to load enrollment details. Your payment may still be processing.' });
          }
          return;
        }

        const data: EnrollPreviewResponse = await response.json();
        if (!isCancelled) {
          setPreview(data);
        }
      } catch {
        if (!isCancelled) {
          setError({ message: 'Network error while loading enrollment details.' });
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border bg-white/80 p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">You&apos;re enrolled!</h1>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for completing your enrollment. Here are your program details and what happens next.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#F16112]" />
            </div>
          )}

          {!loading && error && (
            <div
              className="mb-6 rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
              role="alert"
            >
              {error.message}
            </div>
          )}

          {!loading && preview && (
            <div className="mb-8 rounded-xl border border-gray-200 bg-white/70 p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Program
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{programName}</p>
                </div>
                <p className="text-xs font-medium text-gray-600">{programLabel}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">What happens next</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                <li>Check your email for your receipt and welcome message.</li>
                <li>The GrowWise team will contact you within 24 hours to schedule.</li>
                <li>
                  Your child&apos;s learning journey starts
                  {' '}
                  {programName ? `${programName} Level 1.` : 'Level 1.'}
                </li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              Your family account is being set up — you&apos;ll receive a separate email from our learning
              platform to get started.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-[#F16112] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d4520c]"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


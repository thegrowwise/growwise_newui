'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { PREDICTION_OPTIONS, type ParentPrediction } from '@/lib/award';

export default function DetectivePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = searchParams?.get('session') ?? '';

  const [prediction, setPrediction] = useState<ParentPrediction | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // true while checking whether the student already submitted a prediction
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!session) {
      router.replace('/self-check?error=expired');
      return;
    }

    // If the student already submitted a prediction (e.g. they closed the browser
    // after /detective but before /results), skip straight to results.
    let cancelled = false;
    async function checkExisting() {
      try {
        const res = await fetch(`/api/results?session=${encodeURIComponent(session)}`);
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.student_prediction) {
            router.replace(`/results?session=${encodeURIComponent(session)}`);
            return;
          }
        }
      } catch {
        // Network error — fall through and show the prediction screen normally
      }
      if (!cancelled) setChecking(false);
    }
    checkExisting();
    return () => { cancelled = true; };
  }, [session, router]);

  if (!session || checking) {
    return (
      <main className="min-h-screen page-bg-coding flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F396D]" />
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prediction) {
      setError('Please pick an area before continuing.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/save-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: session, student_prediction: prediction }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      router.push(`/results?session=${encodeURIComponent(session)}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen page-bg-coding flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-4xl">🔍</div>
          <h1 className="text-2xl font-bold text-[#1F396D]">Detective Challenge</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            You finished the quiz. Before we show you what we found —{' '}
            <strong className="text-gray-800">what do YOU think went wrong?</strong>
          </p>
        </div>

        <Card className="border border-[#1F396D]/10 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">
                Pick the area where you think you made the most mistakes:
              </p>

              <div className="space-y-2">
                {PREDICTION_OPTIONS.map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 cursor-pointer rounded-lg border px-4 py-3 text-sm transition-colors ${
                      prediction === value
                        ? 'border-[#F16112] bg-[#F16112]/5 text-[#1F396D] font-medium'
                        : 'border-gray-200 text-gray-700 hover:border-[#1F396D]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="studentPrediction"
                      value={value}
                      checked={prediction === value}
                      onChange={() => setPrediction(value)}
                      className="accent-[#F16112] flex-shrink-0"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <p className="text-xs text-gray-400 leading-snug">
                Your prediction is compared to your parent&#39;s — and to the real answer.
              </p>

              {error && (
                <p className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading || !prediction}
                className="w-full h-11 bg-[#1F396D] hover:bg-[#162d57] text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Locking in…
                  </>
                ) : (
                  'Reveal My Results →'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          GrowWise Mistake Detective Challenge · Free · Dublin, CA
        </p>
      </div>
    </main>
  );
}

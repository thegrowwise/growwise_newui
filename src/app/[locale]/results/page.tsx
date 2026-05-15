'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2 } from 'lucide-react';
import PatternCard from '@/components/PatternCard';
import WorkshopCTA from '@/components/WorkshopCTA';
import AwardBadge from '@/components/AwardBadge';
import type { ErrorPattern } from '@/lib/patterns';
import { type AwardTier, PREDICTION_LABELS } from '@/lib/award';

type ResultsState =
  | { status: 'loading' }
  | { status: 'quiz_not_completed' }
  | { status: 'no_session' }
  | { status: 'error'; message: string }
  | {
      status: 'completed';
      student_name: string;
      grade: number;
      subject: string;
      patterns_confirmed: ErrorPattern[];
      patterns_possible: ErrorPattern[];
      overall_risk: string;
      parent_prediction: string;
      student_prediction: string;
      award_tier: AwardTier;
    };

const SUBJECT_LABEL: Record<string, string> = {
  math: 'Math',
  english: 'English',
  both: 'Math & English',
};

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const session = searchParams?.get('session') ?? '';
  const [state, setState] = useState<ResultsState>({ status: 'loading' });

  useEffect(() => {
    if (!session) {
      setState({ status: 'no_session' });
      return;
    }
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/results?session=${encodeURIComponent(session)}`);
        if (cancelled) return;
        const data = await res.json();
        if (!res.ok || !data.success) {
          setState({ status: 'error', message: data.error ?? 'Could not load results.' });
          return;
        }
        if (data.status === 'quiz_not_completed') {
          router.replace('/self-check?error=incomplete');
          return;
        }
        setState({
          status: 'completed',
          student_name: data.student_name,
          grade: data.grade,
          subject: data.subject,
          patterns_confirmed: data.patterns_confirmed ?? [],
          patterns_possible: data.patterns_possible ?? [],
          overall_risk: data.overall_risk,
          parent_prediction: data.parent_prediction ?? '',
          student_prediction: data.student_prediction ?? '',
          award_tier: data.award_tier ?? 'keep_digging',
        });
      } catch {
        if (!cancelled) setState({ status: 'error', message: 'Network error. Please try again.' });
      }
    }
    load();
    return () => { cancelled = true; };
  }, [session]);

  return (
    <main className="min-h-screen page-bg-coding">
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {state.status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-[#1F396D]" />
            <p>Loading your results…</p>
          </div>
        )}

        {state.status === 'no_session' && (
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <p className="text-gray-600">No session found. Please start the Self-Check from the beginning.</p>
              <a href="/self-check?error=expired" className="text-[#1F396D] underline font-medium">
                Go to Self-Check →
              </a>
            </CardContent>
          </Card>
        )}

        {state.status === 'error' && (
          <Card>
            <CardContent className="p-8 text-center space-y-3">
              <p className="text-red-600 text-sm">{state.message}</p>
              <a href="/self-check" className="text-[#1F396D] underline text-sm">
                Try again →
              </a>
            </CardContent>
          </Card>
        )}

        {state.status === 'completed' && (
          <>
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1F396D]">
                Here&#39;s What We Found for {state.student_name}
              </h1>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-[#1F396D]/10 text-[#1F396D] border-[#1F396D]/20 border">
                  Grade {state.grade}
                </Badge>
                <Badge className="bg-[#F16112]/10 text-[#F16112] border-[#F16112]/20 border">
                  {SUBJECT_LABEL[state.subject] ?? state.subject}
                </Badge>
              </div>
            </div>

            {/* No patterns — all clear */}
            {state.patterns_confirmed.length === 0 && state.patterns_possible.length === 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 flex items-center gap-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h2 className="font-semibold text-green-900">Great news — no major gaps found!</h2>
                    <p className="text-sm text-green-700 mt-1">
                      {state.student_name} answered well across all question areas. Keep up the great work!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirmed patterns */}
            {state.patterns_confirmed.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirmed Patterns{' '}
                  <span className="text-sm font-normal text-gray-500">
                    (appeared multiple times)
                  </span>
                </h2>
                {state.patterns_confirmed.slice(0, 3).map((p) => (
                  <PatternCard key={p.id} pattern={p} variant="confirmed" />
                ))}
              </section>
            )}

            {/* Possible patterns */}
            {state.patterns_possible.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Possible Patterns{' '}
                  <span className="text-sm font-normal text-gray-500">
                    (seen once — worth watching)
                  </span>
                </h2>
                {state.patterns_possible.map((p) => (
                  <PatternCard key={p.id} pattern={p} variant="possible" />
                ))}
              </section>
            )}

            {/* Detective Comparison */}
            {(state.student_prediction || state.parent_prediction) && (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">The Detective Comparison</h2>
                <Card className="border border-[#1F396D]/10">
                  <CardContent className="p-5 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-gray-500 w-36 flex-shrink-0">You predicted:</span>
                      <span className="font-medium text-gray-800 text-right">
                        {PREDICTION_LABELS[state.student_prediction] ?? (state.student_prediction || '—')}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-gray-500 w-36 flex-shrink-0">Parent predicted:</span>
                      <span className="font-medium text-gray-800 text-right">
                        {state.parent_prediction === 'not_sure'
                          ? '🤷 Wasn\'t sure'
                          : (PREDICTION_LABELS[state.parent_prediction] ?? (state.parent_prediction || '—'))}
                      </span>
                    </div>
                    {state.patterns_confirmed.length > 0 && (
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-gray-500 w-36 flex-shrink-0">Actual gap:</span>
                        <span className="font-medium text-gray-800 text-right">
                          {state.patterns_confirmed[0].title}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 space-y-1">
                      {state.award_tier === 'double_detective' && (
                        <>
                          <p className="text-green-700 font-medium">✅ You: Got it right</p>
                          <p className="text-green-700 font-medium">✅ Parent: Got it right</p>
                        </>
                      )}
                      {state.award_tier === 'parent_detective' && (
                        <>
                          <p className="text-red-600 font-medium">❌ You: Missed it</p>
                          <p className="text-green-700 font-medium">✅ Parent: Got it right</p>
                        </>
                      )}
                      {state.award_tier === 'self_aware' && (
                        <>
                          <p className="text-green-700 font-medium">✅ You: Got it right</p>
                          <p className="text-red-600 font-medium">❌ Parent: Missed it</p>
                        </>
                      )}
                      {state.award_tier === 'keep_digging' && (
                        <>
                          <p className="text-gray-600 font-medium">❌ You: Missed it</p>
                          <p className="text-gray-600 font-medium">❌ Parent: Missed it</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Award Badge */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Your Detective Badge</h2>
              <AwardBadge tier={state.award_tier} />
            </section>

            {/* Workshop CTA — adaptive copy by award tier */}
            <WorkshopCTA tier={state.award_tier} />

            <div className="flex flex-col items-center gap-3 pt-2 pb-6">
              <a
                href="/self-check/done"
                className="inline-flex items-center gap-1.5 text-sm text-[#1F396D] font-medium hover:underline"
              >
                View your confirmation page →
              </a>
              <a href="/self-check" className="text-sm text-gray-400 underline hover:text-[#1F396D]">
                Start a new check for another student
              </a>
              <a
                href="/self-check"
                className="text-sm text-gray-400 hover:text-[#1F396D] transition-colors"
              >
                ← Back to Self-Check
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

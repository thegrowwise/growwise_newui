'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';
import { ArrowRight, Sparkles } from 'lucide-react';
import { usePricingConfig, type Program } from '@/hooks/usePricingConfig';

interface AgeRecommenderProps {
  onRecommend: (programId: string) => void;
  className?: string;
}

export function AgeRecommender({ onRecommend, className }: AgeRecommenderProps) {
  const t = useTranslations();
  const { data } = usePricingConfig();
  const [age, setAge] = useState<number | ''>('');

  const rec = useMemo(() => {
    if (age === '' || Number.isNaN(Number(age))) return null;
    const rules = data?.age_recommender?.game_dev ?? [];
    if (!rules.length) return null;

    const numericAge = Number(age);
    const match = rules.find(
      (rule) => numericAge >= rule.min && numericAge <= rule.max,
    );
    if (!match) return null;

    const program: Program | undefined = data?.programs?.find(
      (p) => p.id === match.program_id && p.track === 'game-dev',
    );

    return {
      programId: match.program_id,
      programName: program?.name ?? match.program_id,
      reasonText: t(`gameDevPage.ageRecommender.reasons.${match.reason_key}`),
    };
  }, [age, data, t]);

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 shadow-xl mb-12 text-white overflow-hidden relative',
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Not sure where to start?
          </h3>
          <p className="text-indigo-200 text-sm">
            Enter your child's age and we'll recommend the best starting point for their journey.
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="number"
            min={6}
            max={18}
            placeholder={t('gameDevPage.ageRecommender.placeholder')}
            value={age}
            onChange={(e) => {
              const v = e.target.value;
              setAge(v === '' ? '' : Number(v));
            }}
            className="w-24 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center font-bold text-lg appearance-none"
          />

          {rec && (
            <button
              type="button"
              onClick={() => onRecommend(rec.programId)}
              className="flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-indigo-950 px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
            >
              Start with {rec.programName}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {rec && (
        <p className="text-amber-200 text-sm italic relative z-10 mt-6">
          Why? {rec.reasonText}
        </p>
      )}
    </div>
  );
}


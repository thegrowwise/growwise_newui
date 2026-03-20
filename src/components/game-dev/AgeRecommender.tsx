'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';
import { usePricingConfig } from '@/hooks/usePricingConfig';

type GameDevProgramId = 'scratch' | 'roblox' | 'minecraft' | 'robotics';

interface AgeRecommenderProps {
  onRecommend: (programId: string) => void;
  className?: string;
}

export function AgeRecommender({ onRecommend, className }: AgeRecommenderProps) {
  const t = useTranslations();
  const { data } = usePricingConfig();
  const [age, setAge] = useState<number | ''>('');

  const recs = useMemo(() => {
    if (age === '' || Number.isNaN(Number(age))) return [];
    if (!data?.age_recommender?.game_dev) return [];
    const numericAge = Number(age);
    return data.age_recommender.game_dev.filter(
      (rule) => numericAge >= rule.min && numericAge <= rule.max,
    );
  }, [age, data]);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label className="text-sm text-gray-700">{t('gameDevPage.ageRecommender.label')}</Label>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={age}
          placeholder={t('gameDevPage.ageRecommender.placeholder')}
          onChange={(e) => {
            const v = e.target.value;
            setAge(v === '' ? '' : Number(v));
          }}
          className="max-w-[240px]"
        />
      </div>

      {recs.length > 0 && (
        <Card className="border border-emerald-200 bg-emerald-50/60">
          <CardContent className="space-y-3 pt-6">
            <div className="text-sm font-semibold text-emerald-900">
              {t('gameDevPage.ageRecommender.title')}
            </div>
            <div className="flex flex-wrap gap-2">
              {recs.map((rec) => (
                <Button
                  key={rec.program_id}
                  type="button"
                  variant="outline"
                  className="border-emerald-300 bg-white/60 text-emerald-900 hover:bg-white"
                  onClick={() => onRecommend(rec.program_id)}
                >
                  <span className="mr-2 font-semibold">{rec.program_id}</span>
                  <span className="text-xs text-emerald-700">
                    {t(`gameDevPage.ageRecommender.reasons.${rec.reason_key}`)}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


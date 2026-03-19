'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/components/ui/utils';

type GameDevProgramId = 'scratch' | 'roblox' | 'minecraft' | 'robotics';

interface Recommendation {
  programId: GameDevProgramId;
  reasonKey: string;
}

interface AgeRecommenderProps {
  onRecommend: (programId: string) => void;
  className?: string;
}

function recommendForAge(age: number): Recommendation[] {
  const recs: Recommendation[] = [];

  // Specific suggestions
  if (age >= 6 && age <= 8) recs.push({ programId: 'scratch', reasonKey: 'scratch' });
  if (age >= 8 && age <= 11) recs.push({ programId: 'roblox', reasonKey: 'roblox' });
  if (age >= 10 && age <= 14) recs.push({ programId: 'minecraft', reasonKey: 'minecraft' });
  // Robotics overlaps
  if (age >= 8 && age <= 16) recs.push({ programId: 'robotics', reasonKey: 'robotics' });

  return recs;
}

export function AgeRecommender({ onRecommend, className }: AgeRecommenderProps) {
  const t = useTranslations();
  const [age, setAge] = useState<number | ''>('');

  const recs = useMemo(() => {
    if (age === '' || Number.isNaN(Number(age))) return [];
    return recommendForAge(Number(age));
  }, [age]);

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
                  key={rec.programId}
                  type="button"
                  variant="outline"
                  className="border-emerald-300 bg-white/60 text-emerald-900 hover:bg-white"
                  onClick={() => onRecommend(rec.programId)}
                >
                  <span className="mr-2 font-semibold">{rec.programId}</span>
                  <span className="text-xs text-emerald-700">
                    {t(`gameDevPage.ageRecommender.reasons.${rec.reasonKey}`)}
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


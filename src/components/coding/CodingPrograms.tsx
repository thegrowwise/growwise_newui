'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePricingConfig, type Program } from '@/hooks/usePricingConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import { ProgramJourneyCard } from '@/components/shared/ProgramJourneyCard';

type CodingProgramId = 'python' | 'ml-ai' | 'app-dev';

const CODING_PROGRAM_ORDER: CodingProgramId[] = ['python', 'ml-ai', 'app-dev'];

export function CodingPrograms() {
  const t = useTranslations();
  const { data, loading, error } = usePricingConfig();
  const [activeTab, setActiveTab] = useState<CodingProgramId>('python');

  const programs = useMemo(() => {
    if (!data) return [] as Program[];
    return data.programs
      .filter((p) => p.track === 'coding' && p.active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const programsById = useMemo(() => {
    const map = new Map<string, Program>();
    programs.forEach((p) => map.set(p.id, p));
    return map;
  }, [programs]);

  const activeProgram = programsById.get(activeTab) ?? programs[0] ?? null;

  const tabAccent: Record<CodingProgramId, string> = {
    python: 'text-blue-700',
    'ml-ai': 'text-purple-700',
    'app-dev': 'text-teal-700',
  };

  return (
    <section
      id="programs"
      className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 md:px-6 lg:px-8">
        <Card className="border border-gray-200 bg-white/80 shadow-md backdrop-blur">
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1F396D] md:text-2xl">
                  {t('codingPage.programs.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {t('codingPage.programs.subtitle')}
                </p>
              </div>
              <div className="inline-flex rounded-full bg-gray-100 p-1">
                {CODING_PROGRAM_ORDER.map((id) => {
                  const isActive = id === activeTab;
                  const label = programsById.get(id)?.name ?? id;
                  return (
                    <Button
                      key={id}
                      type="button"
                      size="sm"
                      variant={isActive ? 'default' : 'ghost'}
                      className={cn(
                        'rounded-full px-4 py-1 text-xs md:text-sm',
                        isActive
                          ? 'bg-white text-[#1F396D] shadow-sm'
                          : 'text-gray-600',
                        !isActive && tabAccent[id],
                      )}
                      onClick={() => setActiveTab(id)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {loading && (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F16112]/40 border-t-[#F16112]" />
              </div>
            )}

            {!loading && error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && activeProgram && (
              <ProgramJourneyCard program={activeProgram} />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
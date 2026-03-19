'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePricingConfig, type Program } from '@/hooks/usePricingConfig';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { ProgramJourneyCard } from '@/components/shared/ProgramJourneyCard';
import { AgeRecommender } from '@/components/game-dev/AgeRecommender';
import { ScratchBridgeBanner } from '@/components/game-dev/ScratchBridgeBanner';

type GameDevProgramId = 'scratch' | 'roblox' | 'minecraft' | 'robotics';

const GAME_DEV_ORDER: GameDevProgramId[] = ['scratch', 'roblox', 'minecraft', 'robotics'];

const TAB_ACCENT: Record<GameDevProgramId, string> = {
  scratch: 'text-amber-700',
  roblox: 'text-red-700',
  minecraft: 'text-emerald-700',
  robotics: 'text-orange-700',
};

export function GameDevPrograms() {
  const t = useTranslations();
  const { data, loading, error } = usePricingConfig();
  const [activeTab, setActiveTab] = useState<GameDevProgramId>('scratch');

  const programs = useMemo(() => {
    if (!data) return [] as Program[];
    return data.programs
      .filter((p) => p.track === 'game-dev' && p.active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const programsById = useMemo(() => {
    const map = new Map<string, Program>();
    programs.forEach((p) => map.set(p.id, p));
    return map;
  }, [programs]);

  const activeProgram = programsById.get(activeTab) ?? programs[0] ?? null;

  return (
    <section id="programs" className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 md:px-6 lg:px-8">
        <Card className="border border-gray-200 bg-white/80 shadow-md backdrop-blur">
          <CardContent className="space-y-6 pt-6">
            <AgeRecommender onRecommend={(id) => setActiveTab(id as GameDevProgramId)} />

            <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl bg-gray-100 p-2">
              {GAME_DEV_ORDER.map((tabId) => {
                const isActive = tabId === activeTab;
                const program = programsById.get(tabId);
                const label = program?.name ?? tabId;
                const isInPersonOnly = !!program?.studio_only;

                return (
                  <Button
                    key={tabId}
                    type="button"
                    size="sm"
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'rounded-full px-4 py-1 text-xs md:text-sm',
                      isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600',
                      !isActive && TAB_ACCENT[tabId],
                    )}
                    onClick={() => setActiveTab(tabId)}
                  >
                    <span className="mr-2">{label}</span>
                    {isInPersonOnly && (
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-white/70 text-[10px] font-semibold text-gray-700"
                      >
                        {t('gameDevPage.tabs.inPersonBadge')}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            {loading && (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600/30 border-t-emerald-600" />
              </div>
            )}

            {!loading && error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && activeProgram && (
              <div className="space-y-4">
                <ProgramJourneyCard program={activeProgram} />
                {activeTab === 'scratch' && <ScratchBridgeBanner />}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}


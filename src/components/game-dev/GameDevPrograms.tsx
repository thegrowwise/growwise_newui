'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle } from 'lucide-react';
import { usePricingConfig, type Program } from '@/hooks/usePricingConfig';
import { cn } from '@/components/ui/utils';
import { ProgramJourneyCard } from '@/components/shared/ProgramJourneyCard';
import { AgeRecommender } from '@/components/game-dev/AgeRecommender';
import { ScratchBridgeBanner } from '@/components/game-dev/ScratchBridgeBanner';
import {
  getProgramAccentColorClass,
  getProgramAccentHex,
} from '@/lib/programThemeRegistry';

export function GameDevPrograms() {
  const t = useTranslations();
  const { data, loading, error } = usePricingConfig();
  const [activeTab, setActiveTab] = useState<string>('scratch');

  const programs = useMemo(() => {
    if (!data) return [] as Program[];
    return data.programs
      .filter((p) => p.track === 'game-dev' && p.active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  useEffect(() => {
    if (!programs.length) return;
    const hasActive = programs.some((p) => p.id === activeTab);
    if (!activeTab || !hasActive) {
      setActiveTab(programs[0].id);
    }
  }, [programs, activeTab]);

  const activeProgram =
    programs.find((p) => p.id === activeTab) ?? programs[0] ?? null;

  if (loading && !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-transparent">
        <Loader2 className="h-10 w-10 animate-spin text-[#F16112]" aria-hidden />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center bg-transparent px-4 text-center text-red-700">
        <AlertCircle className="mb-4 h-12 w-12" aria-hidden />
        <p className="font-semibold">{t('gameDevPage.programs.error')}</p>
      </div>
    );
  }

  return (
    <section id="programs" className="px-4 pb-32">
      <div className="max-w-6xl mx-auto">
        <AgeRecommender onRecommend={(id) => setActiveTab(id)} />

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {programs.map((prog) => {
            const isActive = prog.id === activeTab;
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => setActiveTab(prog.id)}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg transition-all border-2',
                  isActive
                    ? 'border-[#1F396D] bg-[#1F396D] text-white shadow-lg shadow-[#1F396D]/25 scale-105'
                    : 'border-[#1F396D]/25 bg-white text-[#1F396D] hover:border-[#F16112]/50 hover:bg-[#F16112]/8',
                )}
              >
                <span>{prog.name}</span>
                {prog.studio_only && (
                  <span
                    className={cn(
                      'ml-1 rounded px-2 py-0.5 text-xs font-semibold',
                      isActive
                        ? 'bg-[#F16112]/25 text-white'
                        : 'bg-[#F16112]/15 text-[#B45309] border border-[#F16112]/30',
                    )}
                  >
                    {t('pricingUi.deliveryMode.studioOnlyBadge')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeProgram && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProgramJourneyCard
              program={activeProgram}
              colorThemeClass={getProgramAccentColorClass(activeProgram.id)}
              colorThemeHex={getProgramAccentHex(activeProgram.id)}
            />
            {activeProgram.id === 'scratch' && <ScratchBridgeBanner />}
          </div>
        )}
      </div>
    </section>
  );
}

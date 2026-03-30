'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle } from 'lucide-react';
import { usePricingConfig, type Program } from '@/hooks/usePricingConfig';
import { cn } from '@/components/ui/utils';
import { ProgramJourneyCard } from '@/components/shared/ProgramJourneyCard';
import {
  getProgramAccentColorClass,
  getProgramAccentHex,
} from '@/lib/programThemeRegistry';

export function CodingPrograms() {
  const t = useTranslations();
  const { data, loading, error } = usePricingConfig();
  const [activeTab, setActiveTab] = useState<string>('python');

  const programs = useMemo(() => {
    if (!data) return [] as Program[];
    return data.programs
      .filter((p) => p.track === 'coding' && p.active)
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
      <div className="flex min-h-[40vh] items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1F396D]" aria-hidden />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center text-red-700">
        <AlertCircle className="mb-4 h-12 w-12" aria-hidden />
        <p className="font-semibold">{t('codingPage.programs.error')}</p>
      </div>
    );
  }

  return (
    <section id="programs" className="px-4 pb-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {programs.map((prog) => {
            const isActive = prog.id === activeTab;
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => setActiveTab(prog.id)}
                className={cn(
                  'px-6 py-3 rounded-full font-bold text-lg transition-all',
                  isActive
                    ? 'bg-foreground text-background shadow-lg scale-105'
                    : 'bg-white text-muted-foreground hover:bg-slate-100 border border-border',
                )}
              >
                {prog.name}
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
          </div>
        )}
      </div>
    </section>
  );
}

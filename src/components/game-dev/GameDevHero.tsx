'use client';

import React from 'react';
import { Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';

interface GameDevHeroProps {
  className?: string;
}

export function GameDevHero({ className }: GameDevHeroProps) {
  const t = useTranslations();

  return (
    <div className={cn('bg-transparent', className)}>
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#F16112]/10 text-[#1F396D] ring-1 ring-[#1F396D]/25 text-sm font-bold uppercase tracking-wider mb-6">
            <Gamepad2 className="w-4 h-4 mr-2 text-[#F16112]" aria-hidden />
            {t('gameDevPage.hero.badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1F396D] mb-6">
            {t('gameDevPage.hero.headlineLine1')}
            <br />
            <span className="text-gradient-gamedev">{t('gameDevPage.hero.headlineLine2')}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            {t('gameDevPage.hero.subtext')}
          </p>

          <div className="aspect-[21/9] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(241,97,18,0.2)] ring-2 ring-[#F16112]/25 ring-offset-2 ring-offset-[#FFFBF0] mb-12">
            <img
              src="/images/hero-gamedev.png"
              alt="Kid excited about game dev"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

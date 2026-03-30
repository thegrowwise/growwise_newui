'use client';

import React from 'react';
import { Code2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';

interface CodingHeroProps {
  className?: string;
}

export function CodingHero({ className }: CodingHeroProps) {
  const t = useTranslations();

  return (
    <div className={cn('bg-transparent', className)}>
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#1F396D]/10 text-[#1F396D] ring-1 ring-[#F16112]/35 text-sm font-bold uppercase tracking-wider mb-6">
            <Code2 className="w-4 h-4 mr-2 text-[#F16112]" aria-hidden />
            {t('codingPage.hero.badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1F396D] mb-6">
            {t('codingPage.hero.headlineLine1')}
            <br />
            <span className="text-gradient-coding">{t('codingPage.hero.headlineLine2')}</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            {t('codingPage.hero.subtext')}
          </p>

          <div className="aspect-[21/9] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(31,57,109,0.28)] ring-2 ring-[#1F396D]/15 ring-offset-2 ring-offset-[#F8FAFC] mb-16">
            <img
              src="/images/hero-coding.png"
              alt="Teenager coding"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

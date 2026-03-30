'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';

interface CodingHeroProps {
  className?: string;
}

export function CodingHero({ className }: CodingHeroProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className={cn('bg-[#F8FAFC]', className)}>
      <nav className="bg-white border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href={`/${locale}`}
            className="font-bold text-xl tracking-tight text-foreground flex items-center gap-2"
            aria-label={t('codingPage.nav.homeAria')}
          >
            <div className="w-8 h-8 bg-[#1F396D] rounded-lg flex items-center justify-center text-white text-sm">
              G
            </div>
            <span>{t('codingPage.nav.brand')}</span>
          </Link>
          <Link
            href={`/${locale}/game-dev`}
            className="text-sm font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <span>{t('codingPage.nav.crossLink')}</span>
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </nav>

      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-wider mb-6">
            <Code2 className="w-4 h-4 mr-2" aria-hidden />
            {t('codingPage.hero.badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('codingPage.hero.headlineLine1')}
            <br />
            <span className="text-gradient-coding">{t('codingPage.hero.headlineLine2')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {t('codingPage.hero.subtext')}
          </p>

          <div className="aspect-[21/9] w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl mb-16">
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

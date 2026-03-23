'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface GameDevHeroProps {
  className?: string;
}

export function GameDevHero({ className }: GameDevHeroProps) {
  const t = useTranslations();

  const handleScrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white',
        'py-16 md:py-24',
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="space-y-6 md:max-w-xl">
          <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {t('gameDevPage.hero.badge')}
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            {t('gameDevPage.hero.headline')}
          </h1>
          <p className="max-w-xl text-sm text-white/80 md:text-base">
            {t('gameDevPage.hero.subtext')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleScrollToPrograms}
              className="bg-emerald-400 text-emerald-950 hover:bg-emerald-300"
            >
              {t('gameDevPage.hero.ctaPrograms')}
            </Button>
            <Link href="/coding" className="inline-flex">
              <Button
                type="button"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/10"
              >
                <span className="mr-1">{t('gameDevPage.hero.ctaAlt')}</span>
                <span className="text-lg leading-none">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


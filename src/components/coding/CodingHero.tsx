'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface CodingHeroProps {
  className?: string;
}

export function CodingHero({ className }: CodingHeroProps) {
  const t = useTranslations();
  const handleScrollToPrograms = () => {
    const el = document.getElementById('programs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#243b6a] to-[#0b172f] text-white py-16 md:py-24',
        className,
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div className="space-y-6 md:max-w-xl">
          <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {t('codingPage.hero.badge')}
          </Badge>
          <h1 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
            {t('codingPage.hero.headline')}
          </h1>
          <p className="max-w-xl text-sm text-white/80 md:text-base">
            {t('codingPage.hero.subtext')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleScrollToPrograms}
              className="bg-[#F16112] hover:bg-[#F1894F]"
            >
              {t('codingPage.hero.ctaPrograms')}
            </Button>
            <Link href="/game-dev" className="inline-flex">
              <Button
                type="button"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/10"
              >
                <span className="mr-1">{t('codingPage.hero.ctaAlt')}</span>
                <span className="text-lg leading-none">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
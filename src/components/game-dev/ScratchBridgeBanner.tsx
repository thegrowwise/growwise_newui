'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';
import { ArrowUpRight } from 'lucide-react';

interface ScratchBridgeBannerProps {
  className?: string;
}

export function ScratchBridgeBanner({ className }: ScratchBridgeBannerProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        'mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm',
        className,
      )}
    >
      <div>
        <h4 className="text-amber-900 font-bold text-lg">
          {t('gameDevPage.scratchBridge.title')}
        </h4>
        <p className="text-amber-700/80 text-sm mt-1">{t('gameDevPage.scratchBridge.body')}</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-amber-900 border border-amber-100 shadow-sm flex items-center gap-1">
          Roblox <ArrowUpRight className="w-3 h-3" />
        </div>
        <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-amber-900 border border-amber-100 shadow-sm flex items-center gap-1">
          Python <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}


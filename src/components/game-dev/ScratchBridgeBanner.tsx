'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';

interface ScratchBridgeBannerProps {
  className?: string;
}

export function ScratchBridgeBanner({ className }: ScratchBridgeBannerProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200 bg-amber-50 px-4 py-3',
        className,
      )}
    >
      <div className="text-sm font-semibold text-amber-900">
        {t('gameDevPage.scratchBridge.title')}
      </div>
      <div className="mt-1 text-xs text-amber-800">
        {t('gameDevPage.scratchBridge.body')}
      </div>
    </div>
  );
}


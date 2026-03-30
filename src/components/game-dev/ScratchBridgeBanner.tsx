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
        'mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border-2 border-[#1F396D]/15 bg-gradient-to-r from-[#1F396D]/[0.06] to-[#F16112]/[0.08]',
        className,
      )}
    >
      <div>
        <h4 className="text-[#1F396D] font-bold text-lg">
          {t('gameDevPage.scratchBridge.title')}
        </h4>
        <p className="text-gray-700 text-sm mt-1">{t('gameDevPage.scratchBridge.body')}</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-[#1F396D] border border-[#F16112]/25 shadow-sm flex items-center gap-1 hover:bg-[#F16112]/5 transition-colors">
          Roblox <ArrowUpRight className="w-3 h-3 text-[#F16112]" />
        </div>
        <div className="px-4 py-2 bg-white rounded-lg text-sm font-semibold text-[#1F396D] border border-[#F16112]/25 shadow-sm flex items-center gap-1 hover:bg-[#F16112]/5 transition-colors">
          Python <ArrowUpRight className="w-3 h-3 text-[#F16112]" />
        </div>
      </div>
    </div>
  );
}


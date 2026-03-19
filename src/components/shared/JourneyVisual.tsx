'use client';

import React from 'react';
import { cn } from '@/components/ui/utils';

export interface JourneyVisualLevel {
  id: string;
  levelNumber: number;
  name: string;
  priceLabel: string;
  milestones: string;
  isActive?: boolean;
}

interface JourneyVisualProps {
  levels: JourneyVisualLevel[];
  onSelectLevel?: (id: string) => void;
  className?: string;
}

export function JourneyVisual({
  levels,
  onSelectLevel,
  className,
}: JourneyVisualProps) {
  if (!levels.length) return null;

  return (
    <div className={cn('overflow-x-auto pb-2', className)}>
      <div className="flex min-w-max items-start gap-6 px-1">
        {levels.map((level, index) => {
          const isLast = index === levels.length - 1;
          const isActive = !!level.isActive;

          return (
            <div key={level.id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onSelectLevel?.(level.id)}
                className="flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                      isActive
                        ? 'bg-[#F16112] text-white shadow-md'
                        : 'border border-[#F16112] bg-[#F16112]/10 text-[#F16112]',
                    )}
                  >
                    {level.levelNumber}
                  </div>
                  {!isLast && (
                    <div className="h-px w-12 bg-gradient-to-r from-[#F16112] to-[#F1894F]" />
                  )}
                </div>
                <div className="space-y-1 text-left">
                  <div className="text-xs font-semibold text-gray-900">
                    {level.name}
                  </div>
                  {level.priceLabel && (
                    <div className="text-xs font-medium text-[#1F396D]">
                      {level.priceLabel}
                    </div>
                  )}
                  <div className="max-w-[200px] text-[11px] text-gray-500 line-clamp-3">
                    {level.milestones}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { JourneyVisual as default };
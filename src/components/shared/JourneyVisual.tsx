'use client';

import React from 'react';
import { cn } from '@/components/ui/utils';
import { CheckCircle2 } from 'lucide-react';

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
  accentColorClass?: string;
  accentColorHex?: string;
  className?: string;
}

export function JourneyVisual({
  levels,
  accentColorClass = 'bg-primary',
  accentColorHex,
  className,
}: JourneyVisualProps) {
  if (!levels.length) return null;

  const accentBgStyle = accentColorHex ? { backgroundColor: accentColorHex } : undefined;
  const accentBgClass = accentColorHex ? '' : accentColorClass;

  return (
    <div className={cn('w-full py-8', className)}>
      <h3 className="text-xl font-bold mb-8 text-center text-foreground">
        The Learning Journey
      </h3>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full w-1/4 opacity-50', accentBgClass)}
            style={accentBgStyle}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 relative z-10">
          {[...levels].slice(0, 4).map((level, idx) => {
            const isFirst = idx === 0;

            return (
              <div key={level.id} className="flex flex-col items-center text-center">
                {/* Step circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm border-4 border-background transition-transform hover:scale-110',
                    isFirst
                      ? cn(accentBgClass, 'text-white')
                      : 'bg-white text-muted-foreground border-muted',
                  )}
                  style={isFirst ? accentBgStyle : undefined}
                >
                  {level.levelNumber}
                </div>

                <h4 className="font-bold text-foreground mb-1">{level.name}</h4>

                {level.priceLabel && (
                  <p className="text-sm font-semibold text-muted-foreground mb-3">
                    {level.priceLabel}/mo
                  </p>
                )}

                <ul className="text-xs text-muted-foreground text-left space-y-2 w-full px-2">
                  {String(level.milestones || '')
                    .split(/[·•]/)
                    .map((m, i) => {
                      const trimmed = m.trim();
                      if (!trimmed) return null;
                      return (
                        <li key={`${level.id}-${i}`} className="flex items-start gap-1.5">
                          <CheckCircle2
                            className={cn(
                              'w-3.5 h-3.5 mt-0.5 shrink-0',
                              isFirst ? 'text-primary' : 'text-muted-foreground/50',
                            )}
                          />
                          <span className="leading-tight">{trimmed}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { JourneyVisual as default };
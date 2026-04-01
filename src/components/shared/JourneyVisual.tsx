'use client';

import React from 'react';
import { cn } from '@/components/ui/utils';
import { CheckCircle2 } from 'lucide-react';

export interface JourneyVisualLevel {
  id: string;
  levelNumber: number;
  name: string;
  milestones: string;
  isActive?: boolean;
}

interface JourneyVisualProps {
  levels: JourneyVisualLevel[];
  accentColorClass?: string;
  accentColorHex?: string;
  className?: string;
  /** When set, level columns are keyboard-focusable and update selection on click. */
  onLevelSelect?: (index: number) => void;
}

export function JourneyVisual({
  levels,
  accentColorClass = 'bg-primary',
  accentColorHex,
  className,
  onLevelSelect,
}: JourneyVisualProps) {
  if (!levels.length) return null;

  const accentBgStyle = accentColorHex ? { backgroundColor: accentColorHex } : undefined;
  const accentBgClass = accentColorHex ? '' : accentColorClass;
  const visibleLevels = [...levels].slice(0, 4);
  const activeIndex = Math.max(
    0,
    visibleLevels.findIndex((l) => !!l.isActive),
  );
  const progressPercent = (() => {
    if (visibleLevels.length <= 1) return 0;
    const last = visibleLevels.length - 1;
    if (activeIndex >= last) return 100;
    return ((activeIndex + 0.5) / last) * 100;
  })();

  return (
    <div className={cn('w-full py-8', className)}>
      <h3 className="text-xl font-bold mb-8 text-center text-foreground">
        The Learning Journey
      </h3>

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full opacity-50 transition-[width] duration-200', accentBgClass)}
            style={{ ...accentBgStyle, width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-4 relative z-10">
          {visibleLevels.map((level, idx) => {
            const isActive = !!level.isActive;

            return (
              <div
                key={level.id}
                role={onLevelSelect ? 'button' : undefined}
                tabIndex={onLevelSelect ? 0 : undefined}
                aria-pressed={onLevelSelect ? isActive : undefined}
                aria-label={onLevelSelect ? `${level.name}, level ${level.levelNumber}` : undefined}
                onClick={onLevelSelect ? () => onLevelSelect(idx) : undefined}
                onKeyDown={
                  onLevelSelect
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onLevelSelect(idx);
                        }
                      }
                    : undefined
                }
                className={cn(
                  'flex flex-col items-center text-center rounded-xl outline-none',
                  onLevelSelect && 'cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                )}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-sm border-4 border-background transition-transform hover:scale-110',
                    isActive
                      ? cn(accentBgClass, 'text-white')
                      : 'bg-white text-muted-foreground border-muted',
                  )}
                  style={isActive ? accentBgStyle : undefined}
                >
                  {level.levelNumber}
                </div>

                <h4 className="font-bold text-foreground mb-1">{level.name}</h4>

                <ul className="text-xs text-muted-foreground text-left space-y-2 w-full px-2 mt-3">
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
                              isActive ? 'text-primary' : 'text-muted-foreground/50',
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
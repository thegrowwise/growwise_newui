'use client';

import React from 'react';
import { cn } from '@/components/ui/utils';
import { Plus } from 'lucide-react';

export interface AddOnVM {
  id: string;
  name: string;
  priceLabel: string;
  active: boolean;
}

interface AddOnSelectorProps {
  addons: AddOnVM[];
  selectedIds: string[];
  onToggle?: (id: string) => void;
  className?: string;
}

export function AddOnSelector({
  addons,
  selectedIds,
  onToggle,
  className,
}: AddOnSelectorProps) {
  const activeAddons = addons.filter((a) => a.active);

  if (!activeAddons.length) return null;

  return (
    <div className={cn('my-8', className)}>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Optional Monthly Add-ons
      </h4>

      <div className="flex flex-wrap gap-3">
        {activeAddons.map((addon) => {
          const selected = selectedIds.includes(addon.id);

          return (
            <button
              key={addon.id}
              type="button"
              onClick={() => onToggle?.(addon.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                selected
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
                  : 'bg-card text-foreground border-border hover:border-primary/30 hover:bg-secondary',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-center w-5 h-5 rounded-full transition-colors',
                  selected ? 'bg-white/20' : 'bg-primary/10 text-primary',
                )}
              >
                <Plus
                  className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    selected && 'rotate-45',
                  )}
                />
              </div>
              {addon.name}
              <span
                className={cn(
                  'opacity-70',
                  selected ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
              >
                +{addon.priceLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { AddOnSelector as default };
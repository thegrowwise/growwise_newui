'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';

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
  const activeAddons = addons
    .filter((a) => a.active)
    .sort((a, b) => a.id.localeCompare(b.id));

  if (!activeAddons.length) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {activeAddons.map((addon) => {
        const selected = selectedIds.includes(addon.id);
        return (
          <Button
            key={addon.id}
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              selected
                ? 'border-[#F16112] bg-[#F16112]/10 text-[#F16112]'
                : 'border-gray-300 text-gray-700 hover:border-[#F16112]/40',
            )}
            onClick={() => onToggle?.(addon.id)}
          >
            <span className="truncate">{addon.name}</span>
            <span className="ml-1 text-[11px] text-gray-500">
              +{addon.priceLabel}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export { AddOnSelector as default };
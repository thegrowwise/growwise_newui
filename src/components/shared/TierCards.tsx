import React from 'react';
import { cn } from '@/components/ui/utils';
import type { TierName } from '@/hooks/usePricingConfig';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

export interface TierCardVM {
  id: string;
  name: TierName;
  title: string;
  priceLabel: string;
  includes: string[];
  isFeatured?: boolean;
}

interface TierCardsProps {
  tiers: TierCardVM[];
  selected?: TierName | null;
  onSelect?: (name: TierName) => void;
  className?: string;
}

export function TierCards({
  tiers,
  selected,
  onSelect,
  className,
}: TierCardsProps) {
  const t = useTranslations();
  const mostChosenLabel = t('pricingUi.tier.mostChosen');
  if (!tiers.length) return null;

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6 my-8', className)}>
      {tiers.map((tier) => {
        const isSelected = tier.name === selected;
        const isFeatured = !!tier.isFeatured;

        return (
          <div
            key={tier.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(tier.name)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect?.(tier.name);
            }}
            className={cn(
              'relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 text-left flex flex-col group',
              isSelected
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
                : isFeatured
                  ? 'border-primary/30 bg-card hover:border-primary/60 hover:shadow-md'
                  : 'border-border bg-card hover:border-border/80 hover:shadow-md',
            )}
          >
            {isFeatured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-indigo-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-sm">
                {mostChosenLabel}
              </div>
            )}

            <div className="mb-4">
              <h4 className="font-bold text-xl capitalize text-foreground">{tier.title}</h4>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{tier.priceLabel}</span>
                <span className="text-sm font-medium text-muted-foreground">/mo</span>
              </div>
            </div>

            <div className="flex-grow">
              <ul className="space-y-3">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <div
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground group-hover:bg-primary/10',
                )}
              >
                {isSelected ? 'Selected' : 'Select Tier'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import type { TierName } from '@/hooks/usePricingConfig';
import { useTranslations } from 'next-intl';

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
    <div
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-3',
        className,
      )}
    >
      {tiers.map((tier) => {
        const isSelected = tier.name === selected;

        return (
          <button
            key={tier.id}
            type="button"
            onClick={() => onSelect?.(tier.name)}
            className="text-left"
          >
            <Card
              className={cn(
                'h-full transition-all duration-200 border-2',
                isSelected
                  ? 'border-[#F16112] bg-[#F16112]/5 shadow-md'
                  : 'border-gray-200 hover:border-[#F16112]/40 hover:shadow-sm',
              )}
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base font-semibold">
                    {tier.title}
                  </CardTitle>
                  {tier.isFeatured && (
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-[#1F396D]/10 text-[10px] font-semibold text-[#1F396D]"
                    >
                      {mostChosenLabel}
                    </Badge>
                  )}
                </div>
                <div className="text-lg font-bold text-[#1F396D]">
                  {tier.priceLabel}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1 text-xs text-gray-600">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 h-3 w-3 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
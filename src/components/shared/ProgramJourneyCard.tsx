'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/ui/utils';
import type {
  Program,
  Tier,
  JourneyLevel,
  ProgramAddon,
  ProgramFee,
  DeliveryMode,
  TierName,
} from '@/hooks/usePricingConfig';
import { useEnroll } from '@/contexts/EnrollContext';
import { DeliveryModeToggle } from '@/components/shared/DeliveryModeToggle';
import {
  JourneyVisual,
  type JourneyVisualLevel,
} from '@/components/shared/JourneyVisual';
import {
  TierCards,
  type TierCardVM,
} from '@/components/shared/TierCards';
import {
  AddOnSelector,
  type AddOnVM,
} from '@/components/shared/AddOnSelector';

interface ProgramJourneyCardProps {
  program: Program;
}

function tierPriceForMode(tier: Tier, mode: DeliveryMode): number {
  return mode === 'studio'
    ? tier.price_studio
    : tier.price_live ?? tier.price_studio;
}

function levelPriceForMode(level: JourneyLevel, mode: DeliveryMode): number {
  return mode === 'studio'
    ? level.price_studio
    : level.price_live ?? level.price_studio;
}

function formatPrice(amount: number | null): string {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function toTierVM(tiers: Tier[], mode: DeliveryMode): TierCardVM[] {
  return [...tiers]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((tier) => ({
      id: tier.id,
      name: tier.name,
      title: tier.name.charAt(0).toUpperCase() + tier.name.slice(1),
      priceLabel: formatPrice(tierPriceForMode(tier, mode)),
      includes: tier.includes,
      isFeatured: tier.is_featured,
    }));
}

function toLevelVM(
  levels: JourneyLevel[],
  mode: DeliveryMode,
): JourneyVisualLevel[] {
  return [...levels]
    .sort((a, b) => a.level_num - b.level_num)
    .slice(0, 4)
    .map((level, index) => ({
      id: level.id,
      levelNumber: level.level_num,
      name: level.name,
      priceLabel: formatPrice(levelPriceForMode(level, mode)),
      milestones: level.milestones,
      isActive: index === 0,
    }));
}

function toAddOnVM(addons: ProgramAddon[]): AddOnVM[] {
  return [...addons]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((addon) => ({
      id: addon.id,
      name: addon.name,
      priceLabel: `${formatPrice(addon.price)}/mo`,
      active: addon.active,
    }));
}

function getActiveFees(fees: ProgramFee[]): ProgramFee[] {
  return fees;
}

export function ProgramJourneyCard({ program }: ProgramJourneyCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const {
    programId,
    tierName,
    addonIds,
    setProgram,
    setTier,
    setDeliveryMode,
    toggleAddon,
    buildEnrollUrl,
  } = useEnroll();

  const [mode, setMode] = useState<DeliveryMode>('live');

  const tiersVM = useMemo(
    () => toTierVM(program.tiers, mode),
    [program.tiers, mode],
  );
  const levelsVM = useMemo(
    () => toLevelVM(program.journey_levels, mode),
    [program.journey_levels, mode],
  );
  const addonsVM = useMemo(
    () => toAddOnVM(program.program_addons),
    [program.program_addons],
  );
  const fees = useMemo(
    () => getActiveFees(program.program_fees),
    [program.program_fees],
  );

  const handleModeChange = (nextMode: DeliveryMode) => {
    setMode(nextMode);
    setDeliveryMode(nextMode);
  };

  const handleTierSelect = (name: TierName) => {
    setProgram(program.id);
    setTier(name);
  };

  const handleAddonToggle = (id: string) => {
    toggleAddon(id);
  };

  const enrollEnabled = programId === program.id && !!tierName;

  const handleEnrollClick = () => {
    if (!enrollEnabled) return;
    const url = buildEnrollUrl();
    router.push(url);
  };

  const ageLabel = t('pricingUi.enroll.ages', { min: program.age_min, max: program.age_max });

  return (
    <Card className="relative overflow-hidden border border-gray-200 bg-white/80 shadow-md backdrop-blur-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-semibold text-[#1F396D]">
              {program.name}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600">
              {program.tagline}
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="rounded-full bg-[#F16112]/10 text-xs font-semibold text-[#F16112]"
          >
            {ageLabel}
          </Badge>
        </div>
        <DeliveryModeToggle
          value={mode}
          onChange={handleModeChange}
          studioOnly={program.studio_only}
        />
      </CardHeader>
      <CardContent className="space-y-6 pt-0">
        <JourneyVisual levels={levelsVM} />

        <div className="space-y-3">
          <TierCards
            tiers={tiersVM}
            selected={tierName}
            onSelect={handleTierSelect}
          />
          {fees.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
              {fees.map((fee) => (
                <Badge
                  key={fee.id}
                  variant="outline"
                  className="rounded-full border-gray-300 bg-white/60"
                >
                  <span className="mr-1">{fee.name}</span>
                  <span className="mr-1 text-gray-500">•</span>
                  <span className="mr-1">
                    {formatPrice(fee.amount)}
                  </span>
                  <span className="text-gray-400">{t('pricingUi.enroll.oneTime')}</span>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <AddOnSelector
            addons={addonsVM}
            selectedIds={addonIds}
            onToggle={handleAddonToggle}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            disabled={!enrollEnabled}
            className={cn(
              'px-6',
              enrollEnabled
                ? 'bg-[#F16112] hover:bg-[#F1894F]'
                : 'bg-gray-300 text-gray-600',
            )}
            onClick={handleEnrollClick}
          >
            {t('pricingUi.enroll.cta')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
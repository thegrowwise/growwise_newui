'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/components/ui/utils';
import { ChevronRight } from 'lucide-react';
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
  /** Accent color used for the journey visual (e.g. bg-blue-600). */
  colorThemeClass?: string;
  /** Accent color used for the enroll button inline background. */
  colorThemeHex?: string;
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

export function ProgramJourneyCard({
  program,
  colorThemeClass,
  colorThemeHex,
}: ProgramJourneyCardProps) {
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

  const [mode, setMode] = useState<DeliveryMode>(program.studio_only ? 'studio' : 'live');

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

  const selectedTierForProgram = programId === program.id ? tierName : null;
  const enrollEnabled = !!selectedTierForProgram;

  const handleEnrollClick = () => {
    if (!enrollEnabled) return;
    const url = buildEnrollUrl();
    router.push(url);
  };

  const ageLabel = t('pricingUi.enroll.ages', { min: program.age_min, max: program.age_max });
  const tierTitle = selectedTierForProgram
    ? selectedTierForProgram.charAt(0).toUpperCase() +
      selectedTierForProgram.slice(1)
    : null;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-border overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-border/50 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl font-bold text-foreground">{program.name}</h2>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full uppercase tracking-wider">
                {ageLabel}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">{program.tagline}</p>
          </div>

          <DeliveryModeToggle
            value={mode}
            onChange={handleModeChange}
            studioOnly={program.studio_only}
          />
        </div>
      </div>

      <div className="px-8 pb-8">
        <JourneyVisual
          levels={levelsVM}
          accentColorClass={colorThemeClass}
          accentColorHex={colorThemeHex}
        />

        <TierCards tiers={tiersVM} selected={selectedTierForProgram} onSelect={handleTierSelect} />

        {fees.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 items-center justify-center bg-slate-50 py-3 rounded-xl">
            <span className="text-sm font-medium text-muted-foreground mr-2">
              One-time fees apply:
            </span>
            {fees.map((fee) => (
              <span
                key={fee.id}
                className="text-xs font-semibold bg-white border border-border px-2 py-1 rounded-md text-foreground shadow-sm"
              >
                {fee.name}: {formatPrice(fee.amount)}
              </span>
            ))}
          </div>
        )}

        <AddOnSelector
          addons={addonsVM}
          selectedIds={addonIds}
          onToggle={handleAddonToggle}
        />

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            disabled={!enrollEnabled}
            className={cn(
              'group relative flex items-center justify-center gap-2 w-full max-w-md py-4 px-8 rounded-2xl font-bold text-lg text-white shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-1 active:translate-y-0 disabled:shadow-none',
            )}
            style={{
              backgroundColor: enrollEnabled
                ? colorThemeHex ?? '#1F396D'
                : 'var(--muted)',
            }}
            onClick={handleEnrollClick}
          >
            {tierTitle ? `Enroll in ${program.name} ${tierTitle}` : 'Select a tier to enroll'}
            {tierTitle && (
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
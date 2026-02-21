'use client';

import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  LEARNING_MODE_KEYS,
  LEARNING_MODE_FORMAT,
  LEARNING_MODE_TIME,
  ADV_MATH_PROGRAM_KEYS,
  type Program,
  type Level,
  type Slot,
  type LearningModeKey,
  type AdvMathProgramKey,
  type OlympiadTierId,
  type OlympiadTierConfig,
} from '@/lib/summer-camp-data';
import { useCart } from '@/components/gw/CartContext';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, Info, CalendarDays, CheckCircle2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ProgramList({
  programs = [],
  onSelectProgram,
  selectedProgramId,
}: {
  programs?: Program[] | null;
  onSelectProgram: (p: Program) => void;
  selectedProgramId: string | null;
}) {
  const t = useTranslations('summerCamp');
  const list = programs ?? [];

  const categories = Array.from(
    new Set(list.map((p) => p.category))
  );

  const isHalfDay = (category: Program['category']) => category === 'Half-Day Camps';

  return (
    <div className="space-y-8" role="group" aria-label={t('page.title')}>
      {categories.map((category) => {
        const categoryPrograms = list.filter(
          (p) => p.category === category
        );
        const hasOddCount = categoryPrograms.length % 2 !== 0;
        const halfDay = isHalfDay(category);

        return (
          <div key={category} className="space-y-3" role="group">
            {/* Category heading */}
            <div
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2
                ${halfDay
                  ? 'bg-[#1F396D]/10 border-[#1F396D]/30'
                  : 'bg-orange-100 border-orange-400'
                }
              `}
            >
              <span
                aria-hidden="true"
                className={`w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm ${
                  halfDay ? 'bg-[#1F396D]' : 'bg-orange-500'
                }`}
              />
              <h3
                className={`font-heading font-black text-xl uppercase tracking-widest
                  ${halfDay ? 'text-[#1F396D]' : 'text-orange-700'}
                `}
              >
                {category}
              </h3>
              <span
                className={`ml-auto text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider
                  ${halfDay
                    ? 'bg-[#1F396D]/30 text-[#1F396D]'
                    : 'bg-orange-300 text-orange-900'
                  }
                `}
              >
                {t('category.programs', { count: categoryPrograms.length })}
              </span>
            </div>

            <ul className="grid grid-cols-2 gap-3 list-none p-0 m-0" aria-label={t('category.programs', { count: categoryPrograms.length })}>
              {categoryPrograms.map((program, idx) => {
                const isSelected = selectedProgramId === program.id;
                const isLastAndAlone = hasOddCount && idx === categoryPrograms.length - 1;
                return (
                  <li key={program.id} className={isLastAndAlone ? 'col-span-2' : ''}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={program.title}
                      onClick={() => onSelectProgram(program)}
                      className={`text-left flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 bg-white w-full
                        ${isSelected
                          ? 'border-[#1F396D] shadow-lg'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }
                      `}
                    >
                      {/* Image — aspect ratio set directly on the img for reliable rendering */}
                      <img
                        src={program.image}
                        alt={`${program.title}: ${program.description}`}
                        draggable={false}
                        loading="lazy"
                        className="w-full object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500 bg-slate-200"
                        style={{
                          display: 'block',
                          aspectRatio: '650/450',
                          maxHeight: isLastAndAlone ? '200px' : undefined,
                        }}
                      />

                      {/* Content — white area below image */}
                      <div className="px-4 py-3 flex flex-col flex-1">
                        <h4
                          className={`font-black text-sm uppercase tracking-tight leading-snug line-clamp-2
                            ${isSelected ? 'text-[#1F396D]' : 'text-slate-900'}
                          `}
                        >
                          {program.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                          {program.description}
                        </p>
                        {isSelected && (
                          <div
                            aria-live="polite"
                            className="mt-2 flex items-center gap-1 text-[#1F396D] text-[10px] font-black uppercase tracking-widest"
                          >
                            {t('card.active')} <Check className="w-3 h-3" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

// Config constants are defined in summer-camp-data.ts (SSOT).
// Display labels are resolved via useTranslations('summerCamp') inside each component.

function InfoModal({
  program,
  onClose,
}: {
  program: Program;
  onClose: () => void;
}) {
  const t = useTranslations('summerCamp');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const details = program.details ?? null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${program.title} — program details`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-[320px] overflow-hidden">
        {/* Header */}
        <div className="bg-[#1F396D] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-0.5">
                Program Details
              </p>
              <h3 className="font-heading font-black text-white text-base leading-tight">
                {program.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close details"
              className="flex-shrink-0 mt-0.5 p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 w-9 h-9 flex items-center justify-center min-w-9 min-h-9"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {details ? (
          <>
            {/* Schedule strip — days per week, schedule, daily hours */}
            <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-[#1F396D]/5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#1F396D]">
                <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Days per week</p>
                  <p className="text-xs font-bold text-slate-900">{details.daysPerWeek} days</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-[#1F396D]">
                <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Schedule</p>
                  <p className="text-xs font-bold text-slate-900">{details.schedule}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-[#1F396D]">
                <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Daily hours</p>
                  <p className="text-xs font-bold text-slate-900">{details.dailyHours}</p>
                </div>
              </div>
            </div>

            {/* What's included */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 mb-3">
                What&apos;s Included
              </p>
              <ul className="space-y-2">
                {(details.includes ?? []).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-[#1F396D] flex-shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-slate-700 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="px-5 py-6">
            <p className="text-sm text-slate-600">{t('infoModal.detailsUnavailable')}</p>
          </div>
        )}

        {/* Age group footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Age Group: </span>
          <span className="text-[10px] font-black text-slate-900">{program.ageGroup}</span>
        </div>
      </div>
    </div>
  );

  // Render into document.body via portal — keeps the modal completely outside
  // the SSR component tree, so it can never cause a hydration mismatch.
  return createPortal(modalContent, document.body);
}

function SlotRow({
  slot,
  level,
  program,
  cartItemIds,
  onAdd,
  onRemove,
}: {
  slot: Slot;
  level: Level;
  program: Program;
  cartItemIds: Set<string>;
  onAdd: (level: Level, slot: Slot) => void;
  onRemove: (slotId: string) => void;
}) {
  const t = useTranslations('summerCamp');
  const inCart = cartItemIds.has(slot.id);

  return (
    <div
      className={`
        relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-300
        ${inCart
          ? 'bg-green-50/30 border-green-200'
          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
        }
      `}
    >
      <div className="space-y-0.5">
        <div className="font-bold text-slate-800 text-sm">{slot.label}</div>
        <div className="text-[9px] text-slate-600 flex items-center gap-2 font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 rounded-full ${
                slot.format === 'Online' ? 'bg-sky-400' : 'bg-amber-400'
              }`}
            />
            {slot.format}
          </span>
          <span>{slot.time}</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        <span className="font-black text-slate-900 text-base">
          ${slot.price}
        </span>
        {inCart ? (
          <Button
            variant="ghost"
            size="sm"
            aria-label={`${t('slots.remove')} ${slot.label}`}
            onClick={() => onRemove(slot.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold h-10 min-w-10 px-4 text-[10px] rounded-full transition-colors"
          >
            {t('slots.remove')}
          </Button>
        ) : (
          <Button
            size="sm"
            aria-label={`${t('slots.add')} ${slot.label}`}
            onClick={() => onAdd(level, slot)}
            className="bg-slate-900 text-white hover:bg-[#1F396D] h-10 min-w-10 px-4 text-[10px] font-bold rounded-full transition-colors"
          >
            {t('slots.add')}
          </Button>
        )}
      </div>
    </div>
  );
}

function toGlobalCartItem(program: Program, level: Level, slot: Slot) {
  return {
    id: slot.id,
    name: `${program.title} — ${level.name} — ${slot.label}`,
    price: slot.price,
    quantity: 1,
    image: program.image,
    category: program.category,
    type: 'summer-camp' as const,
    level: level.name,
  };
}

export function SlotsPanel({
  program,
  olympiadTierConfigs,
}: {
  program: Program;
  olympiadTierConfigs: OlympiadTierConfig[];
}) {
  const t = useTranslations('summerCamp');
  const { state: cartState, addItem, removeItem } = useCart();

  const [advMathMode, setAdvMathMode] = useState<LearningModeKey>('inPerson');
  const [advMathProgram, setAdvMathProgram] = useState<AdvMathProgramKey>('algebra');
  const [olympiadMode, setOlympiadMode] = useState<LearningModeKey>('inPerson');
  const [olympiadTier, setOlympiadTier] = useState<OlympiadTierId>('tier1');
  const [showInfo, setShowInfo] = useState(false);

  const summerCampItemIds = useMemo(
    () => new Set(cartState.items.filter((i) => i.type === 'summer-camp').map((i) => i.id)),
    [cartState.items]
  );

  // Resolved display labels — derived from i18n, stable per render via useMemo.
  const modeLabels = useMemo<Record<LearningModeKey, string>>(
    () => ({
      inPerson: t('mode.inPerson'),
      online: t('mode.online'),
    }),
    [t]
  );

  const programLabels = useMemo<Record<AdvMathProgramKey, string>>(
    () => ({
      algebra: t('advMathProgram.algebra'),
      precalculus: t('advMathProgram.precalculus'),
    }),
    [t]
  );

  const tierLabels = useMemo<Record<OlympiadTierId, { name: string; description: string }>>(
    () => ({
      tier1: { name: t('tier.tier1.name'), description: t('tier.tier1.description') },
      tier2: { name: t('tier.tier2.name'), description: t('tier.tier2.description') },
    }),
    [t]
  );

  const handleAdd = (level: Level, slot: Slot) => {
    if (summerCampItemIds.has(slot.id)) return;
    addItem(toGlobalCartItem(program, level, slot));
  };

  const handleRemove = (slotId: string) => {
    removeItem(slotId);
  };

  const isAdvMath = program.id === 'adv-math';
  const isMathOlympiad = program.id === 'math-olympiad';

  const advMathSlots: Slot[] = useMemo(() => {
    if (!isAdvMath || !program.levels[0]) return [];
    const level = program.levels[0];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format: Slot['format'] = formatMap[advMathMode] ?? 'In-Person';
    const priceByProgramAndFormat = level.priceByProgramAndFormat;
    const price =
      (priceByProgramAndFormat?.[advMathProgram]?.[format] ?? level.slots[0]?.price) ?? 0;
    return level.slots.map((s) => ({
      ...s,
      id: `${s.id}-${advMathMode}-${advMathProgram}`,
      label: `${s.label} — ${programLabels[advMathProgram]}, ${modeLabels[advMathMode]}`,
      format,
      time: timeMap[advMathMode] ?? '9:00 AM - 12:00 PM',
      price,
    }));
  }, [isAdvMath, program, advMathMode, advMathProgram, programLabels, modeLabels]);

  const olympiadTierConfig = useMemo(
    () => (olympiadTierConfigs ?? []).find((c) => c.id === olympiadTier),
    [olympiadTierConfigs, olympiadTier]
  );

  const olympiadSlots: Slot[] = useMemo(() => {
    if (!isMathOlympiad || !olympiadTierConfig) return [];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format = (formatMap[olympiadMode] ?? 'In-Person') as Slot['format'];
    const price = olympiadTierConfig.priceByFormat[format];
    return Array.from({ length: olympiadTierConfig.slotCount }).map((_, i) => {
      const baseLabel =
        olympiadTierConfig.weeksPerSlot === 1
          ? t('slotLabel.singleWeek', { week: i + 1 })
          : t('slotLabel.weekRange', {
              start: i * 2 + 1,
              end: i * 2 + 2,
            });
      return {
        id: `${olympiadTierConfig.slotId(i)}-${olympiadMode}`,
        label: `${baseLabel} — ${tierLabels[olympiadTierConfig.id].name}, ${modeLabels[olympiadMode]}`,
        time: timeMap[olympiadMode] ?? '9:00 AM - 12:00 PM',
        format,
        price,
      };
    });
  }, [isMathOlympiad, olympiadTierConfig, olympiadMode, t, tierLabels, modeLabels]);

  return (
    <div
      id="slots-panel"
      role="region"
      aria-label={program.title}
      className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden h-full flex flex-col"
    >
      {/* Info modal */}
      {showInfo && <InfoModal program={program} onClose={() => setShowInfo(false)} />}

      <div className="p-6 border-b border-slate-50 bg-slate-50/30">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-extrabold text-xl text-slate-900 leading-tight">
            {program.title}
          </h3>
          <button
            onClick={() => setShowInfo(true)}
            aria-label={`View details for ${program.title}`}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1F396D]/10 hover:bg-[#1F396D]/20 text-[#1F396D] flex items-center justify-center transition-colors mt-0.5 min-w-10 min-h-10"
          >
            <Info className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <p className="text-slate-600 mt-2 text-xs leading-relaxed">
          {program.description}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1F396D]/10 text-[#1F396D] text-[10px] font-bold uppercase tracking-widest">
          <Clock className="w-3 h-3" aria-hidden="true" /> {program.hoursPerWeek}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {isAdvMath && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adv-math-mode" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {t('slots.learningMode')}
                </Label>
                <Select
                  value={advMathMode}
                  onValueChange={(v) => setAdvMathMode(v as LearningModeKey)}
                >
                  <SelectTrigger id="adv-math-mode" className="rounded-lg text-sm">
                    <SelectValue placeholder={t('slots.selectMode')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(LEARNING_MODE_KEYS ?? []).map((key) => (
                      <SelectItem key={key} value={key}>
                        {modeLabels[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adv-math-program" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {t('slots.program')}
                </Label>
                <Select
                  value={advMathProgram}
                  onValueChange={(v) => setAdvMathProgram(v as AdvMathProgramKey)}
                >
                  <SelectTrigger id="adv-math-program" className="rounded-lg text-sm">
                    <SelectValue placeholder={t('slots.selectProgram')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(ADV_MATH_PROGRAM_KEYS ?? []).map((key) => (
                      <SelectItem key={key} value={key}>
                        {programLabels[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-0.5 border-l-2 border-[#1F396D] pl-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                  {programLabels[advMathProgram]} • {modeLabels[advMathMode]}
                </h4>
                <span className="text-[10px] text-slate-600">
                  {t('slots.weeklyIntensiveNote')}
                </span>
              </div>
              <div className="grid gap-2">
                {advMathSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={{
                      ...program.levels[0],
                      name: `${programLabels[advMathProgram]} • ${modeLabels[advMathMode]}`,
                    }}
                    program={program}
                    cartItemIds={summerCampItemIds}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {isMathOlympiad && olympiadTierConfig && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="olympiad-mode" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {t('slots.learningMode')}
                </Label>
                <Select
                  value={olympiadMode}
                  onValueChange={(v) => setOlympiadMode(v as LearningModeKey)}
                >
                  <SelectTrigger id="olympiad-mode" className="rounded-lg text-sm">
                    <SelectValue placeholder={t('slots.selectMode')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(LEARNING_MODE_KEYS ?? []).map((key) => (
                      <SelectItem key={key} value={key}>
                        {modeLabels[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="olympiad-tier" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {t('slots.tier')}
                </Label>
                <Select
                  value={olympiadTier}
                  onValueChange={(v) => setOlympiadTier(v as OlympiadTierId)}
                >
                  <SelectTrigger id="olympiad-tier" className="rounded-lg text-sm">
                    <SelectValue placeholder={t('slots.selectTier')} />
                  </SelectTrigger>
                  <SelectContent>
                    {(olympiadTierConfigs ?? []).map((cfg) => (
                      <SelectItem key={cfg.id} value={cfg.id}>
                        {tierLabels[cfg.id].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-0.5 border-l-2 border-[#1F396D] pl-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                  {tierLabels[olympiadTierConfig.id].name}
                </h4>
                <span className="text-[10px] text-slate-600">
                  {tierLabels[olympiadTierConfig.id].description}
                </span>
              </div>
              <div className="grid gap-2">
                {olympiadSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={{
                      id: olympiadTierConfig.id,
                      name: tierLabels[olympiadTierConfig.id].name,
                      description: tierLabels[olympiadTierConfig.id].description,
                      slots: [],
                    }}
                    program={program}
                    cartItemIds={summerCampItemIds}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {!isAdvMath && !isMathOlympiad &&
          program.levels.map((level) => (
            <div key={level.id} className="space-y-4">
              <div className="flex flex-col gap-0.5 border-l-2 border-[#1F396D] pl-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                  {level.name}
                </h4>
                <span className="text-[10px] text-slate-600">
                  {level.description}
                </span>
              </div>
              <div className="grid gap-2">
                {level.slots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={level}
                    program={program}
                    cartItemIds={summerCampItemIds}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

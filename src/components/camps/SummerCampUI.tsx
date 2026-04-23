'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
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
import { X, Clock, Info, CalendarDays, CheckCircle2, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { createLocaleUrl } from '@/components/layout/Header/utils';
import {
  getRoboticsFullDaySeoLink,
  getSummerCampProgramSeoLink,
  summerCampSeoMessagePath,
} from '@/lib/summer-camp-seo-links';
import { formatAdvMathWeekSlotHeading } from '@/lib/adv-math-week-sessions';
import {
  formatCampWeekSlotHeading,
  formatOlympiadTier2SlotHeading,
  SUMMER_CAMP_JULY4_NOTE,
  SUMMER_CAMP_SEASON_RANGE_TEXT,
} from '@/lib/summer-camp-week-calendar';

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
                  <p className="text-xs font-bold text-slate-900">
                    {details.schedule.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200" aria-hidden="true" />
              <div className="flex items-center gap-2 text-[#1F396D]">
                <Clock className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{details.hoursLabel ?? 'Daily hours'}</p>
                  <p className="text-xs font-bold text-slate-900">{details.dailyHours}</p>
                </div>
              </div>
            </div>

            {/* Camp season + format (shared calendar; delivery from program JSON) */}
            <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-white border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#1F396D]">
                <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{t('infoModal.campDatesLabel')}</p>
                  <p className="text-xs font-bold text-slate-900">{SUMMER_CAMP_SEASON_RANGE_TEXT}</p>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 max-[360px]:hidden" aria-hidden="true" />
              <div className="flex items-center gap-2 text-[#1F396D]">
                <CalendarDays className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{t('infoModal.seasonNoteLabel')}</p>
                  <p className="text-xs font-bold text-slate-900">{SUMMER_CAMP_JULY4_NOTE}</p>
                </div>
              </div>
              {details.deliverySummary ? (
                <>
                  <div className="w-px h-8 bg-slate-200 max-[360px]:hidden" aria-hidden="true" />
                  <div className="flex items-center gap-2 text-[#1F396D]">
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{t('infoModal.deliveryLabel')}</p>
                      <p className="text-xs font-bold text-slate-900">{details.deliverySummary}</p>
                    </div>
                  </div>
                </>
              ) : null}
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

        {/* Grade group footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Grade group: </span>
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
        <div className="font-bold text-slate-800 text-sm leading-snug">{slot.label}</div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-600">
          <span className="flex items-center gap-1">
            <span
              aria-hidden="true"
              className={`w-1.5 h-1.5 flex-shrink-0 rounded-full ${
                slot.format === 'Online' ? 'bg-sky-400' : 'bg-amber-400'
              }`}
            />
            {slot.format}
          </span>
          <span className="font-semibold normal-case tracking-normal text-slate-700">{slot.time}</span>
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
  const locale = useLocale();
  const { state: cartState, addItem, removeItem } = useCart();

  const [advMathMode, setAdvMathMode] = useState<LearningModeKey>('inPerson');
  const [advMathProgram, setAdvMathProgram] = useState<AdvMathProgramKey>('algebra');
  const [olympiadMode, setOlympiadMode] = useState<LearningModeKey>('inPerson');
  const [olympiadTier, setOlympiadTier] = useState<OlympiadTierId>('tier1');
  const [aiEntrepreneurMode, setAiEntrepreneurMode] = useState<LearningModeKey>('online');
  const [scratchMode, setScratchMode] = useState<LearningModeKey>('online');
  const [robloxMode, setRobloxMode] = useState<LearningModeKey>('inPerson');
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
    void import('@/lib/meta-pixel').then(({ trackEnrollClick }) =>
      trackEnrollClick(program.title, slot.price)
    );
    addItem(toGlobalCartItem(program, level, slot));
  };

  const handleRemove = (slotId: string) => {
    removeItem(slotId);
  };

  const isAdvMath = program.id === 'adv-math';
  const isMathOlympiad = program.id === 'math-olympiad';
  const isAiEntrepreneur = program.id === 'ai-entrepreneur';
  const isScratch = program.id === 'scratch-online' || program.id === 'scratch';
  const isRoblox = program.id === 'roblox-in-person';
  const isRoboticsCamp = program.id === 'robotics-camp';

  const programSeoLink = useMemo(
    () => getSummerCampProgramSeoLink(program.id),
    [program.id]
  );
  const roboticsFullDaySeo = useMemo(
    () => (isRoboticsCamp ? getRoboticsFullDaySeoLink() : null),
    [isRoboticsCamp]
  );

  const advMathSlots: Slot[] = useMemo(() => {
    if (!isAdvMath || !program.levels[0]) return [];
    const level = program.levels[0];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format: Slot['format'] = formatMap[advMathMode] ?? 'In-Person';
    const priceByProgramAndFormat = level.priceByProgramAndFormat;
    const price =
      (priceByProgramAndFormat?.[advMathProgram]?.[format] ?? level.slots[0]?.price) ?? 0;
    return level.slots.map((s, i) => ({
      ...s,
      id: `${s.id}-${advMathMode}-${advMathProgram}`,
      label: `${formatAdvMathWeekSlotHeading(advMathProgram, i)} — ${programLabels[advMathProgram]}`,
      format,
      time: timeMap[advMathMode] ?? '9:00 AM - 12:00 PM',
      price,
    }));
  }, [isAdvMath, program, advMathMode, advMathProgram, programLabels]);

  const aiEntrepreneurSlots: Slot[] = useMemo(() => {
    if (!isAiEntrepreneur || !program.levels[0]) return [];
    const level = program.levels[0];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format: Slot['format'] = formatMap[aiEntrepreneurMode] ?? 'Online';
    const priceByProgramAndFormat = level.priceByProgramAndFormat;
    const price =
      (priceByProgramAndFormat?.default?.[format] ?? level.slots[0]?.price) ?? 0;
    return level.slots.map((s) => ({
      ...s,
      id: `${s.id}-${aiEntrepreneurMode}`,
      label: s.label,
      format,
      time: timeMap[aiEntrepreneurMode] ?? '9:00 AM - 12:00 PM',
      price,
    }));
  }, [isAiEntrepreneur, program, aiEntrepreneurMode]);

  const scratchSlots: Slot[] = useMemo(() => {
    if (!isScratch || !program.levels[0]) return [];
    const level = program.levels[0];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format: Slot['format'] = formatMap[scratchMode] ?? 'Online';
    const priceByProgramAndFormat = level.priceByProgramAndFormat;
    const price =
      (priceByProgramAndFormat?.default?.[format] ?? level.slots[0]?.price) ?? 0;
    return level.slots.map((s) => ({
      ...s,
      id: `${s.id}-${scratchMode}`,
      label: s.label,
      format,
      time: timeMap[scratchMode] ?? '9:00 AM - 12:00 PM',
      price,
    }));
  }, [isScratch, program, scratchMode]);

  const robloxSlots: Slot[] = useMemo(() => {
    if (!isRoblox || !program.levels[0]) return [];
    const level = program.levels[0];
    const formatMap = LEARNING_MODE_FORMAT ?? {};
    const timeMap = LEARNING_MODE_TIME ?? {};
    const format: Slot['format'] = formatMap[robloxMode] ?? 'In-Person';
    const priceByProgramAndFormat = level.priceByProgramAndFormat;
    const price =
      (priceByProgramAndFormat?.default?.[format] ?? level.slots[0]?.price) ?? 0;
    return level.slots.map((s) => ({
      ...s,
      id: `${s.id}-${robloxMode}`,
      label: s.label,
      format,
      time: timeMap[robloxMode] ?? '9:00 AM - 12:00 PM',
      price,
    }));
  }, [isRoblox, program, robloxMode]);

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
      const weekHeading =
        olympiadTierConfig.weeksPerSlot === 1
          ? formatCampWeekSlotHeading(i)
          : formatOlympiadTier2SlotHeading(i);
      const tierName = tierLabels[olympiadTierConfig.id].name;
      return {
        id: `${olympiadTierConfig.slotId(i)}-${olympiadMode}`,
        label: `${weekHeading} — ${tierName}`,
        time: timeMap[olympiadMode] ?? '9:00 AM - 12:00 PM',
        format,
        price,
      };
    });
  }, [isMathOlympiad, olympiadTierConfig, olympiadMode, tierLabels]);

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
        <p className="text-base font-semibold text-gray-800 mt-2 leading-snug">
          {program.outcome}
        </p>
        <ul className="mt-2 space-y-1" aria-label={`${program.title} highlights`}>
          {program.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
              <span aria-hidden="true" className="mt-[3px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1F396D]" />
              {bullet}
            </li>
          ))}
        </ul>
        {(programSeoLink || roboticsFullDaySeo) && (
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {programSeoLink ? (
              <Link
                href={createLocaleUrl(`/camps/${programSeoLink.slug}`, locale)}
                className="text-[13px] font-semibold text-[#1F396D] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 rounded-sm"
              >
                {t(summerCampSeoMessagePath(programSeoLink.labelKey))}
              </Link>
            ) : null}
            {roboticsFullDaySeo ? (
              <Link
                href={createLocaleUrl(`/camps/${roboticsFullDaySeo.slug}`, locale)}
                className="text-[13px] font-semibold text-[#1F396D] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 rounded-sm"
              >
                {t(summerCampSeoMessagePath(roboticsFullDaySeo.labelKey))}
              </Link>
            ) : null}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Scratch: In-Person $349 / Online $329 — render first so it's always visible when Scratch selected */}
        {isScratch && program.levels[0] && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">
                Choose format
              </p>
              <select
                id="scratch-format"
                value={scratchMode}
                onChange={(e) => setScratchMode(e.target.value as LearningModeKey)}
                className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#1F396D] focus:outline-none focus:ring-2 focus:ring-[#1F396D]/20"
                aria-label="Scratch format: In-Person or Online"
              >
                <option value="inPerson">In-Person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight border-l-2 border-[#1F396D] pl-3">
                {program.levels[0].name} • {modeLabels[scratchMode]}
              </h4>
              <div className="grid gap-2">
                {scratchSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={{
                      ...program.levels[0],
                      name: `${program.levels[0].name} • ${modeLabels[scratchMode]}`,
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

        {/* Roblox: In-Person $349 (default) / Online $329 */}
        {isRoblox && program.levels[0] && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-700">
                Choose format
              </p>
              <select
                id="roblox-format"
                value={robloxMode}
                onChange={(e) => setRobloxMode(e.target.value as LearningModeKey)}
                className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-[#1F396D] focus:outline-none focus:ring-2 focus:ring-[#1F396D]/20"
                aria-label="Roblox format: In-Person or Online"
              >
                <option value="inPerson">In-Person</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight border-l-2 border-[#1F396D] pl-3">
                {program.levels[0].name} • {modeLabels[robloxMode]}
              </h4>
              <div className="grid gap-2">
                {robloxSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={{
                      ...program.levels[0],
                      name: `${program.levels[0].name} • ${modeLabels[robloxMode]}`,
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

        {isAiEntrepreneur && program.levels[0] && (
          <>
            <div className="space-y-2">
              <Label htmlFor="ai-entrepreneur-mode" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {t('slots.learningMode')}
              </Label>
              <Select
                value={aiEntrepreneurMode}
                onValueChange={(v) => setAiEntrepreneurMode(v as LearningModeKey)}
              >
                <SelectTrigger id="ai-entrepreneur-mode" className="rounded-lg text-sm">
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
            <div className="space-y-4">
              <div className="flex flex-col gap-0.5 border-l-2 border-[#1F396D] pl-3">
                <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                  {program.levels[0].name} • {modeLabels[aiEntrepreneurMode]}
                </h4>
              </div>
              <div className="grid gap-2">
                {aiEntrepreneurSlots.map((slot) => (
                  <SlotRow
                    key={slot.id}
                    slot={slot}
                    level={{
                      ...program.levels[0],
                      name: `${program.levels[0].name} • ${modeLabels[aiEntrepreneurMode]}`,
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

        {!isAdvMath && !isMathOlympiad && !isAiEntrepreneur && !isScratch && !isRoblox &&
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

'use client';

import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import type { Program } from '@/lib/summer-camp-data';
import { trackCampView } from '@/lib/meta-pixel';

const DESKTOP_CATEGORY_ORDER: Program['category'][] = ['Half-Day Camps', 'Full Day Camps'];

function orderProgramsForDesktopGrid(list: Program[]): Program[] {
  return DESKTOP_CATEGORY_ORDER.flatMap((cat) => list.filter((p) => p.category === cat));
}

const SummerCampProgramPickCard = memo(function SummerCampProgramPickCard({
  program,
  isSelected,
  onSelect,
  imageSizes,
  imageWrapperClassName,
  imagePriority,
}: {
  program: Program;
  isSelected: boolean;
  onSelect: (program: Program) => void;
  imageSizes: string;
  imageWrapperClassName: string;
  imagePriority: boolean;
}) {
  const t = useTranslations('summerCamp');
  const handleClick = useCallback(() => {
    trackCampView(program.title, program.category);
    onSelect(program);
  }, [onSelect, program]);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={program.title}
      onClick={handleClick}
      className={`text-left flex flex-col rounded-xl overflow-hidden border-2 transition-all duration-300 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 bg-white w-full
        ${isSelected
          ? 'border-[#1F396D] shadow-lg'
          : 'border-slate-200 active:border-slate-300 active:shadow-md min-[769px]:hover:border-slate-300 min-[769px]:hover:shadow-md'
        }
      `}
    >
      <div className={`relative w-full shrink-0 overflow-hidden bg-slate-200 ${imageWrapperClassName}`}>
        <Image
          src={program.image}
          alt={`${program.title}: ${program.description}`}
          fill
          sizes={imageSizes}
          quality={65}
          priority={imagePriority}
          className="object-cover transition-transform duration-500 min-[769px]:group-hover:scale-105"
          draggable={false}
          unoptimized={/^https?:\/\//i.test(program.image)}
        />
      </div>

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
  );
});

export const ProgramList = memo(function ProgramList({
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
  const ordered = useMemo(() => orderProgramsForDesktopGrid(list), [list]);

  return (
    <div className="space-y-8" role="group" aria-label={t('page.title')}>
      <div className="min-[769px]:hidden space-y-4">
        <ul className="grid grid-cols-1 gap-3 list-none p-0 m-0" aria-label={t('page.title')}>
          {ordered.map((program, idx) => {
            const isSelected = selectedProgramId === program.id;
            return (
              <li
                key={program.id}
                className="[content-visibility:auto] [contain-intrinsic-size:auto_300px]"
              >
                <SummerCampProgramPickCard
                  program={program}
                  isSelected={isSelected}
                  onSelect={onSelectProgram}
                  imageSizes="(max-width:768px) 96vw, 100vw"
                  imageWrapperClassName="aspect-[650/450]"
                  imagePriority={idx < 2}
                />
              </li>
            );
          })}
        </ul>
        <p className="text-center">
          <a
            href="#lottery"
            className="text-[13px] font-medium"
            style={{ color: '#0F6E56' }}
          >
            {t('mobile.lotteryLink')}
          </a>
        </p>
      </div>

      <ul
        className="hidden min-[769px]:grid grid-cols-2 gap-3 list-none p-0 m-0"
        aria-label={t('page.title')}
      >
        {ordered.map((program, idx) => {
          const isSelected = selectedProgramId === program.id;
          const hasOddCount = ordered.length % 2 !== 0;
          const isLastAndAlone = hasOddCount && idx === ordered.length - 1;
          return (
            <li
              key={program.id}
              className={`[content-visibility:auto] [contain-intrinsic-size:auto_300px] ${isLastAndAlone ? 'col-span-2' : ''}`}
            >
              <SummerCampProgramPickCard
                program={program}
                isSelected={isSelected}
                onSelect={onSelectProgram}
                imageSizes="(min-width: 1024px) 24vw, (min-width: 769px) 42vw, 100vw"
                imageWrapperClassName={isLastAndAlone ? 'h-[200px]' : 'aspect-[650/450]'}
                imagePriority={idx < 2}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
});

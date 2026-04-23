'use client';

import { memo, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import type { Program } from '@/lib/summer-camp-data';
import {
  getSummerCampProgramTrack,
  orderProgramsBySummerCampTrack,
  type SummerCampProgramTrack,
} from '@/lib/summer-camp-program-groups';
import { createLocaleUrl } from '@/components/layout/Header/utils';
import {
  getSummerCampProgramSeoLink,
  summerCampSeoMessagePath,
} from '@/lib/summer-camp-seo-links';

function groupProgramsByTrack(ordered: Program[]): Array<{
  track: SummerCampProgramTrack | 'unknown';
  programs: Program[];
}> {
  const groups: Array<{ track: SummerCampProgramTrack | 'unknown'; programs: Program[] }> = [];
  let current: (typeof groups)[number] | null = null;
  for (const p of ordered) {
    const tr = getSummerCampProgramTrack(p.id) ?? 'unknown';
    if (!current || current.track !== tr) {
      current = { track: tr, programs: [] };
      groups.push(current);
    }
    current.programs.push(p);
  }
  return groups;
}


const SummerCampProgramPickCard = memo(function SummerCampProgramPickCard({
  program,
  isSelected,
  onSelect,
  imageSizes,
  imageWrapperClassName,
}: {
  program: Program;
  isSelected: boolean;
  onSelect: (program: Program) => void;
  imageSizes: string;
  imageWrapperClassName: string;
}) {
  const t = useTranslations('summerCamp');
  const handleClick = useCallback(() => {
    void import('@/lib/meta-pixel').then(({ trackCampView }) =>
      trackCampView(program.title, program.category)
    );
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
          quality={70}
          decoding="async"
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
          {program.outcome}
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
  const locale = useLocale();
  const list = programs ?? [];
  const ordered = useMemo(() => orderProgramsBySummerCampTrack(list), [list]);
  const groups = useMemo(() => groupProgramsByTrack(ordered), [ordered]);

  const sectionHeading = (track: SummerCampProgramTrack | 'unknown') => {
    switch (track) {
      case 'academic':
        return t('filter.trackAcademic');
      case 'aiGameDev':
        return t('filter.trackAiGameDev');
      case 'creativeWriting':
        return t('filter.trackCreativeWriting');
      default:
        return t('filter.trackOther');
    }
  };

  return (
    <div className="space-y-8" role="group" aria-label={t('page.title')}>
      <div className="min-[769px]:hidden space-y-8">
        {groups.map((group) => (
          <section key={group.track} className="space-y-3">
            <h3 className="font-heading font-black text-base text-slate-800 uppercase tracking-tight">
              {sectionHeading(group.track)}
            </h3>
            <ul className="grid grid-cols-1 gap-3 list-none p-0 m-0" aria-label={sectionHeading(group.track)}>
              {group.programs.map((program) => {
                const isSelected = selectedProgramId === program.id;
                const seo = getSummerCampProgramSeoLink(program.id);
                return (
                  <li
                    key={program.id}
                    className="[content-visibility:auto] [contain-intrinsic-size:auto_300px] flex flex-col gap-2"
                  >
                    <SummerCampProgramPickCard
                      program={program}
                      isSelected={isSelected}
                      onSelect={onSelectProgram}
                      imageSizes="(max-width:768px) 96vw, 100vw"
                      imageWrapperClassName="aspect-[650/450]"
                    />
                    {seo ? (
                      <Link
                        href={createLocaleUrl(`/camps/${seo.slug}`, locale)}
                        className="text-[12px] font-semibold text-[#1F396D] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 rounded-sm px-0.5 -mt-0.5"
                      >
                        {t(summerCampSeoMessagePath(seo.labelKey))}
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <p className="text-center">
          <a
            href="#lead-capture"
            className="text-[13px] font-medium text-[#065f46]"
          >
            {t('mobile.lotteryLink')}
          </a>
        </p>
      </div>

      <div className="hidden min-[769px]:block space-y-8">
        {groups.map((group) => (
          <section key={`d-${group.track}`} className="space-y-3">
            <h3 className="font-heading font-black text-base text-slate-800 uppercase tracking-tight">
              {sectionHeading(group.track)}
            </h3>
            <ul
              className="grid grid-cols-2 gap-3 list-none p-0 m-0"
              aria-label={sectionHeading(group.track)}
            >
              {group.programs.map((program, idx) => {
                const isSelected = selectedProgramId === program.id;
                const hasOddCount = group.programs.length % 2 !== 0;
                const isLastAndAlone = hasOddCount && idx === group.programs.length - 1;
                const seo = getSummerCampProgramSeoLink(program.id);
                return (
                  <li
                    key={program.id}
                    className={`[content-visibility:auto] [contain-intrinsic-size:auto_300px] flex flex-col gap-2 ${isLastAndAlone ? 'col-span-2' : ''}`}
                  >
                    <SummerCampProgramPickCard
                      program={program}
                      isSelected={isSelected}
                      onSelect={onSelectProgram}
                      imageSizes="(min-width: 1024px) 24vw, (min-width: 769px) 42vw, 100vw"
                      imageWrapperClassName={isLastAndAlone ? 'h-[200px]' : 'aspect-[650/450]'}
                    />
                    {seo ? (
                      <Link
                        href={createLocaleUrl(`/camps/${seo.slug}`, locale)}
                        className="text-[12px] font-semibold text-[#1F396D] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 rounded-sm px-0.5 -mt-0.5"
                      >
                        {t(summerCampSeoMessagePath(seo.labelKey))}
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
});

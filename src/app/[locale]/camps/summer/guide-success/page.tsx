'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { createLocaleUrl } from '@/components/layout/Header/utils';

export default function SummerCampGuideSuccessPage() {
  const t = useTranslations('summerCamp.guideSuccess');
  const locale = useLocale();
  const summerBase = createLocaleUrl('/camps/summer', locale);
  const utm = 'utm_source=web&utm_medium=guide_success&utm_campaign=summer_camp';
  const reserveWithUtm = `${summerBase}?${utm}&utm_content=reserve_cta#slots-section`;
  const programsWithUtm = `${summerBase}?${utm}&utm_content=view_programs#program-groups`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
      <div className="container mx-auto max-w-xl px-4 py-14 md:px-6 md:py-20">
        <h1 className="font-heading text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {t('title')}
        </h1>
        <div className="mt-8 space-y-4 text-center text-slate-700">
          <p className="text-base leading-relaxed">{t('bodyEmail')}</p>
          <p className="text-sm font-medium text-slate-800 md:text-base">{t('bodyUrgency')}</p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:mx-auto sm:max-w-md">
          <Link
            href={reserveWithUtm}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#10b981] px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#059669] md:text-base"
          >
            {t('reserveCta')}
          </Link>
          <Link
            href={programsWithUtm}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-[#1F396D] bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#1F396D] transition-colors hover:bg-slate-50 md:text-base"
          >
            {t('viewOptionsCta')}
          </Link>
        </div>
        <p className="mt-10 text-center">
          <Link href={summerBase} className="text-sm font-semibold text-[#1F396D] hover:underline">
            {t('backLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}

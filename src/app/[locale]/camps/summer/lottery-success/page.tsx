'use client';

import { Suspense, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { createLocaleUrl } from '@/components/layout/Header/utils';
import {
  isLotteryGrade,
  isLotteryInterest,
} from '@/lib/summer-lottery-keys';

function LotterySuccessContent() {
  const t = useTranslations('summerCamp');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const interestRaw = searchParams.get('interest') ?? '';
  const gradeRaw = searchParams.get('grade') ?? '';

  const valid = useMemo(
    () => isLotteryInterest(interestRaw) && isLotteryGrade(gradeRaw),
    [interestRaw, gradeRaw]
  );

  useEffect(() => {
    if (!valid) {
      router.replace(`${createLocaleUrl('/camps/summer', locale)}#lottery`);
    }
  }, [valid, router, locale]);

  if (!valid) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-500 text-sm" aria-live="polite">
        {t('lottery.successRedirecting')}
      </div>
    );
  }

  const interestLabel = t(`lottery.interests.${interestRaw}`);
  const gradeLabel = t(`lottery.grades.${gradeRaw}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans">
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-20 max-w-xl">
        <h1 className="font-heading font-black text-2xl md:text-3xl text-slate-900 uppercase tracking-tight text-center mb-2">
          {t('lottery.title')}
        </h1>
        <p className="text-slate-600 text-sm md:text-base text-center mb-8 leading-relaxed">
          {t('lottery.subtitle')}
        </p>
        <div
          className="rounded-xl border border-[#1D9E75]/40 bg-emerald-50/80 text-[#085041] text-center py-5 px-4 space-y-2"
          role="status"
        >
          <p className="text-base font-bold">{t('lottery.successTitle')}</p>
          <p className="text-sm font-medium leading-relaxed">{t('lottery.successBody')}</p>
          <p className="text-xs sm:text-sm text-[#085041]/90 border-t border-[#1D9E75]/25 mt-3 pt-3">
            {t('lottery.successRecorded', {
              interest: interestLabel,
              grade: gradeLabel,
            })}
          </p>
          <p className="text-xs text-[#085041]/80">{t('lottery.successEmailNote')}</p>
        </div>
        <p className="text-center mt-8">
          <Link
            href={createLocaleUrl('/camps/summer', locale)}
            className="text-sm font-semibold text-[#1F396D] hover:underline"
          >
            {t('lottery.successBackToSummer')}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LotterySuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-[40vh] flex items-center justify-center"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-[#1F396D] animate-spin" />
        </div>
      }
    >
      <LotterySuccessContent />
    </Suspense>
  );
}

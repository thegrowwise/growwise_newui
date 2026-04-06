'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { publicPath } from '@/lib/publicPath';

export function RequestCallbackLink() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="mt-6 flex justify-center">
      <Link
        href={publicPath('/contact', locale)}
        className="text-base font-medium text-[#1F396D] underline underline-offset-4 decoration-[#1F396D]/40 hover:decoration-[#1F396D] hover:text-[#152a52] transition-colors"
      >
        {t('pricingUi.requestCallback')}
      </Link>
    </div>
  );
}

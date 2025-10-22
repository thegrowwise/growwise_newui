"use client";

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function ProgramsPage() {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const createLocaleUrl = (path: string) => `/${locale}${path}`;
  return (
    <main className="section-base section-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="title-section mb-6">{t('programs')}</h1>
        <p className="subtitle-sm mb-8">Explore our academic and STEAM offerings.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href={createLocaleUrl('/academic')} className="card-base card-padding hover:shadow-xl rounded-xl border border-gray-100">
            <div className="text-strong text-lg mb-2">Academic</div>
            <div className="text-muted">K-12 Math and English programs</div>
          </Link>
          <Link href={createLocaleUrl('/steam')} className="card-base card-padding hover:shadow-xl rounded-xl border border-gray-100">
            <div className="text-strong text-lg mb-2">STEAM</div>
            <div className="text-muted">ML/AI, Game Development and more</div>
          </Link>
        </div>
      </div>
    </main>
  );
}




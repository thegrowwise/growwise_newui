'use client';

import { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFooterRequested } from '@/store/slices/footerSlice';
import { getFooterFallback } from '@/data/footerFallback';
import { FooterData } from './types';
import { createLocaleUrl } from './utils';
import FooterLogo from './FooterLogo';
import FooterSection from './FooterSection';
import FooterCopyright from './FooterCopyright';

export default function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const footer = useAppSelector((s) => s.footer.data);

  const fallback = useMemo(() => getFooterFallback(locale), [locale]);

  useEffect(() => {
    if (!footer) dispatch(fetchFooterRequested(locale));
  }, [dispatch, footer, locale]);

  const createLocaleUrlHelper = (path: string) => createLocaleUrl(path, locale);
  const isCampsRoute = pathname === '/camps' || pathname.startsWith('/camps/');

  const display: FooterData = footer ?? fallback;

  return (
    <footer
      className={[
        'bg-gradient-to-br from-[#1F396D]/20 via-[#29335C]/15 to-[#1F396D]/20',
        'pt-16 px-4 lg:px-8 relative overflow-hidden text-gray-800',
        isCampsRoute ? 'pb-44 sm:pb-52' : 'pb-16',
      ].join(' ')}
    >
      <div className="absolute top-10 right-20 w-32 h-32 bg-[#F16112]/10 rounded-full blur-3xl" aria-hidden />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl" aria-hidden />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <FooterLogo
              logo={display.logo}
              description={display.description}
              contact={display.contact}
            />
          </div>

          {display.sections.map((section, index) => (
            <div key={index} className="flex-1">
              <FooterSection section={section} createLocaleUrl={createLocaleUrlHelper} />
            </div>
          ))}
        </div>

        <FooterCopyright copyright={display.copyright} />
      </div>
    </footer>
  );
}

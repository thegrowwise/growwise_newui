'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFooterRequested } from '@/store/slices/footerSlice';
import { FooterData } from './types';
import { createLocaleUrl } from './utils';
import FooterLogo from './FooterLogo';
import FooterSection from './FooterSection';
import FooterCopyright from './FooterCopyright';

interface FooterProps {
  data?: Partial<FooterData>;
}

export default function Footer({ data }: FooterProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const footer = useAppSelector((s) => s.footer.data);
  
  // Fetch footer data if not available
  useEffect(() => {
    if (!footer) dispatch(fetchFooterRequested());
  }, [dispatch, footer]);
  
  const createLocaleUrlHelper = (path: string) => createLocaleUrl(path, locale);
  const isCampsRoute = pathname === '/camps' || pathname.startsWith('/camps/');

  // Reserve the same layout shell while Redux/API loads — height + padding must match the
  // loaded footer or Lighthouse reports CLS when content swaps (especially on mobile stacks).
  if (!footer) {
    return (
      <footer
        className={[
          'bg-gradient-to-br from-[#1F396D]/20 via-[#29335C]/15 to-[#1F396D]/20',
          'pt-16 px-4 lg:px-8 relative overflow-hidden text-gray-800',
          isCampsRoute ? 'pb-44 sm:pb-52' : 'pb-16',
        ].join(' ')}
        aria-busy="true"
        aria-label="Site footer loading"
      >
        <div className="absolute top-10 right-20 w-32 h-32 bg-[#F16112]/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl" aria-hidden />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1 w-full space-y-4">
              <div className="h-24 w-56 max-w-full rounded-lg bg-white/25 animate-pulse" />
              <div className="h-16 rounded-lg bg-white/20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-48 max-w-full bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-52 max-w-full bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-64 max-w-full bg-white/20 rounded animate-pulse" />
              </div>
            </div>
            {[0, 1, 2].map((k) => (
              <div key={k} className="flex-1 w-full space-y-4">
                <div className="h-7 w-40 bg-white/25 rounded animate-pulse" />
                <div className="space-y-2.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-full max-w-[220px] bg-white/20 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 h-5 w-72 max-w-full mx-auto bg-white/20 rounded animate-pulse" />
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={[
        'bg-gradient-to-br from-[#1F396D]/20 via-[#29335C]/15 to-[#1F396D]/20',
        'pt-16 pb-16 px-4 lg:px-8 relative overflow-hidden text-gray-800',
        // Camp landings use a fixed bottom CTA; reserve space so the footer can scroll above it.
        isCampsRoute ? 'pb-44 sm:pb-52' : '',
      ].join(' ')}
    >
      {/* Background decorative elements */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-[#F16112]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Logo and Contact Section */}
          <div className="flex-1">
            <FooterLogo 
              logo={footer.logo}
              description={footer.description}
              contact={footer.contact}
            />
          </div>

          {/* Footer Sections */}
          {footer.sections.map((section, index) => (
            <div key={index} className="flex-1">
              <FooterSection
                section={section}
                createLocaleUrl={createLocaleUrlHelper}
              />
            </div>
          ))}
        </div>

        {/* Copyright */}
        <FooterCopyright copyright={footer.copyright} />
      </div>
    </footer>
  );
}

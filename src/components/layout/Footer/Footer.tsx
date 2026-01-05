'use client';

import { useEffect } from 'react';
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
  const dispatch = useAppDispatch();
  const footer = useAppSelector((s) => s.footer.data);
  
  // Fetch footer data if not available
  useEffect(() => {
    if (!footer) dispatch(fetchFooterRequested());
  }, [dispatch, footer]);
  
  const createLocaleUrlHelper = (path: string) => createLocaleUrl(path, locale);

  // Don't render if no data is available yet
  if (!footer) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-[#1F396D]/20 via-[#29335C]/15 to-[#1F396D]/20 py-16 px-4 lg:px-8 relative overflow-hidden text-gray-800">
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

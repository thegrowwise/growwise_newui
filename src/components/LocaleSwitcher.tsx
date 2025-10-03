"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '../i18n/config';
import { useEffect, useState } from 'react';

const localeNames = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  hi: 'हिन्दी'
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Extract locale from pathname as fallback
  const getLocaleFromPath = () => {
    if (!pathname) return 'en';
    const segments = pathname.split('/');
    const pathLocale = segments[1];
    return locales.includes(pathLocale as any) ? pathLocale : 'en';
  };
  
  const [currentLocale, setCurrentLocale] = useState('en'); // Start with default

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
    // Prioritize pathname detection over useLocale hook
    const pathLocale = getLocaleFromPath();
    const newLocale = pathLocale || locale || 'en';
    setCurrentLocale(newLocale);
  }, [locale, pathname]);

  const handleLocaleChange = (newLocale: string) => {
    // Get the path without the current locale prefix
    let pathWithoutLocale = pathname || '/';
    
    // Remove the current locale from the beginning of the path
    if (pathname && pathname.startsWith(`/${currentLocale}`)) {
      pathWithoutLocale = pathname.substring(`/${currentLocale}`.length);
    }
    
    // Ensure we have a valid path
    if (!pathWithoutLocale || pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    
    // Ensure the path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = `/${pathWithoutLocale}`;
    }
    
    // If the path is just '/', don't add it to avoid double slashes
    const finalPath = pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`;
    
    // Navigate to the new locale
    router.push(finalPath);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    // Show the correct locale even during pre-hydration
    const preHydrationLocale = getLocaleFromPath();
    return (
      <div className="relative">
        <select
          defaultValue={preHydrationLocale}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled
        >
          {locales.map((loc) => (
            <option key={loc} value={loc}>
              {localeNames[loc as keyof typeof localeNames]}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as keyof typeof localeNames]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}


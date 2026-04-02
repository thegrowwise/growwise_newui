import { DEFAULT_LOCALE, isLocaleEnabled } from '@/i18n/localeConfig';

/**
 * Locale for mock JSON paths: first path segment is a locale only if it matches
 * an enabled locale code. Routes like `/coding` are not treated as locales.
 */
export function getCurrentLocale(defaultLocale: string = DEFAULT_LOCALE): string {
  if (typeof window === 'undefined') return defaultLocale;
  try {
    const path = window.location.pathname || '';
    const seg = path.split('/').filter(Boolean)[0];
    if (!seg) return defaultLocale;
    if (isLocaleEnabled(seg)) return seg;
    return defaultLocale;
  } catch {
    return defaultLocale;
  }
}

export function buildLocalizedMockPaths(locale: string, file: string): string[] {
  return [
    `/api/mock/${locale}/${file}`,
    `/api/mock/${file}`,
  ];
}

export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE || '';
  return base.replace(/\/$/, '');
}

export function useMock(): boolean {
  return (process.env.NEXT_PUBLIC_USE_MOCK || 'true') === 'true';
}



/** Paths for E2E: default locale (en) has no /en prefix; other locales use /{locale}/... */
export const E2E_LOCALE = process.env.E2E_LOCALE || 'en';

export function localePath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return E2E_LOCALE === 'en' ? p : `/${E2E_LOCALE}${p}`;
}

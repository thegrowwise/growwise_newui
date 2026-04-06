import { DEFAULT_LOCALE, isLocaleEnabled } from '@/i18n/localeConfig';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';

/**
 * Strips a leading locale segment from a pathname when present.
 * Default-locale URLs have no prefix (`localePrefix: 'never'`).
 */
export function pathWithoutLocalePrefix(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  const first = segments[0];
  if (isLocaleEnabled(first)) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

/** User-facing pathname (no `/en` prefix for the default locale). */
export function publicPath(path: string, locale: string): string {
  const trimmed = path.trim();
  if (!trimmed) return '/';

  let normalized = trimmed;
  if (normalized.startsWith('#') || normalized.startsWith('?')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  if (normalized === '') normalized = '/';

  if (locale === DEFAULT_LOCALE) {
    return normalized === '' ? '/' : normalized;
  }
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
}

/**
 * Absolute URL on the public site (canonical, OG, breadcrumbs).
 */
export function absoluteSiteUrl(
  path: string,
  locale: string,
  baseUrl: string = getCanonicalSiteUrl(),
): string {
  const p = publicPath(path, locale);
  if (p === '/') return baseUrl;
  return `${baseUrl}${p}`;
}

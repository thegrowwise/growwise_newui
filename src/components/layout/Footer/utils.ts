import { ENABLED_LOCALES } from '@/i18n/localeConfig';

export function createLocaleUrl(path: string, locale: string): string {
  // Keep external/absolute URLs intact (including protocol-relative URLs).
  if (!path) return `/${locale}`;
  const trimmed = path.trim();
  if (
    /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) || // http(s)://, etc.
    trimmed.startsWith('//') || // protocol-relative
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Normalize to a pathname-like string we can safely prefix.
  let normalized = trimmed;
  if (normalized.startsWith('#') || normalized.startsWith('?')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;

  // Prevent double-locale URLs like `/en/es/contact` when CMS already returns localized paths.
  const localePattern =
    ENABLED_LOCALES.length > 0 ? ENABLED_LOCALES.join('|') : 'en';
  normalized = normalized.replace(new RegExp(`^/(?:${localePattern})(?=/|$)`), '');
  if (normalized === '') normalized = '/';

  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

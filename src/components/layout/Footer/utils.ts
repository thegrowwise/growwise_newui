import { ENABLED_LOCALES } from '@/i18n/localeConfig';
import { publicPath } from '@/lib/publicPath';

export function createLocaleUrl(path: string, locale: string): string {
  if (!path) return publicPath('/', locale);
  const trimmed = path.trim();
  if (
    /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  let normalized = trimmed;
  if (normalized.startsWith('#') || normalized.startsWith('?')) {
    normalized = `/${normalized}`;
  }
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;

  const localePattern =
    ENABLED_LOCALES.length > 0 ? ENABLED_LOCALES.join('|') : 'en';
  normalized = normalized.replace(new RegExp(`^/(?:${localePattern})(?=/|$)`), '');
  if (normalized === '') normalized = '/';

  return publicPath(normalized === '/' ? '/' : normalized, locale);
}

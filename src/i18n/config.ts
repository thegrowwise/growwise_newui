import { getRequestConfig } from 'next-intl/server';
import { ENABLED_LOCALES, DEFAULT_LOCALE, getValidLocale, type Locale } from './localeConfig';

// Export locales for backward compatibility
export const locales = ENABLED_LOCALES;
export type { Locale };

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is valid, fallback to default if not enabled
  const validLocale = getValidLocale(locale);
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});

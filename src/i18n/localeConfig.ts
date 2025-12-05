/**
 * Centralized locale configuration
 * 
 * To enable/disable locales, set the NEXT_PUBLIC_ENABLED_LOCALES environment variable.
 * Format: comma-separated list (e.g., "en,es,zh" or "en")
 * 
 * If not set, defaults to English only.
 * 
 * Example in .env.local:
 * NEXT_PUBLIC_ENABLED_LOCALES=en,es,zh
 * NEXT_PUBLIC_DEFAULT_LOCALE=en
 */

// All available locales in the system
export const AVAILABLE_LOCALES = ['en', 'es', 'zh', 'hi'] as const;

// Type definitions
export type AvailableLocale = (typeof AVAILABLE_LOCALES)[number];

// Parse enabled locales from environment variable
// Format: "en,es,zh" or "en"
function parseEnabledLocales(): readonly string[] {
  const envLocales = process.env.NEXT_PUBLIC_ENABLED_LOCALES;
  
  if (!envLocales) {
    // Default to English if not set
    return ['en'] as const;
  }
  
  // Split by comma and trim whitespace
  const locales = envLocales
    .split(',')
    .map(locale => locale.trim())
    .filter(locale => locale.length > 0);
  
  // Validate that all locales are available
  const validLocales = locales.filter(locale => 
    AVAILABLE_LOCALES.includes(locale as AvailableLocale)
  );
  
  // If no valid locales, fallback to English
  if (validLocales.length === 0) {
    if (typeof window === 'undefined') {
      // Only log warnings on server-side
      console.warn(
        `[localeConfig] Invalid locales in NEXT_PUBLIC_ENABLED_LOCALES: "${envLocales}". ` +
        `Falling back to 'en'. Available locales: ${AVAILABLE_LOCALES.join(', ')}`
      );
    }
    return ['en'] as const;
  }
  
  return validLocales as readonly string[];
}

// Parse default locale from environment variable
function parseDefaultLocale(enabledLocales: readonly string[]): string {
  const envDefault = process.env.NEXT_PUBLIC_DEFAULT_LOCALE?.trim();
  
  if (!envDefault) {
    // Default to first enabled locale
    return enabledLocales[0];
  }
  
  // Check if the default locale is enabled
  if (enabledLocales.includes(envDefault)) {
    return envDefault;
  }
  
  // If default locale is not enabled, use first enabled locale
  if (typeof window === 'undefined') {
    // Only log warnings on server-side
    console.warn(
      `[localeConfig] NEXT_PUBLIC_DEFAULT_LOCALE "${envDefault}" is not in enabled locales. ` +
      `Using "${enabledLocales[0]}" as default.`
    );
  }
  return enabledLocales[0];
}

// Currently enabled locales (from environment variable or default)
const parsedEnabledLocales = parseEnabledLocales();
export const ENABLED_LOCALES: readonly string[] = parsedEnabledLocales;

// Default locale (from environment variable or first enabled locale)
export const DEFAULT_LOCALE: string = parseDefaultLocale(parsedEnabledLocales);

// Type definitions for enabled locales
export type EnabledLocale = string;
export type Locale = EnabledLocale;

// Locale display names
export const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  hi: 'हिन्दी'
} as const;


/**
 * Check if a locale is enabled
 */
export function isLocaleEnabled(locale: string): locale is EnabledLocale {
  return ENABLED_LOCALES.includes(locale as EnabledLocale);
}

/**
 * Get the default locale if the provided locale is not enabled
 */
export function getValidLocale(locale: string | undefined | null): EnabledLocale {
  if (locale && isLocaleEnabled(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}


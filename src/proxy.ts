import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from './i18n/localeConfig';

const intlMiddleware = createMiddleware({
  // Use centralized locale configuration
  locales: ENABLED_LOCALES,
  
  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  
  // Always show the locale in the URL
  localePrefix: 'always'
});

// Export as named proxy function for Next.js 16
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

// Generate matcher pattern dynamically based on enabled locales
const localeMatcher = ENABLED_LOCALES.length === 1 
  ? ['/', `/${ENABLED_LOCALES[0]}/:path*`, '/((?!api|_next|_vercel|.*\\..*).*)']
  : ['/', ...ENABLED_LOCALES.map(locale => `/${locale}/:path*`), '/((?!api|_next|_vercel|.*\\..*).*)'];

export const config = {
  // Match pathnames for enabled locales
  matcher: localeMatcher
};


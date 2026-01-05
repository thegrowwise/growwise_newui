import createMiddleware from 'next-intl/middleware';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from './i18n/localeConfig';

const intlMiddleware = createMiddleware({
  // Use centralized locale configuration
  locales: ENABLED_LOCALES,
  
  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  
  // Always show the locale in the URL
  localePrefix: 'always'
});

export default intlMiddleware;

// Static matcher pattern that works for all locales
// Next.js requires this to be statically analyzable at build time
// The middleware will handle filtering based on ENABLED_LOCALES at runtime
export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  // The middleware will validate locales against ENABLED_LOCALES at runtime
  matcher: [
    // Match root path
    '/',
    // Match any locale path (en, es, zh, hi, etc.)
    '/(en|es|zh|hi)/:path*',
    // Match any other path (excluding API, Next.js internals, and static files)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};


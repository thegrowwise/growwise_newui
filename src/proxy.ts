import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from './i18n/localeConfig';

const intlMiddleware = createMiddleware({
  locales: [...ENABLED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

/** Next.js 16+ convention: `proxy.ts` runs before routes (replaces `middleware.ts`). */
export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(en|es|zh|hi)/:path*',
    // Locale-less paths → redirect to /{locale}/… (skip API, Next internals, static files)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

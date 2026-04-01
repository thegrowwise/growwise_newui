import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from '@/i18n/localeConfig';

const intlMiddleware = createMiddleware({
  locales: [...ENABLED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
});

/** Must match every segment in `ENABLED_LOCALES` (kept in sync with next-intl `locales` above). */
const localePattern =
  ENABLED_LOCALES.length > 0 ? ENABLED_LOCALES.join('|') : 'en';

/**
 * When the matcher `/(locale)/:path*` runs, `/en/_next/static/...` is treated as a localized route.
 * The browser then loads chunks from `/en/_next/...` and Next returns 500. Rewrite to real `/_next/...`.
 */
function rewriteLocalePrefixedNextAssets(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  const m = pathname.match(
    new RegExp(`^/(?:${localePattern})/(_next(?:/.*)?)$`),
  );
  if (!m) return null;
  const url = request.nextUrl.clone();
  url.pathname = `/${m[1]}`;
  return NextResponse.rewrite(url);
}

/**
 * Edge middleware (single root file) — avoids importing `./src/proxy`, which can break
 * Vercel/Next output file tracing (`middleware.js.nft.json` ENOENT on Next 16.2).
 */
export default function middleware(request: NextRequest) {
  const rewritten = rewriteLocalePrefixedNextAssets(request);
  if (rewritten) return rewritten;
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    // Do not use `/(locale)/:path*` — it matches `/en/_next/...` and breaks chunk URLs.
    // next-intl: match everything except api, Next internals, and static files with extensions.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

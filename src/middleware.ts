import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { ENABLED_LOCALES, DEFAULT_LOCALE } from '@/i18n/localeConfig';

/**
 * With `localePrefix: 'never'`, public URLs must not use `/en/`. Legacy `/en/*` HTML routes
 * (old Stripe success_url values, bookmarks, inbound links) are 301-redirected to the canonical
 * URL so link equity consolidates on the prefix-free path. `/_next/*` static assets nested under
 * `/en/` are handled separately by `rewriteLocalePrefixedNextAssets` (rewrite, not redirect).
 */
function redirectLegacyDefaultLocalePrefix(request: NextRequest): NextResponse | null {
  if (DEFAULT_LOCALE !== 'en') return null;
  const pathname = request.nextUrl.pathname;
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const rest = pathname === '/en' ? '/' : pathname.slice('/en'.length) || '/';
    const url = request.nextUrl.clone();
    url.pathname = rest === '' ? '/' : rest;
    return NextResponse.redirect(url, 301);
  }
  return null;
}

const intlMiddleware = createMiddleware({
  locales: [...ENABLED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // Default locale (English) uses clean URLs with no /en prefix.
  localePrefix: 'never',
});

/** Must match every segment in `ENABLED_LOCALES` (kept in sync with next-intl `locales` above). */
const localePattern =
  ENABLED_LOCALES.length > 0 ? ENABLED_LOCALES.join('|') : 'en';

/**
 * When the matcher runs, `/en/_next/static/...` is treated as a localized route.
 * Rewrite to real `/_next/...` so chunks load.
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
 * Paths that live only under `app/[locale]/...` but have no `app/<segment>` shim (unlike
 * `/coding` and `/game-dev`). Without a leading locale segment, Next would match
 * `app/[...catchAll]` and redirect in a loop. Prefix the default locale for intl + routing.
 */
const PATHS_NEEDING_IMPLICIT_LOCALE_PREFIX = new Set(['free-resources']);

/** Header next-intl uses to resolve locale on the server (see next-intl middleware). */
const NEXT_INTL_LOCALE_HEADER = 'X-NEXT-INTL-LOCALE';

/**
 * Rewrite clean URLs → `/{defaultLocale}/...` so `app/[locale]/...` matches, without changing
 * the browser address bar. Avoids `new NextRequest(...)`, which can misbehave in Edge middleware.
 */
function tryImplicitLocaleRewrite(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;
  if (
    pathname === '/' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel')
  ) {
    return null;
  }
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (!first || ENABLED_LOCALES.includes(first)) {
    return null;
  }
  if (!PATHS_NEEDING_IMPLICIT_LOCALE_PREFIX.has(first)) {
    return null;
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}/${segments.join('/')}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NEXT_INTL_LOCALE_HEADER, DEFAULT_LOCALE);

  const response = NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
  response.cookies.set('NEXT_LOCALE', DEFAULT_LOCALE, {
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

/**
 * With `src/app`, Next.js expects middleware beside `src/app` (`src/middleware.ts`).
 * A root-level `middleware.ts` can be ignored in some setups, which makes `/` 404
 * because there is no root `app/page.tsx` (only `app/[locale]/...`).
 */
export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Non-localized App Router segments (`app/camp/...` at repo root). Running next-intl on these
  // can fight with `[locale]/camp/[slug]` and caused redirect loops to the same URL.
  if (pathname === '/camp' || pathname.startsWith('/camp/')) {
    return NextResponse.next();
  }

  const rewritten = rewriteLocalePrefixedNextAssets(request);
  if (rewritten) return rewritten;
  const legacyEn = redirectLegacyDefaultLocalePrefix(request);
  if (legacyEn) return legacyEn;
  const implicit = tryImplicitLocaleRewrite(request);
  if (implicit) return implicit;
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

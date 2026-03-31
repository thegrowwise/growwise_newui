import type { NextRequest } from 'next/server';
import { proxy } from './src/proxy';

export default function middleware(request: NextRequest) {
  return proxy(request);
}

export const config = {
  matcher: [
    '/',
    // Do not use `/(locale)/:path*` — it matches `/en/_next/...` and breaks chunk URLs.
    // next-intl: match everything except api, Next internals, and static files with extensions.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};


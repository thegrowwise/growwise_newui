# S0 BASELINE – Lighthouse perf (before fixes)

## Framework & build

- **Framework:** Next.js 16 (Turbopack), React 18.3
- **Build:** `next build` (SWC minification in prod)
- **Config:** `next.config.ts` (next-intl, compress: true, images, optimizePackageImports for lucide + 4 Radix packages)

## Top assets (inferred – by load reason)

| Asset type              | Load reason        | Notes                                                |
|-------------------------|--------------------|------------------------------------------------------|
| Main/route JS chunks    | Parser / Preload   | React, Next, Redux, all sagas/slices, layout, page   |
| GTM script              | afterInteractive   | googletagmanager.com/gtm.js                          |
| GoogleAnalytics (fallback) | afterInteractive | gtag/js (no strategy prop in @next/third-parties)    |
| Extension-removal script| afterInteractive   | Inline; MutationObserver + DOM work                |
| Firebase                | Dynamic (init)     | `lib/analytics/firebase.ts` dynamic import           |
| Stripe                  | Route (checkout)   | Likely code-split by route                          |
| Embla-carousel          | Component          | `components/ui/carousel.tsx`                         |
| Radix (many)            | Tree-shaken        | optimizePackageImports: accordion, dialog, dropdown, select |

## Long tasks (>50ms) – likely sources

1. **Redux store + saga init** – `store/index.ts`: `sagaMiddleware.run(rootSaga)` on first load (sync when module runs).
2. **GTM/GA** – afterInteractive scripts load and run after hydration.
3. **Extension-removal script** – afterInteractive; then sync DOM query + MutationObserver for 10s.
4. **Hydration** – React tree + layout + ContentProvider + HomeClient.

## Minify

- **Prod minify:** Yes (Next.js uses SWC for JS in production).
- **Source maps:** `productionBrowserSourceMaps` not set → default `false` (no prod source maps).

## CSS

- **Tailwind content:** `./src/components/**/*.{js,ts,jsx,tsx,mdx}`, `./src/app/**/*.{js,ts,jsx,tsx,mdx}`.
- **Unused CSS (16KB):** Likely from Radix/base styles and unused utilities; Tailwind purge is on.

## bfcache (5 reasons)

- **unload / beforeunload:** None in app code (analytics uses `pagehide` in `lib/analytics/hooks.ts`).
- **Likely NotRestoredReasons:** Third-party scripts (GTM, GA), Cache-Control (if set on doc by server/CDN), or browser/extension behavior.
- **cache: 'no-store':** Used only in `lib/api.ts` for `fetch()` of API/mock JSON, not the main document response.

## Barrel files (tree-shaking)

- `store/index.ts`, `store/sagas/index.ts`, `lib/analytics/index.ts`, `Header/index.ts`, `Footer/index.ts`, `chatbot/index.ts` – can pull in more than a single import needs; no change in this pass to avoid regressions.

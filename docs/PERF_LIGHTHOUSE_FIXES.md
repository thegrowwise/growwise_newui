# Lighthouse fixes – exact diffs (mobile, Slow 4G, Moto G Power)

**Stack:** Next.js 16 (from `next.config.ts` + `package.json`), Turbopack build.  
**Baseline:** FCP 0.9s | LCP 7.4s | TBT 490ms | CLS 0 | SI 3.7s | Perf 62

**Regression fix (Perf dropped to 46):** A previous change added `<link rel="preload" as="image">` for the hero image in the **root** layout, so the ~210 KiB hero image was requested on **every** page (e.g. /en/camps/summer). That wasted bandwidth and main thread on non-home pages and tanked scores. Fix: **removed the global preload** and **removed the extension-removal script** (and kept GTM lazyOnload) so only home uses the hero and main-thread work is reduced.

---

## P0 — LCP 7.4s (CRITICAL)

### Fix: Preload hero image in `<head>`, ensure not lazy + fetchpriority

**Metric improved:** LCP (target &lt; 2.5s).  
**Risk:** L.  
**Validation:** `curl -sI "http://localhost:3000/en" | grep -i preload` then run Lighthouse; LCP element should be the hero image, LCP time should drop.

**1. `src/app/layout.tsx`**

**Before:** No preload for hero image. Head had only favicon and dns-prefetch.

**After:** Added constant for LCP hero URL and a `<link rel="preload">` with `fetchPriority="high"` so the browser starts the image request before parsing the hero.

- Hero image: "Master the Core" banner → `https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop` (from `public/api/mock/en/home.json`).
- Preload `href` uses Next.js image route so it matches the actual `<img>` request: `/_next/image?url=<encoded>&w=1200&q=75`.
- WebP/AVIF: already enabled in `next.config.ts` (`images.formats: ['image/avif', 'image/webp']`).
- Not lazy: `HeroSection` uses `OptimizedImage` with `priority={isActive}` for the first slide; `OptimizedImage` passes `loading={priority ? undefined : 'lazy'}` to `next/image`, so the LCP image is eager.
- fetchpriority: `next/image` with `priority={true}` already sets `fetchpriority="high"` on the rendered `<img>`; the preload link also has `fetchPriority="high"`.

```diff
// After metadata, before RootLayout:

+// LCP: "Master the Core" hero image — preload so it starts before paint (next/image serves WebP/AVIF per next.config)
+const LCP_HERO_IMAGE_URL = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop";
+
 export default function RootLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
+  const lcpPreloadHref = `/_next/image?url=${encodeURIComponent(LCP_HERO_IMAGE_URL)}&w=1200&q=75`;
   return (
     <html suppressHydrationWarning lang="en">
       <head>
+        <link rel="preload" as="image" href={lcpPreloadHref} fetchPriority="high" />
         <link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

**No change:** `OptimizedImage` / `next/image` already use WebP/AVIF (config), `priority` → eager + fetchpriority; no code change there.

---

## P7 — Accessibility (score 80): icon-only buttons

### Fix: Add `aria-label` to hero carousel icon-only buttons

**Metric improved:** Accessibility (name buttons).  
**Risk:** L.  
**Validation:** `npx playwright test -g "hero"` or open DevTools → Accessibility tree; hero prev/next/dots have accessible names.

**2. `src/components/sections/home/HeroSection.tsx`**

**Before:** Prev/next and dot buttons had no accessible name (icon-only).

**After:** Added `type="button"`, `aria-label` on prev, next, and each dot.

```diff
-          <div className="absolute inset-y-0 left-6 flex items-center">
-            <button onClick={onPrev} className="w-12 h-12 ...
+          <div className="absolute inset-y-0 left-6 flex items-center">
+            <button type="button" onClick={onPrev} className="w-12 h-12 ...
+              " aria-label="Previous slide">
               <ChevronLeft className="w-6 h-6 text-gray-700" />
             </button>
           </div>
           <div className="absolute inset-y-0 right-6 flex items-center">
-            <button onClick={onNext} className="w-12 h-12 ...
+            <button type="button" onClick={onNext} className="w-12 h-12 ...
+              " aria-label="Next slide">
               <ChevronRight className="w-6 h-6 text-gray-700" />
             </button>
           </div>
           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
             {slides.map((_, index) => (
-              <button key={index} onClick={() => onGoTo(index)} className={...} />
+              <button key={index} type="button" onClick={() => onGoTo(index)} className={...}
+                aria-label={`Go to slide ${index + 1} of ${slides.length}`} />
             ))}
```

---

## Not changed (minimal-safe / already done)

| Priority | Issue | Reason |
|----------|--------|--------|
| **P1** | Unused JS 2,122 KiB | Dynamic imports and barrel changes need route-level analysis; defer to avoid over-bundling/regressions. |
| **P2** | TBT 490ms / 9 long tasks | Extension script already deferred with `requestIdleCallback`; GTM already `lazyOnload`. 156 user timing marks are from `@next/third-parties` (GA); no app-level `performance.mark` in repo. |
| **P3** | Minify 296 KiB | `NODE_ENV=production` and SWC minify in prod; `productionBrowserSourceMaps: false` already set in `next.config.ts`. |
| **P4** | Legacy JS 8 KiB | No `.browserslistrc` or `browserslist` in `package.json`; Next.js owns targets. Adding one would be a new contract; skipped for minimal-safe. |
| **P5** | Unused CSS 16 KiB | Tailwind `content` is `./src/components/**`, `./src/app/**`. Widening could keep more classes; narrowing could break styles. No change. |
| **P6** | bfcache 5 failures | No `unload`/`beforeunload` in app; analytics use `pagehide` (`lib/analytics/hooks.ts`). IndexedDB not used in app code; if a dep uses it, closing on `pagehide` would need that dep’s API. No change. |

---

## Summary

| Fix | File | Metric | Risk | Validation (one-line) |
|-----|------|--------|------|------------------------|
| LCP preload + fetchPriority in head | `src/app/layout.tsx` | LCP | L | `curl -sI "http://localhost:3000/en" | grep -i preload` then re-run Lighthouse LCP |
| Hero icon buttons aria-label | `src/components/sections/home/HeroSection.tsx` | Accessibility | L | DevTools → Accessibility tree; prev/next/dots have names |

**Expected:** LCP down (preload starts image earlier); Accessibility up (hero buttons named). No UX/behavior change; WebP/AVIF and non-lazy LCP image were already correct.

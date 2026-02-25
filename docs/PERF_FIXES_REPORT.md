# Lighthouse perf fixes – report

**Framework detected:** Next.js 16 (Turbopack), React 18.  
**Baseline doc:** `docs/PERF_S0_BASELINE.md`

---

## A) Diffs (before → after)

### 1. `src/components/analytics/GTM.tsx`

**Before:**
```tsx
<Script id="gtm-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: inlineScript }} />
```

**After:**
```tsx
<Script id="gtm-script" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: inlineScript }} />
```

---

### 2. `src/app/layout.tsx` (extension-removal script)

**Before:** Inline script ran immediately when the script loaded (afterInteractive), then set up a MutationObserver for 10s. All work was sync on the main thread.

**After:** Script body wrapped in `requestIdleCallback(run, { timeout: 2000 })` with `setTimeout(run, 1)` fallback for runtimes without `requestIdleCallback`. Logic unchanged; run deferred to idle (or after 2s). Script body slightly minified (vars, for-loops) to reduce parse/exec cost when it does run.

```html
(function() {
  function run() {
    var extensionAttributes = ['bis_skin_checked','data-new-gr-c-s-check-loaded','data-gr-ext-installed','cz-shortcut-listen'];
    function removeExtensionAttributes() {
      for (var i=0;i<extensionAttributes.length;i++) {
        var els = document.querySelectorAll('['+extensionAttributes[i]+']');
        for (var j=0;j<els.length;j++) els[j].removeAttribute(extensionAttributes[i]);
      }
    }
    removeExtensionAttributes();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', removeExtensionAttributes);
    else removeExtensionAttributes();
    var observer = new MutationObserver(removeExtensionAttributes);
    observer.observe(document.documentElement, { attributes: true, childList: true, subtree: true, attributeFilter: extensionAttributes });
    setTimeout(function(){ observer.disconnect(); }, 10000);
  }
  if (typeof requestIdleCallback !== 'undefined') requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 1);
})();
```

---

### 3. `next.config.ts`

**Before:** No explicit `productionBrowserSourceMaps`; `optimizePackageImports` had 5 entries (lucide + 4 Radix).

**After:**
- Set `productionBrowserSourceMaps: false` at top of config.
- Extended `optimizePackageImports` with Radix packages used in `src/components/ui`:  
  `react-alert-dialog`, `react-aspect-ratio`, `react-avatar`, `react-checkbox`, `react-collapsible`, `react-label`, `react-radio-group`, `react-slot`.

```ts
const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  // ...
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-aspect-ratio',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
    ],
  },
};
```

---

### 4. New file: `docs/PERF_S0_BASELINE.md`

- Describes framework, build, inferred top assets and load reasons, long-task sources, minify/source maps, CSS, bfcache, and barrel files. No code changes.

---

## B) Metrics (expected impact)

| Metric            | Before (reported) | After (expected) | Notes |
|------------------|-------------------|------------------|--------|
| JS execution     | 2.0s              | ↓                | GTM deferred; extension work in idle. |
| Main thread      | 3.9s              | ↓                | Same as above; less work during load. |
| Minify JS        | 296 KB            | ~same or ↓       | SWC already minifies; no prod source maps. |
| Unused JS        | 2122 KB           | ↓                | GTM/extension later + better Radix tree-shaking. |
| Unused CSS       | 16 KB             | unchanged        | No Tailwind/content or CSS changes. |
| bfcache          | Blocked (5)       | may improve      | GTM lazyOnload reduces 3p impact; validate in DevTools. |

Exact numbers require a new Lighthouse run and coverage on the deployed URL.

---

## C) Per change: risk + validation

| # | Change | Risk | Validation |
|---|--------|------|-------------|
| 1 | GTM `strategy="lazyOnload"` | **L** | Confirm GTM container loads (e.g. Tag Assistant or network: `gtm.js`), and key tags (e.g. GA4, conversions) still fire. First events may be a few seconds later. |
| 2 | Extension script in `requestIdleCallback` | **L** | Load `/en`; within 2s, extension attributes (e.g. Grammarly) should be removed. If something depends on removal before first paint, revert to running without requestIdleCallback. |
| 3 | `productionBrowserSourceMaps: false` | **L** | Default was already false; only made explicit. Prod build should have no `.map` requests. |
| 4 | More `optimizePackageImports` (Radix) | **L** | Smoke-test UI that uses accordion, dialog, select, checkbox, radio, avatar, sheet, alert-dialog, collapsible, aspect-ratio, label. No visual/behavior regressions. |
| 5 | S0 baseline doc | **None** | Documentation only. |

---

## S4 CSS (no change)

- Tailwind `content` already covers `src/components` and `src/app`. Unused CSS (16 KB) left for a later pass to avoid layout/visual risk.

## S5 bfcache (no code change)

- No `unload`/`beforeunload` in app code; analytics uses `pagehide` (`lib/analytics/hooks.ts`).
- `cache: 'no-store'` in `lib/api.ts` is only for API/mock `fetch()`, not the main document.
- Exact “5 reasons” need Chrome DevTools → Application → Back/forward cache (or Lighthouse) after deploy. GTM deferral may reduce one blocker.

---

## Regression risks

- **GTM/analytics:** First-page events can be delayed by lazyOnload; if you rely on very early (e.g. first 100 ms) hits, consider keeping GTM as `afterInteractive` and measure TBT/JS exec tradeoff.
- **Extension script:** If any feature assumes extension attributes are removed before first interaction, the 2s idle timeout could theoretically allow a brief flash; not observed for typical extension attributes.

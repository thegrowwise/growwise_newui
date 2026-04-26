# Summer camp 2026 — implementation status

Tracks **Plan 1** (dates across UI, schema) and **Plan 2** (hero above-the-fold). Brochure PDF updates are out of scope for this pass. Update this file as work ships.

| Field | Value |
|--------|--------|
| **Jira** | [GWA-171](https://thegrowwise-school.atlassian.net/browse/GWA-171) |
| **Primary repo** | `growwise_newui` |
| **Plan reference** | `.cursor/plans/summer_camp_dates_ux_17dfba25.plan.md` (local Cursor plan, if present). JSON-LD / AEO: changelog **2026-04-23**. **This file is the only local status doc** for summer 2026 + Lighthouse. |

---

## Engineering change log (perf / Lighthouse / a11y)

_Applies to `growwise_newui` — summer camp route and shared pieces._

1. **`src/app/[locale]/camps/summer/page.tsx`** — Meta Pixel: dynamic `import('@/lib/meta-pixel')` for guide submit + early-bird; early-bird idle sets locale ref only inside idle callback; mobile (`max-width: 768px`) longer idle timeouts for FAQ fetch, SlotsPanel (`SummerCampUI`) preload, and early-bird; hero `Image` `quality={70}`, mobile sticky logo `fetchPriority="low"` + `decoding="async"`; hero/subhead/trust text contrast (`zinc-100`, brochure `text-white`); primary CTAs / sticky bar use **`#047857` / `#065f46`**; active filter chips **`#146c43`**; **`SummerCampGuideLeadDialog`** loaded only after first open or `#lead-capture` / `#summercamp` (smaller initial JS).
2. **`src/app/[locale]/camps/summer/SummerCampGuideLeadDialog.tsx`** _(new)_ — Radix `Dialog` + lead form extracted; code-split from main page chunk.
3. **`src/components/camps/SummerCampProgramList.tsx`** — No `priority` on program card images (hero wins LCP on mobile); `quality={70}`, `decoding="async"`; `trackCampView` via dynamic `import`; mobile “summercamp” link uses **`text-[#065f46]`** for contrast.
4. **`src/components/camps/SummerCampUI.tsx`** — `trackEnrollClick` via dynamic `import('@/lib/meta-pixel')`.
5. **`src/components/camps/SummerCampTrustBlock.tsx`** — Testimonials as `<blockquote>` / `<footer>`; projects `Link` `aria-label` includes “opens in new tab”.
6. **`next.config.ts`** — `images.qualities` includes **70** (matches hero/program `quality={70}`).
7. **`scripts/lighthouse-summer-camp.mjs`** + **`package.json`** `lighthouse:summer` — Lighthouse 13 mobile/Slow 4G; writes snapshot into **this** file between HTML comments.
8. **Removed** `docs/lighthouse-summer-camp-summary.json` — metrics live only here (single status file).

---

## Plan 1 — Camp season (Jun 8–Jul 31, 2026) + July 4 note

| Task | Status | Notes / files |
|------|--------|----------------|
| `summer-camp-week-calendar.ts` (8 Mon–Fri labels + season strings) | **Done** | [`src/lib/summer-camp-week-calendar.ts`](../src/lib/summer-camp-week-calendar.ts) |
| `expandSlotTemplate` + week labels | **Done** | [`src/lib/summer-camp-data.ts`](../src/lib/summer-camp-data.ts) |
| Math Olympiad slot labels (tier 1 / tier 2 ranges) | **Done** | [`src/components/camps/SummerCampUI.tsx`](../src/components/camps/SummerCampUI.tsx) |
| Tests (calendar vs JSON `count`) | **Done** | [`src/lib/summer-camp-week-calendar.test.ts`](../src/lib/summer-camp-week-calendar.test.ts), [`src/components/camps/__tests__/summer-camp-data.test.ts`](../src/components/camps/__tests__/summer-camp-data.test.ts) |
| `ProgramDetails` + `summer-camp-programs.json` | **Done** | Optional `deliverySummary` on `ProgramDetails`; all programs in mock JSON |
| Info modal rows (dates, note, delivery) | **Done** | `SummerCampUI.tsx` `InfoModal`; i18n labels in `en.json` `summerCamp.infoModal` |
| JSON-LD `startDate` / `endDate` | **Done** | [`src/app/[locale]/camps/summer/layout.tsx`](../src/app/[locale]/camps/summer/layout.tsx) imports ISO from week-calendar |
| JSON-LD schema hygiene (SEO) | **Done** | Same layout: `BreadcrumbList` middle crumb → `/camps` (not duplicate summer URL); `Event` `offers` omits misleading fixed `price` (multi-tier programs); removed unused `SUMMER_CAMP_FAQS` — FAQPage still from [`summer-camp-faq.json`](../public/api/mock/en/summer-camp-faq.json) only |
| Brochure PDF | **Skipped** | No change to `public/assets/camps/SummerCampBrochure.pdf` for 2026 scope |
| Guide email: PDF attachment + Brevo/SMTP | **Done** | [`src/app/api/summer-camp-summercamp/route.ts`](../src/app/api/summer-camp-summercamp/route.ts) attaches `SummerCampBrochure.pdf` when readable; link retained; [`src/lib/email.ts`](../src/lib/email.ts), [`src/lib/brevo.ts`](../src/lib/brevo.ts) |
| Summer page JS weight (perf) | **Done** | Hero + conversion copy from slim [`summer-camp-canonical-en.json`](../src/i18n/messages/summer-camp-canonical-en.json) (~4.6KB) instead of full `en.json` import; hero `Image` `sizes` tightened in [`page.tsx`](../src/app/[locale]/camps/summer/page.tsx) |

---

## Plan 2 — Hero compact + mobile CTA

| Task | Status | Notes / files |
|------|--------|----------------|
| Reduce hero min/max height, padding | **Done** | Hero `max-h-[600px]`, `min-h` ~48svh / md ~40vh; padding `py-8` → `md:py-14` / `lg:py-16` (removed `md:py-[120px]`) |
| Tighter H1 / subhead | **Done** | Slightly smaller type scale + tighter `mt` / CTA `gap` |
| Mobile: primary CTA without scroll | **Done** | Urgency + trust lines `hidden` below `sm` so primary + secondary CTAs fit first screen; brochure link slightly smaller on narrow |
| Optional: re-export banner WebP | Not started | `public/assets/camps/summer-camp-banner.webp` — only if focal crop needed |

---

## Verification (local)

| Check | Result | When |
|--------|--------|------|
| `npm test` | **184** tests, **18** suites — all passed | After JSON-LD + layout edits |
| `npm run build` | **Next.js build** completed successfully | Same |
| Lighthouse | Re-run updates the snapshot block below | `npm run build && PORT=38479 npm run start` then `PORT=38479 npm run lighthouse:summer` |
| Bundle (static chunks) | **Largest JS** ~221 KiB top file after `next build` | `.next/static/chunks/*.js` — guide dialog split defers Radix until first open |

**Lighthouse note:** PDF (`localhost:3002`, Performance **46**, LCP **12.7 s**) was almost certainly **`next dev`**. Use **`next start`** for realistic scores; numbers vary run-to-run on Slow 4G. Production CDN improves LCP vs local.

<!-- LIGHTHOUSE_SNAPSHOT_START -->
_Last updated: 2026-04-23T20:35:49.111Z (Lighthouse 13.0.2) — run `npm run lighthouse:summer` to refresh._

| Metric | Value |
|--------|-------|
| URL | `http://127.0.0.1:38479/camps/summer` |
| Performance | **59** |
| Accessibility | **100** |
| FCP | 1.22 s |
| LCP | 5.20 s |
| TBT | 137 ms |
| CLS | 0.445 |
| Speed Index | 1.22 s |
| Throttling | Slow 4G (RTT 150 ms, ~1638.4 Kbps), CPU ×4 |
| LCP element | `main > section.relative > div.absolute > img.object-cover` |
| BFCache | Page didn't prevent back/forward cache restoration |
| Contrast audit | Background and foreground colors have a sufficient contrast ratio |

<details><summary>LCP snippet (truncated)</summary>

```html
<img alt="Students in coding, robotics, and math summer programs at GrowWise, Dublin…" draggable="false" fetchpriority="high" decoding="async" data-nimg="fill" class="object-cover object-center select-none" sizes="(max-w
```

</details>
<!-- LIGHTHOUSE_SNAPSHOT_END -->

---

## Changelog (append on merge)

| Date | PR / commit | Summary |
|------|-------------|---------|
| 2026-04-23 | _local_ | JSON-LD: breadcrumb “Camps” → `/camps`; Event `offers` without fixed price; removed dead `SUMMER_CAMP_FAQS`. Earlier same pass: guide-email PDF attach + perf (`summer-camp-canonical-en.json`, hero `sizes`). **Verified:** `npm test` (184), `npm run build`. Status + verification table updated |
| 2026-04-23 | _local_ | Brochure PDF skipped for 2026 scope; tracker row marked **Skipped** |
| 2026-04-24 | _local_ | Plan 1: week calendar module, slot labels, Olympiad labels, Program Details modal (dates + July 4 + delivery), JSON-LD Jun 8–Jul 31, tests |
| 2026-04-24 | _local_ | Plan 2: summer hero shorter (`max-h` + tighter padding/type); urgency/trust hidden `< sm` for above-fold primary CTA |
| 2026-04-24 | _local_ | Advanced Math: per-track weekly session dates (Algebra Mon/Wed/Fri, Precal Tue/Wed/Thu) in slot labels via `adv-math-week-sessions.ts` |
| 2026-04-24 | _local_ | Lighthouse: `lighthouse:summer` embeds snapshot in this file; lazy [`SummerCampGuideLeadDialog`](../src/app/[locale]/camps/summer/SummerCampGuideLeadDialog.tsx); WCAG greens; `images.qualities` **70**; single status doc; Jira GWA-171 comment |

---

## Jira ticket

- **Key:** GWA-171
- **URL:** https://thegrowwise-school.atlassian.net/browse/GWA-171

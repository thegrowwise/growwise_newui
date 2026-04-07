# GROWWISE SCHOOL — CURSOR RULES (ENFORCED)

These rules apply to ALL AI-generated changes in the GrowWise School repository (GROWWISE_NEWUI).
Violations = incorrect solution. No exceptions. No shortcuts.

**If constraints cannot be met:** STOP and explain the violation. Do not guess or invent compliance.

---

## 1. OPERATING MODES

Act as: Principal Engineer + Senior QA Engineer + Senior UX Designer.

**Engineering constraints:**
- Long-term maintainability
- Minimal change surface — fewest files touched wins
- Predictable > clever
- One concept → one file/config location max (+ new files if needed)
- Multi-place edits = refactor first

**UX Design constraints:**
- This is a parent-facing enrollment site — every design decision must reduce friction to enrollment
- Mobile-first — majority of Tri-Valley parents browse on phones via Nextdoor, WhatsApp, and Facebook links
- Scannability > density — parents are time-pressed; key info (age, price, schedule, CTA) must be visible without scrolling past the fold
- Trust signals matter — testimonials, credentials, location details, and recognizable program names build confidence
- One primary CTA per viewport — never present competing actions at equal visual weight
- Consistency > novelty — match existing site patterns; never introduce a new visual style that doesn't exist elsewhere on the site

---

## 2. PERFORMANCE & LIGHTHOUSE PROTECTION

1. Never load third-party scripts synchronously — GTM, Facebook Pixel, GA4, and any future third-party must use `strategy="lazyOnload"` (or interaction-based loading for Pixel where applicable). Never use `strategy="afterInteractive"` for GTM/GA. Do not add raw blocking `<script>` tags outside `next/script` for third parties.
2. Do not add extra artificial delays on top of `lazyOnload` for GTM (e.g. nested `window.load` + long `setTimeout`) unless explicitly approved. Pixel interaction-based loading remains an intentional PSI optimization. Any change to `GTM.tsx` or `MetaPixel.tsx` requires explicit approval with a stated reason.
3. No new third-party scripts without approval — any new external script (analytics, chat widget, A/B testing, ads) must be proposed with its bundle size and loading strategy before adding.
4. Tailwind content array must stay scoped to `src/` only — never broaden `tailwind.config.ts` content globs to include `node_modules`, `pages/`, test files, or root-level wildcards.
5. No synchronous fonts or preconnects that block render — `next/font` self-hosts; never add `<link rel="stylesheet">` for Google Fonts or other external CSS in `<head>`.

---

## 3. CONVERSION TRACKING PROTECTION

1. Never modify the `purchase` dataLayer push on `/[locale]/checkout/success` without explicit approval — this event drives the GTM → GA4 → Google Ads conversion import chain (`event: 'purchase'` with `value`, `currency`, `transaction_id`).
2. Never modify GTM trigger configurations or tag firing sequences — changes to `GTM.tsx`, dataLayer events, or the GTM container require a stated reason and approval. The GTM container ID is set via `NEXT_PUBLIC_GTM_ID` env var.
3. Never remove or alter Meta Pixel event calls — the Pixel ID is set via `NEXT_PUBLIC_META_PIXEL_ID` env var; changes to `MetaPixel.tsx` or `meta-pixel.ts` require approval.
4. Never modify the Stripe checkout redirect flow — the `/[locale]/checkout/success` page is the terminal conversion page. Its route, query parameters, and event firing must remain intact.

---

## 4. ROUTE PROTECTION

1. Never rename, move, or delete existing page routes — especially:
   - `/[locale]/checkout/success` (Stripe redirect + conversion tracking)
   - `/[locale]/camps/summer` (Google Ads landing page)
   - `/[locale]/coding` (Google Ads landing page)
   - `/[locale]/courses/math` (Google Ads landing page)
   - `/[locale]/steam/ml-ai-coding` (program page)
   - `/[locale]/steam/game-development` (program page)
   - Any route appearing in active Google Ads or Meta campaigns
2. New pages must be added as new routes — never repurpose or merge existing routes.
3. Never change the Next.js i18n routing configuration without understanding the canonical URL impact.

---

## 5. LAYOUT & VISUAL STABILITY

1. Never change existing page layout unless the change is the explicit purpose of the task — only add new sections below existing content. Never reorder, remove, or restructure existing sections, hero banners, card grids, or navigation as a side effect.
2. Use existing Tailwind classes and component patterns — never invent new CSS classes, layout components, or styling approaches. Match the spacing, colors, fonts, and border-radius of the existing page.
3. Images must use `next/Image` — always with `sizes`, `alt`, appropriate `priority`/`loading`, and never raw `<img>` tags.

---

## 6. UX & DESIGN SYSTEM

**Enrollment funnel awareness:**
1. Every page is part of the enrollment funnel — hero → program details → social proof → CTA. Never break this flow or bury CTAs below excessive content.
2. Primary CTA (Enroll / Register / Book Trial) must use the existing brand button style (solid, high-contrast). Secondary actions (Learn More, View Schedule) must be visually subordinate (outline or text link).
3. Pricing display must follow the comparison card pattern — price, what's included, age range, and CTA visible together without scrolling within the card. Never separate price from its CTA.

**Mobile-first design:**
4. Design for 375px viewport first — desktop is the enhancement, not the default. All layouts must be single-column readable on mobile before adding multi-column desktop breakpoints.
5. Touch targets must be minimum 44x44px — buttons, links, and interactive elements must be comfortably tappable. Never stack small links close together on mobile.
6. Sticky/fixed CTAs on mobile are encouraged for long pages — a persistent "Enroll Now" bar at the bottom keeps the conversion action always reachable.

**Visual hierarchy:**
7. One `h1` per page — it must describe the program or page purpose, not be a generic tagline. Subheadings (`h2`, `h3`) must follow logical document hierarchy.
8. Key decision info above the fold — program name, age range, price, and primary CTA must be visible on landing without scrolling, especially on ad landing pages.
9. White space is intentional — never fill empty space with decorative elements or filler content. Breathing room improves scannability.

**Design system compliance:**
10. Use the existing color palette — this includes both `tailwind.config.ts` CSS variable tokens AND the established brand hex colors used throughout the codebase (`#1F396D` navy, `#1D9E75` green, `#F16112` orange, `#F1894F` coral). Never introduce new brand colors outside these.
11. Typography must use the existing font stack and size scale — never add new font families or arbitrary `text-[17px]` values. Use the defined Tailwind scale (`text-sm`, `text-base`, `text-lg`, etc.).
12. Component patterns must match existing site — if a card, badge, section divider, or testimonial block already exists on the site, reuse that pattern. Never invent a new component style for something that already has a precedent.
13. Icons must come from Lucide React (the existing icon library) — never add a new icon library or use inline SVGs unless Lucide doesn't cover the need (and if so, state the gap).

**Competitive context:**
14. GrowWise competes with YoungWonks, theCoderSchool, and Code Ninjas in the Tri-Valley. UX decisions should emphasize GrowWise's differentiators: curriculum depth, real programming languages (not just block-based), small class sizes, and instructor credentials. Never design in a way that makes GrowWise look generic or indistinguishable from franchise competitors.

---

## 7. SEO & CONTENT INTEGRITY

1. Never remove or weaken SEO metadata — page titles, descriptions, keywords, JSON-LD structured data, and canonical URLs are intentional. Changes require approval.
2. All canonical URLs must use `https://growwiseschool.org` (non-www) — this is set via `getCanonicalSiteUrl()` in `src/lib/seo/siteUrl.ts`. Never generate canonical tags with `www.` prefix.
3. Founding year is 2024 — all references to GrowWise founding date must use 2024.
4. FAQ data lives in `public/api/mock/en/summer-camp-faq.json` — new FAQs should be prepended, never replace existing ones.
5. Never alter `robots.txt` or `sitemap.xml` generation logic without explicit approval.

---

## 8. PRICING & COURSE DATA — SINGLE SOURCE OF TRUTH

1. Pricing data flows from the `/api/pricing-config` endpoint, consumed via the `usePricingConfig()` hook in `src/hooks/usePricingConfig.ts` — never hardcode prices, age ranges, session counts, or discount values in components.
2. Summer camp program data flows from `src/lib/summer-camp-data.ts` via `fetchSummerCampData()` and `getDefaultSummerCampData()` — never duplicate camp details in components.
3. If a component needs pricing or course data, it must use the existing hooks/functions — if they don't expose what's needed, extend them rather than duplicating values.
4. Marketing copy must not contain specific dollar amounts — reference data-driven values or use i18n keys.

---

## 9. ZERO HARDCODING (GOAL)

Prefer externalized values over inline strings. Allowed sources:
- `en.json` for user-visible text (i18n keys via `useTranslations`)
- `usePricingConfig()` hook for pricing data
- `fetchSummerCampData()` for camp program data
- Environment variables for API keys, URLs, IDs
- `tailwind.config.ts` for design tokens

Where hardcoded English strings currently exist in components (e.g., button labels, link text), prefer migrating them to i18n keys when editing those components — but never refactor working code solely to externalize strings.

---

## 10. LOCALIZATION

1. All new user-visible text should use i18n keys from `en.json` via `useTranslations` — no new readable text hardcoded in components.
2. After editing `en.json`, confirm all 22 top-level keys are intact — the key count must not decrease unless removal is the explicit task.
3. Nested key structures must be preserved — never flatten or restructure existing i18n key hierarchies.

---

## 11. BUILD & QUALITY GATES

1. Every change must pass `npm run build` with 0 errors before committing — no exceptions.
2. Every change must pass `npm run lint` with 0 new errors — pre-existing warnings are acceptable, new errors are not.
3. Validate all JSON files after editing — `en.json`, mock data files, and any config JSON must parse without errors.
4. Never commit environment variables, API keys, Stripe secrets, or tracking IDs to the repository.

---

## 12. SECURITY

1. All new API routes must validate input and return proper error responses — never expose raw error messages or stack traces to the client.
2. Stripe webhook endpoints must verify signatures — never process unverified webhook payloads.
3. No secrets in client-side code — API keys, Stripe keys, and service credentials belong in server-side env vars only. Public keys (e.g., Stripe publishable key) are the only exception.

---

## 13. FAILURE MODES

- Missing env vars → fail fast at build time, not silently at runtime
- Failed API calls → show degraded UI with user-friendly message, never blank screen
- Missing i18n key → show key name (dev) or fallback (prod), never crash
- Invalid pricing data → show loading/error state, never serve broken pricing

---

## 14. CHANGE IMPACT

Include with every change:
- Files touched and why
- Why no other files were touched
- Any assumptions made

---

## 15. SELF-REVIEW

Before final output, verify:
- [ ] `npm run build` passes with 0 errors
- [ ] `npm run lint` passes with 0 new errors
- [ ] No hardcoded strings, prices, or routes added
- [ ] No existing routes renamed or removed
- [ ] No conversion tracking modified
- [ ] No canonical URL logic changed
- [ ] No third-party scripts added without approval
- [ ] No layout changed as a side effect
- [ ] `en.json` key count not reduced
- [ ] Mobile viewport (375px) reviewed — single-column, tappable CTAs, key info above fold
- [ ] Primary CTA is visually dominant — no competing actions at equal weight
- [ ] Only existing color palette, font scale, and component patterns used
- [ ] Heading hierarchy is correct (`h1` → `h2` → `h3`, one `h1` per page)

State **PASS** or **FAIL**. If FAIL: fix or refuse and explain.

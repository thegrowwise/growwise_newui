# Site-wide performance tests — plan & status

Tracks the **performance testing program** for `growwise_newui`: lab metrics, URL coverage, budgets, automation, and rollout. Update this file as work ships.

**Canonical target:** **`http://127.0.0.1:<PORT>`** (typically port **3000**) with **`next build` + `next start`**. That is our **default regression surface** (fast, safe, runs on your laptop or CI).

**Important:** That is **not** the same **machine or network** as live **production**. You are exercising the **same compiled app** (`next build` output) on a **local or CI Node process** — not Vercel’s edge, CDN, or prod CPU. So localhost answers: *“Did this change make our build heavier or our server slower in a controlled lab?”*  
For *“What will real users see on our hosting?”* use a **preview / staging URL** that matches production’s platform (e.g. Vercel preview). **Production URL** lab runs are optional (label the run; expect third-party/CDN noise). **Locust** stays on localhost/preview unless product approves load against prod.

**Constraints (do not regress):**

- Repo workflow: [.cursorrules](../.cursorrules) — approval before non-trivial implementation; layout must not change unless that is the task.
- Product/engineering guardrails: [.cursor/rules.md](../.cursor/rules.md) — especially **§2 Performance & Lighthouse Protection** (third-party scripts, GTM/Pixel loading, Tailwind scope, fonts). Perf **instrumentation and CI must not introduce UI or layout changes** unless a separate task explicitly approves UX edits.

---

## Summary

| Field | Value |
|--------|--------|
| **Where to run** | **Localhost first** (CI or your machine): same **build** as prod, **not** prod’s servers/CDN. **Preview/staging** next for hosting-faithful LCP. **Production URL** only for occasional labeled Lighthouse — not a substitute for localhost gates. |
| **Goal** | Important pages stay within lab **LCP** budgets (`next build` + `next start`, usually localhost). |
| **Desktop budget** | Target **under 2 s** — **lab gate:** median LCP **≤ 2000 ms** |
| **Mobile budget** | Target **under 3 s** — **lab gate:** median LCP **≤ 3000 ms** |
| **Primary metric** | **LCP** (largest contentful paint). Optionally record FCP / TBT / CLS as diagnostics, not hard gates initially. |
| **Existing tooling** | `npm run lighthouse:summer` → [`scripts/lighthouse-summer-camp.mjs`](../scripts/lighthouse-summer-camp.mjs) (single URL, mobile + Slow 4G). |
| **Batch tooling (lab)** | `performance-testing/` module: [`README.md`](../performance-testing/README.md); Lighthouse [`lighthouse-batch.mjs`](../performance-testing/scripts/lighthouse-batch.mjs); smoke [`config/smoke-paths.json`](../performance-testing/config/smoke-paths.json); parser tests **`npm run test:perf`** + PR workflow [`performance-parser-test.yml`](../.github/workflows/performance-parser-test.yml). Root: **`perf:ci:pr`** (PR), **`perf:ci`** / **`perf:lighthouse:smoke*`**. |
| **Load tooling (Locust)** | Python — [`performance-testing/load/README.md`](../performance-testing/load/README.md): **`npm run perf:locust`** / **`perf:locust:headless`**. Same path list JSON; **`GET`** only — no mutation of ads payloads. CI: **[`performance-load-locust.yml`](../.github/workflows/performance-load-locust.yml)** (`workflow_dispatch`). |

---

## How to run (lab) — **localhost**

Requirements: **`next build`** then **`npm run start`** on **`http://127.0.0.1:3000`** (or set `PORT`). **`next dev` is invalid** for budget enforcement — see [`docs/summer-camp-2026-status.md`](./summer-camp-2026-status.md).

| Command | Behavior |
|---------|----------|
| `npm run perf:lighthouse:smoke` | Smoke URLs × **desktop + mobile** (default). **Smoke ≠ full site:** only paths in **`smoke-paths.json`**; use **`perf:lighthouse`** without `--smoke` for sitemap breadth. |
| **`npm run perf:lighthouse:smoke:mobile`** | Smoke × **mobile only** (~half Lighthouse runs — typical **PR** profile). **`--desktop-only`** available as **`perf:lighthouse:smoke:desktop`**. |
| **`npm run perf:lighthouse:smoke:html`** | Smoke + **`--save-html`** — full Lighthouse HTML reports under **`artifacts/lighthouse-html/`** (see **`index.html`**). |
| **`npm run perf:ci:pr`** | Convenience: **`--smoke --mobile-only --runs=1`** (fast PR gate). |
| **`npm run test:perf`** | **`node:test`** on Lighthouse batch CLI/env parser (~60 ms; **no Lighthouse**). **CI:** [`performance-parser-test.yml`](../.github/workflows/performance-parser-test.yml) on every PR + `main push` (**no `npm ci`**). |
| `npm run perf:ci` | **`--smoke --runs=2`** both factors (release-style median on smoke). |
| `npm run perf:lighthouse` | Full sitemap batch (desktop + mobile each URL unless combined with **`--mobile-only`** / **`--desktop-only`** or **`PERF_FORM_FACTORS`**). |

Summary JSON defaults to `./artifacts/lighthouse-batch-summary.json` (`artifacts/` is gitignored). It includes **`urlsTested`** (pages in this run), **`rows`** (one row per URL × form factor — LCP median, budget, Perf score), plus optional **`savedHtmlReports`**, **`lighthouseHtmlIndexRelative`**, and per-row **`htmlReports`** / **`medianHtmlReport`** when **`PERF_SAVE_HTML`** is on. The batch echoes a **full recap table** in the terminal at the end. Scheduled CI uses **`--smoke --mobile-only`** (stable gate), **`PERF_SAVE_HTML=true`**, and uploads **`artifacts/`** — open **`lighthouse-html/index.html`** in the artifact for linked HTML reports. For **desktop + mobile** in lab, run **`npm run perf:lighthouse:smoke`** locally.

| Env / flag | Default | Purpose |
|------------|---------|---------|
| `PERF_BASE_URL` | `http://127.0.0.1:$PORT` | Benchmark origin (`PORT` usually `3000`) |
| `PERF_RUNS`, `--runs=N` | `1` | Lighthouse runs per URL per form factor; **median LCP** |
| `PERF_DESKTOP_MAX_LCP_MS` | `2000` | Desktop budget (fail if median **&gt;** this) |
| `PERF_MOBILE_MAX_LCP_MS` | `3000` | Mobile budget |
| `PERF_OUT` | `./artifacts/lighthouse-batch-summary.json` | Written summary |
| `PERF_SAVE_HTML` | off | `1` / `true` / `yes` / `on` → keep full **HTML** reports under `PERF_HTML_REPORT_DIR` |
| `PERF_HTML_REPORT_DIR` | `./artifacts/lighthouse-html` | One `*.report.html` per run (+ `index.html` index) |
| `PERF_FORM_FACTORS` | `both` | `mobile` or `desktop` limits form factors (same as **`--mobile-only`** / **`--desktop-only`**). CLI flags override env. |

Use `--no-warmup` to skip the GET warm-up before Lighthouse for a cold-cache measurement.

---

## CI profiles: **PR (speed)** vs **release (confidence)**

Same **LCP budgets** (desktop ≤ 2000 ms, mobile ≤ 3000 ms) unless product relaxes them — the difference is **how many runs and how much surface** you exercise.

| Aspect | **PR / every push** (fast) | **Pre-release / promote** (confidence) |
|--------|----------------------------|--------------------------------------|
| **Lighthouse scope** | Smoke only: [`config/smoke-paths.json`](../performance-testing/config/smoke-paths.json) (`--smoke`). | Smoke **plus** full sitemap batch [`perf:lighthouse`](../performance-testing/README.md) when you need breadth (blogs + all pages); accept **long runtime** or run sitemap on a **schedule** instead of every release. |
| **Runs per URL / factor** | **`PERF_RUNS=1`** or **`npm run perf:ci:pr`** (smoke + **mobile-only** + one run). | **`PERF_RUNS=2` or `3`**; **`npm run perf:ci`** = smoke + **`--runs=2`** **both** factors. |
| **Form factors** | **`--mobile-only`** — **`npm run perf:lighthouse:smoke:mobile`** or **`PERF_FORM_FACTORS=mobile`** (~half the Lighthouse calls). **`--desktop-only`** for desktop-only. | Default **desktop + mobile** on every smoke/sitemap URL. |
| **Warm-up** | **On** (default) — one GET per URL keeps runs less wild. | **On**; for cold-cache forensics use `--no-warmup` only in a **separate labeled** job. |
| **Locust** | **Skip** on typical PR pipelines (saves minutes + Python/setup). | **`workflow_dispatch`** or release job: e.g. `LOCUST_USERS=20`, `LOCUST_SPAWN_RATE=3`, `LOCUST_RUN_TIME=90s`–`120s` on localhost or **preview**. |
| **Preview / staging** | Usually **omit** — keep PR green and fast. | Run **labeled** Lighthouse against **preview URL** (`PERF_BASE_URL` / `LOCUST_HOST`) before production promotion when hosting realism matters. |
| **Triggers** | **Parser:** [`performance-parser-test.yml`](../.github/workflows/performance-parser-test.yml) on **every PR** + `main` (fast). Optional: `pull_request` with **narrow `paths`** for Lighthouse (e.g. `src/**`, `performance-testing/**`, `next.config.ts`, lockfile). | `workflow_dispatch`, **release/tag**, merge to protected `main`, or **nightly** full smoke + median runs. |
| **Artifacts** | Upload summary JSON **on failure** or always — team choice; optional on PR to save storage. | **Always** archive Lighthouse (and Locust logs if added) for comparison across releases. |

**Rule of thumb:** PR: **`npm run perf:ci:pr`** (smoke + mobile-only + 1 run). Release: **`npm run perf:ci`** (both factors + median runs) plus optional **sitemap** / **preview**.


---

## Load testing (Locust) — **localhost**

Same stack as Lighthouse: **`next start`** on **`127.0.0.1`**, then Locust **`LOCUST_HOST=http://127.0.0.1:3000`** (default). **Localhost load tests are what we prioritize** — fast feedback, repeatable, safe. Do not aim Locust at production without approval.

| Command | Behaviour |
|---------|-----------|
| `npm run perf:locust` | Locust Web UI at `http://localhost:8089`. **`LOCUST_HOST`** (default `http://127.0.0.1:3000`) = app under load. Requires **Python 3.11+**. |
| `npm run perf:locust:headless` | Non-interactive; tune **`LOCUST_USERS`**, **`LOCUST_SPAWN_RATE`**, **`LOCUST_RUN_TIME`**. Exits non-zero if **any** request fails. |

Paths match [`performance-testing/config/smoke-paths.json`](../performance-testing/config/smoke-paths.json). Full runbook: [`performance-testing/load/README.md`](../performance-testing/load/README.md).

---

## Definition of done (testing program)

| Item | Status | Notes |
|------|--------|--------|
| Documented budgets (desktop / mobile targets + lab ≤ gates) | **Done** | This file |
| Stable **URL list** (sitemap-driven + smoke paths) | **Done** | Smoke list: [`performance-testing/config/smoke-paths.json`](../performance-testing/config/smoke-paths.json); full batch = both child sitemaps via [`performance-testing/scripts/lighthouse-batch.mjs`](../performance-testing/scripts/lighthouse-batch.mjs). Locales match whatever `NEXT_PUBLIC_SITE_URL` sitemaps emit. |
| **Desktop** Lighthouse **LCP ≤ 2000 ms** gate | **Done** | `--preset=desktop` (LH 13; resolves screen emulation with desktop), `--throttling-method=simulate` |
| **Mobile** Lighthouse **LCP ≤ 3000 ms** gate | **Done** | `--form-factor=mobile`; same Lighthouse 13 / simulate mode as batch desktop |
| Median multiple runs per URL | **Done** | `PERF_RUNS` or `--runs` |
| CI or scheduled job + artifacts | **Done** | [`.github/workflows/performance-smoke.yml`](../.github/workflows/performance-smoke.yml): **`--smoke --mobile-only`** (+ **`PERF_SAVE_HTML`**); uploads **`artifacts/`**. Full desktop+mobile smoke: **`npm run perf:lighthouse:smoke`** locally / pre-release. Uncomment `push` in workflow for main merges (adds CI cost). |
| Warm-up documented | **Done** | One GET before each URL’s runs (`--no-warmup` off); aligns with **`next start`** guidance above |
| HTTP load (Locust) documented + manual CI | **Done** | [`performance-testing/load/`](../performance-testing/load/); workflow [`.github/workflows/performance-load-locust.yml`](../.github/workflows/performance-load-locust.yml) |

---

## Environment & methodology (targets)

1. **Server:** `npm run build` then `npm run start` — never benchmark `next dev` for budget enforcement.
2. **Base URL (priority):** **`http://127.0.0.1:<PORT>`** — default for Lighthouse, Locust, and CI (**regression / same-build lab**). **Preview or staging** on the real host (e.g. Vercel) is the right place to approximate **production** behavior (CDN, region, cold start). **Production** origin: optional Lighthouse with clear labels; avoid surprising traffic (especially load tests).
3. **Third-party:** Full marketing stack (GTM, Pixel, HubSpot after consent) may affect LCP; consider a **labeled** run (e.g. “full” vs “no consent / blocked third-party”) if debugging regressions — not a substitute for §2 compliance in [.cursor/rules.md](../.cursor/rules.md).

### Lighthouse Best Practices — “Uses deprecated APIs” (Meta Pixel)

Chrome’s Lighthouse **Best Practices** category may report **`AttributionReporting`** with source **`connect.facebook.net/.../fbevents.js`**. That is **Meta’s Facebook Pixel base library**, not first-party code. The app loads it from [`MetaPixel.tsx`](../src/components/analytics/MetaPixel.tsx) when `NEXT_PUBLIC_META_PIXEL_ID` is set (see [`AnalyticsAfterConsent.tsx`](../src/components/analytics/AnalyticsAfterConsent.tsx)).

**GTM vs app Pixel:** The checked-in GTM import [`gtm/virtual_page_view_import.json`](../gtm/virtual_page_view_import.json) contains **only** GA4 + `virtual_page_view` — **no Meta Pixel tag**. The **live** GTM container may still include a Pixel; confirm in the Tag Manager UI. If Pixel fires from GTM, set `NEXT_PUBLIC_META_PIXEL_DISABLE_APP=true` so the app does not inject a second copy ([`metaPixelEnv.ts`](../src/lib/metaPixelEnv.ts)). Details: [`gtm/README.md`](../gtm/README.md).

**Lab baseline (isolate first-party Best Practices noise):** `NEXT_PUBLIC_*` values are baked at **`next build`**. To confirm the deprecation warning is tied to Pixel/GTM rather than the app shell:

1. From repo root, build with Pixel and GTM **omitted** (empty strings unset the IDs in the client bundle):

   `NEXT_PUBLIC_META_PIXEL_ID= NEXT_PUBLIC_GTM_ID= npm run build`

2. `PORT=3000 npm run start` (or your usual port).

3. Run Lighthouse against a representative path (e.g. `/camps/summer`), Best Practices only, e.g.  
   `npx lighthouse@13.0.2 http://127.0.0.1:3000/camps/summer --only-categories=best-practices --chrome-flags="--headless"`  
   The Facebook **`AttributionReporting` / `fbevents.js`** finding should **not** appear when neither the app nor GTM loads the Pixel. (Production-like runs should keep real env vars; label the comparison “no third-party Pixel/GTM”.)

   **Recorded check (2026-05-06, local):** After `NEXT_PUBLIC_META_PIXEL_ID= NEXT_PUBLIC_GTM_ID= npm run build`, `next start` on port **3042**, `npx lighthouse@13.0.2 http://127.0.0.1:3042/en/camps/summer --only-categories=best-practices` → audit **`deprecations`** score **1**, **0** detail items (“Avoids deprecated APIs”). Full JSON is reproducible under `performance-testing/artifacts/` (gitignored); re-run overwrites or add `--output-path` as needed.
4. **Locales:** Phase 1 test **default English paths**; Phase 2 add other locales for high-traffic templates.
5. **CSS delivery (prod):** [`next.config.ts`](../next.config.ts) enables **`experimental.inlineCss: true`** so critical styles ship with HTML and reduce render-blocking stylesheet round-trips (Next.js docs: [`inlineCss`](https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss)). **Experimental:** larger HTML, no separate CSS cache on first load; not applied in dev. Re-run Lighthouse after changes.
6. **Defer non-critical client work:** [`LazyChatbot`](../src/components/chatbot/LazyChatbot.tsx) loads the chat bundle after **idle or first scroll/tap**. [`Footer`](../src/components/layout/Footer/Footer.tsx) schedules the mock footer fetch for **idle** (fallback `setTimeout` if `requestIdleCallback` is missing). **GTM/consent gates and standalone Meta Pixel bootstrap** unchanged per [.cursor/rules.md](../.cursor/rules.md).

---

## URL inventory strategy

1. **Implemented:** URLs come from **`/sitemap-pages.xml`** + **`/sitemap-blogs.xml`** via [`performance-testing/scripts/lighthouse-batch.mjs`](../performance-testing/scripts/lighthouse-batch.mjs); smoke mode reads [`performance-testing/config/smoke-paths.json`](../performance-testing/config/smoke-paths.json) (includes `/coding` ads landing — §4 [.cursor/rules.md](../.cursor/rules.md)).
2. **Optional extras:** Stripe success/thank-you routes need query/session context — extend smoke list deliberately if those become SLA pages.
3. **Exclude:** API routes are not listed in XML sitemaps; no change.

---

## Implementation backlog (engineering)

_No UI or layout changes in these items unless explicitly scoped._

| Task | Status | Notes |
|------|--------|--------|
| Dedicated **`performance-testing/`** module (configs + README) | **Done** | [`performance-testing/README.md`](../performance-testing/README.md) |
| Batch Lighthouse: desktop + mobile, LCP thresholds 2000 / 3000 ms | **Done** | [`performance-testing/scripts/lighthouse-batch.mjs`](../performance-testing/scripts/lighthouse-batch.mjs) |
| `package.json`: `perf:lighthouse`, `perf:lighthouse:smoke`, `perf:lighthouse:smoke:*`, **`perf:ci`**, **`perf:ci:pr`** | **Done** | `perf:ci` = smoke `--runs=2` (both factors); **`perf:ci:pr`** = smoke `--runs=1` **mobile-only** (~half Lighthouse time); single-factor overrides also via `--mobile-only` / `--desktop-only` or `PERF_FORM_FACTORS`. |
| Scheduled GitHub Actions + artifact upload | **Done** | [`.github/workflows/performance-smoke.yml`](../.github/workflows/performance-smoke.yml); optional `push:` block commented in YAML |
| **PR + `main`:** parser-only workflow (`node:test`, no Lighthouse) | **Done** | [`.github/workflows/performance-parser-test.yml`](../.github/workflows/performance-parser-test.yml); **`npm run test:perf`** locally |
| Locust load tests + manual CI workflow | **Done** | [`performance-testing/load/`](../performance-testing/load/), [`.github/workflows/performance-load-locust.yml`](../.github/workflows/performance-load-locust.yml), `perf:locust*` npm scripts |
| **`npm run test:perf`** (`node:test`, Lighthouse batch CLI/env parse) | **Done** | [`parseLighthouseBatchOptions.mjs`](../performance-testing/scripts/parseLighthouseBatchOptions.mjs), no Lighthouse in test run |
| Optional Playwright timings / LCP for breadth | Not started | Future script under [`performance-testing/scripts/`](../performance-testing/scripts/) |
| **Phase 1 plan (idle deferrals + transition):** chat mount, footer fetch, Redux `fetchHomeSuccess` | **Done** | 2026-04-30 — see changelog |
| Larger home bundle refactor (narrow client island, Redux on `/`) | Not started | |

---

## Change log

| Date | Change |
|------|--------|
| 2026-04-30 | Initial status doc: budgets (desktop &lt; 2 s, mobile &lt; 3 s LCP), plan phases, pointer to existing summer Lighthouse script. |
| 2026-04-30 | Batch Lighthouse (`perf:lighthouse*`), sitemap + smoke URL discovery, `artifacts/` gitignore, doc updates. **No UI/UX code changes.** |
| 2026-04-30 | Desktop runs: **`--preset=desktop`** (Lighthouse 13); `--form-factor=desktop` alone caused emulation validation errors. |
| 2026-04-30 | **`experimental.inlineCss: true`** in [`next.config.ts`](../next.config.ts) — address render-blocking CSS chain in lab (experimental; see methodology §5). |
| 2026-04-30 | **Perf execution (approved plan):** [`LazyChatbot`](../src/components/chatbot/LazyChatbot.tsx) defers mounting chat JS until idle or first scroll/tap (`requestIdleCallback` max 8s). [`Footer`](../src/components/layout/Footer/Footer.tsx) defers Redux footer fetch (`/api/mock/…/footer`) to idle (`timeout` 3s). [`HomeClient`](../src/components/pages/HomeClient.tsx) wraps `fetchHomeSuccess` in `startTransition` when server `initialData` exists. **GTM/consent gates and Pixel behavior unchanged.** |
| 2026-04-30 | **Sitewide JS (no UI / no tracking changes):** **Browserslist** tuned for primary **Chrome + Safari / iOS** — `chrome ≥ 121`, `safari ≥ 17`, `ios ≥ 17` ([`package.json`](../package.json)); no explicit Firefox/Edge (modern Chromium Edge / Firefox usually still fine). **`optimizePackageImports`** in [`next.config.ts`](../next.config.ts) incl. carousel, Stripe, date picker, `cmdk`, `input-otp`, `vaul`. Dead Redux **`content`** slice + saga removed. **`PageTrackingWrapper` / Meta / GTM untouched.** [`src/test-utils.tsx`](../src/test-utils.tsx). |
| 2026-04-30 | **`performance-testing/`** lab module: [`README.md`](../performance-testing/README.md), [`config/smoke-paths.json`](../performance-testing/config/smoke-paths.json), relocated batch runner; GitHub Actions [`performance-smoke.yml`](../.github/workflows/performance-smoke.yml) (weekly cron + `workflow_dispatch`); **`npm run perf:ci`** smoke with `--runs=2`. |
| 2026-04-30 | **Docs:** Perf program positions **`http://127.0.0.1`** + **`next start`** after **`next build`** as the **primary** benchmarking surface (Lighthouse + Locust + CI); remote URLs explicitly secondary — see [`performance-tests-status.md`](./performance-tests-status.md) / [`performance-testing/README.md`](../performance-testing/README.md). Fixed [`performance-smoke.yml`](../.github/workflows/performance-smoke.yml) comment block YAML (`##` → `#`). |
| 2026-04-30 | **CI profiles** table — **PR (speed)** vs **pre-release (confidence)** targets (runs, scope, Locust, staging): [§ CI profiles](./performance-tests-status.md#ci-profiles-pr-speed-vs-release-confidence). |
| 2026-04-30 | Lighthouse batch: **`--mobile-only`** / **`--desktop-only`**, **`PERF_FORM_FACTORS`**, npm **`perf:lighthouse:smoke:mobile`**, **`perf:ci:pr`**. Summary JSON includes **`formFactorMode`** / **`formFactors`**. |
| 2026-04-30 | **`npm run test:perf`** — `node:test` for [`parseLighthouseBatchOptions.mjs`](../performance-testing/scripts/parseLighthouseBatchOptions.mjs); `lighthouse-batch.mjs` imports it (behavior unchanged). |
| 2026-04-30 | **CI:** [`.github/workflows/performance-parser-test.yml`](../.github/workflows/performance-parser-test.yml) on PR + `main`. **Reporting:** Lighthouse batch prints an **all-rows recap table** and summary JSON **`urlsTested`**; clarified **`--smoke`** vs full sitemap in help + docs. |
| 2026-04-30 | **HTML Lighthouse reports:** **`PERF_SAVE_HTML`** / **`--save-html`** persist **`artifacts/lighthouse-html/*.report.html`**, **`index.html`**; summary includes **`medianHtmlReport`**, **`savedHtmlReports`**. [`performance-smoke.yml`](../.github/workflows/performance-smoke.yml): **`PERF_SAVE_HTML=true`**, artifact = full **`artifacts/`**. |
| 2026-04-30 | **PR hygiene:** removed stray duplicate `* 2.*` files; **`performance-smoke`** runs **`--mobile-only`** until mobile LCP passes CI budgets reliably; full smoke remains local **`perf:lighthouse:smoke`** / **`perf:ci`**. |

---

## Related docs

- [Performance testing module — runbook & CI](../performance-testing/README.md)
- [Locust load tests](../performance-testing/load/README.md)
- [Summer camp 2026 — implementation status](./summer-camp-2026-status.md) (route-specific Lighthouse snapshot and perf notes)

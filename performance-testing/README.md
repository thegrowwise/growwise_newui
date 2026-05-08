# Performance testing module (`growwise_newui`)

Self-contained lab + load performance suite so `growwise_newui` stays the single app checkout while benchmarks live in **`performance-testing/`**:

- **Lighthouse** → Web Vitals / LCP budgets (lab).
- **Locust** → HTTP concurrency / latency / failures — see **[`load/README.md`](./load/README.md)**.

**Testing surface:** **`http://127.0.0.1:<PORT>`** with **`next start`** after **`next build`** is the default for **regression** (same app build; local/CI machine — **not** prod’s infrastructure). **Preview/staging** on your real host is the right step to approximate **production**; production URL is optional for labeled lab checks.

## Goals

| Goal | How |
|------|-----|
| **Localhost-first** | `PERF_BASE_URL` / `LOCUST_HOST` default to `127.0.0.1:$PORT`; both workflows compile and probe the **same machine’s** prod build. |
| **Run often** | Lighthouse: `npm run perf:lighthouse:smoke` + [workflow](../.github/workflows/performance-smoke.yml). Locust load: **`npm run perf:locust:headless`** or [manual workflow](../.github/workflows/performance-load-locust.yml). |
| **No UI drift** | Lab-only Lighthouse; thresholds are budgets, not screenshots. Same rules as [`.cursor/rules.md`](../.cursor/rules.md) — do not regress GTM/Pixel/consent intentionally. |
| **Prod-like scores** | Always benchmark `next build` + `next start`, not `next dev`. |

## Layout

```
performance-testing/
  README.md                 ← this file
  package.json              ← `@growwise/performance-testing`; optional `cd` + npm run smoke
  config/
    smoke-paths.json        ← Lighthouse smoke + Locust path mix (shared JSON)
  load/
    locustfile.py           ← Locust users (GET smoke paths + home bias)
    run-locust-*.sh         ← venv + install + exec
  scripts/
    lighthouse-batch.mjs              ← LCP gates; `--mobile-only` / `--desktop-only`; sitemap mode; JSON summary
    parseLighthouseBatchOptions.mjs    ← shared CLI/env parse (unit-tested)
    parseLighthouseBatchOptions.test.mjs  ← `npm run test:perf` (node:test)
```

Site-wide methodology and changelog: [`docs/performance-tests-status.md`](../docs/performance-tests-status.md).

## Prerequisites

- Chrome/Chromium for Lighthouse (local or CI runners).
- **Python 3.11+** for Locust (`python3`; scripts create `performance-testing/load/.venv`).
- Repo root **`npm ci`** completed.

## Commands (always from **`growwise_newui/`**)

```bash
npm run build
PORT=3000 npm run start
# separate terminal:
npm run perf:lighthouse:smoke
```

**Port conflicts (local reproducibility):** If **`npm run start`** exits with **`EADDRINUSE`**, port **3000** is already taken (often **`next dev`**, another **`next start`**, or Cursor’s background task). Lighthouse will still hit whatever answers **`http://127.0.0.1:3000`**, which may **not** be the **`next build`** you just compiled. Either stop the other process (e.g. inspect with `lsof -iTCP:3000 -sTCP:LISTEN`) or use another port consistently: **`PORT=3001 npm run start`** plus **`PERF_BASE_URL=http://127.0.0.1:3001`** when you run **`lighthouse-batch.mjs`** (same for **`LOCUST_HOST`** if load-testing).

| Script | Behaviour |
|--------|-----------|
| **`npm run test:perf`** | **`node:test`** on CLI/env parsing for Lighthouse batch (**no Lighthouse** executed). |
| `npm run perf:lighthouse:smoke` | Smoke paths: desktop + mobile (default). |
| **`npm run perf:lighthouse:smoke:mobile`** | Smoke **mobile-only** (~half Lighthouse time — typical PR). **`perf:lighthouse:smoke:desktop`** for desktop-only. |
| **`npm run perf:lighthouse:smoke:html`** | Smoke + **`--save-html`** — **`artifacts/lighthouse-html/`** (+ **`index.html`**). |
| **`npm run perf:ci:pr`** | **`--smoke --mobile-only --runs=1`**. |
| `npm run perf:ci` | **`--smoke --runs=2`**, both factors (release-style smoke). |
| `npm run perf:lighthouse` | Full sitemap batch (both factors unless `--mobile-only` / `PERF_FORM_FACTORS`). |
| `PERF_RUNS=3 npm run perf:lighthouse:smoke` | Median over 3 runs per URL × each **selected** form factor. |
| **`npm run perf:locust`** | Locust Web UI (`LOCUST_HOST` defaults to `http://127.0.0.1:3000`). |
| **`npm run perf:locust:headless`** | Headless load (`LOCUST_USERS`, `LOCUST_SPAWN_RATE`, `LOCUST_RUN_TIME`). Details: [`load/README.md`](./load/README.md). |

Lighthouse env/flags: `node performance-testing/scripts/lighthouse-batch.mjs --help`.

### Smoke paths vs entire site

- **`--smoke`** (including `perf:lighthouse:smoke`, `perf:ci`): only URLs in **`config/smoke-paths.json`** — a small **critical set**, not every route or every sitemap entry.
- **Full lab sweep:** run **`npm run perf:lighthouse`** **without** `--smoke`; URLs come from **`/sitemap-pages.xml`** + **`/sitemap-blogs.xml`** (anything not in sitemaps is not audited).

At the end of every batch run, logs include a **recap table** (every URL × form factor); the artifact JSON adds **`urlsTested`** plus **`rows`** (medians, budgets, Perf score). With **`PERF_SAVE_HTML`** or **`--save-html`**, Lighthouse writes **`artifacts/lighthouse-html/<slug>_*.report.html`** (one per run), drops parsed JSON after reading metrics, and writes **`artifacts/lighthouse-html/index.html`** linking all reports (`medianHtmlReport` in each row points at the run closest to the median LCP).

## Continuous integration

- **Parser regression:** **`../.github/workflows/performance-parser-test.yml`** — **`pull_request`** + **`push` to `main`**; **`node:test`** only (no `npm ci`, ~1 s).
- Lighthouse: **`../.github/workflows/performance-smoke.yml`** — weekly cron + **`workflow_dispatch`**; **`--smoke --mobile-only`** + **`PERF_SAVE_HTML=true`** → download **`lighthouse-perf-*`** and open **`lighthouse-html/index.html`**. Desktop + mobile in CI: run **`npm run perf:lighthouse:smoke`** locally or extend the workflow when mobile budgets pass reliably.
- Locust load: **`../.github/workflows/performance-load-locust.yml`** — **`workflow_dispatch` only** (inputs: users, spawn rate, duration); **localhost-only** baked in — that is deliberate (primary regression signal).

To extend:

1. Add paths to **`config/smoke-paths.json`** — no runner code change needed.
2. Optional **preview/prod labelled runs:** fork a workflow or export `PERF_BASE_URL` / `LOCUST_HOST` — keep localhost **primary** unless product explicitly compares remote CDN paths.

## Near-term backlog (engineering)

_No layout changes unless accepted as a perf task._

1. **`lighthouse`** as a pinned `devDependency` at repo root → faster CI (`npx` cache still works but pinning reduces drift).
2. **Median runs in CI:** set `PERF_RUNS: 2` or `3` once runtime budget allows.
3. Locust **`--csv`** / Prometheus exporter for trend dashboards — optional enhancement under `performance-testing/load/`.
4. **Playwright “soft” timings** — optional alongside Lighthouse (`performance-testing/scripts/`).
5. **Alerts:** Slack/email on workflow failure → wire an action step after artifact upload.

## Related

- [`scripts/lighthouse-summer-camp.mjs`](../scripts/lighthouse-summer-camp.mjs) — single-route historical script (unchanged paths).
- Lighthouse **Best Practices** / Meta Pixel deprecations (`fbevents.js`) and a **no-Pixel/GTM lab baseline** build command: [`docs/performance-tests-status.md`](../docs/performance-tests-status.md) (subsection *Lighthouse Best Practices — “Uses deprecated APIs”*).

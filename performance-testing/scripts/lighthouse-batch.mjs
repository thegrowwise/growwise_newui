#!/usr/bin/env node
/**
 * Batch Lighthouse against a running Next server (use `next build` + `next start`).
 * Collects URLs from smoke list or from `/sitemap-pages.xml` + `/sitemap-blogs.xml`
 * (rewrites canonical host in <loc> to PERF_BASE_URL for local runs).
 *
 * Config: `performance-testing/config/smoke-paths.json` (when `--smoke`).
 * Run from repo root: `npm run perf:lighthouse:smoke` — see [`performance-testing/README.md`](../README.md).
 *
 * Budgets (median LCP per URL / form factor):
 *   Desktop: ≤ PERF_DESKTOP_MAX_LCP_MS (default 2000)
 *   Mobile:  ≤ PERF_MOBILE_MAX_LCP_MS (default 3000)
 *
 * Flags: --smoke  --runs=3  --base-url=...  --no-warmup
 *         --mobile-only | --desktop-only  (~half Lighthouse runs vs default both)
 *         PERF_FORM_FACTORS=mobile|desktop|both   PERF_SAVE_HTML / --save-html (HTML artifacts)
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseLighthouseBatchOptions } from './parseLighthouseBatchOptions.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** `performance-testing/` (parent of `scripts/`) */
const MODULE_ROOT = join(__dirname, '..');

const LIGHTHOUSE_PKG = 'lighthouse@13.0.2';

/** @typedef {'desktop' | 'mobile'} FormFactor */

/** Fallback when `config/smoke-paths.json` is missing or invalid */
const DEFAULT_SMOKE_PATHS = [
  '/',
  '/camps/summer',
  '/courses/math',
  '/coding',
  '/steam/ml-ai-coding',
  '/enroll',
  '/contact',
];

function loadSmokePaths() {
  const path = join(MODULE_ROOT, 'config', 'smoke-paths.json');
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    const paths = raw.paths;
    if (
      Array.isArray(paths) &&
      paths.length > 0 &&
      paths.every((p) => typeof p === 'string' && p.length > 0)
    ) {
      return paths;
    }
    console.warn(
      `[perf] Ignoring smoke-paths.json: expected non-empty paths[] at ${path}; using defaults.`,
    );
  } catch {
    console.warn(`[perf] Using default smoke paths (no readable ${path}).`);
  }
  return DEFAULT_SMOKE_PATHS;
}

const SMOKE_PATHS = loadSmokePaths();

/** @typedef {'both' | 'mobile' | 'desktop'} FormFactorMode */

/** @param {FormFactorMode} mode @returns {FormFactor[]} */
function formFactorsFromMode(mode) {
  if (mode === 'mobile') return ['mobile'];
  if (mode === 'desktop') return ['desktop'];
  return ['desktop', 'mobile'];
}

function printHelp() {
  console.log(`lighthouse-batch.mjs — batch LCP budgets (no UI changes; lab only)

Module: performance-testing/scripts/
Smoke paths file: performance-testing/config/smoke-paths.json (${SMOKE_PATHS.length} path(s))

Environment:
  PORT                        Default port for base URL (default 3000)
  PERF_BASE_URL               Override base (default http://127.0.0.1:$PORT)
  PERF_RUNS                   Default runs per URL per form factor (default 1)
  PERF_DESKTOP_MAX_LCP_MS     Desktop LCP cap in ms (default 2000)
  PERF_MOBILE_MAX_LCP_MS      Mobile LCP cap in ms (default 3000)
  PERF_OUT                    JSON summary path (default ./artifacts/lighthouse-batch-summary.json)
  PERF_FORM_FACTORS           both (default) | mobile | desktop — limit form factors without CLI flags
  PERF_SAVE_HTML              When 1/true/yes: keep Lighthouse HTML (+ JSON metrics) under PERF_HTML_REPORT_DIR
  PERF_HTML_REPORT_DIR        Directory for *.report.html (default ./artifacts/lighthouse-html)

Flags:
  --smoke       Smoke paths only (see config/smoke-paths.json) — not every sitemap URL; omit for full sitemap batch
  --runs=N      Median of N Lighthouse runs
  --base-url=   Same as PERF_BASE_URL
  --mobile-only Mobile emulation only (~half runtime; typical PR gate)
  --desktop-only Desktop emulation only (~half runtime)
  --save-html   Persist full Lighthouse HTML reports per run (for CI/debug; see PERF_HTML_* env)
  --html-report-dir=PATH  Output dir for HTML/JSON Lighthouse artifacts (--save-html implied)
  --no-warmup   Skip HTTP GET warm-up before Lighthouse
  --help        This text
`);
}

/** @param {number[]} values */
function median(values) {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Replay every row in logs/CI — individual `[OK]`/`[FAIL]` lines stream during the run;
 * this table is an at-a-glance recap (same data as summary JSON `rows`).
 * @param {Record<string, unknown>[]} rows
 */
function printAllResultsDetail(rows) {
  console.log(
    `\n━━━ Lighthouse batch — all URLs × form factors (${rows.length} row(s)) ━━━`,
  );
  console.log('| Status | Factor  | LCP (s) | Budget ms | Perf | Details |');
  console.log('|--------|---------|---------|-----------|------|---------|');
  for (const r of rows) {
    const status = r.ok === true ? 'PASS' : 'FAIL';
    const ff = String(r.formFactor ?? '—');
    const lcpMed =
      typeof r.lcpMsMedian === 'number' && Number.isFinite(r.lcpMsMedian)
        ? (r.lcpMsMedian / 1000).toFixed(2)
        : '—';
    const budget = typeof r.budgetMs === 'number' ? String(r.budgetMs) : '—';
    const perf = r.performanceScore != null ? String(r.performanceScore) : '—';
    const detail =
      typeof r.error === 'string'
        ? r.error
        : typeof r.lcpMsMedian === 'number' && typeof r.budgetMs === 'number'
          ? r.lcpMsMedian <= r.budgetMs
            ? 'within budget'
            : 'over budget'
          : '';
    const url = String(r.url ?? '');
    console.log(
      `| ${status.padEnd(6)} | ${ff.padEnd(7)} | ${lcpMed.padEnd(7)} | ${budget.padEnd(9)} | ${perf.padEnd(4)} | ${url}${detail ? ` — ${detail}` : ''} |`,
    );
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/** @param {string} xml */
function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const raw = m[1].trim();
    if (raw) locs.push(raw);
  }
  return locs;
}

/**
 * Sitemaps emit canonical absolute URLs; remap to the benchmark origin (e.g. localhost).
 * @param {string} loc
 * @param {string} baseUrl
 */
function rewriteLocToBase(loc, baseUrl) {
  try {
    const u = new URL(loc);
    const path = `${u.pathname}${u.search}${u.hash}`;
    if (path === '/') return baseUrl;
    return `${baseUrl}${path}`;
  } catch {
    return null;
  }
}

/**
 * @param {string} baseUrl
 * @returns {Promise<string[]>}
 */
async function collectUrlsFromSitemaps(baseUrl) {
  const paths = ['/sitemap-pages.xml', '/sitemap-blogs.xml'];
  const seen = new Set();
  const urls = [];

  for (const p of paths) {
    const res = await fetch(`${baseUrl}${p}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${p}: HTTP ${res.status}`);
    }
    const xml = await res.text();
    for (const loc of extractLocs(xml)) {
      const u = rewriteLocToBase(loc, baseUrl);
      if (u && !seen.has(u)) {
        seen.add(u);
        urls.push(u);
      }
    }
  }

  if (urls.length === 0) {
    throw new Error('No <loc> entries found in sitemaps');
  }
  return urls.sort();
}

/**
 * @param {string} url
 */
async function warmUpUrl(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    console.warn(`Warm-up: ${url} → HTTP ${res.status}`);
  }
}

/**
 * Stable filename fragment from URL pathname (for report basenames).
 * @param {string} urlStr
 */
function pathnameSlug(urlStr) {
  try {
    const p = new URL(urlStr).pathname;
    if (p === '/' || p === '') return 'home';
    const slug = p
      .replace(/^\/+|\/+$/g, '')
      .replace(/\//g, '__')
      .replace(/[^a-zA-Z0-9._-]/g, '-');
    const trimmed = slug.replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
    return (trimmed.slice(0, 72) || 'page').toLowerCase();
  } catch {
    return 'page';
  }
}

/**
 * @param {number[]} lcpsOrderedByRun Index aligns with parallel html paths array.
 * @returns {number} run index whose LCP is closest to median (for highlighting one HTML report).
 */
function indexNearestMedianRun(lcps) {
  const med = median(lcps.filter((x) => Number.isFinite(x)));
  if (!Number.isFinite(med)) return 0;
  let pick = 0;
  let best = Infinity;
  for (let i = 0; i < lcps.length; i += 1) {
    const v = lcps[i];
    if (!Number.isFinite(v)) continue;
    const d = Math.abs(v - med);
    if (d < best || (d === best && i < pick)) {
      best = d;
      pick = i;
    }
  }
  return pick;
}

/** @typedef {{ cwd: string; saveHtml?: boolean; reportDir?: string; slug: string }} LhOpts */

/**
 * @param {string} url
 * @param {FormFactor} formFactor
 * @param {LhOpts} ctx
 * @returns {{ report: Record<string, unknown>; htmlRelative: string | null } | null}
 */
function runLighthouseOnce(url, formFactor, ctx) {
  const { cwd, saveHtml, reportDir, slug } = ctx;

  const args = [
    '--yes',
    LIGHTHOUSE_PKG,
    url,
    '--only-categories=performance,accessibility',
    '--throttling-method=simulate',
    '--chrome-flags=--headless=new --no-sandbox',
    '--quiet',
  ];
  if (formFactor === 'mobile') args.push('--form-factor=mobile');
  else args.push('--preset=desktop');

  /** @type {string} where Lighthouse writes artifact(s) — extension rules differ by mode */
  let artifactBase;
  let jsonReadPaths = [];

  if (saveHtml && reportDir) {
    mkdirSync(reportDir, { recursive: true });
    artifactBase = join(reportDir, slug);
    jsonReadPaths.push(`${artifactBase}.report.json`, `${artifactBase}.json`);
    args.push('--output=json,html', `--output-path=${artifactBase}`);
  } else {
    const tmpJson = join(
      tmpdir(),
      `lh-batch-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
    );
    artifactBase = tmpJson;
    jsonReadPaths.push(tmpJson);
    args.push('--output=json', `--output-path=${tmpJson}`);
  }

  const r = spawnSync('npx', args, { stdio: 'pipe', encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout || 'Lighthouse failed');
    for (const pth of jsonReadPaths) {
      try {
        unlinkSync(pth);
      } catch {
        /* ignore */
      }
    }
    if (saveHtml && artifactBase && jsonReadPaths.length > 1) {
      try {
        unlinkSync(`${artifactBase}.report.html`);
      } catch {
        /* ignore */
      }
    }
    return null;
  }

  /** @type {string | undefined} picked */
  let jsonPath;
  let rawJson;
  for (const pth of jsonReadPaths) {
    try {
      rawJson = readFileSync(pth, 'utf8');
      jsonPath = pth;
      break;
    } catch {
      /* try next */
    }
  }
  if (!rawJson || !jsonPath) {
    console.error('Failed to locate Lighthouse JSON output beside', artifactBase);
    return null;
  }

  let report;
  try {
    report = JSON.parse(rawJson);
  } catch (e) {
    console.error('Failed to parse Lighthouse JSON', e);
    return null;
  } finally {
    try {
      unlinkSync(jsonPath);
    } catch {
      /* ignore */
    }
  }

  /** @type {string | null} */
  let htmlRelative = null;
  if (saveHtml && reportDir) {
    const htmlAbs = `${artifactBase}.report.html`;
    try {
      readFileSync(htmlAbs, 'utf8');
      htmlRelative = relative(cwd, htmlAbs).replace(/\\/g, '/');
    } catch {
      console.warn(`[perf] Expected HTML missing at ${htmlAbs} — continuing with JSON metrics only`);
    }
  }

  return { report, htmlRelative };
}

/**
 * @param {string} reportDirAbs
 */
function writeLighthouseReportsIndex(reportDirAbs) {
  try {
    const names = readdirSync(reportDirAbs)
      .filter((n) => n.endsWith('.report.html'))
      .sort();
    const items = names
      .map((name) => `<li><a href="${encodeURI(name)}">${name}</a></li>`)
      .join('\n');
    const html = `<!DOCTYPE html><html lang="en"><meta charset="utf-8"/><title>Lighthouse HTML reports</title>
<body style="font-family:system-ui,sans-serif">
<h1>Lighthouse HTML reports</h1>
<p>Open any link below (${names.length} file(s)); generated alongside <code>lighthouse-batch-summary.json</code>.</p>
<ul>${items || '<li><em>No .report.html files found</em></li>'}</ul>
</body></html>`;
    writeFileSync(join(reportDirAbs, 'index.html'), html, 'utf8');
    console.log(`[perf] Wrote report index → ${join(reportDirAbs, 'index.html')}`);
  } catch (e) {
    console.warn('[perf] Could not write index.html in report dir:', e);
  }
}

/** @param {Record<string, unknown>} report */
function readLcpMs(report) {
  const audits = /** @type {Record<string, { numericValue?: number }>} */ (
    report.audits ?? {}
  );
  const v = audits['largest-contentful-paint']?.numericValue;
  return typeof v === 'number' && Number.isFinite(v) ? v : NaN;
}

/** @param {Record<string, unknown>} report */
function readPerfScore(report) {
  const cat = /** @type {Record<string, { score?: number | null }>} */ (
    report.categories ?? {}
  );
  const s = cat.performance?.score;
  return typeof s === 'number' ? Math.round(s * 100) : null;
}

async function main() {
  const parsed = parseLighthouseBatchOptions(process.argv.slice(2), process.env);
  if (!parsed.ok) {
    console.error(parsed.error);
    process.exit(1);
  }
  if (parsed.help) {
    printHelp();
    process.exit(0);
  }

  const cwd = process.cwd();

  const opts = {
    smoke: parsed.smoke,
    runs: parsed.runs,
    baseUrl: parsed.baseUrl,
    warmup: parsed.warmup,
    desktopCap: parsed.desktopCap,
    mobileCap: parsed.mobileCap,
    outPath: parsed.outPath,
    formFactorMode: parsed.formFactorMode,
    saveHtml: parsed.saveHtml,
    htmlReportDir: parsed.htmlReportDir,
  };

  const formFactors = formFactorsFromMode(opts.formFactorMode);

  let urls;
  if (opts.smoke) {
    urls = SMOKE_PATHS.map((p) =>
      p === '/' ? opts.baseUrl : `${opts.baseUrl}${p.startsWith('/') ? p : `/${p}`}`,
    );
  } else {
    try {
      urls = await collectUrlsFromSitemaps(opts.baseUrl);
    } catch (e) {
      console.error(String(e));
      console.error(
        'Hint: start the app with `npm run start` and ensure sitemaps respond, or use --smoke.',
      );
      process.exit(1);
    }
  }

  console.log(
    `Lighthouse batch: ${urls.length} URL(s), ${opts.runs} run(s) each, factors=${formFactors.join(',')}`,
  );
  console.log(`Base: ${opts.baseUrl}`);
  const budgetLine = formFactors.includes('desktop')
    ? `desktop LCP ≤ ${opts.desktopCap} ms`
    : null;
  const budgetLineMobile = formFactors.includes('mobile')
    ? `mobile LCP ≤ ${opts.mobileCap} ms`
    : null;
  console.log(
    `Budgets: ${[budgetLine, budgetLineMobile].filter(Boolean).join('; ')} (mode=${opts.formFactorMode})`,
  );
  if (opts.saveHtml) {
    console.log(`HTML reports: ON → ${opts.htmlReportDir} (open index.html after the run)`);
  }

  /** @type {Array<Record<string, unknown>>} */
  const rows = [];
  /** @type {string[]} */
  const allSavedHtmlReports = [];
  let failed = 0;

  for (let iu = 0; iu < urls.length; iu += 1) {
    const url = urls[iu];
    if (opts.warmup) {
      await warmUpUrl(url);
    }

    const slugBase = pathnameSlug(url);

    for (const ff of formFactors) {
      const lcps = [];
      /** @type {(string | null)[]} */
      const htmlRelRuns = [];
      let lastReport = null;
      let lighthouseFailed = false;
      for (let i = 0; i < opts.runs; i += 1) {
        const slug = `u${iu}_${slugBase}_${ff}_r${i + 1}`;
        const lh = runLighthouseOnce(url, ff, {
          cwd,
          saveHtml: opts.saveHtml,
          reportDir: opts.saveHtml ? opts.htmlReportDir : undefined,
          slug,
        });
        if (!lh) {
          lighthouseFailed = true;
          break;
        }
        lastReport = lh.report;
        lcps.push(readLcpMs(lh.report));
        htmlRelRuns.push(lh.htmlRelative);
        if (lh.htmlRelative) allSavedHtmlReports.push(lh.htmlRelative);
      }

      if (lighthouseFailed) {
        failed += 1;
        rows.push({
          url,
          formFactor: ff,
          ok: false,
          error: 'lighthouse_failed',
          lcpMsMedian: null,
          performanceScore: null,
        });
        console.log(`[FAIL] ${ff.padEnd(7)} Lighthouse exited non-zero — ${url}`);
        continue;
      }

      const lcpMed = median(lcps.filter((x) => Number.isFinite(x)));
      const perfScore = readPerfScore(/** @type {Record<string, unknown>} */ (lastReport));
      const cap = ff === 'desktop' ? opts.desktopCap : opts.mobileCap;
      const ok = Number.isFinite(lcpMed) && lcpMed <= cap;
      if (!ok) failed += 1;

      const medRunIdx = indexNearestMedianRun(lcps);
      /** @type {string | null} */
      const medianHtmlRelative =
        htmlRelRuns.length > medRunIdx && htmlRelRuns[medRunIdx]
          ? /** @type {string} */ (htmlRelRuns[medRunIdx])
          : htmlRelRuns.find((x) => typeof x === 'string') ?? null;

      /** @type {Record<string, unknown>} */
      const rowEntry = {
        url,
        formFactor: ff,
        ok,
        lcpMsMedian: lcpMed,
        lcpMsRuns: lcps,
        performanceScore: perfScore,
        budgetMs: cap,
      };
      if (opts.saveHtml) {
        const htmlList = htmlRelRuns.filter((x) => typeof x === 'string' && x.length > 0);
        if (htmlList.length > 0) rowEntry.htmlReports = [...htmlList];
        if (medianHtmlRelative)
          rowEntry.medianHtmlReport = medianHtmlRelative;
      }

      rows.push(rowEntry);

      const status = ok ? 'OK' : 'FAIL';
      console.log(
        `[${status}] ${ff.padEnd(7)} LCP ${Number.isFinite(lcpMed) ? `${(lcpMed / 1000).toFixed(2)} s` : '—'} (cap ${cap} ms) — ${url}`,
      );
    }
  }

  printAllResultsDetail(rows);

  if (opts.saveHtml && allSavedHtmlReports.length > 0) {
    writeLighthouseReportsIndex(opts.htmlReportDir);
  }

  /** @type {string[] | undefined} */
  const savedDistinct = [...new Set(allSavedHtmlReports)].sort();

  /** @type {Record<string, unknown>} */
  const summary = {
    generatedAt: new Date().toISOString(),
    lighthouse: LIGHTHOUSE_PKG,
    baseUrl: opts.baseUrl,
    smoke: opts.smoke,
    formFactorMode: opts.formFactorMode,
    formFactors,
    runsPerUrl: opts.runs,
    saveHtml: opts.saveHtml,
    htmlReportRelativeDir:
      opts.saveHtml ? relative(cwd, opts.htmlReportDir).replace(/\\/g, '/') : null,
    savedHtmlReports: opts.saveHtml && savedDistinct.length > 0 ? savedDistinct : undefined,
    lighthouseHtmlIndexRelative:
      opts.saveHtml && savedDistinct.length > 0
        ? relative(cwd, join(opts.htmlReportDir, 'index.html')).replace(/\\/g, '/')
        : null,
    budgets: {
      desktopMaxLcpMs: opts.desktopCap,
      mobileMaxLcpMs: opts.mobileCap,
    },
    /** Every page URL audited (paths from smoke list or sitemaps — not “all routes” unless sitemap lists them). */
    urlsTested: urls,
    urlCount: urls.length,
    rowCount: rows.length,
    failedRows: failed,
    rows,
  };

  try {
    mkdirSync(dirname(opts.outPath), { recursive: true });
    writeFileSync(opts.outPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    const extra =
      opts.saveHtml && savedDistinct.length > 0
        ? ` HTML: ${summary.lighthouseHtmlIndexRelative} (+ ${savedDistinct.length} .report.html)`
        : '';
    console.log(`Wrote ${opts.outPath} (urlsTested + rows${extra})`);
  } catch (e) {
    console.error('Failed to write summary JSON', e);
    process.exit(1);
  }

  if (failed > 0) {
    console.error(`\n${failed} failing row(s). Adjust pages or raise budgets only with product approval.`);
    process.exit(1);
  }
  console.log('\nAll URLs passed LCP budgets.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * CLI + env parsing for lighthouse-batch.mjs (testable without running Lighthouse).
 */

import { join, resolve } from 'node:path';

/** @typedef {'both' | 'mobile' | 'desktop'} FormFactorMode */

/**
 * @typedef {{
 *   smoke: boolean;
 *   runs: number;
 *   baseUrl: string;
 *   warmup: boolean;
 *   help: boolean;
 *   desktopCap: number;
 *   mobileCap: number;
 *   outPath: string;
 *   formFactorMode: FormFactorMode;
 *   saveHtml: boolean;
 *   htmlReportDir: string;
 * }} LighthouseBatchOptions
 */

/** @param {string | undefined} v */
function envTruthy(v) {
  if (v == null || v === '') return false;
  return ['1', 'true', 'yes', 'on'].includes(v.trim().toLowerCase());
}

/**
 * @param {string[]} argv process.argv slice after script name
 * @param {Record<string, string | undefined>} env typically process.env
 * @param {{ cwd?: string }} [ctx] cwd for default PERF_OUT path (tests)
 * @returns {{ ok: true } & LighthouseBatchOptions | { ok: false, error: string }}
 */
export function parseLighthouseBatchOptions(argv, env, ctx = {}) {
  const cwd = ctx.cwd ?? process.cwd();

  let smoke = false;
  let runs = Number.parseInt(env.PERF_RUNS ?? '1', 10);
  if (!Number.isFinite(runs) || runs < 1) runs = 1;

  let baseUrl =
    env.PERF_BASE_URL?.replace(/\/$/, '') ||
    `http://127.0.0.1:${env.PORT || '3000'}`;
  let warmup = true;
  let help = false;

  /** @type {FormFactorMode} */
  let formFactorMode = 'both';
  const envFf = env.PERF_FORM_FACTORS?.trim().toLowerCase();
  if (envFf === 'mobile' || envFf === 'desktop') formFactorMode = envFf;

  let mobileOnlyFlag = false;
  let desktopOnlyFlag = false;

  let saveHtmlFlag = envTruthy(env.PERF_SAVE_HTML);
  /** When set via flag, implies saving HTML unless only env defined — optional dir override first */
  let htmlReportDir = env.PERF_HTML_REPORT_DIR?.trim()
    ? resolve(cwd, env.PERF_HTML_REPORT_DIR.trim())
    : join(cwd, 'artifacts', 'lighthouse-html');

  for (const a of argv) {
    if (a === '--smoke') smoke = true;
    else if (a === '--no-warmup') warmup = false;
    else if (a === '--help' || a === '-h') help = true;
    else if (a === '--save-html') saveHtmlFlag = true;
    else if (a === '--mobile-only') mobileOnlyFlag = true;
    else if (a === '--desktop-only') desktopOnlyFlag = true;
    else if (a.startsWith('--runs=')) {
      const n = Number.parseInt(a.slice('--runs='.length), 10);
      if (!Number.isFinite(n) || n < 1) {
        return { ok: false, error: 'Invalid --runs value' };
      }
      runs = n;
    } else if (a.startsWith('--base-url=')) {
      baseUrl = a.slice('--base-url='.length).replace(/\/$/, '');
    } else if (a.startsWith('--html-report-dir=')) {
      const raw = a.slice('--html-report-dir='.length).trim();
      if (!raw) return { ok: false, error: 'Empty --html-report-dir path' };
      htmlReportDir = resolve(cwd, raw);
      saveHtmlFlag = true;
    }
  }

  if (mobileOnlyFlag && desktopOnlyFlag) {
    return { ok: false, error: 'Use only one of --mobile-only or --desktop-only' };
  }
  if (mobileOnlyFlag) formFactorMode = 'mobile';
  if (desktopOnlyFlag) formFactorMode = 'desktop';

  const desktopCap = Number.parseInt(env.PERF_DESKTOP_MAX_LCP_MS ?? '2000', 10);
  const mobileCap = Number.parseInt(env.PERF_MOBILE_MAX_LCP_MS ?? '3000', 10);
  const outPath =
    env.PERF_OUT?.trim() || join(cwd, 'artifacts', 'lighthouse-batch-summary.json');

  return {
    ok: true,
    smoke,
    runs,
    baseUrl,
    warmup,
    help,
    desktopCap,
    mobileCap,
    outPath,
    formFactorMode,
    saveHtml: saveHtmlFlag,
    htmlReportDir,
  };
}

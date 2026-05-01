import assert from 'node:assert/strict';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseLighthouseBatchOptions } from './parseLighthouseBatchOptions.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURE_CWD = join(__dirname, '..', '..', 'tmp-perf-parse');

test('defaults: both factors, runs 1, localhost base', () => {
  const r = parseLighthouseBatchOptions([], {}, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'both');
  assert.equal(r.runs, 1);
  assert.equal(r.baseUrl, 'http://127.0.0.1:3000');
  assert.equal(r.help, false);
  assert.equal(r.smoke, false);
  assert.equal(r.warmup, true);
  assert.equal(r.saveHtml, false);
  assert.equal(r.htmlReportDir, join(FIXTURE_CWD, 'artifacts', 'lighthouse-html'));
});

test('PERF_SAVE_HTML=1 enables saveHtml', () => {
  const r = parseLighthouseBatchOptions([], { PERF_SAVE_HTML: 'yes' }, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.saveHtml, true);
});

test('--save-html enables HTML reports dir default', () => {
  const r = parseLighthouseBatchOptions(['--save-html'], {}, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.saveHtml, true);
});

test('--html-report-dir= implies saveHtml and resolves dir', () => {
  const r = parseLighthouseBatchOptions(
    ['--html-report-dir=staging/reports/lh-html'],
    {},
    { cwd: FIXTURE_CWD },
  );
  assert.equal(r.ok, true);
  assert.equal(r.saveHtml, true);
  assert.equal(r.htmlReportDir, resolve(FIXTURE_CWD, 'staging/reports/lh-html'));

  const invalid = parseLighthouseBatchOptions(['--html-report-dir='], {}, { cwd: FIXTURE_CWD });
  assert.equal(invalid.ok, false);
});

test('PERF_HTML_REPORT_DIR overrides dir', () => {
  const r = parseLighthouseBatchOptions(
    [],
    { PERF_SAVE_HTML: 'true', PERF_HTML_REPORT_DIR: 'custom-html-out' },
    { cwd: FIXTURE_CWD },
  );
  assert.equal(r.ok, true);
  assert.equal(r.saveHtml, true);
  assert.equal(r.htmlReportDir, resolve(FIXTURE_CWD, 'custom-html-out'));
});

test('PERF_FORM_FACTORS=mobile', () => {
  const r = parseLighthouseBatchOptions([], { PERF_FORM_FACTORS: 'mobile' }, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'mobile');
});

test('PERF_FORM_FACTORS=desktop (case-insensitive)', () => {
  const r = parseLighthouseBatchOptions([], { PERF_FORM_FACTORS: ' DESKTOP ' }, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'desktop');
});

test('invalid PERF_FORM_FACTORS falls back to both', () => {
  const r = parseLighthouseBatchOptions([], { PERF_FORM_FACTORS: 'tablet' }, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'both');
});

test('--mobile-only overrides PERF_FORM_FACTORS=desktop', () => {
  const r = parseLighthouseBatchOptions(
    ['--mobile-only'],
    { PERF_FORM_FACTORS: 'desktop' },
    { cwd: FIXTURE_CWD },
  );
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'mobile');
});

test('--desktop-only', () => {
  const r = parseLighthouseBatchOptions(['--desktop-only'], {}, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.formFactorMode, 'desktop');
});

test('mutual exclusion: --mobile-only and --desktop-only', () => {
  const r = parseLighthouseBatchOptions(['--mobile-only', '--desktop-only'], {}, {
    cwd: FIXTURE_CWD,
  });
  assert.equal(r.ok, false);
  assert.match(r.error, /--mobile-only or --desktop-only/);
});

test('invalid --runs', () => {
  const r = parseLighthouseBatchOptions(['--runs=0'], {}, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, false);
  assert.match(r.error, /Invalid --runs/);
});

test('--runs=3 and --smoke', () => {
  const r = parseLighthouseBatchOptions(['--smoke', '--runs=3'], {}, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.smoke, true);
  assert.equal(r.runs, 3);
});

test('PERF_BASE_URL strips trailing slash', () => {
  const r = parseLighthouseBatchOptions(
    [],
    { PERF_BASE_URL: 'http://example.com/' },
    { cwd: FIXTURE_CWD },
  );
  assert.equal(r.ok, true);
  assert.equal(r.baseUrl, 'http://example.com');
});

test('--base-url= overrides env', () => {
  const r = parseLighthouseBatchOptions(
    ['--base-url=http://override/'],
    { PERF_BASE_URL: 'http://ignored' },
    { cwd: FIXTURE_CWD },
  );
  assert.equal(r.ok, true);
  assert.equal(r.baseUrl, 'http://override');
});

test('PERF_OUT default path uses cwd', () => {
  const r = parseLighthouseBatchOptions([], {}, { cwd: '/tmp/gw-perf' });
  assert.equal(r.ok, true);
  assert.equal(r.outPath, '/tmp/gw-perf/artifacts/lighthouse-batch-summary.json');
});

test('PERF_RUNS coerces invalid to 1', () => {
  const r = parseLighthouseBatchOptions([], { PERF_RUNS: 'nope' }, { cwd: FIXTURE_CWD });
  assert.equal(r.ok, true);
  assert.equal(r.runs, 1);
});

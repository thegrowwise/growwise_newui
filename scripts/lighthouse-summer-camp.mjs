#!/usr/bin/env node
/**
 * Runs Lighthouse (mobile + default Slow 4G simulation) against a running prod server.
 * Updates the `<!-- LIGHTHOUSE_SNAPSHOT_START -->` … `END` block inside docs/summer-camp-2026-status.md.
 *
 * Usage: PORT=38479 npm run start  →  PORT=38479 npm run lighthouse:summer
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || '3000';
const url = process.env.LH_URL || `http://127.0.0.1:${port}/camps/summer`;
const out = join(tmpdir(), `lh-summer-${Date.now()}.json`);

const r = spawnSync(
  'npx',
  [
    '--yes',
    'lighthouse@13.0.2',
    url,
    '--only-categories=performance,accessibility',
    '--form-factor=mobile',
    '--throttling-method=simulate',
    '--output=json',
    `--output-path=${out}`,
    '--chrome-flags=--headless=new --no-sandbox',
    '--quiet',
  ],
  { stdio: 'inherit', encoding: 'utf8' }
);

if (r.status !== 0) {
  console.error('Lighthouse failed. Is the server running? Try: PORT=38477 npm run start');
  process.exit(r.status ?? 1);
}

const report = JSON.parse(readFileSync(out, 'utf8'));
try {
  unlinkSync(out);
} catch {
  /* ignore */
}

const a = report.audits;
const cat = report.categories;

const legacyLcp = a['largest-contentful-paint-element']?.details?.items?.[0]?.node;
const discoveryItems = a['lcp-discovery-insight']?.details?.items;
const discoveryNode = Array.isArray(discoveryItems)
  ? discoveryItems.find((x) => x && x.type === 'node')
  : null;
const lcpNode = legacyLcp ?? discoveryNode ?? null;
const lcpSelector = lcpNode?.selector ?? null;
const lcpSnippet = (lcpNode?.snippet ?? '').slice(0, 220) || null;
/** Human-readable LCP phases when Lighthouse exposes a string; avoids multi-KB JSON blobs. */
const lcpBreakdown =
  typeof a['lcp-breakdown-insight']?.displayValue === 'string'
    ? a['lcp-breakdown-insight'].displayValue
    : typeof a['lcp-breakdown']?.displayValue === 'string'
      ? a['lcp-breakdown'].displayValue
      : null;

const summary = {
  generatedAt: new Date().toISOString(),
  lighthouseVersion: report.lighthouseVersion,
  url: report.finalUrl,
  fetchTime: report.fetchTime,
  formFactor: report.configSettings?.formFactor,
  throttling: report.configSettings?.throttling,
  scores: {
    performance: Math.round((cat.performance?.score ?? 0) * 100),
    accessibility: Math.round((cat.accessibility?.score ?? 0) * 100),
  },
  metrics: {
    firstContentfulPaintMs: a['first-contentful-paint']?.numericValue,
    largestContentfulPaintMs: a['largest-contentful-paint']?.numericValue,
    totalBlockingTimeMs: a['total-blocking-time']?.numericValue,
    cumulativeLayoutShift: a['cumulative-layout-shift']?.numericValue,
    speedIndexMs: a['speed-index']?.numericValue,
  },
  lcp: {
    selector: lcpSelector,
    snippet: lcpSnippet,
    breakdown: lcpBreakdown ?? null,
  },
  colorContrastFailures:
    a['color-contrast']?.details?.items?.map((it) => ({
      selector: it.node?.selector,
      label: it.node?.nodeLabel,
      explanation: it.node?.explanation?.split('\n')[0] ?? null,
    })) ?? [],
  bfCache: {
    score: a['bf-cache']?.score,
    title: a['bf-cache']?.title,
    details: a['bf-cache']?.details?.items ?? a['bf-cache']?.details,
  },
  contrast: {
    score: a['color-contrast']?.score,
    title: a['color-contrast']?.title,
  },
};

const th = summary.throttling ?? {};
const md = `<!-- LIGHTHOUSE_SNAPSHOT_START -->
_Last updated: ${summary.generatedAt} (Lighthouse ${summary.lighthouseVersion})_

| Metric | Value |
|--------|-------|
| URL | \`${summary.url}\` |
| Performance | **${summary.scores.performance}** |
| Accessibility | **${summary.scores.accessibility}** |
| FCP | ${(summary.metrics.firstContentfulPaintMs / 1000).toFixed(2)} s |
| LCP | ${(summary.metrics.largestContentfulPaintMs / 1000).toFixed(2)} s |
| TBT | ${Math.round(summary.metrics.totalBlockingTimeMs)} ms |
| CLS | ${summary.metrics.cumulativeLayoutShift?.toFixed(3) ?? '—'} |
| Speed Index | ${(summary.metrics.speedIndexMs / 1000).toFixed(2)} s |
| Throttling | Slow 4G (RTT ${th.rttMs} ms, ~${th.throughputKbps} Kbps), CPU ×${th.cpuSlowdownMultiplier} |
| LCP element | \`${lcpSelector ?? '—'}\` |
| BFCache | ${summary.bfCache?.title ?? '—'} |
| Contrast audit | ${summary.contrast?.title ?? '—'} |

<details><summary>LCP snippet (truncated)</summary>

\`\`\`html
${(lcpSnippet ?? '—').replace(/`/g, "'")}
\`\`\`

</details>
<!-- LIGHTHOUSE_SNAPSHOT_END -->`;

const statusPath = join(__dirname, '../docs/summer-camp-2026-status.md');
let status = readFileSync(statusPath, 'utf8');
const start = '<!-- LIGHTHOUSE_SNAPSHOT_START -->';
const end = '<!-- LIGHTHOUSE_SNAPSHOT_END -->';
const si = status.indexOf(start);
const ei = status.indexOf(end);
if (si === -1 || ei === -1 || ei < si) {
  console.error('Markers not found in docs/summer-camp-2026-status.md:', start, end);
  process.exit(1);
}
status = status.slice(0, si) + md + status.slice(ei + end.length);
writeFileSync(statusPath, status);
console.log('Updated Lighthouse snapshot in', statusPath);

#!/usr/bin/env node
/**
 * SEO Daily Monitoring Script — growwiseschool.com
 * Run: node scripts/seo-monitor.mjs
 * Cron: 0 7 * * * /usr/bin/node /path/to/scripts/seo-monitor.mjs >> /var/log/seo-monitor.log 2>&1
 *
 * Catches regressions in: meta descriptions, H1s, OG tags, schema, sitemap, canonical, Core Web Vitals proxy
 * Outputs JSON report to seo-monitor-report.json + prints summary
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const REPORT_PATH = join(__dir, '..', 'seo-monitor-report.json')
const HISTORY_PATH = join(__dir, '..', 'seo-monitor-history.json')

const BASE = 'https://www.growwiseschool.org'
const NOTIFY_EMAIL = 'anshikaverma79@gmail.com' // Update with ops email

// Priority pages to monitor every day
const MONITOR_PAGES = [
  { path: '/', priority: 'critical' },
  { path: '/camps/summer', priority: 'critical' },
  { path: '/courses/math', priority: 'high' },
  { path: '/courses/english', priority: 'high' },
  { path: '/courses/sat-prep', priority: 'high' },
  { path: '/steam/ml-ai-coding', priority: 'high' },
  { path: '/steam/game-development', priority: 'high' },
  { path: '/academic', priority: 'high' },
  { path: '/enroll', priority: 'high' },
  { path: '/book-assessment', priority: 'high' },
  { path: '/about', priority: 'medium' },
  { path: '/contact', priority: 'medium' },
  { path: '/steam', priority: 'medium' },
  { path: '/camps', priority: 'medium' },
  { path: '/camps/winter', priority: 'medium' },
  { path: '/growwise-blogs', priority: 'low' },
  { path: '/workshop-calendar', priority: 'low' },
  { path: '/privacy-policy', priority: 'low' },
  { path: '/terms-conditions', priority: 'low' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fetchPage(path, timeout = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const start = Date.now()
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'User-Agent': 'GrowWise-SEO-Monitor/1.0' },
      signal: controller.signal,
      redirect: 'follow',
    })
    const html = await res.text()
    const ttfb = Date.now() - start
    return { res, html, ttfb, error: null }
  } catch (e) {
    return { res: null, html: '', ttfb: null, error: e.message }
  } finally {
    clearTimeout(timer)
  }
}

function getMeta(html, name) {
  const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']{1,300})["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,300})["'][^>]+name=["']${name}["']`, 'i'))
  return m ? m[1] : null
}

function getOg(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']{1,500})["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']{1,500})["'][^>]+property=["']og:${prop}["']`, 'i'))
  return m ? m[1] : null
}

function getCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
  return m ? m[1] : null
}

function getH1Count(html) {
  return (html.match(/<h1[\s>]/gi) || []).length
}

function getJsonLdTypes(html) {
  const schemas = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  const types = []
  schemas.forEach(m => {
    try {
      const s = JSON.parse(m[1])
      if (s['@type']) types.push(...[].concat(s['@type']))
      if (s['@graph']) s['@graph'].forEach(n => n['@type'] && types.push(...[].concat(n['@type'])))
    } catch { /* malformed JSON-LD */ }
  })
  return [...new Set(types)]
}

function checkPage(path, html, res, ttfb) {
  const issues = []
  const metrics = {}

  // Status
  metrics.status = res?.status || 0
  if (!res || !res.ok) issues.push({ type: 'error', code: 'HTTP_ERROR', msg: `HTTP ${metrics.status}` })

  // TTFB
  metrics.ttfb_ms = ttfb
  if (ttfb > 3000) issues.push({ type: 'warning', code: 'SLOW_TTFB', msg: `TTFB ${ttfb}ms (>3s)` })

  // Meta description
  const desc = getMeta(html, 'description')
  metrics.meta_desc_len = desc?.length || 0
  if (!desc) issues.push({ type: 'error', code: 'META_DESC_MISSING', msg: 'No meta description' })
  else if (desc.length < 120) issues.push({ type: 'warning', code: 'META_DESC_SHORT', msg: `Meta description too short (${desc.length} chars)` })
  else if (desc.length > 160) issues.push({ type: 'warning', code: 'META_DESC_LONG', msg: `Meta description too long (${desc.length} chars)` })

  // H1
  metrics.h1_count = getH1Count(html)
  if (metrics.h1_count === 0) issues.push({ type: 'error', code: 'H1_MISSING', msg: 'No H1 tag' })
  else if (metrics.h1_count > 1) issues.push({ type: 'warning', code: 'H1_MULTIPLE', msg: `${metrics.h1_count} H1 tags (expected 1)` })

  // Open Graph
  const ogTitle = getOg(html, 'title')
  const ogDesc = getOg(html, 'description')
  const ogImage = getOg(html, 'image')
  metrics.og = { title: !!ogTitle, description: !!ogDesc, image: !!ogImage }
  if (!ogTitle) issues.push({ type: 'error', code: 'OG_TITLE_MISSING', msg: 'og:title missing' })
  if (!ogDesc) issues.push({ type: 'error', code: 'OG_DESC_MISSING', msg: 'og:description missing' })
  if (!ogImage) issues.push({ type: 'error', code: 'OG_IMAGE_MISSING', msg: 'og:image missing' })

  // Canonical
  const canonical = getCanonical(html)
  metrics.canonical = canonical
  if (!canonical) issues.push({ type: 'warning', code: 'CANONICAL_MISSING', msg: 'No canonical tag' })
  else if (!canonical.includes('growwiseschool')) {
    issues.push({ type: 'warning', code: 'CANONICAL_EXTERNAL', msg: `Unusual canonical: ${canonical}` })
  }

  // Schema
  const schemaTypes = getJsonLdTypes(html)
  metrics.schema_types = schemaTypes
  if (schemaTypes.length === 0) issues.push({ type: 'warning', code: 'SCHEMA_MISSING', msg: 'No JSON-LD schema' })

  // noindex check
  const robots = getMeta(html, 'robots')
  metrics.robots = robots
  if (robots && robots.toLowerCase().includes('noindex')) {
    issues.push({ type: 'error', code: 'NOINDEX', msg: `Page is noindex (robots: ${robots})` })
  }

  return { issues, metrics }
}

// ─── Sitemap Check ────────────────────────────────────────────────────────────

async function checkSitemap() {
  const results = { ok: false, pages_count: 0, blogs_count: 0, issues: [] }
  const { res, html } = await fetchPage('/sitemap.xml')
  if (!res?.ok) { results.issues.push('sitemap.xml not accessible'); return results }
  results.ok = true

  for (const child of ['/sitemap-pages.xml', '/sitemap-blogs.xml']) {
    const { res: cr, html: cxml } = await fetchPage(child)
    if (!cr?.ok) { results.issues.push(`${child} not accessible`); continue }
    const count = (cxml.match(/<loc>/g) || []).length
    if (child.includes('pages')) results.pages_count = count
    if (child.includes('blogs')) results.blogs_count = count
  }
  return results
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const run_at = new Date().toISOString()
const report = { run_at, base: BASE, pages: {}, sitemap: {}, summary: {} }

console.log(`[${run_at}] GrowWise SEO Monitor starting…`)

// Run page checks
let total_issues = 0
let critical_issues = 0

for (const { path, priority } of MONITOR_PAGES) {
  const { res, html, ttfb, error } = await fetchPage(path)
  if (error) {
    report.pages[path] = { priority, error, issues: [{ type: 'error', code: 'FETCH_FAILED', msg: error }], metrics: {} }
    total_issues++; critical_issues++
    continue
  }
  const { issues, metrics } = checkPage(path, html, res, ttfb)
  report.pages[path] = { priority, issues, metrics }
  total_issues += issues.length
  if (priority === 'critical') critical_issues += issues.filter(i => i.type === 'error').length
  if (issues.length > 0) {
    console.log(`  [${priority.toUpperCase()}] ${path} — ${issues.length} issue(s)`)
    issues.forEach(i => console.log(`    ${i.type === 'error' ? '✗' : '⚠'} ${i.msg}`))
  }
}

// Sitemap check
report.sitemap = await checkSitemap()

// Summary
report.summary = {
  total_pages_checked: MONITOR_PAGES.length,
  total_issues,
  critical_issues,
  pages_with_issues: Object.values(report.pages).filter(p => p.issues?.length > 0).length,
  sitemap_pages: report.sitemap.pages_count,
  sitemap_blogs: report.sitemap.blogs_count,
  status: critical_issues === 0 ? 'HEALTHY' : 'DEGRADED',
}

// Save report
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
console.log(`\nReport saved to seo-monitor-report.json`)

// Append to history (keep last 90 days)
let history = []
if (existsSync(HISTORY_PATH)) {
  try { history = JSON.parse(readFileSync(HISTORY_PATH, 'utf8')) } catch {}
}
history.push({ date: run_at, summary: report.summary })
// Keep last 90 entries
history = history.slice(-90)
writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2))

// Final output
console.log(`\n── Summary ────────────────────────────`)
console.log(`Status:         ${report.summary.status}`)
console.log(`Pages checked:  ${report.summary.total_pages_checked}`)
console.log(`Total issues:   ${report.summary.total_issues}`)
console.log(`Critical:       ${report.summary.critical_issues}`)
console.log(`Sitemap pages:  ${report.summary.sitemap_pages}`)
console.log(`Sitemap blogs:  ${report.summary.sitemap_blogs}`)
console.log(`────────────────────────────────────────`)

if (critical_issues > 0) {
  console.error(`\nALERT: ${critical_issues} critical SEO issue(s) detected on ${run_at}`)
  console.error(`Notify: ${NOTIFY_EMAIL}`)
  process.exit(1)
} else {
  console.log('\nAll critical checks passed.')
  process.exit(0)
}

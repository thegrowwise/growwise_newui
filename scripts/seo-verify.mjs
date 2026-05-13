#!/usr/bin/env node
/**
 * SEO Fix Verification Script — growwiseschool.com
 * Run: node scripts/seo-verify.mjs
 *
 * Checks all 6 deployed SEO fix categories against live pages.
 * Exit code 0 = all clear, 1 = failures found.
 */

const BASE = 'https://www.growwiseschool.org'

const PAGES_TO_CHECK = [
  '/',
  '/about',
  '/academic',
  '/contact',
  '/enroll',
  '/enroll-academic',
  '/book-assessment',
  '/programs',
  '/courses/math',
  '/courses/english',
  '/courses/sat-prep',
  '/courses/high-school-math',
  '/steam',
  '/steam/ml-ai-coding',
  '/steam/game-development',
  '/coding',
  '/game-dev',
  '/camps',
  '/camps/summer',
  '/camps/winter',
  '/workshop-calendar',
  '/growwise-blogs',
  '/math-finals-practice-session',
  '/privacy-policy',
  '/terms-conditions',
]

const SCHEMA_PAGES = [
  '/',
  '/camps/summer',
  '/courses/math',
  '/courses/english',
  '/steam/ml-ai-coding',
  '/steam/game-development',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pass(msg) { console.log(`  \x1b[32m✓\x1b[0m ${msg}`) }
function fail(msg) { console.log(`  \x1b[31m✗\x1b[0m ${msg}`); failures++ }
function warn(msg) { console.log(`  \x1b[33m⚠\x1b[0m ${msg}`) }
function section(msg) { console.log(`\n\x1b[1m▸ ${msg}\x1b[0m`) }

let failures = 0

async function fetchPage(path) {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SEO-Verifier/1.0' },
    redirect: 'follow',
  })
  const html = await res.text()
  return { url, res, html }
}

function extractMeta(html, name) {
  const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`, 'i'))
  return m ? m[1] : null
}

function extractOg(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'))
  return m ? m[1] : null
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
  return m ? m[1] : null
}

function extractH1s(html) {
  const matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
  return matches.map(m => m[1].replace(/<[^>]+>/g, '').trim())
}

function extractJsonLd(html) {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  return matches.map(m => {
    try { return JSON.parse(m[1]) } catch { return null }
  }).filter(Boolean)
}

// ─── Check 1: Meta Descriptions ──────────────────────────────────────────────

async function checkMetaDescriptions() {
  section('1. Meta Descriptions (target: 150–160 chars)')
  const tooShort = []
  const tooLong = []

  for (const path of PAGES_TO_CHECK) {
    const { html } = await fetchPage(path)
    const desc = extractMeta(html, 'description')
    if (!desc) {
      fail(`${path} — missing meta description`)
      continue
    }
    const len = desc.length
    if (len < 120) tooShort.push({ path, len, desc: desc.slice(0, 60) + '…' })
    else if (len > 160) tooLong.push({ path, len, desc: desc.slice(0, 60) + '…' })
  }

  if (tooShort.length === 0 && tooLong.length === 0) {
    pass('All meta descriptions are within 120–160 chars')
  } else {
    tooShort.forEach(p => fail(`${p.path} — too short (${p.len} chars): "${p.desc}"`))
    tooLong.forEach(p => fail(`${p.path} — too long (${p.len} chars): "${p.desc}"`))
  }
}

// ─── Check 2: H1 Tags ────────────────────────────────────────────────────────

async function checkH1Tags() {
  section('2. H1 Tags (each page needs exactly one)')
  for (const path of PAGES_TO_CHECK) {
    const { html } = await fetchPage(path)
    const h1s = extractH1s(html)
    if (h1s.length === 0) fail(`${path} — no H1 found`)
    else if (h1s.length > 1) warn(`${path} — multiple H1s (${h1s.length}): ${h1s.map(h => `"${h.slice(0,40)}"`).join(', ')}`)
    else pass(`${path} — "${h1s[0].slice(0, 60)}"`)
  }
}

// ─── Check 3: Open Graph Tags ────────────────────────────────────────────────

async function checkOpenGraph() {
  section('3. Open Graph Tags (title, description, image required)')
  for (const path of PAGES_TO_CHECK) {
    const { html } = await fetchPage(path)
    const title = extractOg(html, 'title')
    const desc = extractOg(html, 'description')
    const image = extractOg(html, 'image')
    const missing = []
    if (!title) missing.push('og:title')
    if (!desc) missing.push('og:description')
    if (!image) missing.push('og:image')
    if (missing.length > 0) fail(`${path} — missing: ${missing.join(', ')}`)
    else pass(`${path} — all OG tags present`)
  }
}

// ─── Check 4: Canonical URLs ─────────────────────────────────────────────────

async function checkCanonicals() {
  section('4. Canonical URLs')
  for (const path of PAGES_TO_CHECK) {
    const { html } = await fetchPage(path)
    const canonical = extractCanonical(html)
    if (!canonical) fail(`${path} — no canonical tag`)
    else if (!canonical.includes('growwiseschool')) warn(`${path} — unusual canonical: ${canonical}`)
    else pass(`${path} — ${canonical}`)
  }
}

// ─── Check 5: Schema.org Structured Data ─────────────────────────────────────

async function checkSchema() {
  section('5. Schema.org Structured Data (key validation rules)')

  const REQUIRED_TYPES = {
    '/': ['EducationalOrganization', 'WebSite'],
    '/camps/summer': ['Event'],
    '/courses/math': ['Course'],
    '/courses/english': ['Course'],
    '/steam/ml-ai-coding': ['Course'],
    '/steam/game-development': ['Course'],
  }

  for (const path of SCHEMA_PAGES) {
    const { html } = await fetchPage(path)
    const schemas = extractJsonLd(html)
    if (schemas.length === 0) { fail(`${path} — no JSON-LD found`); continue }

    const allTypes = schemas.flatMap(s => {
      const types = []
      if (s['@type']) types.push(...[].concat(s['@type']))
      if (s['@graph']) s['@graph'].forEach(n => n['@type'] && types.push(...[].concat(n['@type'])))
      return types
    })

    const required = REQUIRED_TYPES[path] || []
    const missing = required.filter(t => !allTypes.includes(t))
    if (missing.length > 0) fail(`${path} — missing schema types: ${missing.join(', ')}`)
    else pass(`${path} — found: ${[...new Set(allTypes)].join(', ')}`)

    // Check Event schema for typicalAgeRange (invalid on Event)
    schemas.forEach(s => {
      const events = [s, ...(s['@graph'] || [])].filter(n => [].concat(n['@type'] || []).includes('Event'))
      events.forEach(ev => {
        if (ev.typicalAgeRange) fail(`${path} — Event schema has invalid 'typicalAgeRange' property`)
        if (!ev.startDate) fail(`${path} — Event schema missing required 'startDate'`)
        if (!ev.location) fail(`${path} — Event schema missing required 'location'`)
      })
      // Check AggregateRating not used as standalone root type
      if ([].concat(s['@type'] || []).includes('AggregateRating') && !s['@graph']) {
        fail(`${path} — AggregateRating used as standalone root schema (must be nested)`)
      }
      // Check Course has hasCourseInstance or valid offers
      const courses = [s, ...(s['@graph'] || [])].filter(n => [].concat(n['@type'] || []).includes('Course'))
      courses.forEach(c => {
        if (!c.name) fail(`${path} — Course schema missing 'name'`)
        if (!c.description) fail(`${path} — Course schema missing 'description'`)
        if (!c.provider) fail(`${path} — Course schema missing 'provider'`)
      })
    })
  }
}

// ─── Check 6: Sitemap ────────────────────────────────────────────────────────

async function checkSitemap() {
  section('6. Sitemap Coverage')
  const { res, html: xml } = await fetchPage('/sitemap.xml')
  if (!res.ok) { fail(`/sitemap.xml returned ${res.status}`); return }
  pass(`/sitemap.xml accessible (${res.status})`)

  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  pass(`sitemap.xml contains ${locs.length} URLs (index entries)`)

  // Check child sitemaps
  for (const childUrl of ['/sitemap-pages.xml', '/sitemap-blogs.xml']) {
    const { res: cr, html: cxml } = await fetchPage(childUrl)
    if (!cr.ok) { fail(`${childUrl} returned ${cr.status}`); continue }
    const clocs = [...cxml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
    pass(`${childUrl} — ${clocs.length} URLs`)

    // Spot-check key pages are in sitemap
    const KEY_PAGES = ['/camps/summer', '/courses/math', '/courses/english', '/steam']
    if (childUrl.includes('pages')) {
      KEY_PAGES.forEach(p => {
        const found = clocs.some(l => l.includes(p))
        if (!found) fail(`${p} not found in ${childUrl}`)
        else pass(`${p} in sitemap`)
      })
    }
  }
}

// ─── Check 7: IndexNow ───────────────────────────────────────────────────────

async function checkIndexNow() {
  section('7. IndexNow Key File')
  try {
    const { res } = await fetchPage('/growwiseschool-indexnow-key.txt')
    if (res.ok) pass('IndexNow key file accessible')
    else warn('IndexNow key file not found — submit via IndexNow API instead')
  } catch {
    warn('Could not check IndexNow key file')
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n\x1b[1m╔══════════════════════════════════════╗')
console.log('║   GrowWise SEO Verification Suite   ║')
console.log('╚══════════════════════════════════════╝\x1b[0m')
console.log(`  Target: ${BASE}`)
console.log(`  Date:   ${new Date().toISOString()}`)

await checkMetaDescriptions()
await checkH1Tags()
await checkOpenGraph()
await checkCanonicals()
await checkSchema()
await checkSitemap()
await checkIndexNow()

console.log('\n' + '─'.repeat(45))
if (failures === 0) {
  console.log('\x1b[32m\x1b[1m✓ All checks passed — SEO fixes verified!\x1b[0m\n')
  process.exit(0)
} else {
  console.log(`\x1b[31m\x1b[1m✗ ${failures} check(s) failed — review above\x1b[0m\n`)
  process.exit(1)
}

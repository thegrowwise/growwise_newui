#!/usr/bin/env node
/**
 * IndexNow Batch Submission Script — growwiseschool.com
 * Run: node scripts/indexnow-submit.mjs
 *
 * Submits all indexable pages to IndexNow (Bing, Yandex, IndexNow.org)
 * IndexNow also forwards to other participating engines automatically.
 *
 * SETUP:
 * 1. Get your key from https://www.bing.com/indexnow
 * 2. Create /public/<your-key>.txt with your key as content
 * 3. Set INDEXNOW_KEY env var: INDEXNOW_KEY=abc123 node scripts/indexnow-submit.mjs
 */

const HOST = 'www.growwiseschool.org'
const BASE = `https://${HOST}`
const KEY = process.env.INDEXNOW_KEY || 'YOUR_INDEXNOW_KEY_HERE'
const KEY_LOCATION = `${BASE}/${KEY}.txt`

// All indexable pages (matches sitemap)
const ALL_URLS = [
  // Core
  `${BASE}/`,
  `${BASE}/about`,
  `${BASE}/academic`,
  `${BASE}/contact`,
  `${BASE}/enroll`,
  `${BASE}/enroll-academic`,
  `${BASE}/book-assessment`,
  `${BASE}/programs`,
  `${BASE}/math-finals-practice-session`,
  `${BASE}/workshop-calendar`,

  // Courses
  `${BASE}/courses/math`,
  `${BASE}/courses/english`,
  `${BASE}/courses/sat-prep`,
  `${BASE}/courses/high-school-math`,

  // STEAM
  `${BASE}/steam`,
  `${BASE}/steam/ml-ai-coding`,
  `${BASE}/steam/game-development`,
  `${BASE}/coding`,
  `${BASE}/game-dev`,

  // Camps
  `${BASE}/camps`,
  `${BASE}/camps/summer`,
  `${BASE}/camps/winter`,
  `${BASE}/camps/winter/calendar`,

  // Blog index + posts
  `${BASE}/growwise-blogs`,
  `${BASE}/growwise-blogs/high-school-math-finals-prep-dublin-tri-valley`,
  `${BASE}/growwise-blogs/embrace-the-future-of-technology-advance-your-coding-expertise-with-growwise`,
  `${BASE}/growwise-blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era`,
  `${BASE}/growwise-blogs/how-coding-skills-empower-you-to-shape-tomorrows-ai-innovations`,
  `${BASE}/growwise-blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities`,
  `${BASE}/growwise-blogs/how-to-choose-the-right-summer-camp-for-your-child-a-parents-guide`,
  `${BASE}/growwise-blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux`,
  `${BASE}/growwise-blogs/how-to-identify-learning-gaps-in-your-childs-education-at-home-parent-guide`,
  `${BASE}/growwise-blogs/improve-child-focus-feel-valued`,
  `${BASE}/growwise-blogs/technical-schools-in-2025-a-smart-investment-for-your-career`,
  `${BASE}/growwise-blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child`,
  `${BASE}/growwise-blogs/the-importance-of-coding-for-kids-building-future-ready-skills`,
  `${BASE}/growwise-blogs/thinking-gap-your-kids-arent-distracted`,
  `${BASE}/growwise-blogs/unlock-your-future-the-best-programming-languages-for-career-advancement`,
  `${BASE}/growwise-blogs/unlocking-confidence-independence-and-fun-through-summer-camp`,
  `${BASE}/growwise-blogs/us-kids-falling-behind-math-english-parent-assessments`,
  `${BASE}/growwise-blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile`,
  `${BASE}/growwise-blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers`,
]

// IndexNow endpoints (each independently indexes; IndexNow.org relays to all members)
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
]

async function submitBatch(endpoint, urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  console.log(`\nSubmitting ${urls.length} URLs to ${endpoint}…`)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  if (res.ok || res.status === 202) {
    console.log(`  ✓ Accepted (${res.status})`)
  } else if (res.status === 422) {
    console.log(`  ⚠ Invalid URLs in submission (422) — check urlList for non-indexable URLs`)
  } else if (res.status === 429) {
    console.log(`  ⚠ Rate limited (429) — retry in 24h`)
  } else {
    console.log(`  ✗ Failed (${res.status}): ${text.slice(0, 200)}`)
  }
  return res.status
}

// Validate key is set
if (KEY === 'YOUR_INDEXNOW_KEY_HERE') {
  console.error('ERROR: Set INDEXNOW_KEY env var first.')
  console.error('  INDEXNOW_KEY=abc123 node scripts/indexnow-submit.mjs')
  process.exit(1)
}

console.log('IndexNow Batch Submission — growwiseschool.com')
console.log(`Key location: ${KEY_LOCATION}`)
console.log(`Total URLs:   ${ALL_URLS.length}`)

// Submit in batches of 10000 (IndexNow limit)
const BATCH_SIZE = 10000
for (let i = 0; i < ALL_URLS.length; i += BATCH_SIZE) {
  const batch = ALL_URLS.slice(i, i + BATCH_SIZE)
  for (const endpoint of ENDPOINTS) {
    await submitBatch(endpoint, batch)
    // Brief pause between endpoints
    await new Promise(r => setTimeout(r, 500))
  }
}

console.log('\nDone. Check Bing Webmaster Tools for indexing status in 24–48h.')

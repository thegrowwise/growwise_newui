# Ahrefs Re-Crawl & Issue Tracking — growwiseschool.com

## Current Baseline (Pre-Fix)

| Metric | Before Fix | Target |
|--------|-----------|--------|
| Health Score | 99 | 100 |
| Errors | 1 | 0 |
| Warnings | 14 | 0–2 |
| Notices | 68 | <20 |
| Schema errors | 67 | 0 |
| Pages not in sitemap | 46 | 0 |
| OG tags incomplete | 5 | 0 |
| H1 missing/empty | 4 | 0 |
| Meta desc too short | 2 | 0 |
| Meta desc too long | 2 | 0 |
| Canonical no inlinks | 1 | 0 |
| 3XX redirects | 1 | 0 |
| One dofollow inlink | 25 | <5 |

---

## Ahrefs Re-Crawl Instructions

### Step 1: Force a Full Re-Crawl (Immediate)

1. Log into **Ahrefs** → **Site Audit**
2. Select project: `growwiseschool.com`
3. Top right → **Settings** → **Crawl settings**
4. Set crawl frequency to **On demand** temporarily
5. Click **Start new crawl** (or wait for next scheduled crawl)
6. Ahrefs typically takes 1–4 hours for a site this size

### Step 2: After Crawl Completes

Compare these specific reports against the baseline above:

**Issues to verify CLOSED:**

| Ahrefs Issue | Where to Check | Expected Result |
|-------------|----------------|-----------------|
| Schema validation errors | All Issues → Notices → "Structured data has schema.org validation error" | 0 (was 67) |
| Indexable page not in sitemap | All Issues → Notices → "Indexable page not in sitemap" | 0 (was 46) |
| OG tags incomplete | All Issues → Warnings → "Open Graph tags incomplete" | 0 (was 5) |
| H1 missing | All Issues → Warnings → "H1 tag missing or empty" | 0 (was 4) |
| Meta desc short | All Issues → Warnings → "Meta description too short" | 0 (was 2) |
| Meta desc long | All Issues → Warnings → "Meta description too long" | 0 (was 2) |
| Canonical no inlinks | All Issues → Errors → "Canonical URL has no incoming internal links" | 0 (was 1) |

**Issues to monitor for improvement:**

| Ahrefs Issue | Current | 30-day Target |
|-------------|---------|--------------|
| Pages to submit to IndexNow | 46 | 0 (after submission) |
| One dofollow inlink only | 25 | <10 |
| 3XX redirects | 1 | 0 |

### Step 3: Configure Recurring Crawls

1. Ahrefs Site Audit → **Settings** → **Crawl schedule**
2. Set to: **Weekly** (every Monday 8am PT)
3. Alerts → Enable email alerts for:
   - Health score drops by >2 points
   - New errors appear
   - 4xx/5xx errors detected

### Step 4: Track Over Time

Use the Ahrefs **Progress** tab to track improvement:
- Site Audit → **Progress** tab shows health score trend
- Export comparison report: Old crawl vs New crawl → "New Issues" / "Fixed Issues"

---

## Issue-by-Issue Re-Crawl Verification

### Schema.org Errors (67 → target 0)

In Ahrefs after re-crawl:
1. All Issues → filter "Notices" → search "schema"
2. Click "View" on any remaining schema errors
3. Check the URLs listed — all should show 0 errors
4. If errors remain, use schema.org validator on the specific URL to identify exact property

**Known fixes deployed:**
- Removed `typicalAgeRange` from Event schemas (was invalid on Event type)
- Fixed `areaServed` on Course schemas (removed — not a valid Course property)
- Fixed `numberOfEmployees.value` (was string, now number)
- Fixed standalone `AggregateRating` (now nested in LocalBusiness)

### Sitemap Coverage (46 → target 0)

1. All Issues → Notices → "Indexable page not in sitemap"
2. Click View — list all 46 URLs
3. Verify each now appears in `/sitemap-pages.xml` or `/sitemap-blogs.xml`
4. Any new pages added after deployment? → Add to `sitemapData.ts`

**Missing pages that were added to sitemap:**
- `/coding` (was missing)
- `/game-dev` (was missing)
- `/privacy-policy` (was missing)
- `/terms-conditions` (was missing)
- Camp landing pages (dynamic slugs)

### Open Graph (5 → target 0)

1. All Issues → Warnings → "Open Graph tags incomplete"
2. URLs flagged = pages missing og:image, og:title, or og:description
3. All core pages now have full OG via Next.js metadata API
4. Camp pages now have camp-specific OG images

### H1 Tags (4 → target 0)

1. All Issues → Warnings → "H1 tag missing or empty"
2. Click View → verify 0 pages listed
3. Pages fixed: `/about`, `/contact`, `/game-dev`, `/workshop-calendar` (or whichever 4 Ahrefs flagged)

### Canonical Inlinks (1 → target 0)

1. All Issues → Errors → "Canonical URL has no incoming internal links"
2. Should show 0 URLs
3. The canonical page now has ≥3 internal links pointing to it

---

## Re-Crawl Schedule & Expectations

| Timeline | What to Check | Expected Change |
|----------|--------------|-----------------|
| Day 1–2 | Run `seo-verify.mjs` | All local checks pass |
| Day 2–3 | Ahrefs re-crawl | Errors drop to 0, warnings drop to <5 |
| Day 3–7 | GSC Coverage | Sitemap pages indexed count increases |
| Week 2 | GSC Performance | Impressions increase for fixed pages |
| Week 3–4 | Ahrefs Rank Tracker | Rankings stabilize or improve |
| Day 30 | Full Ahrefs report | Health Score 100, notices <20 |

---

## Setting Up Ahrefs Alerts

1. Ahrefs → **Alerts** → **Site Audit**
2. Add alert for project `growwiseschool.com`:
   - Trigger: Health score < 97
   - Trigger: New errors > 0
   - Frequency: Weekly email
3. Email: anshikaverma79@gmail.com

---

## If Issues Persist After Re-Crawl

**Schema errors still showing:**
- Go to that specific URL in Ahrefs → "Issues" tab
- Check exact error message (property name or value issue)
- Validate at https://validator.schema.org/ for specifics

**Pages still not in sitemap:**
- Verify the page is not behind auth (`/student-login` is intentionally excluded)
- Check if page has `noindex` in robots meta — Ahrefs won't add noindex pages
- Check sitemap route handler returns the URL in correct format

**OG tags still flagged:**
- Fetch the raw HTML: `curl -s https://www.growwiseschool.org/page | grep og:`
- Verify `og:image` URL is absolute (not relative)
- Verify image dimensions ≥ 1200×630 (Ahrefs checks this)

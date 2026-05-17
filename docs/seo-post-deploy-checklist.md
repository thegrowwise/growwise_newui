# SEO Post-Deploy Action Checklist — growwiseschool.com
**Deployed fixes:** Sitemap, Schema.org, Meta descriptions, H1 tags, OG tags, Canonical links  
**Health Score before:** 99 (1 error, 14 warnings, 68 notices)

---

## 1. Verify Fixes (Run First)

```bash
# Run automated verification against live site
node scripts/seo-verify.mjs

# Expected: 0 failures
# If failures remain, fix before proceeding to submissions
```

---

## 2. Google Search Console Actions

### A. Submit Updated Sitemap

1. Go to **Search Console** → select `growwiseschool.org`
2. Left sidebar → **Sitemaps**
3. Remove any old sitemap entries if present
4. Add each sitemap URL and click Submit:
   - `https://www.growwiseschool.org/sitemap.xml`
   - `https://www.growwiseschool.org/sitemap-pages.xml`
   - `https://www.growwiseschool.org/sitemap-blogs.xml`
5. **Expected response:** "Success" with URL count shown
6. Monitor "Discovered URLs" vs "Indexed URLs" — should close within 2–4 weeks

### B. Request Indexing for Priority Pages

Use **URL Inspection Tool** for each high-value page in this order:

| Priority | URL | Action |
|----------|-----|--------|
| 1 | `https://www.growwiseschool.org/camps/summer` | Inspect → Request Indexing |
| 2 | `https://www.growwiseschool.org/` | Inspect → Request Indexing |
| 3 | `https://www.growwiseschool.org/courses/math` | Inspect → Request Indexing |
| 4 | `https://www.growwiseschool.org/courses/english` | Inspect → Request Indexing |
| 5 | `https://www.growwiseschool.org/courses/sat-prep` | Inspect → Request Indexing |
| 6 | `https://www.growwiseschool.org/steam/ml-ai-coding` | Inspect → Request Indexing |
| 7 | `https://www.growwiseschool.org/steam/game-development` | Inspect → Request Indexing |
| 8 | `https://www.growwiseschool.org/academic` | Inspect → Request Indexing |
| 9 | `https://www.growwiseschool.org/enroll` | Inspect → Request Indexing |
| 10 | `https://www.growwiseschool.org/book-assessment` | Inspect → Request Indexing |

> GSC allows ~10 indexing requests per day. Do top 10 today, rest tomorrow.

### C. Validate Schema with Rich Results Test

1. Go to: https://search.google.com/test/rich-results
2. Test these URLs for schema errors:
   - `https://www.growwiseschool.org/` → expect: EducationalOrganization, WebSite
   - `https://www.growwiseschool.org/camps/summer` → expect: Event, BreadcrumbList
   - `https://www.growwiseschool.org/courses/math` → expect: Course
3. Zero errors = success. Fix any remaining warnings in schema files.

### D. Check Core Web Vitals

1. GSC → **Core Web Vitals** report
2. Check "Mobile" and "Desktop" tabs
3. Target: LCP < 2.5s, INP < 200ms, CLS < 0.1
4. If issues flagged, run: `node scripts/lighthouse-summer-camp.mjs`

### E. Monitor Coverage Report

1. GSC → **Pages** (formerly Coverage)
2. Check "Error" and "Excluded" tabs
3. Expected fixes visible within 3–7 days:
   - `Canonical URL has no incoming internal links` → should drop to 0
   - `Duplicate, Google chose different canonical` → should reduce
4. Watch for new errors introduced by deployment

---

## 3. IndexNow Submission

```bash
# Set your IndexNow key (get from Bing Webmaster Tools)
INDEXNOW_KEY=your_key_here node scripts/indexnow-submit.mjs
```

**To get your IndexNow key:**
1. Go to https://www.bing.com/webmasters
2. Add site → **IndexNow** section → Generate key
3. Download key file → place in `/public/<key>.txt`
4. Run the submit script above

**What happens after submission:**
- Bing: crawls within hours
- Google: not directly via IndexNow, but Google monitors Bing's index signals
- Check Bing Webmaster Tools → URLs → Submitted URLs for status

---

## 4. Bing Webmaster Tools

1. Verify site at https://www.bing.com/webmasters if not already done
2. Submit sitemap: `https://www.growwiseschool.org/sitemap.xml`
3. Check **SEO Reports** → Site Scan after 48h
4. Fix any Bing-specific issues (often mirrors GSC issues)

---

## 5. Schema.org Validation (Google's Structured Data Testing Tool)

Test each schema type after deployment:

```
https://validator.schema.org/
```

Paste the full page URL and check for:
- [ ] EducationalOrganization — no errors on `/`
- [ ] LocalBusiness — no errors on `/`
- [ ] Event — no `typicalAgeRange` error on `/camps/summer`
- [ ] Course — no `areaServed` error on course pages
- [ ] FAQPage — validates on pages with FAQs
- [ ] BreadcrumbList — validates on all pages with breadcrumbs
- [ ] Article — validates on blog post pages

---

## 6. 3XX Redirect Check

Ahrefs flagged 1 redirect warning. Find and fix:

1. GSC → Pages → Excluded → "Redirect"
2. Or run: `curl -sI https://www.growwiseschool.org/<suspect-path> | grep -i location`
3. Common culprit: trailing slash redirects (`/camps/summer` → `/camps/summer/`)
4. Fix by ensuring internal links match the canonical URL exactly (no trailing slash difference)

---

## Completion Checklist

- [ ] `node scripts/seo-verify.mjs` passes with 0 failures
- [ ] Sitemap submitted to GSC (3 URLs)
- [ ] Top 10 priority pages requested for indexing in GSC
- [ ] Rich Results Test passes for `/`, `/camps/summer`, `/courses/math`
- [ ] IndexNow submission script run with valid key
- [ ] Bing Webmaster sitemap submitted
- [ ] schema.org validator shows 0 errors on key pages
- [ ] 3XX redirect root cause identified and fixed
- [ ] Daily monitor cron job scheduled (see below)

### Schedule Daily Monitor

```bash
# Add to crontab: crontab -e
# Run at 7am every day, log output
0 7 * * * /usr/bin/node /path/to/growwise_newui/scripts/seo-monitor.mjs >> /var/log/growwise-seo.log 2>&1
```

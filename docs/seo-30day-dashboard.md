# 30-Day SEO Monitoring Dashboard — growwiseschool.com
**Fix deploy date:** 2026-05-12  
**Review dates:** Weekly check-ins + day-30 full audit

---

## Week 1 (May 12–18): Verify & Submit

### Daily Actions
- [ ] Run `node scripts/seo-verify.mjs` — target 0 failures
- [ ] Check GSC for crawl errors (new 4xx, 5xx)

### Week 1 Milestones
- [ ] Ahrefs errors: **1 → 0**
- [ ] Ahrefs warnings: **14 → ≤5**
- [ ] Schema errors: **67 → 0**
- [ ] Sitemap submitted to GSC + Bing
- [ ] IndexNow submission run: `INDEXNOW_KEY=xxx node scripts/indexnow-submit.mjs`
- [ ] Rich Results Test passes for `/`, `/camps/summer`, `/courses/math`

### Week 1 Metrics to Record

| Metric | May 12 (Baseline) | May 18 |
|--------|------------------|--------|
| Ahrefs Health Score | 99 | |
| Ahrefs Errors | 1 | |
| Ahrefs Warnings | 14 | |
| Ahrefs Notices | 68 | |
| GSC: Total indexed pages | _record today_ | |
| GSC: Pages with coverage errors | _record today_ | |
| GSC: Total impressions (28d) | _record today_ | |
| GSC: Total clicks (28d) | _record today_ | |

---

## Week 2 (May 19–25): Index Pickup

### Focus: Watch for Googlebot crawling the fixed pages

### Week 2 Milestones
- [ ] GSC indexed pages: increased by ≥10 from baseline
- [ ] `/camps/summer` showing in GSC URL Inspection as "Indexed"
- [ ] GSC Core Web Vitals: no new poor URLs
- [ ] Ahrefs: "Pages to submit to IndexNow" → 0

### Week 2 Metrics to Record

| Metric | May 18 | May 25 |
|--------|--------|--------|
| Ahrefs Health Score | | |
| GSC: Total indexed pages | | |
| GSC: Impressions (7d) | | |
| GSC: Clicks (7d) | | |
| GSC: Avg position (7d) | | |
| /camps/summer impressions | | |
| /courses/math impressions | | |
| /courses/english impressions | | |

### Week 2 Checks
```bash
# Check if Googlebot has crawled key pages recently
# GSC → URL Inspection → paste URL → check "Last crawl" date

Pages to inspect:
- https://www.growwiseschool.org/camps/summer
- https://www.growwiseschool.org/courses/math
- https://www.growwiseschool.org/about
- https://www.growwiseschool.org/steam/ml-ai-coding
```

---

## Week 3 (May 26 – Jun 1): Ranking Signals

### Focus: Check if ranking improvements visible for target keywords

### Target Keywords to Track

| Keyword | Current Position | Week 3 | Week 4 (Target) |
|---------|-----------------|--------|-----------------|
| summer camp Dublin CA | _record_ | | Top 5 |
| math tutoring Dublin CA | _record_ | | Top 5 |
| coding classes kids Dublin | _record_ | | Top 10 |
| AI coding for kids Dublin | _record_ | | Top 10 |
| SAT prep Dublin CA | _record_ | | Top 10 |
| game development kids Dublin | _record_ | | Top 10 |
| STEAM programs Dublin CA | _record_ | | Top 10 |
| tutoring Dublin CA | _record_ | | Top 10 |

> Track in: Ahrefs Rank Tracker or GSC Performance → Search type: Web → filter by query

### Week 3 Milestones
- [ ] "One dofollow inlink" pages: **25 → ≤15** (internal linking improvements)
- [ ] Blog pages indexed and showing impressions in GSC
- [ ] No new Ahrefs warnings appeared
- [ ] Core Web Vitals report: all pages "Good"

### Week 3 Metrics

| Metric | May 25 | Jun 1 |
|--------|--------|-------|
| Ahrefs Health Score | | |
| Ahrefs Warnings | | |
| GSC: Impressions (7d) | | |
| GSC: Clicks (7d) | | |
| GSC: Avg position (7d) | | |
| Target keyword avg position | | |

---

## Week 4 (Jun 2–8): Full Audit

### Focus: Complete 30-day assessment, plan next improvements

### Week 4 Milestones
- [ ] Ahrefs full re-crawl completed → export report
- [ ] Health Score: target **100**
- [ ] Errors: target **0**
- [ ] Warnings: target **≤2**
- [ ] Notices: target **<20**
- [ ] GSC impressions up ≥20% from baseline
- [ ] GSC clicks up ≥15% from baseline
- [ ] Local SEO: Verify Google Business Profile is linked to site

### 30-Day Final Metrics

| Metric | May 12 | Jun 8 | Change |
|--------|--------|-------|--------|
| Ahrefs Health Score | 99 | | |
| Ahrefs Errors | 1 | | |
| Ahrefs Warnings | 14 | | |
| Ahrefs Notices | 68 | | |
| Schema errors | 67 | | |
| OG incomplete | 5 | | |
| H1 missing | 4 | | |
| Pages not in sitemap | 46 | | |
| Canonical no inlinks | 1 | | |
| GSC: Indexed pages | | | |
| GSC: Impressions (28d) | | | |
| GSC: Clicks (28d) | | | |
| GSC: Avg position (28d) | | | |
| /camps/summer clicks | | | |
| /courses/math clicks | | | |

---

## Automated Monitoring Setup

### Daily Script (already created)
```bash
# Schedule in crontab
crontab -e

# Add line (adjust path):
0 7 * * * /usr/bin/node /home/user/growwise_newui/scripts/seo-monitor.mjs >> /var/log/growwise-seo.log 2>&1
```

### Check Monitor History
```bash
# View last 7 days of monitor summaries
node -e "
const h = JSON.parse(require('fs').readFileSync('seo-monitor-history.json'));
h.slice(-7).forEach(e => console.log(e.date.slice(0,10), e.summary.status, 'issues:', e.summary.total_issues));
"
```

### Weekly Ahrefs Email Report
- Ahrefs → Site Audit → Settings → Email reports → Weekly
- Recipient: anshikaverma79@gmail.com
- Include: Health score, new issues, fixed issues

---

## Red Flags — Act Immediately If:

| Signal | Threshold | Action |
|--------|-----------|--------|
| Ahrefs Health Score drops | < 95 | Run seo-verify.mjs, check recent deploys |
| GSC Coverage errors spike | +10 new errors | Check deploy logs, roll back if needed |
| GSC Impressions drop | > 20% week-over-week | Check GSC Manual Actions, check robots.txt |
| Monitor script exits 1 | Any critical issue | Fix within 24h |
| New schema validation errors | Any | Validate schema at schema.org/validator |
| noindex deployed to key pages | Any | Immediately remove from robots meta |

---

## Next SEO Priorities (Post 30-Day)

Based on remaining notices and growth opportunities:

1. **Internal linking** — 25 pages with only 1 dofollow inlink. Create a linking strategy:
   - Blog posts link to course pages
   - Course pages cross-link each other
   - Footer navigation includes all major pages

2. **Camp landing pages** — Each camp slug needs unique meta + H1 + schema

3. **Image alt text** — Audit all `<img>` and `<Image>` tags for descriptive alt text

4. **Blog frequency** — Currently 18 posts. Target 2/month minimum for authority

5. **Local citations** — Ensure NAP (Name, Address, Phone) consistent across:
   - Google Business Profile
   - Yelp
   - Facebook
   - Bing Places

6. **Page speed** — Run Lighthouse monthly: `node scripts/lighthouse-summer-camp.mjs`

7. **Backlink outreach** — Target local Dublin/Tri-Valley parent blogs and school directories

/**
 * Shared sitemap data + XML helpers consumed by the sitemap index and child
 * sitemap route handlers (`src/app/sitemap*.xml/route.ts`).
 *
 * We split into two child sitemaps so Google can segment crawl/lastmod
 * tracking per content type:
 *   - `/sitemap-pages.xml`  — core site (home, academic, courses, STEAM, camps)
 *   - `/sitemap-blogs.xml`  — blog posts only
 * Index at `/sitemap.xml` references both.
 */

import { locales } from '@/i18n/config'
import { DEFAULT_LOCALE } from '@/i18n/localeConfig'
import { getCampSlugs } from '@/lib/camps/get-camp-page'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export type ChangeFreq =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export interface SitemapEntry {
  path: string
  priority: number
  changefreq: ChangeFreq
  /** When the entry was last meaningfully updated (ISO string). */
  lastmod?: string
}

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: ChangeFreq
  priority: number
}

/** Non-blog pages. `/` and `/camps/summer` are top-tier commercial targets. */
const corePages: SitemapEntry[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/academic', priority: 0.9, changefreq: 'monthly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/free-resources', priority: 0.75, changefreq: 'monthly' },
  { path: '/enroll', priority: 0.9, changefreq: 'monthly' },
  { path: '/enroll-academic', priority: 0.9, changefreq: 'monthly' },
  { path: '/book-assessment', priority: 0.9, changefreq: 'monthly' },
  { path: '/math-finals-practice-session', priority: 0.85, changefreq: 'weekly' },
  { path: '/workshop-calendar', priority: 0.8, changefreq: 'weekly' },
  { path: '/programs', priority: 0.8, changefreq: 'monthly' },
  { path: '/growwise-blogs', priority: 0.85, changefreq: 'weekly' },
]

const coursePages: SitemapEntry[] = [
  { path: '/courses/math', priority: 0.95, changefreq: 'weekly' },
  { path: '/courses/english', priority: 0.95, changefreq: 'weekly' },
  { path: '/courses/sat-prep', priority: 0.9, changefreq: 'weekly' },
  { path: '/courses/high-school-math', priority: 0.85, changefreq: 'monthly' },
]

const steamPages: SitemapEntry[] = [
  { path: '/steam', priority: 0.9, changefreq: 'monthly' },
  { path: '/steam/ml-ai-coding', priority: 0.85, changefreq: 'monthly' },
  { path: '/steam/game-development', priority: 0.85, changefreq: 'monthly' },
]

const campPages: SitemapEntry[] = [
  { path: '/camps/summer', priority: 1.0, changefreq: 'weekly' },
  { path: '/camps/winter', priority: 0.7, changefreq: 'weekly' },
  { path: '/camps/winter/calendar', priority: 0.6, changefreq: 'weekly' },
]

/** SEO camp hub + landings — single Dublin campus, default-locale only. */
const campLandingHub: SitemapEntry = {
  path: '/camps',
  priority: 0.85,
  changefreq: 'weekly',
}

/** Blog post paths (same slugs as under `src/app/[locale]/growwise-blogs/`). */
const blogPostPaths = [
  '/growwise-blogs/embrace-the-future-of-technology-advance-your-coding-expertise-with-growwise',
  '/growwise-blogs/harnessing-the-power-of-code-a-skill-for-the-modern-era',
  '/growwise-blogs/how-coding-skills-empower-you-to-shape-tomorrows-ai-innovations',
  '/growwise-blogs/how-programming-skills-on-a-resume-will-open-more-career-opportunities',
  '/growwise-blogs/how-to-choose-the-right-summer-camp-for-your-child-a-parents-guide',
  '/growwise-blogs/how-to-go-from-roblox-player-to-game-developer-and-earn-real-robux',
  '/growwise-blogs/how-to-identify-learning-gaps-in-your-childs-education-at-home-parent-guide',
  '/growwise-blogs/improve-child-focus-feel-valued',
  '/growwise-blogs/technical-schools-in-2025-a-smart-investment-for-your-career',
  '/growwise-blogs/the-advantage-in-choosing-the-right-coding-class-for-your-child',
  '/growwise-blogs/the-importance-of-coding-for-kids-building-future-ready-skills',
  '/growwise-blogs/thinking-gap-your-kids-arent-distracted',
  '/growwise-blogs/unlock-your-future-the-best-programming-languages-for-career-advancement',
  '/growwise-blogs/unlocking-confidence-independence-and-fun-through-summer-camp',
  '/growwise-blogs/us-kids-falling-behind-math-english-parent-assessments',
  '/growwise-blogs/why-learning-java-coding-is-impressive-on-your-linkedin-profile',
  '/growwise-blogs/why-learning-python-is-your-fast-track-to-in-demand-job-offers',
] as const

const XML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&apos;',
  '"': '&quot;',
}

function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (ch) => XML_ESCAPE[ch] ?? ch)
}

function renderUrl(u: SitemapUrl): string {
  return [
    '  <url>',
    `    <loc>${escapeXml(u.loc)}</loc>`,
    `    <lastmod>${u.lastmod}</lastmod>`,
    `    <changefreq>${u.changefreq}</changefreq>`,
    `    <priority>${u.priority.toFixed(2)}</priority>`,
    '  </url>',
  ].join('\n')
}

export function renderUrlset(urls: SitemapUrl[]): string {
  const body = urls.map(renderUrl).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

export function renderSitemapIndex(
  entries: Array<{ loc: string; lastmod: string }>,
): string {
  const body = entries
    .map(
      (e) =>
        `  <sitemap>\n    <loc>${escapeXml(e.loc)}</loc>\n    <lastmod>${
          e.lastmod
        }</lastmod>\n  </sitemap>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`
}

/** Build all non-blog page URLs across enabled locales. */
export function buildPagesUrls(baseUrl: string, lastmod: string): SitemapUrl[] {
  const urls: SitemapUrl[] = []
  const localeRoutes = [...corePages, ...coursePages, ...steamPages, ...campPages]

  locales.forEach((locale) => {
    localeRoutes.forEach((page) => {
      urls.push({
        loc: absoluteSiteUrl(page.path, locale, baseUrl),
        lastmod: page.lastmod ?? lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
      })
    })

    if (locale === DEFAULT_LOCALE) {
      urls.push({
        loc: absoluteSiteUrl(campLandingHub.path, locale, baseUrl),
        lastmod: campLandingHub.lastmod ?? lastmod,
        changefreq: campLandingHub.changefreq,
        priority: campLandingHub.priority,
      })
      getCampSlugs().forEach((slug) => {
        urls.push({
          loc: absoluteSiteUrl(`/camps/${slug}`, locale, baseUrl),
          lastmod,
          changefreq: 'weekly',
          priority: 0.9,
        })
      })
    }
  })

  return urls
}

/** Build blog post URLs across enabled locales. */
export function buildBlogUrls(baseUrl: string, lastmod: string): SitemapUrl[] {
  const urls: SitemapUrl[] = []
  locales.forEach((locale) => {
    blogPostPaths.forEach((path) => {
      urls.push({
        loc: absoluteSiteUrl(path, locale, baseUrl),
        lastmod,
        changefreq: 'monthly',
        priority: 0.75,
      })
    })
  })
  return urls
}

/** Child sitemap descriptors listed in the sitemap index. */
export function getChildSitemaps(baseUrl: string, lastmod: string) {
  return [
    { loc: `${baseUrl}/sitemap-pages.xml`, lastmod },
    { loc: `${baseUrl}/sitemap-blogs.xml`, lastmod },
  ]
}

export const sitemapConstants = {
  getBaseUrl: getCanonicalSiteUrl,
}

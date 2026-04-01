import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

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

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getCanonicalSiteUrl()
  const currentDate = new Date().toISOString()

  const corePages = [
    { path: '/', priority: 1.0, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/academic', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/enroll', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/enroll-academic', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/book-assessment', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/workshop-calendar', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/programs', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/growwise-blogs', priority: 0.85, changefreq: 'weekly' as const },
  ]

  const coursePages = [
    { path: '/courses/math', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/courses/english', priority: 0.95, changefreq: 'weekly' as const },
    { path: '/courses/sat-prep', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/courses/high-school-math', priority: 0.85, changefreq: 'monthly' as const },
  ]

  const steamPages = [
    { path: '/steam', priority: 0.9, changefreq: 'monthly' as const },
    { path: '/steam/ml-ai-coding', priority: 0.85, changefreq: 'monthly' as const },
    { path: '/steam/game-development', priority: 0.85, changefreq: 'monthly' as const },
  ]

  const campPages = [
    { path: '/camps/summer', priority: 0.85, changefreq: 'weekly' as const },
    { path: '/camps/winter', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/camps/winter/calendar', priority: 0.6, changefreq: 'weekly' as const },
  ]

  const blogPages = blogPostPaths.map((path) => ({
    path,
    priority: 0.75,
    changefreq: 'monthly' as const,
  }))

  const urls: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    const push = (page: { path: string; priority: number; changefreq: 'weekly' | 'monthly' }) => {
      urls.push({
        url: absoluteSiteUrl(page.path, locale, baseUrl),
        lastModified: currentDate,
        changeFrequency: page.changefreq,
        priority: page.priority,
      })
    }

    corePages.forEach(push)
    coursePages.forEach(push)
    steamPages.forEach(push)
    campPages.forEach(push)
    blogPages.forEach(push)
  })

  return urls
}

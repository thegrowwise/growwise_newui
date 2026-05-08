import { MetadataRoute } from 'next'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/student-login', '/cart'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

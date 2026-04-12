import { MetadataRoute } from 'next'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalSiteUrl()
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/',
          '/admin/',
          '/*.json$',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


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
          // Filter/pagination query param variants — these are correctly canonicalised to
          // their base pages, but blocking crawl prevents crawl budget waste.
          '/*?grade=*',
          '/*?type=*',
          '/*?level=*',
          '/*?alignment=*',
          '/*?workshop=*',
          '/*?page=*',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


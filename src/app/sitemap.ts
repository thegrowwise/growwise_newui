import { MetadataRoute } from 'next'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getCanonicalSiteUrl().replace(/\/$/, '')
  return [
    { url: `${base}/sitemap-pages.xml` },
    { url: `${base}/sitemap-blogs.xml` },
  ]
}

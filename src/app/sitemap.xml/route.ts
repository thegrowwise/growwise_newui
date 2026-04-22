import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import {
  getChildSitemaps,
  renderSitemapIndex,
} from '@/lib/seo/sitemapData'

/**
 * Sitemap index. References child sitemaps for pages and blogs so Google can
 * segment crawl/lastmod per content type.
 */
export async function GET(): Promise<Response> {
  const baseUrl = getCanonicalSiteUrl()
  const lastmod = new Date().toISOString()
  const xml = renderSitemapIndex(getChildSitemaps(baseUrl, lastmod))

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

export const dynamic = 'force-dynamic'

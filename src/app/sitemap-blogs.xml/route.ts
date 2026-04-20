import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { buildBlogUrls, renderUrlset } from '@/lib/seo/sitemapData'

/** Blog-only URLs, kept separate so Search Console can slice blog performance. */
export async function GET(): Promise<Response> {
  const baseUrl = getCanonicalSiteUrl()
  const lastmod = new Date().toISOString()
  const xml = renderUrlset(buildBlogUrls(baseUrl, lastmod))

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

export const dynamic = 'force-dynamic'

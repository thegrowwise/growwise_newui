import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { buildPagesUrls, renderUrlset } from '@/lib/seo/sitemapData'

/** Non-blog URLs: core, courses, STEAM, camps, and the `/camps` landing hub. */
export async function GET(): Promise<Response> {
  const baseUrl = getCanonicalSiteUrl()
  const lastmod = new Date().toISOString()
  const xml = renderUrlset(buildPagesUrls(baseUrl, lastmod))

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

export const dynamic = 'force-dynamic'

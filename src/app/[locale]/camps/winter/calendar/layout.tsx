import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ workshop?: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { workshop } = (await searchParams) ?? {}

  const metadata = generateMetadataFromPath('/camps/winter/calendar', locale)
  const baseMetadata =
    metadata || ({ title: 'Winter Camp Calendar | GrowWise', description: 'Winter camp calendar' } satisfies Metadata)

  // Filter/state URLs should not be indexed; canonical points to the main winter camp page.
  if (workshop) {
    const baseUrl = getCanonicalSiteUrl()
    return {
      ...baseMetadata,
      alternates: {
        canonical: absoluteSiteUrl('/camps/winter', locale, baseUrl),
      },
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    }
  }

  return baseMetadata
}

export default function WinterCampCalendarLayout({ children }: { children: React.ReactNode }) {
  return children
}


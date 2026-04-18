import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateEventSchema } from '@/lib/seo/structuredData'
import { CONTACT_INFO } from '@/lib/constants'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/camps/winter', locale)
  return metadata || { title: 'Winter Camp | GrowWise', description: 'Winter camp programs' }
}

export default async function WinterCampLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  
  // Generate Event structured data for Winter Camp 2025
  const eventSchema = generateEventSchema({
    name: "Winter Camp 2025 - Academic & STEAM Programs",
    description:
      "Winter break workshops in Dublin, CA—Dec 22–30. Academic and STEAM tracks. Reserve a spot before sessions fill.",
    startDate: "2025-12-22T09:00:00-08:00",
    endDate: "2025-12-30T17:00:00-08:00",
    location: {
      name: "GrowWise School",
      address: {
        streetAddress: CONTACT_INFO.street,
        addressLocality: "Dublin",
        addressRegion: "CA",
        postalCode: CONTACT_INFO.zipCode || "94568",
        addressCountry: "US"
      }
    },
    organizer: {
      name: "GrowWise",
      url: baseUrl
    },
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "75",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteSiteUrl('/camps/winter', locale, baseUrl),
    },
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode"
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {children}
    </>
  )
}


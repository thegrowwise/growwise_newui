import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { CONTACT_INFO } from '@/lib/constants'
import { MATH_FINALS_PRACTICE_SESSION_DESCRIPTION } from '@/lib/seo/metadataConfig'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/math-finals-practice-session', locale)
  return (
    metadata || {
      title: 'High School Math Finals Prep | GrowWise',
      description: MATH_FINALS_PRACTICE_SESSION_DESCRIPTION,
    }
  )
}

export default async function MathFinalsPracticeLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteSiteUrl('/math-finals-practice-session#service', locale, baseUrl),
    name: 'High school Math Finals Prep (four-session program)',
    description: MATH_FINALS_PRACTICE_SESSION_DESCRIPTION,
    serviceType: 'Educational program',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'GrowWise',
      url: baseUrl,
      telephone: CONTACT_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT_INFO.street,
        addressLocality: 'Dublin',
        addressRegion: 'CA',
        postalCode: CONTACT_INFO.zipCode,
        addressCountry: 'US',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'Dublin' },
      { '@type': 'City', name: 'Pleasanton' },
      { '@type': 'City', name: 'San Ramon' },
      { '@type': 'City', name: 'Livermore' },
    ],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/math-finals-practice-session', locale, baseUrl),
      description:
        'Four-session Math Finals Prep. Contact GrowWise for current schedule, scope, and enrollment.',
    },
    url: absoluteSiteUrl('/math-finals-practice-session', locale, baseUrl),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  )
}

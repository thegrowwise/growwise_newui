import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { CONTACT_INFO } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/math-finals-practice-session', locale)
  return (
    metadata || {
      title: 'Free math finals practice | GrowWise',
      description: 'Free in-center high school math finals practice session in Dublin, CA.',
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
    name: 'Complimentary high school math finals session (Sunday 12–1 pm)',
    description:
      'One complimentary in-center session in the Sunday 12–1 pm window for high school students preparing for math finals (Algebra 1, Algebra 2, and Pre-Calculus) at GrowWise in Dublin, CA. Paid four-session Math Finals Prep is a separate program.',
    serviceType: 'Tutoring session',
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
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/math-finals-practice-session', locale, baseUrl),
      description:
        'Complimentary Sunday session in the 12–1 pm window (registration required; capacity limited). Paid four-session Math Finals Prep is separate.',
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

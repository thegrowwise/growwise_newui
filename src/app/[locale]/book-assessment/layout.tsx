import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { CONTACT_INFO } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/book-assessment', locale)
  return metadata || { title: 'Book Assessment | GrowWise', description: 'Book your free assessment' }
}

export default async function BookAssessmentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Free Student Assessment — GrowWise Dublin CA",
    "description": "Book a free 60-minute student assessment at GrowWise in Dublin, CA. Our education experts evaluate your child's current level in Math, English, or STEAM and recommend the right program.",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
      "telephone": CONTACT_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CONTACT_INFO.street,
        "addressLocality": "Dublin",
        "addressRegion": "CA",
        "postalCode": CONTACT_INFO.zipCode,
        "addressCountry": "US",
      },
    },
    "serviceType": "Educational Assessment",
    "areaServed": ["Dublin", "Pleasanton", "San Ramon", "Livermore"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Complimentary 60-minute placement assessment",
    },
    "url": absoluteSiteUrl('/book-assessment', locale, baseUrl),
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


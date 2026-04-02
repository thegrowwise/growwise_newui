import About from '@/components/sections/About'
import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/about', locale)
  return metadata || { title: 'About | GrowWise', description: 'Learn about GrowWise' }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()


  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'About', url: absoluteSiteUrl('/about', locale, baseUrl) },
  ])

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About GrowWise — K-12 Tutoring Center in Dublin, CA",
    "description": "Learn about GrowWise, a K-12 education center in Dublin, CA offering personalized tutoring in Math, English, coding, and STEAM programs. Our mission, team, and approach.",
    "url": absoluteSiteUrl('/about', locale, baseUrl),
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
      "foundingDate": "2019",
      "description": "Empowering K-12 students through personalized education and innovative STEAM programs in Dublin, CA.",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <About />
    </>
  )
}



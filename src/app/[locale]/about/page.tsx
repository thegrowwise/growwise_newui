import About from '@/components/sections/About'
import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema, generateFAQPageSchema, TRI_VALLEY_AREA_SERVED } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/about', locale)
  return metadata || { title: 'About | GrowWise', description: 'Learn about GrowWise' }
}

const ABOUT_FAQS = [
  {
    question: "What makes GrowWise different from other tutoring centres in Dublin?",
    answer: "GrowWise is the only centre in Dublin offering academic tutoring in Math and English alongside STEAM programs in coding, AI, and game development, plus summer camps — all in one place. Programs are aligned with DUSD and PUSD curriculum. Classes have a maximum of 8 students. Every student starts with a free assessment rather than being placed into a one-size-fits-all track.",
  },
  {
    question: "Where is GrowWise located and which areas do you serve?",
    answer: "GrowWise is located at 4564 Dublin Blvd, Dublin, CA 94568. We serve families from Dublin, Pleasanton, San Ramon, Danville, and Livermore across the Tri-Valley area. In-person, online, and hybrid formats are available.",
  },
]

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
      "foundingDate": "2024",
      "description": "Empowering K-12 students through personalized education and innovative STEAM programs in Dublin, CA.",
      "areaServed": [...TRI_VALLEY_AREA_SERVED],
      "founder": {
        "@type": "Person",
        "name": "Anshika Verma",
        "jobTitle": "Founder & Director",
      },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQPageSchema(ABOUT_FAQS)) }}
      />
      <About />
    </>
  )
}



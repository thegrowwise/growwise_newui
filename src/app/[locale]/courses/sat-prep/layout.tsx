import { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/sat-prep', locale)
  return metadata || { title: 'SAT Prep | GrowWise', description: 'Comprehensive SAT prep course' }
}

export default async function SATPrepLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  
  const courseSchema = generateCourseSchema({
    name: "SAT Prep Course Dublin CA | SAT Test Preparation & Strategies | SAT Tutoring",
    description:
      "SAT prep in Dublin, CA with practice tests and strategy. Small classes and expert coaches. Book your SAT readiness check.",
    provider: "GrowWise",
    courseCode: "SAT-PREP",
    educationalLevel: "High School",
    teaches: [
      "SAT Math",
      "SAT Reading",
      "SAT Writing and Language",
      "SAT Test Strategies",
      "SAT Practice Tests",
      "Time Management",
      "Test-Taking Techniques"
    ],
    coursePrerequisites: "High school student preparing for SAT exam",
    url: absoluteSiteUrl('/courses/sat-prep', locale, baseUrl),
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteSiteUrl('/enroll', locale, baseUrl),
    }
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
          {
            name: 'Academic Programs',
            url: absoluteSiteUrl('/academic', locale, baseUrl),
          },
          {
            name: 'SAT Prep',
            url: absoluteSiteUrl('/courses/sat-prep', locale, baseUrl),
          },
        ]}
      />
      {children}
    </>
  )
}


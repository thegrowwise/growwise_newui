import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
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
    description: "Top-rated SAT prep course in Dublin, CA. Comprehensive SAT preparation with practice tests, proven strategies, and personalized instruction. Expert SAT tutors help boost your score. Small classes, flexible scheduling. Book your SAT prep course today!",
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Programs', url: absoluteSiteUrl('/programs', locale, baseUrl) },
    { name: 'Academic', url: absoluteSiteUrl('/academic', locale, baseUrl) },
    { name: 'SAT Prep', url: absoluteSiteUrl('/courses/sat-prep', locale, baseUrl) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}


import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

/** Reduces dev static-path worker churn; mitigates `spawn EBADF` with Turbopack on some macOS setups (see `[locale]/[...catchAll]/page.tsx`). */
export const dynamic = 'force-dynamic'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/english', locale)
  return metadata || { title: 'English Courses | GrowWise', description: 'Comprehensive English courses' }
}

export default async function EnglishCoursesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  
  const courseSchema = generateCourseSchema({
    name: "English Language Arts Courses - Reading, Writing & Grammar | English Tutoring Dublin CA",
    description:
      "English and ELA tutoring for grades 1–12 in Dublin, CA. Reading, writing, and grammar in small groups. Book a free assessment.",
    provider: "GrowWise",
    courseCode: "ELA-K12",
    educationalLevel: "K-12",
    teaches: [
      "Reading Comprehension",
      "Vocabulary Development",
      "Grammar & Mechanics",
      "Essay Writing",
      "Creative Writing",
      "English Language Arts",
      "Literary Analysis",
      "Writing Skills"
    ],
    coursePrerequisites: "Placement assessment recommended to determine appropriate level",
    url: absoluteSiteUrl('/courses/english', locale, baseUrl),
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
    { name: 'English Courses', url: absoluteSiteUrl('/courses/english', locale, baseUrl) },
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


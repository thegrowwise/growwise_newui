import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/math', locale)
  return metadata || { title: 'Math Courses | GrowWise', description: 'Comprehensive math courses' }
}

export default async function MathCoursesLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  
  // Generate Course structured data with enhanced details
  const courseSchema = generateCourseSchema({
    name: "K-12 Math Courses - Grade-Level, Accelerated & Integrated Math | Math Tutoring Dublin CA",
    description: "Comprehensive math courses from elementary to high school. Grade-level math (California Common Core Standards), accelerated math programs, and integrated math 1 & 2. DUSD & PUSD aligned curriculum. Expert math tutors in Dublin, CA. Algebra, Geometry, Pre-Calculus, and more. Small class sizes, personalized instruction, proven results.",
    provider: "GrowWise",
    courseCode: "MATH-K12",
    educationalLevel: "K-12",
    teaches: [
      "Grade-Level Math (California Common Core Standards)",
      "Accelerated Math",
      "Integrated Math 1",
      "Integrated Math 2",
      "Algebra",
      "Geometry",
      "Pre-Calculus",
      "Elementary Math",
      "Middle School Math",
      "High School Math"
    ],
    coursePrerequisites: "Placement assessment recommended to determine appropriate level",
    url: absoluteSiteUrl('/courses/math', locale, baseUrl),
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteSiteUrl('/enroll', locale, baseUrl),
    }
  })

  // Generate Breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Programs', url: absoluteSiteUrl('/programs', locale, baseUrl) },
    { name: 'Academic', url: absoluteSiteUrl('/academic', locale, baseUrl) },
    { name: 'Math Courses', url: absoluteSiteUrl('/courses/math', locale, baseUrl) },
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


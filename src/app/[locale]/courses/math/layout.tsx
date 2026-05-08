import { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FAQSchema from '@/components/schema/FAQSchema'
import { MATH_COURSE_MERGED_FAQ_JSONLD } from '@/lib/schema/course-hub-jsonld-faqs'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'
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
    name: "Grades 1-12 Math Courses - Grade-Level, Accelerated & Integrated Math | Math Tutoring Dublin CA",
    description:
      "Math tutoring for grades 1–12 in Dublin, CA. Common Core aligned, small groups, placement support. Book a free assessment.",
    provider: "GrowWise",
    courseCode: "MATH-K12",
    educationalLevel: "Grades 1-12",
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
            name: 'Math Courses',
            url: absoluteSiteUrl('/courses/math', locale, baseUrl),
          },
        ]}
      />
      <FAQSchema faqs={MATH_COURSE_MERGED_FAQ_JSONLD} />
      {children}
    </>
  )
}

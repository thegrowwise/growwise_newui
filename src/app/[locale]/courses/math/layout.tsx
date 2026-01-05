import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'

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
  const baseUrl = 'https://growwiseschool.org'
  
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
    url: `${baseUrl}/${locale}/courses/math`,
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/enroll`,
    }
  })

  // Generate Breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Programs', url: `${baseUrl}/${locale}/programs` },
    { name: 'Academic', url: `${baseUrl}/${locale}/academic` },
    { name: 'Math Courses', url: `${baseUrl}/${locale}/courses/math` },
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


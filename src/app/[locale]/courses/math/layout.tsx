import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'

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
  
  // Generate Course structured data
  const courseSchema = generateCourseSchema({
    name: "K-12 Math Courses - Grade-Level, Accelerated & Integrated Math",
    description: "Comprehensive math courses from elementary to high school. Grade-level math, accelerated programs, and integrated math. DUSD & PUSD aligned curriculum. Expert math tutors in Dublin, CA.",
    provider: "GrowWise",
    educationalLevel: "K-12",
    teaches: [
      "Grade-Level Math (CACCS)",
      "Accelerated Math",
      "Integrated Math 1 & 2",
      "Algebra",
      "Geometry",
      "Pre-Calculus"
    ],
    coursePrerequisites: "Placement assessment recommended",
    url: `${baseUrl}/${locale}/courses/math`,
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/enroll`,
    }
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {children}
    </>
  )
}


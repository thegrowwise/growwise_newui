import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/high-school-math', locale)
  return metadata || { title: 'High School Math | GrowWise', description: 'High school math courses' }
}

export default async function HighSchoolMathLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = 'https://growwiseschool.org'
  
  const courseSchema = generateCourseSchema({
    name: "High School Math Courses - Algebra, Geometry, Pre-Calculus",
    description: "High school math courses: Algebra, Geometry, Pre-Calculus, and more. Expert instruction for high school students. DUSD & PUSD aligned. Math tutoring in Dublin, CA.",
    provider: "GrowWise",
    educationalLevel: "High School",
    teaches: [
      "Algebra",
      "Geometry",
      "Pre-Calculus",
      "Trigonometry",
      "Advanced Mathematics"
    ],
    coursePrerequisites: "High school level math foundation",
    url: `${baseUrl}/${locale}/courses/high-school-math`,
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


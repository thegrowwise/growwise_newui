import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'

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
  const baseUrl = 'https://growwiseschool.org'
  
  const courseSchema = generateCourseSchema({
    name: "English Language Arts Courses - Reading, Writing & Grammar | English Tutoring Dublin CA",
    description: "Comprehensive English Language Arts courses: reading comprehension, vocabulary development, grammar, mechanics, and essay writing. California Common Core aligned. Expert English tutors in Dublin, CA. K-12 ELA programs with proven results. Small classes, personalized instruction, flexible scheduling.",
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
    url: `${baseUrl}/${locale}/courses/english`,
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: "35",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${baseUrl}/${locale}/enroll`,
    }
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Programs', url: `${baseUrl}/${locale}/programs` },
    { name: 'Academic', url: `${baseUrl}/${locale}/academic` },
    { name: 'English Courses', url: `${baseUrl}/${locale}/courses/english` },
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


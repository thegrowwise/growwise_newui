import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'

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
  const baseUrl = 'https://growwiseschool.org'
  
  const courseSchema = generateCourseSchema({
    name: "SAT Prep Course - SAT Test Preparation & Strategies",
    description: "Comprehensive SAT prep course with practice tests, strategies, and personalized instruction. Boost your SAT score with expert tutors. Book your SAT prep course in Dublin, CA.",
    provider: "GrowWise",
    educationalLevel: "High School",
    teaches: [
      "SAT Math",
      "SAT Reading",
      "SAT Writing",
      "Test Strategies",
      "Practice Tests"
    ],
    coursePrerequisites: "High school student preparing for SAT",
    url: `${baseUrl}/${locale}/courses/sat-prep`,
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


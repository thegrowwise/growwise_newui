import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam/ml-ai-coding', locale)
  return metadata || { title: 'ML/AI Coding | GrowWise', description: 'Machine Learning & AI course' }
}

export default async function MLAICodingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = 'https://growwiseschool.org'
  
  const courseSchema = generateCourseSchema({
    name: "ML/AI Coding Course Dublin CA | Machine Learning & AI for Kids | GrowWise",
    description: "Learn Machine Learning and Artificial Intelligence coding in Dublin, CA. Hands-on ML/AI projects for K-12 students. Build real AI applications, understand machine learning concepts. Expert instructors, project-based learning. Start your AI journey today!",
    provider: "GrowWise",
    courseCode: "ML-AI-K12",
    educationalLevel: "K-12",
    teaches: [
      "Machine Learning",
      "Artificial Intelligence",
      "Python Programming",
      "Data Science",
      "AI Project Development",
      "Neural Networks",
      "Deep Learning Basics"
    ],
    coursePrerequisites: "Basic programming knowledge recommended but not required",
    url: `${baseUrl}/${locale}/steam/ml-ai-coding`,
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


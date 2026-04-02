import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

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
  const baseUrl = getCanonicalSiteUrl()
  
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
    url: absoluteSiteUrl('/steam/ml-ai-coding', locale, baseUrl),
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
    { name: 'STEAM', url: absoluteSiteUrl('/steam', locale, baseUrl) },
    { name: 'ML/AI Coding', url: absoluteSiteUrl('/steam/ml-ai-coding', locale, baseUrl) },
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


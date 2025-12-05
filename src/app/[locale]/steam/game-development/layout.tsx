import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema } from '@/lib/seo/structuredData'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam/game-development', locale)
  return metadata || { title: 'Game Development | GrowWise', description: 'Game development course' }
}

export default async function GameDevelopmentLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = 'https://growwiseschool.org'
  
  const courseSchema = generateCourseSchema({
    name: "Game Development Course - Learn to Build Games",
    description: "Game development course for K-12 students. Learn to create games, build projects, and develop coding skills. Hands-on game development classes in Dublin, CA.",
    provider: "GrowWise",
    educationalLevel: "K-12",
    teaches: [
      "Game Design",
      "Game Programming",
      "Roblox Development",
      "Scratch Programming",
      "Minecraft Modding"
    ],
    coursePrerequisites: "No prior experience required",
    url: `${baseUrl}/${locale}/steam/game-development`,
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


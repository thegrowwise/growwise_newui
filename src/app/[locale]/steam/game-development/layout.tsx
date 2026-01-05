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
    name: "Game Development Course Dublin CA | Learn to Build Games | Coding Classes | GrowWise",
    description: "Game development course for K-12 students in Dublin, CA. Learn to create games using Roblox, Scratch, and Python. Build real game projects, develop coding skills. Hands-on game development classes with expert instructors. Start building games today!",
    provider: "GrowWise",
    courseCode: "GAME-DEV-K12",
    educationalLevel: "K-12",
    teaches: [
      "Game Design",
      "Game Programming",
      "Roblox Development",
      "Scratch Programming",
      "Python Game Development",
      "Minecraft Modding",
      "Game Mechanics"
    ],
    coursePrerequisites: "No prior experience required - perfect for beginners",
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


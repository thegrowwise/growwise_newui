import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/game-dev', locale)
  return metadata || { title: 'Game Development for Kids | GrowWise', description: 'Scratch, Roblox, Minecraft, and Robotics journeys for kids aged 6–16.' }
}

export default async function GameDevLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()

  const courseSchema = generateCourseSchema({
    name: 'Game Development for Kids Dublin CA | Scratch, Roblox & Minecraft | GrowWise',
    description: 'Game development courses for kids aged 6–16 in Dublin, CA. Build real games with Scratch, Roblox, Minecraft, and Robotics. Hands-on project-based learning with expert instructors. No experience required.',
    provider: 'GrowWise',
    courseCode: 'GAME-DEV-STANDALONE-K12',
    educationalLevel: 'K-12',
    teaches: [
      'Scratch Programming',
      'Roblox Game Development',
      'Minecraft Modding',
      'Robotics',
      'Game Design',
      'Creative Coding',
    ],
    coursePrerequisites: 'No prior experience required – perfect for beginners',
    url: absoluteSiteUrl('/game-dev', locale, baseUrl),
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: '35',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/enroll', locale, baseUrl),
    },
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Programs', url: absoluteSiteUrl('/programs', locale, baseUrl) },
    { name: 'STEAM', url: absoluteSiteUrl('/steam', locale, baseUrl) },
    { name: 'Game Development', url: absoluteSiteUrl('/game-dev', locale, baseUrl) },
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

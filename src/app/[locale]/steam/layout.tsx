import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam', locale)
  return metadata || { title: 'STEAM Programs | GrowWise', description: 'Innovative STEAM programs' }
}

export default function SteamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = getCanonicalSiteUrl()

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "STEAM Programs Dublin CA — Coding, AI & Game Development | GrowWise",
    "description": "Innovative STEAM programs for K-12 students in Dublin, CA: ML/AI coding, game development, robotics, and more. Hands-on project-based learning with expert instructors.",
    "url": `${baseUrl}/steam`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "hasPart": [
      { "@type": "Course", "name": "ML/AI Coding", "url": `${baseUrl}/steam/ml-ai-coding` },
      { "@type": "Course", "name": "Game Development", "url": `${baseUrl}/steam/game-development` },
      { "@type": "Course", "name": "Coding Programs", "url": `${baseUrl}/coding` },
      { "@type": "Course", "name": "Game Dev", "url": `${baseUrl}/game-dev` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {children}
    </>
  )
}


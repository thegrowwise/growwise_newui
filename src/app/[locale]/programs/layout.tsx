import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/programs', locale)
  return metadata || { title: 'Programs | GrowWise', description: 'Explore our programs' }
}

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = getCanonicalSiteUrl()

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "GrowWise Programs — K-12 Academic & STEAM",
    "description": "Explore all GrowWise programs for K-12 students in Dublin, CA: Math tutoring, English tutoring, SAT prep, ML/AI coding, game development, and summer camps.",
    "url": `${baseUrl}/programs`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "hasPart": [
      { "@type": "Course", "name": "Math Tutoring", "url": `${baseUrl}/courses/math` },
      { "@type": "Course", "name": "English Tutoring", "url": `${baseUrl}/courses/english` },
      { "@type": "Course", "name": "SAT Prep", "url": `${baseUrl}/courses/sat-prep` },
      { "@type": "Course", "name": "ML/AI Coding", "url": `${baseUrl}/steam/ml-ai-coding` },
      { "@type": "Course", "name": "Game Development", "url": `${baseUrl}/steam/game-development` },
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


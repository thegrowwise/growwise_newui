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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "STEAM Programs — Coding, AI & Game Development | GrowWise Dublin CA",
    "description": "STEAM programs for Grades 1-12 students in Dublin, CA: ML/AI coding, game development, and more. Hands-on project-based learning with expert instructors.",
    "url": `${baseUrl}/steam`,
    "serviceType": "STEAM Education",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "areaServed": ["Dublin, CA", "Pleasanton, CA", "San Ramon, CA", "Tri-Valley, CA"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "STEAM Programs",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "ML/AI Coding", "url": `${baseUrl}/steam/ml-ai-coding` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Game Development", "url": `${baseUrl}/steam/game-development` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Coding Programs", "url": `${baseUrl}/coding` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Game Dev", "url": `${baseUrl}/game-dev` } },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {children}
    </>
  )
}


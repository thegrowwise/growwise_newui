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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Grades 1-12 Academic & STEAM Programs | GrowWise Dublin CA",
    "description": "All GrowWise programs for Grades 1-12 students in Dublin, CA: Math tutoring, English tutoring, SAT prep, ML/AI coding, game development, and summer camps.",
    "url": `${baseUrl}/programs`,
    "serviceType": "Grades 1-12 Educational Programs",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "areaServed": ["Dublin, CA", "Pleasanton, CA", "San Ramon, CA", "Tri-Valley, CA"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "All Programs",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Math Tutoring", "url": `${baseUrl}/courses/math` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "English Tutoring", "url": `${baseUrl}/courses/english` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "SAT Prep", "url": `${baseUrl}/courses/sat-prep` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "ML/AI Coding", "url": `${baseUrl}/steam/ml-ai-coding` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Game Development", "url": `${baseUrl}/steam/game-development` } },
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


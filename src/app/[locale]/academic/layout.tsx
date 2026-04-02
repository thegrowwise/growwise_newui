import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/academic', locale)

  if (!metadata) {
    return {
      title: 'Academic Programs | GrowWise',
      description: 'K-12 Math and English programs',
    }
  }

  return metadata
}

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const baseUrl = getCanonicalSiteUrl()

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Academic Programs — Math & English Tutoring Dublin CA | GrowWise",
    "description": "K-12 academic programs in Dublin, CA: Math tutoring (grade-level, accelerated, integrated), English Language Arts, and SAT prep. Aligned with DUSD & PUSD standards.",
    "url": `${baseUrl}/academic`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "hasPart": [
      { "@type": "Course", "name": "Math Tutoring K-12", "url": `${baseUrl}/courses/math` },
      { "@type": "Course", "name": "High School Math", "url": `${baseUrl}/courses/high-school-math` },
      { "@type": "Course", "name": "English Tutoring K-12", "url": `${baseUrl}/courses/english` },
      { "@type": "Course", "name": "SAT Prep", "url": `${baseUrl}/courses/sat-prep` },
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


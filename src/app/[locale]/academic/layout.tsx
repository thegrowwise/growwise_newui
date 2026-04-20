import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/academic', locale)

  if (!metadata) {
    return {
      title: 'Academic Programs | GrowWise',
      description: 'Grades 1-12 Math and English programs',
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

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Academic Tutoring — Math, English & SAT Prep | GrowWise Dublin CA",
    "description": "Grades 1-12 academic tutoring in Dublin, CA: Math (grade-level, accelerated, integrated), English Language Arts, and SAT prep. Aligned with DUSD & PUSD standards.",
    "url": `${baseUrl}/academic`,
    "serviceType": "Educational Tutoring",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "url": baseUrl,
    },
    "areaServed": ["Dublin, CA", "Pleasanton, CA", "San Ramon, CA", "Tri-Valley, CA"],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Academic Programs",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Math Tutoring Grades 1-12", "url": `${baseUrl}/courses/math` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "High School Math", "url": `${baseUrl}/courses/high-school-math` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "English Tutoring Grades 1-12", "url": `${baseUrl}/courses/english` } },
        { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "SAT Prep", "url": `${baseUrl}/courses/sat-prep` } },
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


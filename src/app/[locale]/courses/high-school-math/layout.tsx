import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/high-school-math', locale)
  return metadata || { title: 'High School Math | GrowWise', description: 'High school math courses' }
}

export default async function HighSchoolMathLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  
  const courseSchema = generateCourseSchema({
    name: "High School Math Courses - Algebra, Geometry, Pre-Calculus",
    description: "High school math courses: Algebra, Geometry, Pre-Calculus, and more. Expert instruction for high school students. DUSD & PUSD aligned. Math tutoring in Dublin, CA.",
    provider: "GrowWise",
    educationalLevel: "High School",
    teaches: [
      "Algebra",
      "Geometry",
      "Pre-Calculus",
      "Trigonometry",
      "Advanced Mathematics"
    ],
    coursePrerequisites: "High school level math foundation",
    url: absoluteSiteUrl('/courses/high-school-math', locale, baseUrl),
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
    { name: 'Academic', url: absoluteSiteUrl('/academic', locale, baseUrl) },
    { name: 'High School Math', url: absoluteSiteUrl('/courses/high-school-math', locale, baseUrl) },
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


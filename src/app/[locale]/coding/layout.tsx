import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateCourseSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/coding', locale)
  return metadata || { title: 'Coding Programs for Kids | GrowWise', description: 'Structured coding learning journeys for kids aged 10–18.' }
}

export default async function CodingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()

  const courseSchema = generateCourseSchema({
    name: 'Coding Programs for Kids Dublin CA | Python, JavaScript & Web Dev | GrowWise',
    description: 'Structured coding learning journeys for kids aged 10–18 in Dublin, CA. Learn Python, JavaScript, web development, and more. Project-based coding classes with expert instructors. Small groups, personalized instruction.',
    provider: 'GrowWise',
    courseCode: 'CODING-K12',
    educationalLevel: 'Grades 1-12',
    teaches: [
      'Python Programming',
      'JavaScript',
      'Web Development',
      'HTML & CSS',
      'Computational Thinking',
      'Software Engineering Fundamentals',
    ],
    coursePrerequisites: 'No prior coding experience required',
    url: absoluteSiteUrl('/coding', locale, baseUrl),
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
    { name: 'Coding', url: absoluteSiteUrl('/coding', locale, baseUrl) },
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

import { MathFinalsPracticeLanding } from '@/components/math-finals-practice/MathFinalsPracticeLanding'
import { MATH_FINALS_PRACTICE_FAQS } from '@/data/math-finals-practice-faqs'
import { getMetadataConfig } from '@/lib/seo/metadataConfig'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import {
  generateBreadcrumbSchema,
  generateFAQPageSchema,
  generateWebPageJsonLd,
} from '@/lib/seo/structuredData'

const PAGE_PATH = '/math-finals-practice-session'

export default async function MathFinalsPracticePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  const pageUrl = absoluteSiteUrl(PAGE_PATH, locale, baseUrl)
  const meta = getMetadataConfig(PAGE_PATH)
  const name =
    meta?.title ?? 'Free High School Math Finals Practice Session | GrowWise'
  const description =
    meta?.description ??
    'Request a high school math finals session in Dublin, CA — Sunday 12–1 pm or structured prep. Algebra 1 through Pre-Calculus.'

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Math finals practice', url: pageUrl },
  ])
  const webPageSchema = generateWebPageJsonLd({ name, description, url: pageUrl })
  const faqSchema = generateFAQPageSchema(MATH_FINALS_PRACTICE_FAQS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <MathFinalsPracticeLanding />
    </>
  )
}

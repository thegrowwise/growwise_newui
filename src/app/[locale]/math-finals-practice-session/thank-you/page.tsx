import Link from 'next/link'
import type { Metadata } from 'next'
import { absoluteSiteUrl, publicPath } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { generateBreadcrumbSchema, generateWebPageJsonLd } from '@/lib/seo/structuredData'

const PAGE_PATH = '/math-finals-practice-session/thank-you'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Request received | GrowWise',
  description: 'We received your request for math finals support. Our team will follow up shortly.',
}

export default async function MathFinalsPracticeThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  const pageUrl = absoluteSiteUrl(PAGE_PATH, locale, baseUrl)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    {
      name: 'Math finals practice',
      url: absoluteSiteUrl('/math-finals-practice-session', locale, baseUrl),
    },
    { name: 'Thank you', url: pageUrl },
  ])
  const webPageSchema = generateWebPageJsonLd({
    name: 'Math finals practice request received | GrowWise',
    description: 'We received your request for math finals support. Our team will follow up shortly.',
    url: pageUrl,
  })

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
      <main className="min-h-[100dvh] bg-slate-50/80 text-slate-800">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Thank you — we received your request.
          </h1>
          <p className="mt-4 text-slate-600">
            Our team will follow up shortly by email or phone to confirm next steps for the option you selected—the
            four-session structured prep course or the complimentary Sunday session (12–1 pm time window).
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={publicPath('/math-finals-practice-session', locale)}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#1F396D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#162a52] sm:w-auto"
            >
              Back to session details
            </Link>
            <Link
              href={publicPath('/enroll', locale)}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-[#1F396D] bg-white px-6 py-3 text-sm font-semibold text-[#1F396D] hover:bg-slate-50 sm:w-auto"
            >
              Explore enrollment
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}


import type { Metadata } from 'next'
import { FREE_RESOURCES } from '@/data/resources'
import { FreeResourcesClient } from '@/components/free-resources/FreeResourcesClient'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/free-resources', locale)
  return metadata ?? {
    title: 'Free Learning Resources for K–12 | GrowWise',
    description:
      'Download free math worksheets, English practice sheets, coding cheat sheets, and AI guides for grades 1–12. No sign-up hassle — just enter your email and get instant access.',
  }
}

export default function FreeResourcesPage() {
  return (
    <div className="section-base section-gray min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="title-section mb-6">
          Free <span className="highlight-orange">Learning Resources</span> for K–12 Students
        </h1>
        <p className="subtitle-sm mb-10 max-w-3xl">
          Download free math worksheets, English practice sheets, coding cheat sheets, and AI guides for
          grades 1–12. No sign-up hassle — just enter your email and get instant access.
        </p>
        <FreeResourcesClient resources={FREE_RESOURCES} />
      </div>
    </div>
  )
}

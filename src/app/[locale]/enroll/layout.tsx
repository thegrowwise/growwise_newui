import { Metadata } from 'next'
import { getMessages } from 'next-intl/server'
import { getMetadataConfig } from '@/lib/seo/metadataConfig'
import { generatePageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params

  const config = getMetadataConfig('/enroll')
  if (!config) {
    return { title: 'Enroll | GrowWise', description: 'Enroll in our programs' }
  }

  const messages = await getMessages({ locale })
  const rawEnrollNow = (messages as { enrollnow?: unknown }).enrollnow
  const enrollNowMessages =
    rawEnrollNow && typeof rawEnrollNow === 'object'
      ? (rawEnrollNow as { metaDescription?: unknown })
      : undefined

  const metaDescription =
    typeof enrollNowMessages?.metaDescription === 'string' && enrollNowMessages.metaDescription.trim().length > 0
      ? enrollNowMessages.metaDescription
      : config.description

  return generatePageMetadata({
    title: config.title,
    description: metaDescription,
    keywords: config.keywords,
    locale,
    path: config.path,
  })
}

export default function EnrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


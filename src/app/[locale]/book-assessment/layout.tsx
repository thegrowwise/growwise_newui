import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/book-assessment', locale)
  return metadata || { title: 'Book Assessment | GrowWise', description: 'Book your free assessment' }
}

export default function BookAssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


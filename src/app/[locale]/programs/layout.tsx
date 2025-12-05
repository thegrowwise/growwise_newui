import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

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
  return children
}


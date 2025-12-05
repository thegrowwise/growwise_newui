import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam/game-development', locale)
  return metadata || { title: 'Game Development | GrowWise', description: 'Game development course' }
}

export default function GameDevelopmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


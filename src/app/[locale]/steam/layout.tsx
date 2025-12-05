import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam', locale)
  return metadata || { title: 'STEAM Programs | GrowWise', description: 'Innovative STEAM programs' }
}

export default function SteamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


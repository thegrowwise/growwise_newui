import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/camps/winter', locale)
  return metadata || { title: 'Winter Camp | GrowWise', description: 'Winter camp programs' }
}

export default function WinterCampLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


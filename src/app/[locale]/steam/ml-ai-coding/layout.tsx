import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/steam/ml-ai-coding', locale)
  return metadata || { title: 'ML/AI Coding | GrowWise', description: 'Machine Learning & AI course' }
}

export default function MLAICodingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


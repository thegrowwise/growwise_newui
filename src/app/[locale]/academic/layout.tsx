import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/academic', locale)
  
  // Fallback to default if config not found
  if (!metadata) {
    return {
      title: 'Academic Programs | GrowWise',
      description: 'K-12 Math and English programs',
    }
  }
  
  return metadata
}

export default function AcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


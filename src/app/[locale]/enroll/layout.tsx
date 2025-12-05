import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/enroll', locale)
  return metadata || { title: 'Enroll | GrowWise', description: 'Enroll in our programs' }
}

export default function EnrollLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


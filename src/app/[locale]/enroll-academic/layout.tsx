import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/enroll-academic', locale)
  return metadata || { title: 'Enroll Academic | GrowWise', description: 'Enroll in academic programs' }
}

export default function EnrollAcademicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/high-school-math', locale)
  return metadata || { title: 'High School Math | GrowWise', description: 'High school math courses' }
}

export default function HighSchoolMathLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


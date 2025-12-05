import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/courses/math', locale)
  return metadata || { title: 'Math Courses | GrowWise', description: 'Comprehensive math courses' }
}

export default function MathCoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


import About from '@/components/sections/About'
import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/about', locale)
  return metadata || { title: 'About | GrowWise', description: 'Learn about GrowWise' }
}

export default function AboutPage() {
  return <About />
}



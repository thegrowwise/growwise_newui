import Contact from '@/components/sections/Contact'
import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/contact', locale)
  return metadata || { title: 'Contact | GrowWise', description: 'Get in touch with us' }
}

export default function ContactPage() {
  return <Contact />
}




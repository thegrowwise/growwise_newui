import Contact from '@/components/sections/Contact'
import { Metadata } from 'next'
import { generateMetadataFromPath } from '@/lib/seo/metadata'
import { generateBreadcrumbSchema, generateFAQPageSchema } from '@/lib/seo/structuredData'
import { absoluteSiteUrl } from '@/lib/publicPath'
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl'
import { CONTACT_INFO } from '@/lib/constants'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const metadata = generateMetadataFromPath('/contact', locale)
  return metadata || { title: 'Contact | GrowWise', description: 'Get in touch with us' }
}

const CONTACT_FAQS = [
  {
    question: "How do I know which GrowWise program is right for my child before committing to anything?",
    answer: "The free assessment is the right starting point. GrowWise evaluates your child's current level and recommends the most appropriate program and format — small group or one-on-one, in-person or online. There is no commitment required to complete the assessment.",
  },
  {
    question: "What happens after I submit the contact form?",
    answer: "A GrowWise team member will reach out to schedule your child's free assessment. The assessment identifies your child's current level and which program fits — Math or English academic support, a STEAM program, or a summer camp.",
  },
]

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const baseUrl = getCanonicalSiteUrl()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Contact', url: absoluteSiteUrl('/contact', locale, baseUrl) },
  ])

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact GrowWise — Dublin, CA Tutoring Center",
    "description": "Contact GrowWise in Dublin, CA. Call, email, or visit us at 4564 Dublin Blvd. Book a free assessment or ask about our K-12 tutoring and STEAM programs.",
    "url": absoluteSiteUrl('/contact', locale, baseUrl),
    "mainEntity": {
      "@type": "EducationalOrganization",
      "name": "GrowWise",
      "telephone": CONTACT_INFO.phone,
      "email": CONTACT_INFO.email,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": CONTACT_INFO.street,
        "addressLocality": "Dublin",
        "addressRegion": "CA",
        "postalCode": CONTACT_INFO.zipCode,
        "addressCountry": "US",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQPageSchema(CONTACT_FAQS)) }}
      />
      <Contact />
    </>
  )
}




import { buildEducationalOrganizationSchema } from '@/lib/seo/educationalOrganizationSchema'

/**
 * Primary EducationalOrganization JSON-LD for local SEO (homepage / site-wide).
 * Phone and email use CONTACT_INFO inside {@link buildEducationalOrganizationSchema}.
 */
export default function LocalBusinessSchema() {
  const schema = buildEducationalOrganizationSchema()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

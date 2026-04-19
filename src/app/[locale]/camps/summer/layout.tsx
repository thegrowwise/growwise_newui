import { Metadata } from 'next';
import { generateMetadataFromPath } from '@/lib/seo/metadata';
import { generateEventSchema, generateBreadcrumbSchema, generateFAQPageSchema } from '@/lib/seo/structuredData';
import { CONTACT_INFO } from '@/lib/constants';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';
import summerCampFaqData from '../../../../../public/api/mock/en/summer-camp-faq.json';

// Q-SC1–SC4: hardcoded here so FAQPage JSON-LD lands in server HTML (page.tsx is 'use client')
const SUMMER_CAMP_FAQS = [
  {
    question: 'Are STEM summer camps actually worth it, or is it just organised screen time?',
    answer:
      'GrowWise summer camps are built around a tangible Friday output. By the end of the week, every student has completed something real — a working game, a programmed robot, a machine learning project, or a written piece ready for sharing. Instructors are subject experts in their program, not general activity supervisors. Small groups with a maximum of 8 students mean every student is actively building throughout the week.',
  },
  {
    question: 'How do I choose the right summer camp for my child if they have never done coding or robotics before?',
    answer:
      'Scratch camp is the recommended starting point for students with no coding experience. It uses visual block-based programming and is beginner-friendly from Grade 3. Students who enjoy Minecraft or Roblox but have not coded before typically do well in Roblox camp, which starts from the basics of Lua scripting. Robotics camp is hands-on engineering — no coding prerequisite. If you are unsure which camp fits your child, contact GrowWise before enrolling.',
  },
  {
    question: 'I want a summer camp that teaches real skills and is also engaging — not just lectures. Does GrowWise fit that?',
    answer:
      'GrowWise camps are structured around doing, not watching. Students spend the week building a project in their chosen subject. Scratch students code an animated project. Roblox students publish a game. Robotics students build and race a robot. Math Olympiad students work through competition-style problem sets. Young Authors students finish a written piece. Every camp ends with a demo or showcase of what students built that week.',
  },
  {
    question: 'What grades and ages are GrowWise summer camps designed for?',
    answer:
      'GrowWise summer camps are available for Grades K through 12. Most camps start from Grade 3. Advanced Math camps (Algebra II and Precalculus, and Math Olympiad) are designed for Grades 5 through 12. Each camp page lists the recommended grade range. Half-day and full-day formats are available depending on the camp. Camps are held at 4564 Dublin Blvd, Dublin, CA and serve families from Dublin, Pleasanton, San Ramon, and across the Tri-Valley.',
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const metadata = generateMetadataFromPath('/camps/summer', locale);
  return (
    metadata || {
      title: 'Summer Camp 2026 | GrowWise',
      description: 'Summer camp programs - Math, Coding, Robotics.',
    }
  );
}

export default async function SummerCampLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const baseUrl = getCanonicalSiteUrl();

  const eventSchema = generateEventSchema({
    name: 'Summer Camp 2026 - Math, Coding & Robotics',
    description:
      'Enrollment open for GrowWise Summer Camp 2026! Accredited courses in Math, Coding, Robotics, and more. Half-day and full-day camps. Small cohorts. Dublin, CA.',
    startDate: '2026-06-15T09:00:00-08:00',
    endDate: '2026-08-08T17:00:00-08:00',
    location: {
      name: 'GrowWise School',
      address: {
        streetAddress: CONTACT_INFO.street,
        addressLocality: 'Dublin',
        addressRegion: 'CA',
        postalCode: CONTACT_INFO.zipCode || '94568',
        addressCountry: 'US',
      },
    },
    organizer: {
      name: 'GrowWise',
      url: baseUrl,
    },
    image: `${baseUrl}/assets/growwise-logo.png`,
    offers: {
      price: '249',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteSiteUrl('/camps/summer', locale, baseUrl),
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteSiteUrl('/', locale, baseUrl) },
    { name: 'Camps', url: absoluteSiteUrl('/camps/summer', locale, baseUrl) },
    { name: 'Summer Camp 2026', url: absoluteSiteUrl('/camps/summer', locale, baseUrl) },
  ]);

  const faqSchema = generateFAQPageSchema(summerCampFaqData.faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

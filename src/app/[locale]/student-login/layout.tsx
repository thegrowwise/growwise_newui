import type { Metadata } from 'next';
import { absoluteSiteUrl } from '@/lib/publicPath';
import { getCanonicalSiteUrl } from '@/lib/seo/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getCanonicalSiteUrl();
  const url = absoluteSiteUrl('/student-login', locale, baseUrl);

  return {
    title: 'Student Login | GrowWise',
    description: 'Student login portal.',
    alternates: { canonical: url },
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
      },
    },
  };
}

export default function StudentLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

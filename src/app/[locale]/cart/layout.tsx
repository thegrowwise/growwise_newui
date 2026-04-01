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
  const url = absoluteSiteUrl('/cart', locale, baseUrl);

  return {
    title: 'Cart | GrowWise',
    description: 'Review your selected items before checkout.',
    alternates: { canonical: url },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}


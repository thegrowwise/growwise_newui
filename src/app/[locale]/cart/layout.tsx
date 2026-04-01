import type { Metadata } from 'next';

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.growwiseschool.org').replace(/\/$/, '');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${locale}/cart`;

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


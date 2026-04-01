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
  const url = `${baseUrl}/${locale}/student-login`;

  return {
    title: 'Student Login | GrowWise',
    description: 'Student login portal.',
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

export default function StudentLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}


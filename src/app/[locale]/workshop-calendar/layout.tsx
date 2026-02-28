import { Metadata } from 'next';
import { generateMetadataFromPath } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const metadata = generateMetadataFromPath('/workshop-calendar', locale);
  return metadata ?? { title: 'Workshop Calendar | GrowWise', description: 'Free Saturday skill workshops and parent webinars' };
}

export default function WorkshopCalendarLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}

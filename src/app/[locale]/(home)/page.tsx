import { getHomeDataServer } from '@/lib/homeDataServer';
import HomeClient from '@/components/pages/HomeClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const initialData = await getHomeDataServer(locale);
  return <HomeClient initialData={initialData} />;
}

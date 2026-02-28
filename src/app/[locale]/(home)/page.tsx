import Image from 'next/image';
import { getHomeDataServer } from '@/lib/homeDataServer';
import HomeClient from '@/components/pages/HomeClient';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const initialData = getHomeDataServer(locale);
  const firstSlideImage = initialData?.heroSlides?.[0]?.bgImage;

  return (
    <>
      {/* LCP: hero image in initial HTML; client HeroSection overlays same area */}
      {firstSlideImage ? (
        <div className="relative w-full h-[500px] lg:h-[550px] overflow-hidden -mb-[500px] lg:-mb-[550px] z-0" aria-hidden>
          <Image
            src={firstSlideImage}
            alt=""
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
        </div>
      ) : null}
      <HomeClient initialData={initialData} />
    </>
  );
}

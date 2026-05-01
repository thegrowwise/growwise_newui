import Image from 'next/image';
import { getValidLocale } from '@/i18n/localeConfig';
import { getHomeDataServer } from '@/lib/homeDataServer';
import HomeClient from '@/components/pages/HomeClient';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
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
            quality={70}
          />
        </div>
      ) : null}
      <HomeClient initialData={initialData} />
    </>
  );
}

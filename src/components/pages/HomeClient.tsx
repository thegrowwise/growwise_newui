'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations, useLocale } from 'next-intl';
import { RootState } from '@/store';
import { fetchHomeStart, fetchHomeSuccess } from '@/store/slices/homeSlice';
import { getIconComponent } from '@/lib/iconMap';
import { useChatbot } from '@/contexts/ChatbotContext';
import { HeroSection } from '../sections/home/HeroSection';
import { useRouter } from 'next/navigation';
import { publicPath } from '@/lib/publicPath';
import {
  HeroSkeleton,
  StatisticsSkeleton,
  PopularCoursesSkeleton,
  ProgramsSkeleton,
  WhyChooseSkeleton,
  TestimonialsSkeleton,
} from '../ui/loading-skeletons';
import type { HomeContentData } from '@/store/slices/homeSlice';

// SSR enabled (default): below-the-fold HTML ships in first response — better mobile parse/paint than client-only chunks.
const PopularCoursesSection = dynamic(
  () =>
    import('../sections/home/PopularCoursesSection').then((m) => ({
      default: m.PopularCoursesSection,
    })),
  { loading: () => <PopularCoursesSkeleton /> }
);

const StatisticsSection = dynamic(
  () => import('../sections/home/StatisticsSection').then((m) => ({ default: m.StatisticsSection })),
  { loading: () => <StatisticsSkeleton /> }
);

const ProgramsSection = dynamic(
  () => import('../sections/home/ProgramsSection').then((m) => ({ default: m.ProgramsSection })),
  { loading: () => <ProgramsSkeleton /> }
);

const WhyChooseSection = dynamic(
  () => import('../sections/home/WhyChooseSection').then((m) => ({ default: m.WhyChooseSection })),
  { loading: () => <WhyChooseSkeleton /> }
);

const TestimonialsSection = dynamic(
  () => import('../sections/home/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })),
  { loading: () => <TestimonialsSkeleton /> }
);

const CtaSection = dynamic(() =>
  import('../sections/home/CtaSection').then((m) => ({ default: m.CtaSection })),
);

const FreeAssessmentModal = dynamic(
  () => import('../FreeAssessmentModal'),
  { ssr: false }
);

const STEAMTrialModal = dynamic(
  () => import('../ui/STEAMTrialModal'),
  { ssr: false }
);

interface HomeClientProps {
  initialData: HomeContentData | null;
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const storeState = useSelector((s: RootState) => s.home);
  const { data: storeData, loading: storeLoading, error } = storeState;

  // Use server data for first paint (LCP) when available; otherwise use store
  const data = initialData ?? storeData;
  const loading = !initialData && storeLoading;

  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSTEAMTrialModalOpen, setIsSTEAMTrialModalOpen] = useState(false);
  const openAssessmentModal = useCallback(() => setIsAssessmentModalOpen(true), []);
  const closeAssessmentModal = useCallback(() => setIsAssessmentModalOpen(false), []);
  const openSTEAMTrialModal = useCallback(() => setIsSTEAMTrialModalOpen(true), []);
  const closeSTEAMTrialModal = useCallback(() => setIsSTEAMTrialModalOpen(false), []);
  const navigateToEnrollForm = useCallback(
    () => router.push(publicPath('/enroll-academic', locale) + '#enrollment-form'),
    [router, locale],
  );
  const { openChatbot } = useChatbot();

  const heroSlides = useMemo(
    () =>
      (data?.heroSlides || []).map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        cta: s.cta,
        secondaryCta: s.secondaryCta,
        secondaryCtaUrl: s.secondaryCtaUrl,
        IconComponent: getIconComponent(s.icon),
        bgGradient: s.bgGradient,
        iconColor: s.iconColor,
        ctaColor: s.ctaColor,
        bgImage: s.bgImage,
        onClick:
          s.id === 1
            ? openAssessmentModal
            : s.id === 2
              ? openSTEAMTrialModal
              : s.id === 3
                ? navigateToEnrollForm
                : openAssessmentModal,
      })),
    [data, openAssessmentModal, openSTEAMTrialModal, navigateToEnrollForm]
  );

  const popularCourses = useMemo(
    () =>
      (data?.popularCourses || []).map((c) => {
        const raw = typeof c.href === 'string' ? c.href.trim() : '';
        // ELA / English card is id 4 in mocks; some API payloads omit `href` — keep navigation working.
        const href =
          raw ||
          (c.id === 4 ? '/courses/english' : undefined);
        return {
          ...c,
          href,
          IconComponent: getIconComponent(c.icon),
        };
      }),
    [data]
  );

  const statisticsData = useMemo(
    () =>
      (data?.statisticsData || []).map((s) => ({
        id: s.id,
        value: s.value,
        label: s.label,
        IconComponent: getIconComponent(s.icon),
        color: s.color,
        bgColor: s.bgColor,
      })),
    [data]
  );

  const k12Programs = useMemo(
    () =>
      (data?.k12Programs || []).map((p) => ({
        ...p,
        IconComponent: getIconComponent(p.icon),
      })),
    [data]
  );

  const steamPrograms = useMemo(
    () =>
      (data?.steamPrograms || []).map((p) => ({
        ...p,
        IconComponent: getIconComponent(p.icon),
      })),
    [data]
  );

  const whyChooseUs = useMemo(
    () =>
      (data?.whyChooseUs || []).map((w) => ({
        ...w,
        IconComponent: getIconComponent(w.icon),
      })),
    [data]
  );

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialData) {
      dispatch(fetchHomeSuccess(initialData));
    } else {
      dispatch(fetchHomeStart());
    }
  }, [dispatch, initialData]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % (heroSlides.length || 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [heroSlides.length, isPaused]);

  const nextHeroSlide = () =>
    setCurrentHeroSlide((prev) => (prev + 1) % (heroSlides.length || 1));
  const prevHeroSlide = () =>
    setCurrentHeroSlide((prev) => (prev - 1 + (heroSlides.length || 1)) % (heroSlides.length || 1));
  const goToHeroSlide = (index: number) =>
    setCurrentHeroSlide(index % (heroSlides.length || 1));
  const pauseCarousel = () => setIsPaused(true);
  const resumeCarousel = () => setIsPaused(false);

  // Failed fetch with no server data: show error — do not leave the user on a permanent skeleton.
  if (error && !data) {
    return (
      <div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4"
        style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}
      >
        <p className="text-center text-red-700 max-w-md">{error}</p>
        <button
          type="button"
          onClick={() => dispatch(fetchHomeStart())}
          className="rounded-full bg-[#1F396D] px-6 py-2 text-white hover:bg-[#29335C]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div
        className="relative z-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
        style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}
      >
        <HeroSkeleton />
        <PopularCoursesSkeleton />
        <StatisticsSkeleton />
        <ProgramsSkeleton />
        <WhyChooseSkeleton />
        <TestimonialsSkeleton />
      </div>
    );
  }

  return (
    <div
      className="relative z-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
      style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}
    >
      <HeroSection
        slides={heroSlides as any}
        currentIndex={currentHeroSlide}
        onPrev={prevHeroSlide}
        onNext={nextHeroSlide}
        onGoTo={goToHeroSlide}
        onMouseEnter={pauseCarousel}
        onMouseLeave={resumeCarousel}
        error={error}
        onRetry={() => dispatch(fetchHomeStart())}
        lcpImageInDocument={!!initialData}
      />

      <PopularCoursesSection
        courses={popularCourses as any}
        error={error}
        onRetry={() => dispatch(fetchHomeStart())}
      />

      <StatisticsSection
        title={
          <span>
            {t('home.statistics.titlePrefix')}
            <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">
              {t('home.statistics.titleHighlight')}
            </span>
          </span>
        }
        subtitle={t('home.statistics.subtitle')}
        stats={statisticsData as any}
        error={error}
        onRetry={() => dispatch(fetchHomeStart())}
      />

      <ProgramsSection k12={k12Programs as any} steam={steamPrograms as any} />

      <WhyChooseSection
        items={whyChooseUs as any}
        error={error}
        onRetry={() => dispatch(fetchHomeStart())}
      />

      <TestimonialsSection
        fallbackTestimonials={data?.testimonials ?? null}
        homeError={error}
        onRetryHome={() => dispatch(fetchHomeStart())}
      />

      <CtaSection
        title={data?.cta?.title || t('home.cta.title')}
        subtitle={data?.cta?.subtitle || t('home.cta.subtitle')}
        primaryText={data?.cta?.primaryCta || t('home.cta.primaryCta')}
        secondaryText={data?.cta?.secondaryCta || t('home.cta.secondaryCta')}
        onPrimary={openAssessmentModal}
        onSecondary={openChatbot}
      />

      <FreeAssessmentModal isOpen={isAssessmentModalOpen} onClose={closeAssessmentModal} />
      <STEAMTrialModal isOpen={isSTEAMTrialModalOpen} onClose={closeSTEAMTrialModal} />
    </div>
  );
}

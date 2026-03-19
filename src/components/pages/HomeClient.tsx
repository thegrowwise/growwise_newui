'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { RootState } from '@/store';
import { fetchHomeStart, fetchHomeSuccess } from '@/store/slices/homeSlice';
import { getIconComponent } from '@/lib/iconMap';
import { useChatbot } from '@/contexts/ChatbotContext';
import { HeroSection } from '../sections/home/HeroSection';
import { useRouter } from 'next/navigation';
import { PopularCoursesSection } from '../sections/home/PopularCoursesSection';
import { useTestimonials } from '@/hooks/useTestimonials';
import {
  HeroSkeleton,
  StatisticsSkeleton,
  PopularCoursesSkeleton,
  ProgramsSkeleton,
  WhyChooseSkeleton,
  TestimonialsSkeleton,
} from '../ui/loading-skeletons';
import type { HomeContentData } from '@/store/slices/homeSlice';

const StatisticsSection = dynamic(
  () => import('../sections/home/StatisticsSection').then((m) => ({ default: m.StatisticsSection })),
  { ssr: false, loading: () => <StatisticsSkeleton /> }
);

const ProgramsSection = dynamic(
  () => import('../sections/home/ProgramsSection').then((m) => ({ default: m.ProgramsSection })),
  { ssr: false, loading: () => <ProgramsSkeleton /> }
);

const WhyChooseSection = dynamic(
  () => import('../sections/home/WhyChooseSection').then((m) => ({ default: m.WhyChooseSection })),
  { ssr: false, loading: () => <WhyChooseSkeleton /> }
);

const TestimonialsSection = dynamic(
  () => import('../sections/home/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })),
  { ssr: false, loading: () => <TestimonialsSkeleton /> }
);

const CtaSection = dynamic(
  () => import('../sections/home/CtaSection').then((m) => ({ default: m.CtaSection })),
  { ssr: false }
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
  const storeState = useSelector((s: RootState) => s.home);
  const { data: storeData, loading: storeLoading, error } = storeState;

  // Use server data for first paint (LCP) when available; otherwise use store
  const data = initialData ?? storeData;
  const loading = !initialData && storeLoading;

  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isSTEAMTrialModalOpen, setIsSTEAMTrialModalOpen] = useState(false);
  const openAssessmentModal = () => setIsAssessmentModalOpen(true);
  const closeAssessmentModal = () => setIsAssessmentModalOpen(false);
  const openSTEAMTrialModal = () => setIsSTEAMTrialModalOpen(true);
  const closeSTEAMTrialModal = () => setIsSTEAMTrialModalOpen(false);
  const navigateToEnrollForm = () => router.push('/enroll-academic#enrollment-form');
  const { openChatbot } = useChatbot();

  const heroSlides = useMemo(
    () =>
      (data?.heroSlides || []).map((s) => ({
        id: s.id,
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        cta: s.cta,
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
    [data]
  );

  const popularCourses = useMemo(
    () =>
      (data?.popularCourses || []).map((c) => ({
        ...c,
        IconComponent: getIconComponent(c.icon),
      })),
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

  const {
    testimonials: apiTestimonials,
    error: testimonialsError,
    retry: retryTestimonials,
  } = useTestimonials({
    limit: 20,
    autoRefresh: true,
    refreshInterval: 300000,
    minRating: 4,
  });

  const testimonials = useMemo(() => {
    if (apiTestimonials && apiTestimonials.length > 0) return apiTestimonials;
    return data?.testimonials || [];
  }, [apiTestimonials, data?.testimonials]);

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

  if (loading || !data || (data && (!data.heroSlides || data.heroSlides.length === 0))) {
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
        testimonials={testimonials as any}
        error={testimonialsError || error}
        onRetry={() => {
          retryTestimonials();
          dispatch(fetchHomeStart());
        }}
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

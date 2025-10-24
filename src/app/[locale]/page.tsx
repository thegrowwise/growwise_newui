"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import FreeAssessmentModal from '../../components/FreeAssessmentModal';
import { RootState } from '../../store';
import { fetchHomeStart } from '../../store/slices/homeSlice';
import { getIconComponent } from '../../lib/iconMap';
import { useChatbot } from '../../contexts/ChatbotContext';
import { HeroSection } from '../../components/sections/home/HeroSection';
import { PopularCoursesSection } from '../../components/sections/home/PopularCoursesSection';
import { StatisticsSection } from '../../components/sections/home/StatisticsSection';
import { ProgramsSection } from '../../components/sections/home/ProgramsSection';
import { WhyChooseSection } from '../../components/sections/home/WhyChooseSection';
import { TestimonialsSection } from '../../components/sections/home/TestimonialsSection';
import { CtaSection } from '../../components/sections/home/CtaSection';

export default function Home() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((s: RootState) => s.home);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const openAssessmentModal = () => setIsAssessmentModalOpen(true);
  const closeAssessmentModal = () => setIsAssessmentModalOpen(false);
  const { openChatbot } = useChatbot();

  const heroSlides = useMemo(() => (data?.heroSlides || []).map((s) => ({
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
    onClick: openAssessmentModal
  })), [data]);

  const popularCourses = useMemo(() => (data?.popularCourses || []).map((c) => ({
    ...c,
    IconComponent: getIconComponent(c.icon),
  })), [data]);

  const statisticsData = useMemo(() => (data?.statisticsData || []).map((s) => ({
    id: s.id,
    value: s.value,
    label: s.label,
    IconComponent: getIconComponent(s.icon),
    color: s.color,
    bgColor: s.bgColor,
  })), [data]);

  const k12Programs = useMemo(() => (data?.k12Programs || []).map((p) => ({
    ...p,
    IconComponent: getIconComponent(p.icon),
  })), [data]);

  const steamPrograms = useMemo(() => (data?.steamPrograms || []).map((p) => ({
    ...p,
    IconComponent: getIconComponent(p.icon),
  })), [data]);

  const testimonials = useMemo(() => data?.testimonials || [], [data]);
  const whyChooseUs = useMemo(() => (data?.whyChooseUs || []).map((w) => ({ ...w, IconComponent: getIconComponent(w.icon) })), [data]);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchHomeStart());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % (heroSlides.length || 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextHeroSlide = () => setCurrentHeroSlide((prev) => (prev + 1) % (heroSlides.length || 1));
  const prevHeroSlide = () => setCurrentHeroSlide((prev) => (prev - 1 + (heroSlides.length || 1)) % (heroSlides.length || 1));
  const goToHeroSlide = (index: number) => setCurrentHeroSlide(index % (heroSlides.length || 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      <HeroSection slides={heroSlides as any} currentIndex={currentHeroSlide} onPrev={prevHeroSlide} onNext={nextHeroSlide} onGoTo={goToHeroSlide} error={error} onRetry={() => dispatch(fetchHomeStart())} />

      <PopularCoursesSection courses={popularCourses as any} error={error} onRetry={() => dispatch(fetchHomeStart())} />

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

      <WhyChooseSection items={whyChooseUs as any} error={error} onRetry={() => dispatch(fetchHomeStart())} />

      <TestimonialsSection testimonials={testimonials as any} error={error} onRetry={() => dispatch(fetchHomeStart())} />

      <CtaSection
        title={data?.cta?.title || t('home.cta.title')}
        subtitle={data?.cta?.subtitle || t('home.cta.subtitle')}
        primaryText={data?.cta?.primaryCta || t('home.cta.primaryCta')}
        secondaryText={data?.cta?.secondaryCta || t('home.cta.secondaryCta')}
        onPrimary={openAssessmentModal}
        onSecondary={openChatbot}
      />

      <FreeAssessmentModal isOpen={isAssessmentModalOpen} onClose={closeAssessmentModal} />
    </div>
  );
}

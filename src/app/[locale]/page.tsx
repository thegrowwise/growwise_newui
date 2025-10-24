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
import TestimonialsWithBackend from '../../components/sections/TestimonialsWithBackend';
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
    onClick: openAssessmentModal,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#1F396D]/10 rounded-full blur-3xl animate-float-gentle"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#F16112]/10 rounded-full blur-3xl animate-float-gentle animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#29335C]/10 rounded-full blur-3xl animate-float-gentle animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#F1894F]/10 rounded-full blur-3xl animate-float-gentle animation-delay-6000"></div>
        <div className="absolute bottom-1/3 right-20 w-56 h-56 bg-[#1F396D]/5 rounded-full blur-2xl animate-float-gentle animation-delay-8000"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#F16112]/30 rounded-full animate-float-rotate animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#1F396D]/30 rounded-full animate-float-rotate animation-delay-3000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-[#F1894F]/30 rounded-full animate-float-rotate animation-delay-5000"></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-[#29335C]/30 rounded-full animate-float-rotate animation-delay-7000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-[#F16112]/20 rounded-full animate-float-rotate animation-delay-9000"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#1F396D]/20 to-[#F16112]/20 rounded-full blur-2xl animate-pulse-glow"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-[#F16112]/20 to-[#F1894F]/20 rounded-full blur-2xl animate-pulse-glow animation-delay-2000"></div>
      </div>
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

      <TestimonialsWithBackend />

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

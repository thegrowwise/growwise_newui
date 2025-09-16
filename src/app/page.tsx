"use client";

import React, { useEffect, useState } from 'react';
import ImageWithFallback from '@/components/gw/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Code,
  Users,
  Bot,
  Book,
  BookMarked,
  ThumbsUp,
  Gamepad2,
  Lightbulb,
  Brain,
  Award,
  PenTool,
  Calculator,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';

export default function Home() {
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const openAssessmentModal = () => setIsAssessmentModalOpen(true);
  const closeAssessmentModal = () => setIsAssessmentModalOpen(false);

  const heroSlides = [
    {
      id: 1,
      title: 'Master the Core',
      subtitle: 'Personalized and small group learning',
      description:
        "Build strong academic foundations with expert K-12 instruction tailored to your child's learning style.",
      cta: 'Book 60 minutes Free Assessment',
      icon: BookOpen,
      bgGradient: 'bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#2a4a7c]',
      iconColor: 'text-white',
      ctaColor: 'bg-[#F1894F] hover:bg-[#F16112] text-white',
      bgImage:
        'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop',
      onClick: openAssessmentModal
    },
    {
      id: 2,
      title: 'Build. Code, Create',
      subtitle: 'STEAM courses',
      description:
        'Hands-on STEAM learning with Roblox, Scratch, Python, ML/AI, and Young Entrepreneurship programs.',
      cta: 'Book 30 minutes trial class',
      icon: Code,
      bgGradient: 'bg-gradient-to-br from-[#F16112] via-[#F1894F] to-[#d54f0a]',
      iconColor: 'text-white',
      ctaColor: 'bg-[#1F396D] hover:bg-[#29335C] text-white',
      bgImage:
        'https://images.unsplash.com/photo-1548686304-89d188a80029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY29kaW5nJTIwY29tcHV0ZXIlMjBwcm9ncmFtbWluZyUyMFNURUFNfGVufDF8fHx8MTc1NzQ4Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: 'One-on-One Tuition',
      subtitle: '100% personal attention',
      description:
        'Specially designed for homework help and targeted learning support for kids who need focused attention.',
      cta: 'Register Now',
      icon: Users,
      bgGradient: 'bg-gradient-to-br from-[#1F396D] via-[#F16112] to-[#F1894F]',
      iconColor: 'text-white',
      ctaColor: 'bg-white hover:bg-gray-100 text-[#1F396D]',
      bgImage:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop'
    }
  ];

  const popularCourses = [
    {
      id: 1,
      name: 'Python Coding',
      benefit: 'Project-based',
      icon: Code,
      bgColor: 'bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/20',
      iconColor: 'text-[#1F396D]',
      borderColor: 'border-[#1F396D]/30',
      cta: 'Free Assessment',
      onClick: openAssessmentModal
    },
    {
      id: 2,
      name: 'Math Mastery',
      benefit: '1:1 attention',
      icon: Calculator,
      bgColor: 'bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/20',
      iconColor: 'text-[#F16112]',
      borderColor: 'border-[#F16112]/30',
      cta: 'Free Assessment',
      onClick: openAssessmentModal
    },
    {
      id: 3,
      name: 'AI Explorer',
      benefit: 'Future-ready',
      icon: Bot,
      bgColor: 'bg-gradient-to-br from-[#F1894F]/10 to-[#F16112]/20',
      iconColor: 'text-[#1F396D]',
      borderColor: 'border-[#F1894F]/30',
      cta: 'Free Assessment',
      onClick: openAssessmentModal
    },
    {
      id: 4,
      name: 'Reading Mastery',
      benefit: 'Accelerated growth',
      icon: Book,
      bgColor: 'bg-gradient-to-br from-[#29335C]/10 to-[#1F396D]/20',
      iconColor: 'text-[#F16112]',
      borderColor: 'border-[#29335C]/30',
      cta: 'Free Assessment',
      onClick: openAssessmentModal
    }
  ];

  const statisticsData = [
    { id: 1, value: '300+', label: 'Students Enrolled', icon: Users, color: 'text-[#1F396D]', bgColor: 'bg-[#1F396D]/10' },
    { id: 2, value: '25+', label: 'Courses Offered', icon: BookMarked, color: 'text-[#F16112]', bgColor: 'bg-[#F16112]/10' },
    { id: 3, value: '98%', label: 'Students Satisfaction', icon: ThumbsUp, color: 'text-[#F1894F]', bgColor: 'bg-[#F1894F]/10' }
  ];

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [statsInView, setStatsInView] = useState(false);

  // Animated counter hook (mirrors Vite behavior)
  const useCounterAnimation = (endValue: number, duration: number = 2000) => {
    const [currentValue, setCurrentValue] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (!hasStarted) return;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCurrentValue(Math.floor(easeOutQuart * endValue));
        if (progress === 1) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }, [endValue, duration, hasStarted]);

    return { currentValue, start: () => setHasStarted(true) };
  };

  // K-12 Programs and STEAM Programs (mirroring Vite)
  const k12Programs = [
    {
      id: 1,
      title: 'Math Courses',
      description: 'Build strong mathematical foundations from elementary to advanced levels',
      icon: Calculator,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]'
    },
    {
      id: 2,
      title: 'ELA Courses',
      description: 'Develop comprehensive English language arts skills',
      icon: BookOpen,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]'
    },
    {
      id: 3,
      title: 'Writing Lab',
      description: 'Master the art of effective written communication',
      icon: PenTool,
      gradient: 'from-[#F1894F] to-[#F16112]',
      bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10',
      iconColor: 'text-[#F1894F]'
    },
    {
      id: 4,
      title: 'SAT/ACT',
      description: 'Achieve your best scores with comprehensive test preparation',
      icon: Award,
      gradient: 'from-[#1F396D] to-[#F16112]',
      bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
      iconColor: 'text-[#1F396D]'
    }
  ];

  const steamPrograms = [
    {
      id: 1,
      title: 'Game Development',
      description: 'Create immersive games and interactive experiences',
      icon: Gamepad2,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]'
    },
    {
      id: 2,
      title: 'Python Programming',
      description: "Master the world's most popular programming language",
      icon: Code,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]'
    },
    {
      id: 3,
      title: 'Young Founders',
      description: 'Develop entrepreneurial skills and business mindset',
      icon: Lightbulb,
      gradient: 'from-[#F1894F] to-[#F16112]',
      bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10',
      iconColor: 'text-[#F1894F]'
    },
    {
      id: 4,
      title: 'ML/Gen AI',
      description: 'Explore artificial intelligence and machine learning',
      icon: Brain,
      gradient: 'from-[#1F396D] to-[#F16112]',
      bgGradient: 'bg-gradient-to-br from-[#29335C]/5 to-[#1F396D]/10',
      iconColor: 'text-[#1F396D]'
    }
  ];

  const whyChooseUs = [
    { icon: Users, title: 'Expert Instructors', description: 'Learn from certified teachers with years of experience' },
    { icon: Award, title: 'Proven Results', description: '95% of our students show measurable improvement' },
    { icon: BookOpen, title: 'Comprehensive Curriculum', description: 'Aligned with state standards and modern needs' },
    { icon: Lightbulb, title: 'Hands-on Learning', description: 'Interactive labs and projects make learning memorable' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Parent', content: "GrowWise transformed my daughter's learning.", rating: 5, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
    { name: 'Michael Chen', role: 'Student', content: 'The STEAM programs opened a world of possibilities.', rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Lisa Rodriguez', role: 'Parent', content: 'Personalized attention and innovative methods stand out.', rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
  ];

  useEffect(() => {
    const id = setInterval(() => setCurrentHeroSlide((p) => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCurrentCourseIndex((p) => (p + 1) % Math.ceil(popularCourses.length / 4)), 6000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true);
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const nextHeroSlide = () => setCurrentHeroSlide((p) => (p + 1) % heroSlides.length);
  const prevHeroSlide = () => setCurrentHeroSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length);
  const nextCourses = () => setCurrentCourseIndex((p) => (p + 1) % Math.ceil(popularCourses.length / 4));
  const prevCourses = () => setCurrentCourseIndex((p) => (p - 1 + Math.ceil(popularCourses.length / 4)) % Math.ceil(popularCourses.length / 4));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative py-16 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-60 left-1/2 w-24 h-24 bg-[#29335C]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="relative bg-white/20 backdrop-blur-3xl rounded-[40px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] overflow-hidden border border-white/50 ring-1 ring-white/20">
            <div className="relative h-[500px] lg:h-[550px] overflow-hidden">
              {heroSlides.map((slide, index) => {
                const IconComponent = slide.icon as any;
                const isActive = index === currentHeroSlide;
                return (
                  <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                    <div className="relative h-full flex flex-col lg:flex-row items-center overflow-hidden">
                      <div className="absolute inset-0">
                        <ImageWithFallback src={slide.bgImage} alt={slide.title} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 ${slide.bgGradient} opacity-85`}></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
                        <div className="absolute inset-0 backdrop-blur-[0.5px]"></div>
                      </div>
                      <div className="flex-1 text-center lg:text-left p-10 lg:p-16 relative z-10 lg:max-w-lg">
                        <div className={`transform transition-all duration-1000 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">{slide.title}</h1>
                          <h2 className="text-xl lg:text-2xl mb-6 text-white/95 font-semibold">{slide.subtitle}</h2>
                          <p className="text-base lg:text-lg mb-8 text-white/85 leading-relaxed">{slide.description}</p>
                          <Button onClick={slide.onClick} className={`${slide.ctaColor} rounded-full px-8 py-4 font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 text-base lg:text-lg backdrop-blur-sm border border-white/20`}>
                            {slide.cta}
                            <ChevronRight className="ml-2 w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 flex justify-center lg:justify-end items-center p-10 lg:p-16 relative z-10">
                        <div className={`transform transition-all duration-1000 ${isActive ? 'scale-100 opacity-100 rotate-0' : 'scale-90 opacity-0 rotate-12'}`}>
                          <div className="relative">
                            <div className="w-36 h-36 lg:w-44 lg:h-44 bg-white/30 backdrop-blur-2xl rounded-full flex items-center justify-center border-2 border-white/60 shadow-[0px_20px_60px_rgba(255,255,255,0.3)] ring-1 ring-white/40">
                              <IconComponent className={`w-20 h-20 lg:w-24 lg:h-24 ${slide.iconColor} drop-shadow-lg`} />
                            </div>
                            <div className="absolute -inset-6 border-2 border-white/30 rounded-full animate-pulse backdrop-blur-sm"></div>
                            <div className="absolute -inset-12 border border-white/20 rounded-full animate-pulse backdrop-blur-sm" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute -inset-16 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hero controls */}
            <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-between px-4 lg:px-6">
              <Button variant="outline" className="bg-white/70 backdrop-blur border-white/80 text-gray-700 hover:bg-white" onClick={prevHeroSlide}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex gap-2">
                {heroSlides.map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentHeroSlide ? 'bg-white' : 'bg-white/50'}`}></div>
                ))}
              </div>
              <Button variant="outline" className="bg-white/70 backdrop-blur border-white/80 text-gray-700 hover:bg-white" onClick={nextHeroSlide}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Popular Programs</h2>
              <p className="text-gray-600">Explore our most loved programs by students and families</p>
            </div>
            <div className="hidden md:flex gap-2">
              <Button variant="outline" onClick={prevCourses}>Prev</Button>
              <Button onClick={nextCourses} className="bg-[#1F396D] hover:bg-[#29335C]">Next</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCourses.map((c) => {
              const Icon = c.icon as any;
              return (
                <Card key={c.id} className={`relative ${c.bgColor} border ${c.borderColor} rounded-[20px] shadow-[0_10px_30px_rgba(31,57,109,0.1)]`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${c.iconColor}`} />
                      </div>
                      <div className="font-semibold text-gray-900">{c.name}</div>
                    </div>
                    <p className="text-gray-600 mb-6">{c.benefit}</p>
                    <Button onClick={c.onClick} className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white rounded-full">{c.cta}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats-section" className="py-16 px-4 lg:px-8 bg-white/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {statisticsData.map((stat, i) => {
            const IconComponent = stat.icon as any;
            const numericValue = parseInt(stat.value.replace(/\D/g, ''));
            const { currentValue, start } = useCounterAnimation(numericValue, 2000);

            useEffect(() => {
              if (statsInView) {
                const t = setTimeout(() => start(), i * 150);
                return () => clearTimeout(t);
              }
            }, [statsInView]);

            const formatValue = (v: number) => {
              if (stat.value.includes('%')) return `${v}%`;
              if (stat.value.includes('+')) return `${v}+`;
              return v.toString();
            };

            return (
              <Card key={stat.id} className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 ring-1 ring-white/30">
                <CardContent className="p-8 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                  <div className={`${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/20 border-2 border-white/40`}>
                    <IconComponent className={`w-10 h-10 ${stat.color}`} />
                  </div>
                  <div className="mb-2">
                    <h3 className={`text-4xl font-bold ${stat.color}`}>{statsInView ? formatValue(currentValue) : '0'}</h3>
                  </div>
                  <p className="text-gray-700 font-semibold">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* K-12 Programs */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">K-12 Academic Programs</h2>
            <p className="text-gray-600">Comprehensive foundation building from elementary to high school</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {k12Programs.map((p) => {
              const Icon = p.icon as any;
              return (
                <Card key={p.id} className={`bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 overflow-hidden ring-1 ring-white/30`}>
                  <div className={`absolute inset-0 ${p.bgGradient} opacity-60`}></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${p.gradient} shadow-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{p.description}</p>
                    <Button className="w-full bg-[#1F396D] hover:bg-[#29335C] text-white rounded-xl">Explore</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* STEAM Programs */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">STEAM Programs</h2>
            <p className="text-gray-600">Hands-on technology and creativity for future innovators</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steamPrograms.map((p) => {
              const Icon = p.icon as any;
              return (
                <Card key={p.id} className={`bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 overflow-hidden ring-1 ring-white/30`}>
                  <div className={`absolute inset-0 ${p.bgGradient} opacity-60`}></div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${p.gradient} shadow-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{p.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">{p.description}</p>
                    <Button className="w-full bg-[#F16112] hover:bg-[#d54f0a] text-white rounded-xl">Explore</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose GrowWise?</h2>
            <p className="text-gray-600">What makes our programs effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => {
              const Icon = item.icon as any;
              return (
                <Card key={i} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 ring-1 ring-white/30">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/60 border-2 border-white/70 ring-1 ring-white/30 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[#1F396D]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What Families Say</h2>
            <p className="text-gray-600">Real stories from parents and students</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white/80 rounded-2xl shadow-lg border border-white/60">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-5 h-5 fill-[#F16112] text-[#F16112]" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">“{t.content}”</p>
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{t.name}</p>
                      <p className="text-sm text-gray-600">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Assessment Modal */}
      <Dialog open={isAssessmentModalOpen} onOpenChange={setIsAssessmentModalOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-3xl border-2 border-white/70 shadow-[0px_40px_120px_rgba(31,57,109,0.3)] rounded-[24px] p-0 ring-1 ring-white/40">
          <DialogHeader className="p-6 border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900">Book a Free Assessment</DialogTitle>
            <DialogDescription className="text-gray-600">Tell us a bit about your child and we’ll reach out.</DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" placeholder="Jane Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" placeholder="Student" />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input id="grade" placeholder="e.g., 6" />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Any goals or areas to focus on..." />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={closeAssessmentModal}>Cancel</Button>
              <Button className="bg-[#1F396D] hover:bg-[#29335C] text-white">Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

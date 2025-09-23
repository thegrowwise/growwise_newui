"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/layout/Header';
import { ImageWithFallback } from '../components/gw/ImageWithFallback';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronDown, Users, BookOpen, Code, Calculator, Bot, Book, BookMarked, ThumbsUp, Award, PenTool, GraduationCap, Rocket, Gamepad2, Lightbulb, Brain, Microscope, Shield, Sparkles, Star } from 'lucide-react';
import FreeAssessmentModal from '../components/FreeAssessmentModal';
import CourseCustomizationModal from '../components/gw/CourseCustomizationModal';
import StartChatButton from '../components/chatbot/StartChatButton';
import { useChatbot } from '../contexts/ChatbotContext';

export default function Home() {
  // --- Homepage logic, state, and data arrays ---
  // Modal state for Free Assessment
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const openAssessmentModal = () => setIsAssessmentModalOpen(true);
  const closeAssessmentModal = () => setIsAssessmentModalOpen(false);
  
  // Chatbot state
  const { openChatbot } = useChatbot();
  // Dummy course and handler for modal
  const dummyCourse = { id: 'demo', name: 'Demo Course', image: '', category: 'Demo' };
  const handleAddToCart = (item: any) => {};

  // Hero carousel data
  const heroSlides = [
    {
      id: 1,
      title: "Master the Core",
      subtitle: "Personalized and small group learning",
      description: "Build strong academic foundations with expert K-12 instruction tailored to your child's learning style.",
      cta: "Book 60 minutes Free Assessment",
      icon: BookOpen,
      bgGradient: "bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#2a4a7c]",
      iconColor: "text-white",
      ctaColor: "bg-[#F1894F] hover:bg-[#F16112] text-white",
      bgImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop",
      onClick: openAssessmentModal
    },
    {
      id: 2,
      title: "Build. Code, Create",
      subtitle: "STEAM courses", 
      description: "Hands-on STEAM learning with Roblox, Scratch, Python, ML/AI, and Young Entrepreneurship programs.",
      cta: "Book 30 minutes trial class",
      icon: Code,
      bgGradient: "bg-gradient-to-br from-[#F16112] via-[#F1894F] to-[#d54f0a]",
      iconColor: "text-white",
      ctaColor: "bg-[#1F396D] hover:bg-[#29335C] text-white",
      bgImage: "https://images.unsplash.com/photo-1548686304-89d188a80029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwY29kaW5nJTIwY29tcHV0ZXIlMjBwcm9ncmFtbWluZyUyMFNURUFNfGVufDF8fHx8MTc1NzQ4Mjg3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      onClick: openAssessmentModal
    },
    {
      id: 3,
      title: "One-on-One Tuition",
      subtitle: "100% personal attention",
      description: "Specially designed for specific homework help and targeted learning support for kids who need focused attention.",
      cta: "Register Now",
      icon: Users,
      bgGradient: "bg-gradient-to-br from-[#1F396D] via-[#F16112] to-[#F1894F]",
      iconColor: "text-white",
      ctaColor: "bg-white hover:bg-gray-100 text-[#1F396D]",
      bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop",
      onClick: openAssessmentModal
    }
  ];

  // Popular Courses
  const popularCourses = [
    { id: 1, name: "Python Coding", benefit: "Project-based", icon: Code, bgColor: "bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/20", iconColor: "text-[#1F396D]", borderColor: "border-[#1F396D]/30", cta: "Free Assessment", onClick: openAssessmentModal },
    { id: 2, name: "Math Mastery", benefit: "1:1 attention", icon: Calculator, bgColor: "bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/20", iconColor: "text-[#F16112]", borderColor: "border-[#F16112]/30", cta: "Free Assessment", onClick: openAssessmentModal },
    { id: 3, name: "AI Explorer", benefit: "Future-ready", icon: Bot, bgColor: "bg-gradient-to-br from-[#F1894F]/10 to-[#F16112]/20", iconColor: "text-[#1F396D]", borderColor: "border-[#F1894F]/30", cta: "Free Assessment", onClick: openAssessmentModal },
    { id: 4, name: "Reading Mastery", benefit: "Accelerated growth", icon: Book, bgColor: "bg-gradient-to-br from-[#29335C]/10 to-[#1F396D]/20", iconColor: "text-[#F16112]", borderColor: "border-[#29335C]/30", cta: "Free Assessment", onClick: openAssessmentModal }
  ];

  // Statistics Data
  const statisticsData = [
    { id: 1, value: "300+", label: "Students Enrolled", icon: Users, color: "text-[#1F396D]", bgColor: "bg-[#1F396D]/10" },
    { id: 2, value: "25+", label: "Courses Offered", icon: BookMarked, color: "text-[#F16112]", bgColor: "bg-[#F16112]/10" },
    { id: 3, value: "98%", label: "Students Satisfaction", icon: ThumbsUp, color: "text-[#F1894F]", bgColor: "bg-[#F1894F]/10" }
  ];

  // K-12 Programs
  const k12Programs = [
    { id: 1, title: 'Math Courses', description: 'Build strong mathematical foundations from elementary to advanced levels', icon: Calculator, gradient: 'from-[#1F396D] to-[#29335C]', bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10', iconColor: 'text-[#1F396D]', href: '/courses/math', subItems: [
      { name: 'Elementary Math', icon: '🔢', description: 'Basic arithmetic and number sense' },
      { name: 'Middle School Math', icon: '📊', description: 'Algebra and geometry foundations' },
      { name: 'DUSD Accelerated Math', icon: '🚀', description: 'Advanced placement preparation' },
      { name: 'High School Math', icon: '🎯', description: 'Calculus and advanced topics' }
    ] },
    { id: 2, title: 'ELA Courses', description: 'Develop comprehensive English language arts skills', icon: BookOpen, gradient: 'from-[#F16112] to-[#F1894F]', bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10', iconColor: 'text-[#F16112]', href: '/courses/english', subItems: [
      { name: 'English Mastery: K-12', icon: '📚', description: 'Complete language arts curriculum' },
      { name: 'Reading Enrichment', icon: '📖', description: 'Improve reading comprehension' },
      { name: 'Grammar Boost', icon: '✏️', description: 'Master grammar and mechanics' }
    ] },
    { id: 3, title: 'Writing Lab', description: 'Master the art of effective written communication', icon: PenTool, gradient: 'from-[#F1894F] to-[#F16112]', bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10', iconColor: 'text-[#F1894F]', subItems: [
      { name: 'Creative Writing', icon: '✨', description: 'Unleash your creative potential' },
      { name: 'Essay Writing', icon: '📝', description: 'Academic and persuasive writing' },
      { name: 'Create & Reflect', icon: '🤔', description: 'Develop critical thinking skills' }
    ] },
    { id: 4, title: 'SAT/ACT', description: 'Achieve your best scores with comprehensive test preparation', icon: Award, gradient: 'from-[#1F396D] to-[#F16112]', bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100', iconColor: 'text-[#1F396D]', subItems: [
      { name: 'Math Test Prep', icon: '🧮', description: 'Master SAT/ACT math sections' },
      { name: 'Online SAT Test Prep', icon: '💻', description: 'Comprehensive SAT preparation' },
      { name: 'Online ACT Test Prep', icon: '🎯', description: 'Complete ACT test strategy' }
    ] }
  ];

  // STEAM Programs
  const steamPrograms = [
    { id: 1, title: 'Game Development', description: 'Create immersive games and interactive experiences', icon: Gamepad2, gradient: 'from-[#F16112] to-[#F1894F]', bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10', iconColor: 'text-[#F16112]', subItems: [
      { name: 'Roblox Studio', icon: '🎮', description: 'Create games in Roblox platform' },
      { name: 'Scratch', icon: '🐱', description: 'Visual programming for beginners' },
      { name: 'Minecraft', icon: '⛏️', description: 'Build and code in Minecraft' }
    ] },
    { id: 2, title: 'Python Programming', description: 'Master the world\'s most popular programming language', icon: Code, gradient: 'from-[#1F396D] to-[#29335C]', bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10', iconColor: 'text-[#1F396D]', subItems: [
      { name: 'Python Kickstart', icon: '🚀', description: 'Begin your Python journey' },
      { name: 'Python Power Up', icon: '⚡', description: 'Intermediate Python skills' },
      { name: 'Python Pro', icon: '🏆', description: 'Advanced Python mastery' }
    ] },
    { id: 3, title: 'Young Founders', description: 'Develop entrepreneurial skills and business mindset', icon: Lightbulb, gradient: 'from-[#F1894F] to-[#F16112]', bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10', iconColor: 'text-[#F1894F]', subItems: [
      { name: 'Youth CEO', icon: '👑', description: 'Learn leadership and management' },
      { name: 'I Am Brand', icon: '🎯', description: 'Build your personal brand' }
    ] },
    { id: 4, title: 'ML/Gen AI', description: 'Explore artificial intelligence and machine learning', icon: Brain, gradient: 'from-[#1F396D] to-[#F16112]', bgGradient: 'bg-gradient-to-br from-[#29335C]/5 to-[#1F396D]/10', iconColor: 'text-[#1F396D]', subItems: [
      { name: 'Prompt Engineering', icon: '🤖', description: 'Master AI prompt techniques' },
      { name: 'AI for Everyone', icon: '🧠', description: 'AI fundamentals for all ages' },
      { name: 'ML/AI for Highschoolers', icon: '🎓', description: 'Advanced AI concepts' }
    ] }
  ];

  // Testimonials and reasons
  const testimonials = [
    { name: "Sarah Johnson", role: "Parent", content: "GrowWise transformed my daughter's approach to learning. She went from struggling with math to excelling in advanced courses.", rating: 5, image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
    { name: "Michael Chen", role: "Student", content: "The STEAM programs at GrowWise opened up a whole new world of possibilities. I'm now pursuing computer science in college!", rating: 5, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Lisa Rodriguez", role: "Parent", content: "The personalized attention and innovative teaching methods make GrowWise stand out from other programs.", rating: 5, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" }
  ];

  const whyChooseUs = [
    { icon: Users, title: "Expert Instructors", description: "Learn from certified teachers with years of experience in K-12 and STEAM education" },
    { icon: Award, title: "Proven Results", description: "95% of our students show measurable improvement within the first semester" },
    { icon: BookOpen, title: "Comprehensive Curriculum", description: "Aligned with state standards and designed for modern learning needs" },
    { icon: Microscope, title: "Hands-on Learning", description: "Interactive labs and projects that make learning engaging and memorable" }
  ];

  // Interaction state
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  const [hoveredK12Program, setHoveredK12Program] = useState<number | null>(null);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [statsInView, setStatsInView] = useState(false);

  // Counter animation
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
    return { currentValue, startAnimation: () => setHasStarted(true) } as const;
  };

  // Effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCourseIndex((prev) => (prev + 1) % Math.ceil(popularCourses.length / 4));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsInView(true); },
      { threshold: 0.5 }
    );
    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);
    return () => { if (statsElement) observer.unobserve(statsElement); };
  }, []);

  const nextHeroSlide = () => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
  const prevHeroSlide = () => setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goToHeroSlide = (index: number) => setCurrentHeroSlide(index);

  const StatCard = ({ stat, IconComponent, index, startAnimation }: any) => {
    const numericValue = parseInt(stat.value.replace(/\D/g, ''));
    const { currentValue, startAnimation: startCounter } = useCounterAnimation(numericValue, 2000);
    useEffect(() => {
      if (startAnimation) {
        const timer = setTimeout(() => startCounter(), index * 200);
        return () => clearTimeout(timer);
      }
    }, [startAnimation, startCounter, index]);
    const formatValue = (value: number) => {
      if (stat.value.includes('%')) return `${value}%`;
      if (stat.value.includes('+')) return `${value}+`;
      return value.toString();
    };
    return (
      <Card className="bg-white/30 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-700 transform hover:-translate-y-3 group ring-1 ring-white/30">
        <CardContent className="p-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
          <div className={`${stat.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 ring-1 ring-white/20 relative z-10`}>
            <IconComponent className={`w-10 h-10 ${stat.color} drop-shadow-sm`} />
          </div>
          <div className="mb-4">
            <h3 className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-2`}>{startAnimation ? formatValue(currentValue) : '0'}</h3>
            <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
          </div>
          <div className="w-12 h-1 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full mx-auto opacity-70"></div>
        </CardContent>
      </Card>
    );
  };

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
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={slide.onClick} className={`${slide.ctaColor} rounded-full px-8 py-4 font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 text-base lg:text-lg backdrop-blur-sm border border-white/20`}>
                              {slide.cta}
                              <ChevronRight className="ml-2 w-5 h-5" />
                            </Button>
                            <StartChatButton 
                              onStartChat={openChatbot}
                              variant="hero"
                              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                            />
                          </div>
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

            <div className="absolute inset-y-0 left-6 flex items-center">
              <button onClick={prevHeroSlide} className="w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full shadow-[0px_15px_40px_rgba(255,255,255,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-2xl border-2 border-white/50 ring-1 ring-white/30">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-6 flex items-center">
              <button onClick={nextHeroSlide} className="w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full shadow-[0px_15px_40px_rgba(255,255,255,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-2xl border-2 border-white/50 ring-1 ring-white/30">
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {heroSlides.map((_, index) => (
                <button key={index} onClick={() => goToHeroSlide(index)} className={`h-3 rounded-full transition-all duration-500 ${index === currentHeroSlide ? 'w-12 bg-white shadow-xl border border-white/30' : 'w-3 bg-white/60 hover:bg-white/80'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="relative -mt-24 px-4 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto relative z-20">
          <Card className="bg-white/25 backdrop-blur-3xl rounded-[32px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] border-2 border-white/60 overflow-hidden ring-1 ring-white/30">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/8 via-transparent to-[#F16112]/8"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
            <CardContent className="p-8 lg:p-12 relative z-10">
              <div className="mb-10 text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Popular Courses</h3>
                <p className="text-gray-600">Start your learning journey with our most sought-after programs</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {popularCourses.map((course) => {
                  const IconComponent = course.icon as any;
                  return (
                    <Card key={course.id} className={`bg-white/40 backdrop-blur-2xl border-2 ${course.borderColor} rounded-2xl shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40`} onClick={course.onClick}>
                      <div className={`absolute inset-0 ${course.bgColor} opacity-60`}></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
                      <CardContent className="p-6 text-center flex flex-col items-center relative z-10">
                        <div className={`${course.iconColor} mb-4 flex justify-center`}>
                          <div className="w-14 h-14 bg-white/50 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-[0px_10px_30px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
                            <IconComponent className="w-7 h-7 drop-shadow-sm" />
                          </div>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-2 leading-tight text-center group-hover:text-gray-800 transition-colors">{course.name}</h4>
                        <p className="text-xs text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{course.benefit}</p>
                        <Button className={`w-full ${course.iconColor === 'text-[#1F396D]' ? 'bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D]' : 'bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112]'} text-white rounded-xl py-2.5 px-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-xs backdrop-blur-sm border border-white/20`}>{course.cta}</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              <div className="flex justify-center mt-8">
                <div className="h-2 w-8 bg-gradient-to-r from-[#1F396D] to-[#F16112] rounded-full shadow-lg"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics */}
      <section id="stats-section" className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 backdrop-blur-[0.5px]"></div>
          <div className="absolute top-20 left-10 w-40 h-40 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-56 h-56 bg-[#F16112]/18 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-40 right-1/4 w-32 h-32 bg-[#1F396D]/12 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#F1894F]/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '8s' }}></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Trusted by <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Tri-Valley Families</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Join hundreds of families who have chosen GrowWise for their children's educational journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {statisticsData.map((stat, index) => {
              const IconComponent = stat.icon as any;
              return (
                <StatCard key={stat.id} stat={stat} IconComponent={IconComponent} index={index} startAnimation={statsInView} />
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 bg-white/40 backdrop-blur-3xl px-8 py-4 rounded-full shadow-[0px_20px_50px_rgba(255,255,255,0.4)] border-2 border-white/60 ring-1 ring-white/30">
              <div className="w-10 h-10 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center shadow-[0px_8px_20px_rgba(241,97,18,0.4)] ring-2 ring-white/50">
                <Shield className="w-6 h-6 text-white drop-shadow-sm" />
              </div>
              <span className="text-base font-semibold text-gray-700 drop-shadow-sm">Trusted by 300+ Tri-Valley families</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Programs</span></h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">Comprehensive educational solutions designed to help students excel</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="bg-white/30 backdrop-blur-3xl rounded-full p-2 shadow-[0px_20px_50px_rgba(255,255,255,0.4)] border-2 border-white/60 ring-1 ring-white/30">
                <div className="flex">
                  <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white px-6 py-3 rounded-full font-semibold shadow-lg"><GraduationCap className="w-5 h-5 inline mr-2" />K-12 Academic</div>
                  <div className="bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white px-6 py-3 rounded-full font-semibold shadow-lg ml-2"><Rocket className="w-5 h-5 inline mr-2" />STEAM</div>
                </div>
              </div>
            </div>
          </div>

          {/* K-12 Academic Programs */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-[#1F396D] to-[#29335C] rounded-2xl flex items-center justify-center shadow-lg"><GraduationCap className="w-6 h-6 text-white" /></div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">K-12 Academic Programs</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#1F396D]/30 via-[#F16112]/20 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {k12Programs.map((program) => {
                const IconComponent = program.icon as any;
                const isHovered = hoveredK12Program === program.id;
                return (
                  <Card key={program.id} className={`bg-white/35 backdrop-blur-3xl rounded-[32px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 transition-all duration-700 cursor-pointer group overflow-hidden relative ring-1 ring-white/30 ${isHovered ? 'shadow-[0px_40px_120px_0px_rgba(31,57,109,0.35)] scale-105' : ''}`} onMouseEnter={() => setHoveredK12Program(program.id)} onMouseLeave={() => setHoveredK12Program(null)}>
                    <div className={`absolute inset-0 ${program.bgGradient} opacity-40`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                    <CardContent className="p-8 relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-[0px_15px_40px_rgba(31,57,109,0.4)] ring-2 ring-white/50 backdrop-blur-sm`}>
                          <IconComponent className="w-7 h-7 text-white drop-shadow-sm" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-xl ${program.iconColor} drop-shadow-sm`}>{program.title}</h4>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-8 leading-relaxed">{program.description}</p>
                      <div className={`space-y-4 flex-1 transition-all duration-700 ${isHovered ? 'opacity-100 max-h-[500px]' : 'opacity-85 max-h-[400px]'}`}>
                        {program.subItems.map((item: any, itemIndex: number) => (
                          <div key={item.name} className={`flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-2xl border-2 border-white/70 transition-all duration-500 hover:bg-white/70 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.5)] group/item ring-1 ring-white/40 ${isHovered ? 'transform translate-x-0 opacity-100' : ''}`} style={{ transitionDelay: isHovered ? `${itemIndex * 150}ms` : '0ms' }}>
                            <span className="text-3xl">{item.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600 group-hover/item:text-gray-700 transition-colors">{item.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6">
                        {program.href ? (
                          <Button asChild className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${isHovered ? 'scale-105 shadow-xl' : ''} backdrop-blur-sm border border-white/20`}>
                            <Link href={program.href}>
                              Enroll Now
                              <GraduationCap className="ml-2 w-5 h-5" />
                            </Link>
                          </Button>
                        ) : (
                          <Button className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${isHovered ? 'scale-105 shadow-xl' : ''} backdrop-blur-sm border border-white/20`}>
                            Enroll Now
                            <GraduationCap className="ml-2 w-5 h-5" />
                          </Button>
                        )}
                      </div>
                      <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${program.gradient} rounded-full opacity-10 transition-all duration-700 ${isHovered ? 'scale-150 opacity-20' : ''}`} />
                      <div className={`absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-full opacity-5 transition-all duration-700 ${isHovered ? 'scale-125 opacity-15' : ''}`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* STEAM Programs */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-2xl flex items-center justify-center shadow-lg"><Rocket className="w-6 h-6 text-white" /></div>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">STEAM Programs</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-[#F16112]/30 via-[#1F396D]/20 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steamPrograms.map((program) => {
                const IconComponent = program.icon as any;
                const isHovered = hoveredProgram === program.id;
                return (
                  <Card key={program.id} className={`bg-white/35 backdrop-blur-3xl rounded-[32px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 transition-all duration-700 cursor-pointer group overflow-hidden relative ring-1 ring-white/30 ${isHovered ? 'shadow-[0px_40px_120px_0px_rgba(31,57,109,0.35)] scale-105' : ''}`} onMouseEnter={() => setHoveredProgram(program.id)} onMouseLeave={() => setHoveredProgram(null)}>
                    <div className={`absolute inset-0 ${program.bgGradient} opacity-40`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                    <CardContent className="p-8 relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-[0px_15px_40px_rgba(31,57,109,0.4)] ring-2 ring-white/50 backdrop-blur-sm`}>
                          <IconComponent className="w-7 h-7 text-white drop-shadow-sm" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-xl ${program.iconColor} drop-shadow-sm`}>{program.title}</h4>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-8 leading-relaxed">{program.description}</p>
                      <div className={`space-y-4 flex-1 transition-all duration-700 ${isHovered ? 'opacity-100 max-h-[500px]' : 'opacity-85 max-h-[400px]'}`}>
                        {program.subItems.map((item: any, itemIndex: number) => (
                          <div key={item.name} className={`flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-2xl border-2 border-white/70 transition-all duration-500 hover:bg-white/70 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.5)] group/item ring-1 ring-white/40 ${isHovered ? 'transform translate-x-0 opacity-100' : ''}`} style={{ transitionDelay: isHovered ? `${itemIndex * 150}ms` : '0ms' }}>
                            <span className="text-3xl">{item.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600 group-hover/item:text-gray-700 transition-colors">{item.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6">
                        <Button className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${isHovered ? 'scale-105 shadow-xl' : ''} backdrop-blur-sm border border-white/20`}>
                          Enroll Now
                          <Sparkles className="ml-2 w-5 h-5" />
                        </Button>
                      </div>
                      <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${program.gradient} rounded-full opacity-10 transition-all duration-700 ${isHovered ? 'scale-150 opacity-20' : ''}`} />
                      <div className={`absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-full opacity-5 transition-all duration-700 ${isHovered ? 'scale-125 opacity-15' : ''}`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GrowWise */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-[#1F396D]/8 to-[#F16112]/8 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">Why Choose <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">GrowWise</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-[#1F396D] to-[#29335C] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_20px_50px_rgba(31,57,109,0.4)] group-hover:scale-110 transition-transform duration-500 border-2 border-white/50 backdrop-blur-2xl ring-1 ring-white/30">
                  <item.icon className="w-10 h-10 text-white drop-shadow-sm" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900 drop-shadow-sm">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">What Our Families Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
                <CardContent className="p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112] drop-shadow-sm" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-8 italic text-base leading-relaxed">"{testimonial.content}"</p>
                    <div className="flex items-center gap-4">
                      <ImageWithFallback src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50" />
                      <div>
                        <p className="font-semibold text-gray-900 text-base drop-shadow-sm">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">Join thousands of students who have transformed their academic future with GrowWise.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button onClick={openAssessmentModal} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" size="lg">
              Get Started
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <StartChatButton 
              onStartChat={openChatbot}
              variant="hero"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold"
            />
            <Button 
              onClick={openChatbot}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105" 
              size="lg"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Modal */}
      <FreeAssessmentModal isOpen={isAssessmentModalOpen} onClose={closeAssessmentModal} />
    </div>
  );
}

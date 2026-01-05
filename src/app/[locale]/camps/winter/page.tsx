'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Code, 
  Snowflake,
  Calendar,
  Clock,
  Users,
  Award,
  CheckCircle,
  Star,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Target,
  Zap,
  Lightbulb,
  Blocks,
  Gift,
  PartyPopper,
  TreePine,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  X
} from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { useChatbot } from '@/contexts/ChatbotContext';
import { getIconComponent } from '@/lib/iconMap';

export default function WinterCampPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { openChatbot } = useChatbot();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({ hero: true });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const workshopsRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const createLocaleUrl = (path: string) => `/${locale}${path}`;

  // Contact information for modal
  const contactInfo = [
    {
      icon: 'Phone',
      title: 'Call Us',
      primary: CONTACT_INFO.phone,
      bgColor: 'bg-[#F16112]'
    },
    {
      icon: 'Mail',
      title: 'Email Us',
      primary: CONTACT_INFO.email,
      bgColor: 'bg-[#1F396D]'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      primary: CONTACT_INFO.address,
      bgColor: 'bg-[#F1894F]'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      primary: 'Chat with us now',
      bgColor: 'bg-[#1F396D]'
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const createObserver = (ref: React.RefObject<HTMLElement>, key: string) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      observer.observe(ref.current);
      observers.push(observer);
    };

    // Hero is visible on load, others need scroll
    createObserver(workshopsRef, 'workshops');
    createObserver(benefitsRef, 'benefits');
    createObserver(ctaRef, 'cta');

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Winter Camp Cards
  const workshops = [
    {
      id: 'roblox-workshop',
      title: 'Roblox Camp',
      description: 'Build and publish your own Roblox games in this hands-on winter camp. Learn game design, Lua scripting, and create interactive experiences.',
      icon: Gamepad2,
      gradient: 'from-sky-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-sky-50 to-blue-50',
      iconColor: 'text-sky-600',
      features: [
        'Roblox Studio Basics',
        'Lua Scripting Fundamentals',
        'Game Design Principles',
        '3D World Building',
        'Publishing Your Game',
        'Monetization Basics'
      ],
      duration: '1 to 5 days camp',
      level: 'Beginner to Intermediate',
      price: 75
    },
    {
      id: 'scratch-workshop',
      title: 'Scratch Camp',
      description: 'Create fun games and animations using Scratch visual programming. Perfect for beginners to learn coding concepts through creative projects.',
      icon: Code,
      gradient: 'from-blue-500 to-sky-500',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-sky-50',
      iconColor: 'text-blue-600',
      features: [
        'Visual Programming Basics',
        'Game Creation',
        'Animation & Storytelling',
        'Interactive Projects',
        'Sharing & Collaboration',
        'Problem Solving Skills'
      ],
      duration: '1 to 5 days camp',
      level: 'Beginner',
      price: 75
    },
    {
      id: 'minecraft-workshop',
      title: 'Minecraft Camp',
      description: 'Explore engineering and coding in Minecraft. Learn redstone circuits, command blocks, and modding to create amazing builds and contraptions.',
      icon: Blocks,
      gradient: 'from-slate-600 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
      iconColor: 'text-slate-700',
      features: [
        'Redstone Engineering',
        'Command Block Programming',
        'World Building & Design',
        'Modding Basics',
        'Collaborative Projects',
        'Creative Problem Solving'
      ],
      duration: '1 to 5 days camp',
      level: 'Beginner to Intermediate',
      price: 75
    }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .twinkle {
          animation: twinkle 1.5s ease-in-out infinite;
        }
        
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(20px) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes snowfall-left {
          0% {
            transform: translateY(-100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
        
        .snowflake {
          position: absolute;
          top: -10px;
          color: rgba(148, 163, 184, 0.6);
          pointer-events: none;
          z-index: 1;
        }
        
        .snowflake svg {
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.5));
        }
        
        .snowflake-fall {
          animation: snowfall linear infinite;
        }
        
        .snowflake-fall-left {
          animation: snowfall-left linear infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-slate-50 relative overflow-hidden">
      {/* Subtle Winter Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Falling Snowflakes - Icons */}
        {[...Array(20)].map((_, i) => {
          // Use fixed values based on index to avoid hydration mismatch
          const left = (i * 5) % 100;
          const delay = (i * 0.2) % 6;
          const duration = 12 + (i % 5) * 2; // Vary duration between 12-20 seconds
          const driftDirection = i % 2 === 0 ? 'snowflake-fall' : 'snowflake-fall-left';
          const size = 8 + (i % 3) * 2; // Vary size between 8-12px
          const opacity = 0.5 + (i % 2) * 0.2; // Vary opacity
          return (
            <div
              key={`snow-icon-${i}`}
              className={`snowflake ${driftDirection}`}
              style={{
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                opacity: opacity
              } as React.CSSProperties}
            >
              <Snowflake className="w-4 h-4" style={{ width: `${size}px`, height: `${size}px` }} />
            </div>
          );
        })}
        
        {/* Falling Snowflakes - Simple Dots */}
        {[...Array(50)].map((_, i) => {
          // Use fixed values based on index to avoid hydration mismatch
          const left = (i * 2) % 100;
          const delay = (i * 0.1) % 5;
          const duration = 8 + (i % 4) * 2; // Vary duration between 8-14 seconds
          const driftDirection = i % 2 === 0 ? 'snowflake-fall' : 'snowflake-fall-left';
          const size = 3 + (i % 3); // Vary size between 3-5px
          const opacity = 0.5 + (i % 3) * 0.15; // Vary opacity
          return (
            <div
              key={`snow-dot-${i}`}
              className={`snowflake ${driftDirection}`}
              style={{
                left: `${left}%`,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: 'rgba(148, 163, 184, 0.7)',
                opacity: opacity,
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.5)'
              } as React.CSSProperties}
            />
          );
        })}
        
        {/* Subtle Static Snowflakes */}
        {[...Array(10)].map((_, i) => {
          // Use fixed values based on index to avoid hydration mismatch
          const delay = (i * 0.2) % 3;
          const left = (i * 10) % 100;
          const top = (i * 11.7) % 100;
          return (
            <div
              key={`static-${i}`}
              className="absolute text-slate-300/20"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationName: 'float, pulse',
                animationDuration: '6s, 3s',
                animationTimingFunction: 'ease-in-out, ease-in-out',
                animationIterationCount: 'infinite, infinite',
                animationDelay: `${delay}s, ${delay}s`
              }}
            >
              <Snowflake className="w-4 h-4" />
            </div>
          );
        })}
        
        {/* Subtle Winter Decorative Circles */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 bg-sky-100/15 rounded-full blur-3xl" 
          style={{ 
            animationName: 'pulse',
            animationDuration: '4s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite'
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-slate-200/10 rounded-full blur-3xl" 
          style={{ 
            animationName: 'pulse',
            animationDuration: '5s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/8 rounded-full blur-3xl" 
          style={{ 
            animationName: 'pulse',
            animationDuration: '6s',
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: '2s'
          }}
        ></div>
        
        {/* Floating Sparkles */}
        {[...Array(15)].map((_, i) => {
          const positions = [
            { left: '10%', top: '20%' },
            { left: '85%', top: '30%' },
            { left: '15%', top: '60%' },
            { left: '90%', top: '50%' },
            { left: '5%', top: '80%' },
            { left: '75%', top: '15%' },
            { left: '25%', top: '40%' },
            { left: '95%', top: '70%' },
            { left: '50%', top: '10%' },
            { left: '30%', top: '85%' },
            { left: '70%', top: '25%' },
            { left: '20%', top: '45%' },
            { left: '80%', top: '65%' },
            { left: '40%', top: '75%' },
            { left: '60%', top: '35%' }
          ];
          const pos = positions[i];
          const delay = (i * 0.2) % 3;
          const size = 8 + (i % 3) * 4;
          const colors = ['text-sky-400', 'text-blue-400', 'text-cyan-400'];
          return (
            <div
              key={`sparkle-${i}`}
              className={`absolute ${colors[i % 3]} twinkle`}
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: `${delay}s`,
                fontSize: `${size}px`
              }}
            >
              <Sparkles className="w-4 h-4" style={{ width: `${size}px`, height: `${size}px` }} />
            </div>
          );
        })}
        
        {/* Holiday Stars */}
        {[...Array(8)].map((_, i) => {
          const positions = [
            { left: '8%', top: '12%' },
            { left: '92%', top: '18%' },
            { left: '12%', top: '55%' },
            { left: '88%', top: '48%' },
            { left: '6%', top: '78%' },
            { left: '94%', top: '72%' },
            { left: '45%', top: '8%' },
            { left: '55%', top: '88%' }
          ];
          const pos = positions[i];
          const delay = (i * 0.3) % 2;
          return (
            <div
              key={`star-${i}`}
              className="absolute twinkle"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: `${delay}s`
              }}
            >
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" style={{ opacity: 0.6 }} />
            </div>
          );
        })}
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Elegant Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-lg mb-8 border border-slate-200 transition-all duration-1000 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
          }`}>
            <Snowflake className="w-4 h-4 text-sky-500 animate-spin-slow" />
            <span className="text-slate-700 font-semibold text-sm uppercase tracking-wide">Winter Camp 2025-26</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 text-sm">Dec 22 - Jan 2</span>
          </div>
          
          {/* Main Title */}
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 transition-all duration-1000 delay-200 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent relative">
              Winter Coding
              <Sparkles className="absolute -top-2 -right-8 w-6 h-6 text-sky-400 sparkle" style={{ animationDelay: '0s' }} />
              <Sparkles className="absolute -bottom-1 -left-6 w-4 h-4 text-blue-400 sparkle" style={{ animationDelay: '0.5s' }} />
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 bg-clip-text text-transparent relative">
              Camps
              <Sparkles className="absolute -top-1 right-4 w-5 h-5 text-blue-400 sparkle" style={{ animationDelay: '1s' }} />
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-300 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Join us for immersive coding camps during the holiday break. 
            <br className="hidden md:block" />
            <span className="text-slate-500">Learn game development and coding through hands-on projects.</span>
          </p>

          {/* Clean Info Cards */}
          <div className={`flex flex-wrap items-center justify-center gap-4 mb-8 transition-all duration-1000 delay-500 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {[
              { icon: Calendar, text: '5-Day Intensive', color: 'text-sky-600' },
              { icon: Clock, text: '3 Hours/Day', color: 'text-blue-600' },
              { icon: Users, text: 'Small Groups', color: 'text-slate-700' },
              { icon: Award, text: 'Certificate Included', color: 'text-sky-600' }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  style={{ transitionDelay: `${600 + index * 100}ms` }}
                >
                  <IconComponent className={`w-4 h-4 ${item.color}`} />
                  <span className="font-medium text-slate-700 text-sm">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Subtle Offer Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm transition-all duration-1000 delay-700 hover:scale-105 ${
            isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Star className="w-4 h-4 text-sky-500 fill-sky-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-700">Early Bird: 10% Off for 5 Days Course + Free Snacks</span>
          </div>
        </div>
      </section>

      {/* Camps Section */}
      <section ref={workshopsRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.workshops ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Choose Your Camp
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three immersive camps designed to spark creativity and build coding skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workshops.map((workshop, index) => {
              const IconComponent = workshop.icon;
              const isHovered = hoveredCard === workshop.id;
              
              return (
                <Card
                  key={workshop.id}
                  className={`relative overflow-hidden ${workshop.bgGradient} rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border-2 border-white/50 hover:border-gray-200 transition-all duration-500 ${
                    isHovered ? 'scale-105 shadow-2xl' : ''
                  } ${
                    isVisible.workshops 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={isVisible.workshops ? { 
                    transitionDelay: `${index * 150}ms`,
                    animationName: 'fadeInUp',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards'
                  } : { 
                    transitionDelay: `${index * 150}ms`
                  }}
                  onMouseEnter={() => setHoveredCard(workshop.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-5 relative flex flex-col h-full justify-between">
                    {/* Top Section - Camp Header */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${workshop.gradient} shadow-lg transition-transform duration-300 ${isHovered ? 'scale-110 rotate-3' : ''}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`font-bold text-base ${workshop.iconColor} leading-tight`}>
                              {workshop.title}
                            </h3>
                            <span className="text-lg font-bold text-gray-900">${workshop.price}</span>
                          </div>
                          <Badge className="bg-white/80 text-gray-700 text-xs mt-1">
                            {workshop.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Camp Description */}
                    <div className="flex-grow mb-4">
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {workshop.description}
                      </p>
                      
                      {/* Camp Details */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-white/80 text-gray-700 text-xs px-2 py-1">
                          <Clock className="w-3 h-3 mr-1 inline" />
                          {workshop.duration}
                        </Badge>
                      </div>

                      {/* Features List */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                          What You'll Learn
                        </h4>
                        <ul className="space-y-1.5">
                          {workshop.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                              <CheckCircle className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`${createLocaleUrl('/camps/winter/calendar')}?workshop=${workshop.id}`}>
                      <Button
                        className={`w-full bg-gradient-to-r ${workshop.gradient} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg text-sm group`}
                      >
                        View Schedule
                        <Calendar className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section ref={benefitsRef} className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Why Choose Our Camps?
            </h2>
            <p className="text-lg text-slate-600">Designed to inspire and educate through hands-on learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Lightbulb,
                title: 'Hands-On Learning',
                description: 'Learn by doing with real projects and games you create yourself'
              },
              {
                icon: Users,
                title: 'Expert Instructors',
                description: 'Learn from experienced educators passionate about coding and creativity'
              },
              {
                icon: Award,
                title: 'Certificates',
                description: 'Receive a certificate of completion to showcase your new skills'
              },
              {
                icon: Zap,
                title: 'Fun & Engaging',
                description: 'Enjoy learning through games, challenges, and creative projects'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
                        const gradients = [
                          'from-sky-500 to-blue-500',
                          'from-blue-500 to-sky-500',
                          'from-slate-600 to-blue-600',
                          'from-blue-600 to-slate-600'
                        ];
              
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-slate-200 hover:scale-105 ${
                    isVisible.benefits 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-20'
                  }`}
                  style={isVisible.benefits ? { 
                    transitionDelay: `${index * 100}ms`,
                    animationName: 'fadeInUp',
                    animationDuration: '0.6s',
                    animationTimingFunction: 'ease-out',
                    animationFillMode: 'forwards'
                  } : { 
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${gradients[index]} mb-4 transition-transform duration-300 hover:scale-110`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
          isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <Card className="bg-gradient-to-br from-slate-700 via-blue-700 to-slate-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                      <CardContent className="p-12">
                        <div className="flex justify-center mb-6">
                          <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm animate-float">
                            <Star className="w-12 h-12 text-sky-300 fill-sky-300 animate-pulse" />
                          </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                          Ready to Start Your Coding Journey?
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                Limited spots available! Enroll now and secure your place in our winter camps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white/30 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 group"
                >
                  <Mail className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Modal */}
      <AlertDialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-3xl border-2 border-gray-200/50 shadow-[0px_30px_90px_rgba(31,57,109,0.25)] rounded-[20px] max-w-4xl w-[calc(100%-2rem)] p-0 overflow-hidden max-h-[70vh]">
          {/* Enhanced Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-transparent to-blue-50/50"></div>
          
          {/* Custom Close Button */}
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
          
          {/* Scrollable content area */}
          <div className="relative z-10 p-4 lg:p-6">
            <AlertDialogHeader className="text-center mb-4 lg:mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-3">
                          <Sparkles className="w-4 h-4 text-sky-500" />
                          <span className="text-xs font-semibold text-gray-700 tracking-wide">Get in touch</span>
                          <Sparkles className="w-4 h-4 text-sky-500" />
                        </div>
                        <AlertDialogTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                          Multiple Ways to <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">Connect</span>
                        </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Choose the method that works best for you
              </AlertDialogDescription>
              <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </AlertDialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);
                const isPhone = item.icon === 'Phone';
                const isEmail = item.icon === 'Mail';
                const isLiveChat = item.icon === 'MessageCircle';
                const isVisitUs = item.icon === 'MapPin';
                const isClickable = isPhone || isEmail || isLiveChat || isVisitUs;
                
                const href = isPhone 
                  ? `tel:${item.primary.replace(/[\s\(\)\-]/g, '')}`
                  : isEmail 
                  ? `mailto:${item.primary}`
                  : isLiveChat
                  ? '#' // Will be handled by onClick
                  : isVisitUs
                  ? 'https://maps.google.com/?q=4564+Dublin+Blvd,+Dublin,+CA'
                  : '#';
                
                const CardWrapper = isClickable ? 'a' : 'div';
                const cardProps = isClickable ? { 
                  href: href, 
                  title: isPhone ? 'Click to call' : isEmail ? 'Click to email' : isVisitUs ? 'Click to view on map' : 'Click to start chat',
                  onClick: isLiveChat ? (e: React.MouseEvent) => { e.preventDefault(); setIsContactModalOpen(false); openChatbot(); } : undefined
                } : {};
                
                return (
                  <Card key={index} className="relative bg-white/95 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group hover:border-blue-300 overflow-hidden hover:-translate-y-0.5">
                    <CardWrapper {...cardProps} className="block h-full no-underline">
                      <CardContent className="relative p-5 lg:p-6">
                        <div className={`${item.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md ring-1 ring-white/40`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.title}</h3>
                        <div>
                          <p
                                      className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-snug ${isClickable ? 'text-blue-600 group-hover:text-blue-700 transition-colors' : 'text-gray-800'}`}
                            title={item.primary}
                          >
                            {item.primary}
                          </p>
                        </div>
                      </CardContent>
                    </CardWrapper>
                  </Card>
                );
              })}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      </div>
    </>
  );
}


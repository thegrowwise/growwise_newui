'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Code, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Hero Carousel Slides Data with Corrected Images
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
    bgImage: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1200&h=800&fit=crop"
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
    bgImage: "https://images.unsplash.com/photo-1515378791036-0648a814a05f?w=1200&h=800&fit=crop"
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
    bgImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative py-12 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Carousel Container */}
        <div className="relative bg-white rounded-[32px] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="relative h-[400px] lg:h-[450px] overflow-hidden">
            {heroSlides.map((slide, index) => {
              const IconComponent = slide.icon;
              const isActive = index === currentSlide;
              
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ${
                    isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                  }`}
                >
                  <div className="relative h-full flex flex-col lg:flex-row items-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <div 
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slide.bgImage})` }}
                      />
                      <div className={`absolute inset-0 ${slide.bgGradient} opacity-85`}></div>
                    </div>

                    {/* Content Side - Optimized for Sleeker Layout */}
                    <div className="flex-1 text-center lg:text-left p-8 lg:p-12 relative z-10 lg:max-w-md">
                      <div className={`transform transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
                          {slide.title}
                        </h1>
                        <h2 className="text-lg lg:text-xl mb-4 text-white/90 font-semibold">
                          {slide.subtitle}
                        </h2>
                        <p className="text-sm lg:text-base mb-6 text-white/80 leading-relaxed">
                          {slide.description}
                        </p>
                        
                        {/* CTA Button - Optimized Size */}
                        <Button 
                          className={`${slide.ctaColor} rounded-full px-6 py-3 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-sm lg:text-base`}
                        >
                          {slide.cta}
                        </Button>
                      </div>
                    </div>

                    {/* Icon Side - Better Proportions */}
                    <div className="flex-1 flex justify-center lg:justify-end items-center p-8 lg:p-12 relative z-10">
                      <div className={`transform transition-all duration-700 ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                        <div className="relative">
                          <div className="w-28 h-28 lg:w-36 lg:h-36 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                            <IconComponent className={`w-14 h-14 lg:w-18 lg:h-18 ${slide.iconColor}`} />
                          </div>
                          {/* Decorative rings - Adjusted for sleeker size */}
                          <div className="absolute -inset-4 border border-white/20 rounded-full animate-pulse"></div>
                          <div className="absolute -inset-8 border border-white/10 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls - Refined Positioning */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-20 shadow-lg hover:shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm z-20 shadow-lg hover:shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
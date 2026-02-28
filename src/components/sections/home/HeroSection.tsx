"use client";
import React from 'react';
import { Button } from '../../ui/button';
import { SectionError } from '../../ui/SectionError';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OptimizedImage } from '../../gw/OptimizedImage';

export interface HeroSlideVM {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  IconComponent: React.ComponentType<any>;
  bgGradient: string;
  iconColor: string;
  ctaColor: string;
  bgImage: string;
  onClick: () => void;
}

export function HeroSection({
  slides,
  currentIndex,
  onPrev,
  onNext,
  onGoTo,
  onMouseEnter,
  onMouseLeave,
  error,
  onRetry,
  lcpImageInDocument = false,
}: {
  slides: HeroSlideVM[] | null;
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  error?: string | null;
  onRetry?: () => void;
  /** When true, first slide image is already in DOM (server-rendered for LCP); skip duplicate image. */
  lcpImageInDocument?: boolean;
}) {
  if (error) return <SectionError title="Hero unavailable" message={error} onRetry={onRetry} />;
  if (!slides || slides.length === 0) return <SectionError title="No hero slides" message="Please check back later." onRetry={onRetry} />;
  return (
    <section className="relative py-16 px-4 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-60 left-1/2 w-24 h-24 bg-[#29335C]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '6s' }}></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div 
          className="relative bg-white/20 backdrop-blur-3xl rounded-[40px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] overflow-hidden border border-white/50 ring-1 ring-white/20"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="relative h-[500px] lg:h-[550px] overflow-hidden">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              const IconComponent = slide.IconComponent as any;
              return (
                <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                  <div className="relative h-full flex flex-col lg:flex-row items-center overflow-hidden">
                    <div className="absolute inset-0">
                      {!(lcpImageInDocument && index === 0) && (
                        <OptimizedImage 
                          src={slide.bgImage} 
                          alt={slide.title} 
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={isActive}
                        />
                      )}
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
            <button type="button" onClick={onPrev} aria-label="Previous slide" className="w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full shadow-[0px_15px_40px_rgba(255,255,255,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-2xl border-2 border-white/50 ring-1 ring-white/30">
              <ChevronLeft className="w-6 h-6 text-gray-900" aria-hidden />
            </button>
          </div>
          <div className="absolute inset-y-0 right-6 flex items-center">
            <button type="button" onClick={onNext} aria-label="Next slide" className="w-12 h-12 bg-white/40 hover:bg-white/60 rounded-full shadow-[0px_15px_40px_rgba(255,255,255,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-2xl border-2 border-white/50 ring-1 ring-white/30">
              <ChevronRight className="w-6 h-6 text-gray-900" aria-hidden />
            </button>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, index) => (
              <button key={index} type="button" onClick={() => onGoTo(index)} aria-label={`Go to slide ${index + 1}`} className={`min-w-[24px] min-h-[24px] rounded-full transition-all duration-500 flex items-center justify-center ${index === currentIndex ? 'w-12 bg-white shadow-xl border border-white/30' : 'w-3 bg-white/60 hover:bg-white/80'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



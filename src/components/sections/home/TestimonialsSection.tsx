"use client";
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { SectionError } from '../../ui/SectionError';
import { ImageWithFallback } from '../../gw/ImageWithFallback';
import { Star } from 'lucide-react';

export interface TestimonialVM {
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export function TestimonialsSection({ testimonials, error, onRetry }: { testimonials: TestimonialVM[] | null; error?: string | null; onRetry?: () => void }) {
  if (error) return <SectionError title="Testimonials unavailable" message={error} onRetry={onRetry} />;
  if (!testimonials || testimonials.length === 0) return <SectionError title="No testimonials yet" message="Check back later." onRetry={onRetry} />;
  return (
    <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 text-gray-900">What Our Families Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
              <CardContent className="p-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112] drop-shadow-sm" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 italic text-base leading-relaxed">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <ImageWithFallback src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50" />
                    <div>
                      <p className="font-semibold text-gray-900 text-base drop-shadow-sm">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}



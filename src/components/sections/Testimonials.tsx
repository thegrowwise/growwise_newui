'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ClientOnly from '@/components/providers/ClientOnly';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Parent of 8th Grader",
    content: "GrowWise has transformed my daughter's approach to math. The personalized attention and engaging teaching methods have boosted her confidence tremendously. She went from struggling with algebra to excelling in advanced math concepts.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Parent of 6th Grader",
    content: "The STEAM programs at GrowWise are incredible! My son loves the coding classes and has already created his first game. The instructors are patient and make complex concepts easy to understand. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Parent of 10th Grader",
    content: "The SAT prep program exceeded our expectations. My daughter improved her score by 200 points! The structured approach and regular practice tests gave her the confidence she needed. Thank you, GrowWise!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Parent of 4th Grader",
    content: "The one-on-one tutoring has been a game-changer for my son. He was falling behind in reading, but now he's reading above grade level. The teachers truly care about each student's success.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "Parent of 7th Grader",
    content: "We've tried several tutoring centers, but GrowWise stands out for their comprehensive approach. They don't just teach subjects; they build confidence and critical thinking skills. My daughter loves coming here!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Robert Martinez",
    role: "Parent of 9th Grader",
    content: "The writing lab program has been fantastic for my son. His essay writing skills have improved dramatically, and he's now more confident in expressing his ideas. The teachers provide excellent feedback.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
];

export default function Testimonials() {
  const [currentSet, setCurrentSet] = useState(0);

  // Show 3 cards per set
  const cardsPerSet = 3;
  const totalSets = Math.ceil(testimonials.length / cardsPerSet);

  const nextSet = () => {
    setCurrentSet((prev) => (prev + 1) % totalSets);
  };

  const prevSet = () => {
    setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
  };

  const goToSet = (index: number) => {
    setCurrentSet(index);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentSet * cardsPerSet;
    return testimonials.slice(startIndex, startIndex + cardsPerSet);
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Parents Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from families who have experienced the GrowWise difference
          </p>
        </div>

        {/* Testimonials Carousel */}
        <ClientOnly fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <Card key={testimonial.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 rounded-2xl">
                <CardContent className="p-6 lg:p-8">
                  <div className="text-center">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 bg-[#1F396D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Quote className="w-6 h-6 text-[#1F396D]" />
                    </div>

                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, index) => (
                        <Star key={index} className="w-4 h-4 text-[#F16112] fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <blockquote className="text-sm lg:text-base text-gray-700 leading-relaxed mb-6 italic line-clamp-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSet}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSet}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
              {getCurrentTestimonials().map((testimonial) => (
                <Card key={testimonial.id} className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <CardContent className="p-6 lg:p-8">
                    <div className="text-center">
                      {/* Quote Icon */}
                      <div className="w-12 h-12 bg-[#1F396D]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Quote className="w-6 h-6 text-[#1F396D]" />
                      </div>

                      {/* Rating */}
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, index) => (
                          <Star key={index} className="w-4 h-4 text-[#F16112] fill-current" />
                        ))}
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-sm lg:text-base text-gray-700 leading-relaxed mb-6 italic line-clamp-4">
                        &ldquo;{testimonial.content}&rdquo;
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-600 text-xs">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Carousel Indicators */}
            {totalSets > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSets }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSet(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentSet 
                        ? 'bg-[#1F396D] scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </ClientOnly>
      </div>
    </section>
  );
} 
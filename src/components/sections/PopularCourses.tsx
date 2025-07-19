'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Code, Calculator, Bot, Book } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Updated Popular Courses Data with GrowWise Brand Colors
const popularCourses = [
  {
    id: 1,
    name: "Python Coding",
    benefit: "Project-based",
    icon: Code,
    bgColor: "bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/20",
    iconColor: "text-[#1F396D]",
    borderColor: "border-[#1F396D]/30",
    cta: "Book Trial"
  },
  {
    id: 2,
    name: "Math Mastery",
    benefit: "1:1 attention",
    icon: Calculator,
    bgColor: "bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/20",
    iconColor: "text-[#F16112]",
    borderColor: "border-[#F16112]/30",
    cta: "Free Assessment"
  },
  {
    id: 3,
    name: "AI Explorer",
    benefit: "Future-ready",
    icon: Bot,
    bgColor: "bg-gradient-to-br from-[#F1894F]/10 to-[#F16112]/20",
    iconColor: "text-[#1F396D]",
    borderColor: "border-[#F1894F]/30",
    cta: "Book Trial"
  },
  {
    id: 4,
    name: "Reading Rockets",
    benefit: "Accelerated growth",
    icon: Book,
    bgColor: "bg-gradient-to-br from-[#29335C]/10 to-[#1F396D]/20",
    iconColor: "text-[#F16112]",
    borderColor: "border-[#29335C]/30",
    cta: "Free Assessment"
  }
];

export default function PopularCourses() {
  const [currentSet, setCurrentSet] = useState(0);
  const coursesPerSet = 3;
  const totalSets = Math.ceil(popularCourses.length / coursesPerSet);

  const nextCourses = () => {
    setCurrentSet((prev) => (prev + 1) % totalSets);
  };

  const prevCourses = () => {
    setCurrentSet((prev) => (prev - 1 + totalSets) % totalSets);
  };

  const goToCourseSet = (index: number) => {
    setCurrentSet(index);
  };

  const startIndex = currentSet * coursesPerSet;
  const endIndex = startIndex + coursesPerSet;
  const currentCourses = popularCourses.slice(startIndex, endIndex);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after programs designed to accelerate your child&apos;s learning journey
          </p>
        </div>

        {/* Courses Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevCourses}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextCourses}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg border transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
            {currentCourses.map((course) => {
              const IconComponent = course.icon;
              return (
                <Card
                  key={course.id}
                  className={`${course.bgColor} ${course.borderColor} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${course.iconColor} bg-white/50`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {course.benefit}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {course.name}
                    </h3>

                    <Button 
                      className={`w-full ${course.iconColor.replace('text-', 'bg-')} hover:opacity-90 text-white font-medium rounded-xl`}
                    >
                      {course.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Course Set Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSets }, (_, index) => (
              <button
                key={index}
                onClick={() => goToCourseSet(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSet 
                    ? 'bg-[#1F396D] scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
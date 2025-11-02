'use client';

import { Button } from '@/components/ui/button';

const popularCourses = [
  {
    title: "Python Coding",
    caption: "Project-based",
    primaryCta: "Book Trial",
    primaryCtaType: "primary",
    secondaryCta: "Learn More",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    title: "Math Mastery",
    caption: "1:1 attention",
    primaryCta: "Book Assessment",
    primaryCtaType: "primary",
    secondaryCta: "Learn More",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "AI Explorer",
    caption: "Future-ready",
    primaryCta: "Book Trial",
    primaryCtaType: "primary",
    secondaryCta: "Learn More",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Mastery in English",
    caption: "Accelerated growth",
    primaryCta: "Book Assessment",
    primaryCtaType: "primary",
    secondaryCta: "Learn More",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
];

export default function PopularCourses() {
  return (
    <section className="relative -mt-24 px-4 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0px_30px_80px_0px_rgba(31,57,109,0.15)] border border-white/40 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/5 via-transparent to-[#F16112]/5"></div>
          
          <div className="p-8 lg:p-12 relative z-10">
            {/* Enhanced Title */}
            <div className="mb-10 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
                Popular Courses
              </h3>
              <p className="text-gray-600">Start your learning journey with our most sought-after programs</p>
            </div>

            {/* Enhanced Course Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {popularCourses.map((course, index) => (
                <div
                  key={index}
                  className={`bg-white/70 backdrop-blur-lg border-2 ${course.title === "Python Coding" || course.title === "AI Explorer" ? "border-[#1F396D]/30" : "border-[#F16112]/30"} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative`}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 ${course.title === "Python Coding" || course.title === "AI Explorer" ? "bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/20" : "bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/20"} opacity-50`}></div>
                  
                  <div className="p-6 text-center flex flex-col items-center relative z-10">
                    {/* Enhanced Icon */}
                    <div className={`${course.title === "Python Coding" || course.title === "AI Explorer" ? "text-[#1F396D]" : "text-[#F16112]"} mb-4 flex justify-center`}>
                      <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/50 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-7 h-7">
                          {course.icon}
                        </div>
                      </div>
                    </div>

                    {/* Course Name */}
                    <h4 className="font-bold text-sm text-gray-900 mb-2 leading-tight text-center group-hover:text-gray-800 transition-colors">
                      {course.title}
                    </h4>

                    {/* Benefit */}
                    <p className="text-xs text-gray-600 mb-4 group-hover:text-gray-700 transition-colors">{course.caption}</p>

                    {/* Enhanced CTA Button */}
                    <Button 
                      className={`w-full ${course.title === "Python Coding" || course.title === "AI Explorer" ? 'bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D]' : 'bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112]'} text-white rounded-xl py-2.5 px-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-xs backdrop-blur-sm border border-white/20`}
                    >
                      {course.primaryCta}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Navigation Indicator */}
            <div className="flex justify-center mt-8">
              <div className="h-2 w-8 bg-gradient-to-r from-[#1F396D] to-[#F16112] rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
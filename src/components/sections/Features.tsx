'use client';

import { useState } from 'react';
import { Calculator, BookOpen, PenTool, Award, Gamepad2, Code, Palette, TrendingUp, ChevronRight, GraduationCap, Sparkles, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Updated K-12 Programs with exact content from original
const k12Programs = [
  {
    id: 1,
    title: 'Math Courses',
    description: 'Build strong mathematical foundations from elementary to advanced levels',
    icon: Calculator,
    gradient: 'from-[#1F396D] to-[#29335C]',
    bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
    iconColor: 'text-[#1F396D]',
    subItems: [
      { name: 'Elementary Math', icon: '🔢', description: 'Basic arithmetic and number sense' },
      { name: 'Middle School Math', icon: '📊', description: 'Algebra and geometry foundations' },
      { name: 'DUSD Accelerated Math', icon: '🚀', description: 'Advanced placement preparation' },
      { name: 'High School Math', icon: '🎯', description: 'Calculus and advanced topics' }
    ]
  },
  {
    id: 2,
    title: 'ELA Courses',
    description: 'Develop comprehensive English language arts skills',
    icon: BookOpen,
    gradient: 'from-[#F16112] to-[#F1894F]',
    bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
    iconColor: 'text-[#F16112]',
    subItems: [
      { name: 'English Mastery: K-12', icon: '📚', description: 'Complete language arts curriculum' },
      { name: 'Reading Enrichment', icon: '📖', description: 'Improve reading comprehension' },
      { name: 'Grammar Boost', icon: '✏️', description: 'Master grammar and mechanics' }
    ]
  },
  {
    id: 3,
    title: 'Writing Lab',
    description: 'Master the art of effective written communication',
    icon: PenTool,
    gradient: 'from-[#F1894F] to-[#F16112]',
    bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10',
    iconColor: 'text-[#F1894F]',
    subItems: [
      { name: 'Creative Writing', icon: '✨', description: 'Unleash your creative potential' },
      { name: 'Essay Writing', icon: '📝', description: 'Academic and persuasive writing' },
      { name: 'Create & Reflect', icon: '🤔', description: 'Develop critical thinking skills' }
    ]
  },
  {
    id: 4,
    title: 'SAT/ACT',
    description: 'Achieve your best scores with comprehensive test preparation',
    icon: Award,
    gradient: 'from-[#1F396D] to-[#F16112]',
    bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    iconColor: 'text-[#1F396D]',
    subItems: [
      { name: 'Math Test Prep', icon: '🧮', description: 'Master SAT/ACT math sections' },
      { name: 'Online SAT Test Prep', icon: '💻', description: 'Comprehensive SAT preparation' },
      { name: 'Online ACT Test Prep', icon: '🎯', description: 'Complete ACT test strategy' }
    ]
  },
  {
    id: 5,
    title: 'Science Lab',
    description: 'Explore scientific concepts through hands-on experiments',
    icon: Award,
    gradient: 'from-[#F16112] to-[#1F396D]',
    bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#1F396D]/10',
    iconColor: 'text-[#F16112]',
    subItems: [
      { name: 'Biology', icon: '🧬', description: 'Life sciences and organisms' },
      { name: 'Chemistry', icon: '⚗️', description: 'Chemical reactions and properties' },
      { name: 'Physics', icon: '⚡', description: 'Forces, energy, and motion' }
    ]
  },
  {
    id: 6,
    title: 'Social Studies',
    description: 'Understand history, geography, and civic engagement',
    icon: BookOpen,
    gradient: 'from-[#1F396D] to-[#F1894F]',
    bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#F1894F]/10',
    iconColor: 'text-[#1F396D]',
    subItems: [
      { name: 'World History', icon: '🌍', description: 'Global historical events' },
      { name: 'Geography', icon: '🗺️', description: 'Physical and human geography' },
      { name: 'Civics', icon: '🏛️', description: 'Government and citizenship' }
    ]
  }
];

// Updated STEAM Programs with exact content from original
const steamPrograms = [
  {
    id: 1,
    title: 'Game Development',
    description: 'Create immersive games and interactive experiences',
    icon: Gamepad2,
    gradient: 'from-[#F16112] to-[#F1894F]',
    bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
    iconColor: 'text-[#F16112]',
    subItems: [
      { name: 'Roblox Studio', icon: '🎮', description: 'Create games in Roblox platform' },
      { name: 'Scratch', icon: '🐱', description: 'Visual programming for beginners' },
      { name: 'Minecraft', icon: '⛏️', description: 'Build and code in Minecraft' }
    ]
  },
  {
    id: 2,
    title: 'Coding & AI',
    description: 'Learn programming and artificial intelligence fundamentals',
    icon: Code,
    gradient: 'from-[#1F396D] to-[#29335C]',
    bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
    iconColor: 'text-[#1F396D]',
    subItems: [
      { name: 'Python Programming', icon: '🐍', description: 'Learn Python from basics to advanced' },
      { name: 'AI & Machine Learning', icon: '🤖', description: 'Introduction to AI concepts' },
      { name: 'Web Development', icon: '🌐', description: 'Build websites and web applications' }
    ]
  },
  {
    id: 3,
    title: 'Creative Arts',
    description: 'Express creativity through digital and traditional arts',
    icon: Palette,
    gradient: 'from-[#F1894F] to-[#F16112]',
    bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10',
    iconColor: 'text-[#F1894F]',
    subItems: [
      { name: 'Digital Art', icon: '🎨', description: 'Create digital artwork and designs' },
      { name: 'Music Production', icon: '🎵', description: 'Learn music creation and production' },
      { name: 'Animation', icon: '🎬', description: 'Create animated stories and characters' }
    ]
  },
  {
    id: 4,
    title: 'Young Entrepreneurs',
    description: 'Develop business skills and entrepreneurial mindset',
    icon: TrendingUp,
    gradient: 'from-[#1F396D] to-[#F16112]',
    bgGradient: 'bg-gradient-to-br from-gray-50 to-gray-100',
    iconColor: 'text-[#1F396D]',
    subItems: [
      { name: 'Business Basics', icon: '💼', description: 'Learn fundamental business concepts' },
      { name: 'Marketing & Sales', icon: '📈', description: 'Understand marketing strategies' },
      { name: 'Product Development', icon: '🚀', description: 'Create and launch products' }
    ]
  }
];

export default function Features() {
  const [hoveredK12Program, setHoveredK12Program] = useState<number | null>(null);
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  const [currentK12Set, setCurrentK12Set] = useState(0);

  // Calculate how many cards to show per set based on screen size
  const cardsPerSet = 4;
  const totalK12Sets = Math.ceil(k12Programs.length / cardsPerSet);

  const nextK12Set = () => {
    setCurrentK12Set((prev) => (prev + 1) % totalK12Sets);
  };

  const prevK12Set = () => {
    setCurrentK12Set((prev) => (prev - 1 + totalK12Sets) % totalK12Sets);
  };

  const goToK12Set = (index: number) => {
    setCurrentK12Set(index);
  };

  const getCurrentK12Cards = () => {
    const startIndex = currentK12Set * cardsPerSet;
    return k12Programs.slice(startIndex, startIndex + cardsPerSet);
  };

  return (
    <>
      {/* Our Programs Header */}
      <section className="py-16 px-4 lg:px-8 relative overflow-hidden">
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-[#1F396D]/8 to-[#F16112]/8 backdrop-blur-[2px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-bold text-black mb-12">
            Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Programs</span>
          </h2>
        </div>
      </section>

      {/* Enhanced K-12 Programs Section with Carousel */}
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl mb-8 text-center text-black">K-12 Academic Programs</h3>
          
          {/* Carousel Container */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevK12Set}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-[#1F396D]" />
            </button>
            
            <button
              onClick={nextK12Set}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 group"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600 group-hover:text-[#1F396D]" />
            </button>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentK12Cards().map((program, index) => {
                const IconComponent = program.icon;
                const isHovered = hoveredK12Program === program.id;
                
                return (
                  <Card 
                    key={program.id} 
                    className={`${program.bgGradient} rounded-2xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border border-white/50 transition-all duration-500 cursor-pointer group overflow-hidden ${
                      isHovered ? 'shadow-[0px_16px_32px_0px_rgba(0,0,0,0.15)] scale-105' : ''
                    }`}
                    onMouseEnter={() => setHoveredK12Program(program.id)}
                    onMouseLeave={() => setHoveredK12Program(null)}
                  >
                    <CardContent className="p-6 relative flex flex-col h-full">
                      {/* Main Program Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-lg ${program.iconColor}`}>{program.title}</h4>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{program.description}</p>
                      
                      {/* Sub-items with smooth animation */}
                      <div className={`space-y-3 flex-1 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-[400px]' : 'opacity-80 max-h-[300px]'}`}>
                        {program.subItems.map((item, itemIndex) => (
                          <div 
                            key={item.name}
                            className={`flex items-center gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 transition-all duration-300 hover:bg-white hover:shadow-md group/item ${
                              isHovered ? 'transform translate-x-0 opacity-100' : ''
                            }`}
                            style={{
                              transitionDelay: isHovered ? `${itemIndex * 100}ms` : '0ms'
                            }}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                              <p className="text-xs text-gray-600 group-hover/item:text-gray-700 transition-colors">{item.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA Button */}
                      <div className="mt-6 pt-4">
                        <Button 
                          onClick={() => window.location.href = program.ctaUrl || '/enroll'}
                          className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-lg text-white rounded-xl py-3 transition-all duration-300 transform ${
                            isHovered ? 'scale-105 shadow-lg' : ''
                          }`}
                        >
                          {program.ctaText || 'Enroll Now'}
                          <GraduationCap className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Decorative background elements */}
                      <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-full opacity-10 transition-all duration-500 ${
                        isHovered ? 'scale-150 opacity-20' : ''
                      }`} />
                      <div className={`absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br ${program.gradient} rounded-full opacity-5 transition-all duration-500 ${
                        isHovered ? 'scale-125 opacity-10' : ''
                      }`} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Carousel Indicators */}
            {totalK12Sets > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalK12Sets }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => goToK12Set(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentK12Set
                        ? 'bg-[#1F396D] scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced STEAM Programs Section */}
      <section className="py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl mb-8 text-center text-black">STEAM Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steamPrograms.map((program, index) => {
              const IconComponent = program.icon;
              const isHovered = hoveredProgram === program.id;
              
              return (
                <Card 
                  key={program.id} 
                  className={`${program.bgGradient} rounded-2xl shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border border-white/50 transition-all duration-500 cursor-pointer group overflow-hidden ${
                    isHovered ? 'shadow-[0px_16px_32px_0px_rgba(0,0,0,0.15)] scale-105' : ''
                  }`}
                  onMouseEnter={() => setHoveredProgram(program.id)}
                  onMouseLeave={() => setHoveredProgram(null)}
                >
                  <CardContent className="p-6 relative flex flex-col h-full">
                    {/* Main Program Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-lg ${program.iconColor}`}>{program.title}</h4>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{program.description}</p>
                    
                    {/* Sub-items with smooth animation */}
                    <div className={`space-y-3 flex-1 transition-all duration-500 ${isHovered ? 'opacity-100 max-h-[400px]' : 'opacity-80 max-h-[300px]'}`}>
                      {program.subItems.map((item, itemIndex) => (
                        <div 
                          key={item.name}
                          className={`flex items-center gap-3 p-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/50 transition-all duration-300 hover:bg-white hover:shadow-md group/item ${
                            isHovered ? 'transform translate-x-0 opacity-100' : ''
                          }`}
                          style={{
                            transitionDelay: isHovered ? `${itemIndex * 100}ms` : '0ms'
                          }}
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                            <p className="text-xs text-gray-600 group-hover/item:text-gray-700 transition-colors">{item.description}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover/item:text-gray-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA Button */}
                    <div className="mt-6 pt-4">
                      <Button 
                        className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-lg text-white rounded-xl py-3 transition-all duration-300 transform ${
                          isHovered ? 'scale-105 shadow-lg' : ''
                        }`}
                      >
                        Enroll Now
                        <Sparkles className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Decorative background elements */}
                    <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-full opacity-10 transition-all duration-500 ${
                      isHovered ? 'scale-150 opacity-20' : ''
                    }`} />
                    <div className={`absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br ${program.gradient} rounded-full opacity-5 transition-all duration-500 ${
                      isHovered ? 'scale-125 opacity-10' : ''
                    }`} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
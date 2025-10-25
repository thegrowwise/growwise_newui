'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Clock, Users, Star, Filter, ShoppingCart, CheckCircle, Award, BookOpen, Target, GraduationCap, TrendingUp, Shield, ChevronRight, DollarSign, Eye, Sparkles, ArrowRight, HelpCircle, MessageCircle, Phone, Mail, Calendar, X, Smartphone } from "lucide-react";
import { mathCourses } from '@/data/mathCourses';
import { useCart } from '@/components/gw/CartContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import { ImageWithFallback } from '@/components/gw/ImageWithFallback';
import CourseCustomizationModal from '@/components/gw/CourseCustomizationModal';
import ClientOnly from '@/components/providers/ClientOnly';
import HydrationBoundary from '@/components/HydrationBoundary';
import DynamicWrapper from '@/components/DynamicWrapper';
import MathSymbolsBackground from '@/components/MathSymbolsBackground';
import CourseCard from '@/components/CourseCard';
import { useTouchDetection } from '@/hooks/useHydration';
import { useTranslations } from 'next-intl';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMathCoursesRequested } from '@/store/slices/mathCoursesSlice';
import { getIconComponent } from '@/lib/iconMap';
import { CourseCardSkeleton, CardSkeleton } from '@/components/ui/loading-skeletons';

const MathCoursesPage: React.FC = () => {
  const { addItem } = useCart();
  const { openChatbot } = useChatbot();
  const t = useTranslations('mathCourses');
  const dispatch = useAppDispatch();
  const mathCoursesData = useAppSelector((s) => s.mathCourses.data);
  const mathCoursesLoading = useAppSelector((s) => s.mathCourses.loading);
  
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedAlignments, setSelectedAlignments] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('price-low');
  // hoveredCourse state moved to CourseCard component
  const [scrollY, setScrollY] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Fetch Math courses data
  useEffect(() => {
    if (!mathCoursesData && !mathCoursesLoading) {
      dispatch(fetchMathCoursesRequested());
    }
  }, [mathCoursesData, mathCoursesLoading, dispatch]);

  // Detect touch device and disable hover effects on mobile
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
      // Consider it a touch device if it has touch AND (small screen OR no hover capability)
      setIsTouchDevice(hasTouch && (isSmallScreen || !hasHover));
    };

    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => {
      window.removeEventListener('resize', checkTouchDevice);
    };
  }, []);

  // Scroll effect for header animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter categories
  // Filter categories from Redux data
  const gradeLevelFilters = mathCoursesData?.filters?.gradeLevels ?? [];
  const courseTypeFilters = mathCoursesData?.filters?.courseTypes ?? [];
  const alignmentFilters = mathCoursesData?.filters?.alignments ?? [];

  // Course gradients based on level
  const getCourseGradients = (course: any) => {
    if (course.gradeLevel.includes('Elementary')) {
      return {
        gradient: 'from-[#F16112] to-[#F1894F]',
        bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
        iconColor: 'text-[#F16112]',
        hoverBorder: 'border-[#F16112]/30'
      };
    } else if (course.gradeLevel.includes('Middle School')) {
      return {
        gradient: 'from-[#1F396D] to-[#29335C]',
        bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
        iconColor: 'text-[#1F396D]',
        hoverBorder: 'border-[#1F396D]/30'
      };
    } else if (course.gradeLevel.includes('High School')) {
      return {
        gradient: 'from-[#F1894F] to-[#F16112]',
        bgGradient: 'bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/10',
        iconColor: 'text-[#F1894F]',
        hoverBorder: 'border-[#F1894F]/30'
      };
    } else {
      return {
        gradient: 'from-[#29335C] to-[#1F396D]',
        bgGradient: 'bg-gradient-to-br from-[#29335C]/5 to-[#1F396D]/10',
        iconColor: 'text-[#29335C]',
        hoverBorder: 'border-[#29335C]/30'
      };
    }
  };

  // Filter course logic
  const filteredCourses = mathCourses
    .filter(course => {
      const gradeMatch = selectedGradeLevels.length === 0 || 
        selectedGradeLevels.some(grade => course.gradeLevel.includes(grade));
      
      const typeMatch = selectedCourseTypes.length === 0 || 
        selectedCourseTypes.some(type => course.courseType.includes(type));
      
      const alignmentMatch = selectedAlignments.length === 0 || 
        selectedAlignments.some(alignment => course.alignment.includes(alignment));
      
      return gradeMatch && typeMatch && alignmentMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

  const handleAddToCart = (course: any) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  // Hover handlers are now handled in the CourseCard component

  // Toggle filter functions
  const toggleGradeLevel = (grade: string) => {
    setSelectedGradeLevels(prev => 
      prev.includes(grade) 
        ? prev.filter(g => g !== grade)
        : [...prev, grade]
    );
  };

  const toggleCourseType = (type: string) => {
    setSelectedCourseTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAlignment = (alignment: string) => {
    setSelectedAlignments(prev => 
      prev.includes(alignment) 
        ? prev.filter(a => a !== alignment)
        : [...prev, alignment]
    );
  };

  const clearAllFilters = () => {
    setSelectedGradeLevels([]);
    setSelectedCourseTypes([]);
    setSelectedAlignments([]);
  };

  // Get chip color for course tags
  const getChipColor = (value: string, type: 'grade' | 'courseType' | 'alignment') => {
    const filterArrays = {
      grade: gradeLevelFilters,
      courseType: courseTypeFilters,
      alignment: alignmentFilters
    };
    
    const filter = filterArrays[type].find(f => f.value === value);
    return filter ? filter.color : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getChipIcon = (value: string, type: 'grade' | 'courseType' | 'alignment') => {
    const filterArrays = {
      grade: gradeLevelFilters,
      courseType: courseTypeFilters,
      alignment: alignmentFilters
    };
    
    const filter = filterArrays[type].find(f => f.value === value);
    return filter ? filter.icon : '•';
  };

  // Enhanced Program Features from Redux data
  const enhancedProgramFeatures = mathCoursesData?.features ?? [];

  // Show loading skeleton when data is loading
  if (mathCoursesLoading && !mathCoursesData) {
    return (
      <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
        {/* Header Skeleton */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-50"></div>
          <div className="relative z-10 py-20 px-4 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="space-y-6">
                <div className="h-12 w-96 mx-auto bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-80 mx-auto bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-48 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Skeleton */}
        <section className="py-12 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Courses Grid Skeleton */}
        <section className="py-12 px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <HydrationBoundary>
      <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>

      {/* Enhanced Creative Header Section - Ultra Gentle Math Symbols */}
      <section className="relative overflow-hidden">
        {/* Animated Background - Updated with Very Light, Soothing Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-50">
          {/* Floating mathematical symbols - Server-safe animation */}
          <MathSymbolsBackground scrollY={scrollY} seed={12345} />
          
          {/* Gradient overlay circles - Much softer */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Main Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50">
              <Calculator className="w-5 h-5 text-[#F1894F]" />
              <span className="text-gray-700 font-medium">{mathCoursesData?.hero?.badge || t('hero.badge')}</span>
              <Sparkles className="w-5 h-5 text-[#F1894F]" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              {mathCoursesData?.hero?.title || t('hero.title')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              {mathCoursesData?.hero?.subtitle || t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <Calculator className="mr-2 w-5 h-5" />
                Book Free Assessment
              </Button>
              {/* Fixed View Programs Button - Better Visibility */}
              <Button variant="outline" className="border-2 border-gray-400 text-gray-700 bg-white/60 hover:bg-white hover:text-[#1F396D] rounded-full px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 shadow-lg">
                <Eye className="mr-2 w-5 h-5" />
                View Programs
              </Button>
            </div>
          </div>

          {/* Integrated "Why Choose Our Math Programs" - Updated with Blue Gradient */}
          <div className="bg-gradient-to-br from-orange-100/30 via-amber-100/20 to-orange-200/30 backdrop-blur-lg rounded-[32px] border border-orange-200/30 p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="text-[#1F396D]">Math Programs</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Comprehensive math education designed specifically for Tri-Valley students with curriculum alignment and proven teaching methodologies.
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {enhancedProgramFeatures.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <div 
                    key={index} 
                    className="text-center group"
                    style={{ animationDelay: feature.delay }}
                  >
                    <div className="relative mb-6">
                      <div className={`${feature.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-500 shadow-xl backdrop-blur-sm border border-white/20`}>
                        <IconComponent className={`w-10 h-10 ${feature.color}`} />
                      </div>
                      <div className="absolute -inset-2 bg-orange-100/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-3 group-hover:text-[#1F396D] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Math Courses Section with New Chip Filters */}
      <section className="py-16 px-4 lg:px-8" style={{
        background: `
          radial-gradient(circle at 20% 25%, rgba(31, 57, 109, 0.08) 0%, transparent 15%),
          radial-gradient(circle at 80% 35%, rgba(241, 137, 79, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 45% 70%, rgba(31, 57, 109, 0.06) 0%, transparent 25%),
          radial-gradient(circle at 70% 15%, rgba(241, 97, 18, 0.09) 0%, transparent 18%),
          radial-gradient(circle at 15% 80%, rgba(241, 137, 79, 0.07) 0%, transparent 22%),
          radial-gradient(circle at 90% 60%, rgba(31, 57, 109, 0.05) 0%, transparent 30%),
          radial-gradient(circle at 35% 10%, rgba(241, 97, 18, 0.08) 0%, transparent 20%),
          radial-gradient(circle at 60% 90%, rgba(241, 137, 79, 0.06) 0%, transparent 25%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(255, 255, 255, 0.9) 100%)
        `
      }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F16112]">Math Courses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of math programs designed for every learning level and goal.
            </p>
          </div>

          {/* New Chip-Style Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            {/* Filter Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Courses</h3>
                {(selectedGradeLevels.length > 0 || selectedCourseTypes.length > 0 || selectedAlignments.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-600 hover:text-red-600 border-gray-300 hover:border-red-300"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {/* Grade Level Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Grade Level</h4>
              <div className="flex flex-wrap gap-2">
                {gradeLevelFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => toggleGradeLevel(filter.value)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      selectedGradeLevels.includes(filter.value)
                        ? `${filter.color} border-current shadow-md scale-105`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Type Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Course Type</h4>
              <div className="flex flex-wrap gap-2">
                {courseTypeFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => toggleCourseType(filter.value)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      selectedCourseTypes.includes(filter.value)
                        ? `${filter.color} border-current shadow-md scale-105`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alignment Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Curriculum Alignment</h4>
              <div className="flex flex-wrap gap-2">
                {alignmentFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => toggleAlignment(filter.value)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      selectedAlignments.includes(filter.value)
                        ? `${filter.color} border-current shadow-md scale-105`
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCourses.length} of {mathCourses.length} courses
              {(selectedGradeLevels.length > 0 || selectedCourseTypes.length > 0 || selectedAlignments.length > 0) && 
                ' matching your filters'
              }
            </p>
          </div>

          {/* Course Cards Grid - Better Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DynamicWrapper fallback={
              <div className="col-span-full text-center py-8">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            }>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onAddToCart={handleAddToCart}
                  getCourseGradients={getCourseGradients}
                  getChipColor={getChipColor}
                  getChipIcon={getChipIcon}
                />
              ))}
            </DynamicWrapper>
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more courses.</p>
              <Button
                onClick={clearAllFilters}
                className="mt-4 bg-[#F16112] hover:bg-[#d54f0a] text-white px-6 py-2 rounded-lg"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Course Customization Modal */}
      {selectedCourse && (
        <CourseCustomizationModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          course={selectedCourse}
          onAddToCart={addItem}
        />
      )}

      {/* "Not Sure Which Course is Right?" Section - Clean Design */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        {/* Background with subtle animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-amber-100/20 to-orange-200/20"></div>
        
        <div className="absolute inset-0">
          {/* Floating elements for depth */}
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-amber-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Frosted Glass Container */}
          <div className="bg-white/20 backdrop-blur-xl rounded-[32px] border border-white/30 shadow-2xl p-8 lg:p-12 relative overflow-hidden">
            {/* Inner frosted effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[32px]"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon Header */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <HelpCircle className="w-10 h-10 text-orange-600" />
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {mathCoursesData?.notSure?.title || t('notSure.title')}
              </h2>
              
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                {mathCoursesData?.notSure?.subtitle || t('notSure.subtitle')}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {(mathCoursesData?.notSure?.steps ?? []).map((feature, index) => {
                  const IconComponent = getIconComponent(feature.icon);
                  return (
                    <div key={index} className="text-center group">
                      <div className="bg-white/30 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={openChatbot}
                  className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  {mathCoursesData?.notSure?.cta?.primary || t('notSure.cta.primary')}
                </Button>
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-white hover:text-[#1F396D] px-8 py-4 rounded-full text-lg backdrop-blur-sm transition-all duration-300">
                  <Phone className="mr-2 w-5 h-5" />
                  {mathCoursesData?.notSure?.cta?.secondary || t('notSure.cta.secondary')}
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>connect@thegrowwise.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>(925) 456-4606</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-12 h-12 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-[#F1894F]/30 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#1F396D]/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-8 bg-[#1F396D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">{mathCoursesData?.cta?.title || t('cta.title')}</h2>
          <p className="text-xl mb-8 text-white/90">
            {mathCoursesData?.cta?.subtitle || t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3 rounded-[30px]" size="lg">
              {mathCoursesData?.cta?.primaryButton || t('cta.primaryButton')}
            </Button>
            <Button 
              onClick={openChatbot}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-3 rounded-[30px] transition-all duration-200" 
              size="lg"
            >
              {mathCoursesData?.cta?.secondaryButton || t('cta.secondaryButton')}
            </Button>
          </div>
        </div>
      </section>
      </div>
    </HydrationBoundary>
  );
};

export default MathCoursesPage;










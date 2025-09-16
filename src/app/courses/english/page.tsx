'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Users, Star, Filter, ShoppingCart, CheckCircle, Award, Target, GraduationCap, TrendingUp, Shield, ChevronRight, DollarSign, Eye, Sparkles, ArrowRight, HelpCircle, MessageCircle, Phone, Mail, Calendar, X, PenTool, BookMarked } from "lucide-react";
import { englishCourses } from '@/data/englishCourses';
import { useCart } from '@/components/gw/CartContext';
import ImageWithFallback from '@/components/gw/ImageWithFallback';
import CourseCustomizationModal from '@/components/gw/CourseCustomizationModal';

const EnglishCoursesPage: React.FC = () => {
  const { addItem } = useCart();
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedAlignments, setSelectedAlignments] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device and disable hover effects on mobile
  useEffect(() => {
    const checkTouchDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
      const hasHover = window.matchMedia('(hover: hover)').matches;
      
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
  const gradeLevelFilters = [
    { value: 'Elementary', label: 'Elementary', icon: '📚', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Middle School', label: 'Middle School', icon: '📖', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'High School', label: 'High School', icon: '🎯', color: 'bg-purple-100 text-purple-800 border-purple-200' }
  ];

  const courseTypeFilters = [
    { value: 'Core English', label: 'Core English', icon: '📝', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'Grammar', label: 'Grammar', icon: '✏️', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'Comprehensive', label: 'Comprehensive', icon: '📚', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'Advanced', label: 'Advanced', icon: '🚀', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  ];

  const alignmentFilters = [
    { value: 'California Standards', label: 'California Standards', icon: '🏛️', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'DUSD Aligned', label: 'DUSD Aligned', icon: '🏫', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    { value: 'PUSD Aligned', label: 'PUSD Aligned', icon: '🎓', color: 'bg-pink-100 text-pink-800 border-pink-200' }
  ];

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
  const filteredCourses = englishCourses
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

  // Modified hover handlers to respect touch device detection
  const handleMouseEnter = (courseId: string) => {
    if (!isTouchDevice) {
      setHoveredCourse(courseId);
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setHoveredCourse(null);
    }
  };

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

  // Enhanced Program Features for the Header
  const enhancedProgramFeatures = [
    {
      icon: Shield,
      title: 'DUSD & PUSD Aligned',
      description: 'Perfectly synchronized with Dublin and Pleasanton Unified School Districts English curriculum standards',
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10',
      delay: '0ms'
    },
    {
      icon: GraduationCap,
      title: 'Comprehensive ELA',
      description: 'Complete English Language Arts education from reading fundamentals through advanced writing',
      color: 'text-[#F16112]',
      bgColor: 'bg-[#F16112]/10',
      delay: '100ms'
    },
    {
      icon: TrendingUp,
      title: 'Skills Development',
      description: 'Progressive skill building with detailed assessments and personalized learning paths',
      color: 'text-[#F1894F]',
      bgColor: 'bg-[#F1894F]/10',
      delay: '200ms'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engaging small group discussions and individual coaching for optimal language development',
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10',
      delay: '300ms'
    }
  ];

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>

      {/* Enhanced Creative Header Section - English Theme */}
      <section className="relative overflow-hidden">
        {/* Animated Background - English-themed gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 via-indigo-50 to-purple-50">
          {/* Floating literary symbols */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-gray-500/60 animate-float-gentle font-semibold"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateY(${scrollY * 0.05}px)`,
                  animationDelay: `${i * 1.2}s`,
                  animationDuration: `${8 + Math.random() * 4}s`,
                  fontSize: `${Math.random() * 15 + 18}px`
                }}
              >
                {['📚', '✍️', '📝', '💭', '🔤', '📖', '✨', '🎯', '💡', '🌟', '📋', '🖊️', '📄', '🔍', '💻'][Math.floor(Math.random() * 15)]}
              </div>
            ))}
          </div>
          
          {/* Gradient overlay circles - English theme colors */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Main Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50">
              <BookOpen className="w-5 h-5 text-[#F1894F]" />
              <span className="text-gray-700 font-medium">Master English with Excellence</span>
              <Sparkles className="w-5 h-5 text-[#F1894F]" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Excel in
              <span className="block bg-gradient-to-r from-[#F1894F] to-[#F16112] bg-clip-text text-transparent">
                English Arts
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive English Language Arts programs for students in Grades K–12. From reading enrichment to advanced writing, develop strong communication skills with expert instruction aligned to Dublin and Pleasanton school district standards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <BookOpen className="mr-2 w-5 h-5" />
                Book Free Assessment
              </Button>
              <Button variant="outline" className="border-2 border-gray-400 text-gray-700 bg-white/60 hover:bg-white hover:text-[#1F396D] rounded-full px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 shadow-lg">
                <Eye className="mr-2 w-5 h-5" />
                View Programs
              </Button>
            </div>
          </div>

          {/* Integrated "Why Choose Our English Programs" */}
          <div className="bg-gradient-to-br from-emerald-100/30 via-blue-100/20 to-indigo-200/30 backdrop-blur-lg rounded-[32px] border border-blue-200/30 p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="text-[#1F396D]">English Programs</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Comprehensive English Language Arts education designed specifically for Tri-Valley students with curriculum alignment and proven literacy methodologies that produce measurable results.
              </p>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {enhancedProgramFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
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
                      <div className="absolute -inset-2 bg-blue-100/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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

      {/* English Courses Section with Chip Filters */}
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
              Our <span className="text-[#F16112]">English Courses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of English Language Arts programs designed for every learning level and goal.
            </p>
          </div>

          {/* Chip-Style Filters */}
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
              Showing {filteredCourses.length} of {englishCourses.length} courses
              {(selectedGradeLevels.length > 0 || selectedCourseTypes.length > 0 || selectedAlignments.length > 0) && 
                ' matching your filters'
              }
            </p>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isHovered = hoveredCourse === course.id;
              const courseGradients = getCourseGradients(course);

              return (
                <div
                  key={course.id}
                  className={`relative h-[420px] cursor-pointer group ${!isTouchDevice ? 'perspective-1000' : ''}`}
                  onMouseEnter={() => handleMouseEnter(course.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Card Container with Conditional 3D Flip */}
                  <div className={`relative w-full h-full transition-transform duration-700 ${
                    !isTouchDevice ? 'transform-style-preserve-3d' : ''
                  } ${
                    !isTouchDevice && isHovered ? 'rotate-y-180' : ''
                  }`}>
                    
                    {/* Front Side - Clean Layout */}
                    <Card className={`absolute inset-0 w-full h-full ${courseGradients.bgGradient} rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border-2 border-white/50 hover:border-gray-200 ${!isTouchDevice ? 'backface-hidden' : ''} group-hover:scale-105 transition-all duration-300`}>
                      <CardContent className="p-5 relative flex flex-col h-full justify-between">
                        {/* Top Section - Course Header */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-bold text-base ${courseGradients.iconColor} leading-tight`}>{course.name}</h4>
                              <Badge className="bg-white/80 text-gray-700 text-xs mt-1">
                                {course.level}
                              </Badge>
                            </div>
                            {/* Hover Indicator - Only show on non-touch devices */}
                            {!isTouchDevice && (
                              <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Course Description */}
                        <div className="flex-grow">
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>
                          
                          {/* Course Tags/Chips */}
                          <div className="mb-4 space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {course.gradeLevel.map((grade) => (
                                <span
                                  key={grade}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChipColor(grade, 'grade')}`}
                                >
                                  <span>{getChipIcon(grade, 'grade')}</span>
                                  {grade}
                                </span>
                              ))}
                              {course.courseType.map((type) => (
                                <span
                                  key={type}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChipColor(type, 'courseType')}`}
                                >
                                  <span>{getChipIcon(type, 'courseType')}</span>
                                  {type}
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {course.alignment.map((align) => (
                                <span
                                  key={align}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getChipColor(align, 'alignment')}`}
                                >
                                  <span>{getChipIcon(align, 'alignment')}</span>
                                  {align}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Pricing & Rating */}
                          <div className="mb-3 p-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">💰</span>
                                <span className="font-bold text-lg text-[#1F396D]">{course.priceRange}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-[#F1894F] text-[#F1894F]" />
                                <span className="text-sm font-semibold text-gray-700">4.9</span>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-600">
                              <span>📦 Quantity: 1</span>
                            </div>
                          </div>

                          {/* Mobile/Desktop Responsive Interaction Hint - Only for non-touch devices */}
                          {!isTouchDevice && (
                            <div className="mb-3 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:border-blue-200 transition-all duration-300">
                              <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-600">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Hover to flip card</span>
                                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bottom Section - CTA */}
                        <div className="flex-shrink-0">
                          <Button 
                            onClick={() => handleAddToCart(course)}
                            className={`w-full bg-gradient-to-r ${courseGradients.gradient} text-white rounded-xl py-2.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105`}
                          >
                            {/* Desktop button text - Only for non-touch devices */}
                            {!isTouchDevice && (
                              <div className="hidden md:flex items-center justify-center">
                                <Eye className="mr-2 w-4 h-4" />
                                Hover to reveal information
                              </div>
                            )}
                            {/* Mobile button text or fallback for touch devices */}
                            <div className={`${!isTouchDevice ? 'flex md:hidden' : 'flex'} items-center justify-center`}>
                              <ShoppingCart className="mr-2 w-4 h-4" />
                              Add to Cart
                            </div>
                          </Button>
                        </div>

                        {/* Decorative background elements */}
                        <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${courseGradients.gradient} rounded-full opacity-10 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`} />
                        <div className={`absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br ${courseGradients.gradient} rounded-full opacity-5 transition-all duration-500 group-hover:scale-125 group-hover:opacity-10`} />
                      </CardContent>
                    </Card>

                    {/* Back Side - Enhanced Hover State - Only for non-touch devices */}
                    {!isTouchDevice && (
                      <Card className={`absolute inset-0 w-full h-full ${courseGradients.bgGradient} rounded-[24px] shadow-[0px_16px_32px_0px_rgba(0,0,0,0.15)] border-2 ${courseGradients.hoverBorder} backface-hidden rotate-y-180 scale-105`}>
                        <CardContent className="p-4 relative flex flex-col h-full justify-between overflow-hidden">
                          {/* Top Section - Course Header */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`p-2 rounded-xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                                <BookOpen className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm ${courseGradients.iconColor} leading-tight truncate`}>{course.name}</h4>
                                <div className="flex items-center gap-1 mt-1">
                                  <Badge className="bg-white/80 text-gray-700 text-xs">{course.level}</Badge>
                                  <Badge className="bg-white/80 text-gray-700 text-xs">{course.duration}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Middle Section - Features */}
                          <div className="flex-grow overflow-hidden">
                            {/* Description */}
                            <p className="text-gray-600 text-xs mb-2 leading-relaxed line-clamp-2">{course.description}</p>
                            
                            {/* Pricing */}
                            <div className="mb-2 p-2 bg-white/70 backdrop-blur-sm border border-white/50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="font-bold text-base text-[#1F396D]">{course.priceRange}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[#F1894F] text-[#F1894F]" />
                                  <span className="text-xs text-gray-600">4.9/5</span>
                                </div>
                              </div>
                            </div>

                            {/* Key Features - Limited to 3 items */}
                            <div className="space-y-1">
                              {course.features.slice(0, 3).map((feature, featureIndex) => (
                                <div 
                                  key={featureIndex}
                                  className="flex items-center gap-2 p-1.5 rounded-lg bg-white/70 backdrop-blur-sm border border-white/50"
                                  style={{
                                    transitionDelay: `${featureIndex * 100}ms`
                                  }}
                                >
                                  <span className="text-sm">✅</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-xs truncate">{feature}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Bottom Section - CTA Buttons */}
                          <div className="flex-shrink-0 space-y-1.5 mt-2">
                            <Button 
                              onClick={() => handleAddToCart(course)}
                              className={`w-full bg-gradient-to-r ${courseGradients.gradient} hover:shadow-lg text-white rounded-xl py-2 text-xs transition-all duration-300 transform scale-105 shadow-lg`}
                            >
                              <ShoppingCart className="mr-1 w-3 h-3" />
                              Add to Cart • {course.priceRange}
                            </Button>
                            <Button 
                              variant="outline"
                              className={`w-full border ${courseGradients.iconColor} hover:bg-gray-50 rounded-xl py-1.5 text-xs transition-all duration-300`}
                            >
                              Learn More
                              <ChevronRight className="ml-1 w-3 h-3" />
                            </Button>
                          </div>

                          {/* Decorative background elements - Properly positioned within card bounds */}
                          <div className={`absolute top-2 right-2 w-12 h-12 bg-gradient-to-br ${courseGradients.gradient} rounded-full opacity-20 scale-150`} />
                          <div className={`absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br ${courseGradients.gradient} rounded-full opacity-10 scale-125`} />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-8 bg-[#1F396D]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl mb-6 text-white">Ready to Excel in English?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of students who have transformed their writing and reading skills with GrowWise English programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#F16112] hover:bg-[#d54f0a] text-white px-8 py-3 rounded-[30px]" size="lg">
              Get Started
            </Button>
            <Button 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-3 rounded-[30px] transition-all duration-200" 
              size="lg"
            >
              Contact Us
            </Button>
          </div>
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
    </div>
  );
};

export default EnglishCoursesPage;




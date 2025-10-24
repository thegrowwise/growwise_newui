import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Target, GraduationCap, BookOpen, Calculator, CheckCircle, Clock, Users, Award, TrendingUp, Brain, FileText, PenTool, Sparkles, Eye, ChevronRight, Lightbulb, Trophy, BookMarked, Star, Shield, ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from './gw/CartContext';
import FreeAssessmentModal from './FreeAssessmentModal';

const SATPage: React.FC = () => {
  const { addItem } = useCart();
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
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

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const satCourses = [
    {
      id: 'sat-level-1',
      name: 'Level 1 – Fix the Gap',
      description: 'Build strong Math and English foundations before diving into SAT prep. Identify and fill critical gaps in your knowledge.',
      price: 1199,
      priceRange: '$1,199',
      duration: '3 months',
      sessions: '2 hrs/session',
      level: 'Foundation Level',
      icon: Lightbulb,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]',
      hoverBorder: 'border-[#1F396D]/30',
      hoverContent: [
        '3-month program',
        'Strengthen Math & English foundations',
        'Close learning gaps that impact SAT'
      ]
    },
    {
      id: 'sat-level-2',
      name: 'Level 2 – SAT Preparation',
      description: 'Master SAT-specific strategies and practice with timed sections. Learn test-taking techniques that boost your score.',
      price: 1299,
      priceRange: '$1,299',
      duration: '3 months',
      sessions: '2 hrs/session',
      level: 'SAT Strategy',
      icon: Target,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]',
      hoverBorder: 'border-[#F16112]/30',
      hoverContent: [
        '3-month program',
        'Full SAT content coverage',
        'Timed section practice',
        'Learn proven strategies'
      ]
    },
    {
      id: 'sat-level-3',
      name: 'Level 3 – Timed Practice & Accuracy',
      description: 'Intensive practice with real test conditions. Perfect your timing and accuracy with expert doubt clearing support.',
      price: 75,
      priceRange: '$75/session',
      duration: '1-3 months',
      sessions: '2 hrs/session',
      level: 'Test Mastery',
      icon: Trophy,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]',
      hoverBorder: 'border-[#1F396D]/30',
      isPricePerSession: true,
      hoverContent: [
        'Simulate real SAT test conditions',
        'Speed + accuracy drills',
        'Full-length practice exams',
        'Personalized doubt clearing'
      ]
    }
  ];

  // Enhanced Program Features for the Header
  const enhancedProgramFeatures = [
    {
      icon: Lightbulb,
      title: 'SAT Readiness in Dublin, CA',
      description: 'GrowWise offers SAT readiness programs for Grades 9-12. Every student starts with a Readiness Check to identify Math and English gaps before beginning SAT prep.',
      color: 'text-[#F16112]',
      bgColor: 'bg-[#F16112]/10',
      delay: '0ms'
    },
    {
      icon: TrendingUp,
      title: 'Step-by-Step SAT Pathway',
      description: 'Level 1 – Fix the Gap (Math & English foundations) | Level 2 – SAT Prep (strategies + timed practice) | Level 3 – Timed Practice (real test simulation + doubt clearing). Serving students in Dublin, Pleasanton, and San Ramon.',
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10',
      delay: '100ms'
    },
    {
      icon: Trophy,
      title: 'Beyond Test Scores',
      description: 'Our SAT programs build critical thinking and problem-solving skills that support college admissions success and long-term learning confidence.',
      color: 'text-[#F1894F]',
      bgColor: 'bg-[#F1894F]/10',
      delay: '200ms'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from teachers who scored in the 99th percentile and have years of SAT coaching experience',
      color: 'text-[#29335C]',
      bgColor: 'bg-[#29335C]/10',
      delay: '300ms'
    }
  ];

  const handleAddToCart = (course: any) => {
    addItem({
      id: course.id,
      name: course.name,
      price: course.price,
      quantity: 1,
      image: '🎯',
      category: 'SAT Prep'
    });
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

  // Get course gradients
  const getCourseGradients = (course: any) => {
    return {
      gradient: course.gradient,
      bgGradient: course.bgGradient,
      iconColor: course.iconColor,
      hoverBorder: course.hoverBorder
    };
  };

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      
      {/* Enhanced Creative Header Section - SAT Theme */}
      <section className="relative overflow-hidden">
        {/* Animated Background - SAT-themed gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
          {/* Floating SAT symbols */}
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
                {['🎯', '📊', '📈', '🧮', '📚', '✍️', '💯', '🏆', '⭐', '✅', '📝', '🎓', '💡', '🔍', '📖'][Math.floor(Math.random() * 15)]}
              </div>
            ))}
          </div>
          
          {/* Gradient overlay circles - SAT theme colors */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#1F396D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Main Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50">
              <Target className="w-5 h-5 text-[#F1894F]" />
              <span className="text-gray-700 font-medium">Excel in SAT/PSAT with GrowWise</span>
              <Sparkles className="w-5 h-5 text-[#F1894F]" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Master the
              <span className="block bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
                SAT & PSAT
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive SAT/PSAT preparation programs for high school students in Dublin, CA. From foundational skills to test-day strategies, achieve your target scores with expert instruction and proven methods.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setIsAssessmentModalOpen(true)}
                className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Target className="mr-2 w-5 h-5" />
                Free Assessment
              </Button>
              <Button variant="outline" className="border-2 border-gray-400 text-gray-700 bg-white/60 hover:bg-white hover:text-[#1F396D] rounded-full px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 shadow-lg">
                <Eye className="mr-2 w-5 h-5" />
                View Programs
              </Button>
            </div>
          </div>

          {/* Integrated "Why Choose Our SAT Programs" */}
          <div className="bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-purple-200/30 backdrop-blur-lg rounded-[32px] border border-blue-200/30 p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="text-[#1F396D]">SAT Programs</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                High School SAT Prep in Dublin, CA designed to meet students exactly where they are and guide them step by step toward their target SAT scores.
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

      {/* SAT Courses Section - Matching English Courses Style */}
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
              Our <span className="text-[#1F396D]">SAT Programs</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
              <span className="font-semibold text-gray-700">(3 Levels of Support – From Gaps to Test Day)</span>
            </p>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Three progressive levels designed to take you from foundation to test mastery
            </p>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              Showing {satCourses.length} SAT preparation levels
            </p>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {satCourses.map((course) => {
              const isHovered = hoveredCourse === course.id;
              const courseGradients = getCourseGradients(course);
              const IconComponent = course.icon;

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
                              <IconComponent className="w-5 h-5 text-white" />
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
                          
                          {/* Course Details */}
                          <div className="mb-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-[#F16112]" />
                              <span>{course.duration} • {course.sessions} sessions</span>
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
                        <CardContent className="p-5 relative flex flex-col h-full justify-between overflow-hidden">
                          {/* Top Section - Course Header */}
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`p-2 rounded-xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                                <IconComponent className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm ${courseGradients.iconColor} leading-tight`}>{course.name}</h4>
                                <Badge className="bg-white/80 text-gray-700 text-xs mt-1">{course.level}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Middle Section - Content */}
                          <div className="flex-grow">
                            {/* Pricing */}
                            <div className="mb-3 p-2.5 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-base text-[#1F396D]">{course.priceRange}</span>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-[#F1894F] text-[#F1894F]" />
                                  <span className="text-xs text-gray-600">4.9/5</span>
                                </div>
                              </div>
                              {course.isPricePerSession && (
                                <p className="text-[10px] text-gray-600 italic">Flexible pay-per-session</p>
                              )}
                            </div>

                            {/* What's Included Section */}
                            <div className="mb-3 p-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl">
                              <h5 className="text-xs font-semibold text-gray-700 mb-2">What's Included:</h5>
                              <ul className="space-y-2">
                                {course.hoverContent.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-xs text-gray-600 leading-tight">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Duration Badge */}
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                              <Clock className="w-3.5 h-3.5 text-[#F16112]" />
                              <span>{course.duration} • {course.sessions}</span>
                            </div>
                          </div>

                          {/* Bottom Section - CTA */}
                          <div className="flex-shrink-0">
                            <Button
                              onClick={() => handleAddToCart(course)}
                              className={`w-full bg-gradient-to-r ${courseGradients.gradient} text-white rounded-xl py-2.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg`}
                            >
                              <ShoppingCart className="mr-2 w-4 h-4" />
                              Enroll Now
                            </Button>
                          </div>

                          {/* Decorative corner accent */}
                          <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${courseGradients.gradient} rounded-bl-full opacity-10`}></div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Boost Your SAT Score?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Start your SAT preparation journey with GrowWise's proven methods
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsAssessmentModalOpen(true)}
              className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Free Assessment
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Free Assessment Modal */}
      <FreeAssessmentModal 
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
      />
    </div>
  );
};

export default SATPage;


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { GraduationCap, Calculator, TrendingUp, Award, BookOpen, CheckCircle, Clock, Users, Target, Brain, Sparkles, Eye, ChevronRight, Star, ShoppingCart, ArrowRight, Filter, X, UserCheck, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useCart } from './gw/CartContext';
import { useChatbot } from '../contexts/ChatbotContext';
import FreeAssessmentModal from './FreeAssessmentModal';
import { getIconComponent } from '@/lib/iconMap';

const HighSchoolMathPage: React.FC = () => {
  const router = useRouter();
  const { addItem } = useCart();
  const { openChatbot } = useChatbot();
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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

  const programFeatures = [
    {
      icon: Calculator,
      title: 'Math Courses in Dublin',
      description: 'Our Math courses are tailored specifically for students in Dublin, CA. We understand the local education standards and customize our curriculum to meet and exceed these expectations.',
      color: 'text-[#1F396D]',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      delay: '0ms',
      isWhiteCard: true
    },
    {
      icon: BookOpen,
      title: 'Common Core Math Alignment',
      description: 'At GrowWise, our math programs for Grades 1-8 are fully aligned with Common Core standards and the pacing guides used by DUSD, PUSD, and other Tri-Valley school districts. We focus on building strong number sense, conceptual understanding, and problem-solving skills that reinforce classroom instruction.',
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-[#F16112] to-[#F1894F]',
      borderColor: 'border-[#F16112]',
      delay: '100ms',
      isOrangeCard: true
    },
    {
      icon: TrendingUp,
      title: 'Accelerated & Enrichment Math',
      description: 'GrowWise offers support for accelerated math learners through challenging problems, pre-algebra foundations, and advanced concepts. Our curriculum is designed to match the rigor of district-level accelerated programs and help students in Dublin, Pleasanton, and San Ramon stay ahead with confidence.',
      color: 'text-white',
      bgColor: 'bg-gradient-to-r from-[#F16112] to-[#F1894F]',
      borderColor: 'border-[#F16112]',
      delay: '200ms',
      isOrangeCard: true
    }
  ];

  const highSchoolMathCourses = [
    {
      id: 'freshman-sophomore',
      name: 'Freshman & Sophomore',
      subtitle: 'Grades 9-10',
      description: 'Foundation courses covering Algebra I and Geometry with personalized attention to build strong mathematical fundamentals.',
      groupPrice: 45,
      oneOnOnePrice: 65,
      priceRange: '$45-$65',
      duration: 'Per session',
      sessions: '2 hrs/session',
      level: 'Grades 9-10',
      icon: GraduationCap,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]',
      hoverBorder: 'border-[#1F396D]/30',
      curriculum: [
        {
          course: 'Algebra I',
          topics: [
            'One and Two Variable Statistics',
            'Linear equations & inequalities',
            'Systems of linear equations',
            'Quadratic equations',
            'Exponential Functions',
            'Functions (intro, graphs)'
          ]
        },
        {
          course: 'Geometry',
          topics: [
            'Points, lines, angles',
            'Triangles (congruence, similarity)',
            'Quadrilaterals & polygons',
            'Circles & tangents',
            'Transformations & dilations',
            'Coordinate geometry',
            'Perimeter, area, volume',
            'Proofs (two-column, paragraph)',
            'Intro trigonometry'
          ]
        }
      ]
    },
    {
      id: 'junior-senior',
      name: 'Junior & Senior',
      subtitle: 'Grades 11-12',
      description: 'Advanced courses covering Algebra II and Pre-Calculus preparing students for college-level mathematics and AP exams.',
      groupPrice: 65,
      oneOnOnePrice: 75,
      priceRange: '$65-$75',
      duration: 'Per session',
      sessions: '2 hrs/session',
      level: 'Grades 11-12',
      icon: Award,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]',
      hoverBorder: 'border-[#F16112]/30',
      curriculum: [
        {
          course: 'Algebra II',
          topics: [
            'Sequences and Functions',
            'Polynomial functions',
            'Rational Functions and Equations',
            'Complex Numbers and Rational Exponents',
            'Exponential Functions and Equations',
            'Transformations and Functions',
            'Trigonometric Functions',
            'Statistical Inferences'
          ]
        },
        {
          course: 'Precalculus',
          topics: [
            'Advanced functions',
            'Trigonometric (identities, graphs)',
            'Sequences & series',
            'Vectors & parametrics',
            'Conic sections',
            'Limits (intro)',
            'Matrices & determinants'
          ]
        }
      ]
    }
  ];

  const handleAddToCart = (course: any) => {
    addItem({
      id: course.id,
      name: course.name,
      price: course.groupPrice,
      quantity: 1,
      image: '📐',
      category: 'High School Math'
    });
  };

  // Contact information for modal
  const contactInfo = [
    {
      icon: 'Phone',
      title: 'Call Us',
      primary: '(925) 456-4606',
      secondary: 'Mon-Fri 9AM-7PM',
      description: 'Speak directly with our education consultants',
      bgColor: 'bg-[#1F396D]'
    },
    {
      icon: 'Mail',
      title: 'Email Us',
      primary: 'connect@thegrowwise.com',
      secondary: 'Response within 24 hours',
      description: 'Get detailed information about our programs',
      bgColor: 'bg-[#F16112]'
    },
    {
      icon: 'MapPin',
      title: 'Visit Us',
      primary: '4564 Dublin Blvd',
      secondary: 'Dublin, CA 94568',
      description: 'Come see our learning center in person',
      bgColor: 'bg-[#F1894F]'
    },
    {
      icon: 'MessageCircle',
      title: 'Live Chat',
      primary: 'Instant Support',
      secondary: 'Available during business hours',
      description: 'Quick answers to your questions',
      bgColor: 'bg-[#29335C]'
    }
  ];

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
      
      {/* Enhanced Creative Header Section - High School Math Theme */}
      <section className="relative overflow-hidden">
        {/* Animated Background - High School Math-themed gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
          {/* Floating math symbols */}
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
                {['∑', '∫', '∂', 'π', '∞', '√', '≈', '≠', '≤', '≥', 'α', 'β', 'θ', 'Δ', '∇'][Math.floor(Math.random() * 15)]}
              </div>
            ))}
          </div>
          
          {/* Gradient overlay circles - High School Math theme colors */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#1F396D]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Main Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50">
              <GraduationCap className="w-5 h-5 text-[#F1894F]" />
              <span className="text-gray-700 font-medium">Excel in Math with GrowWise</span>
              <Sparkles className="w-5 h-5 text-[#F1894F]" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              High School
              <span className="block bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">
                Math Courses
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive Math Courses in Dublin, CA for Grades 9-12. Aligned with California Common Core Standards for academic success and future STEM opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setIsAssessmentModalOpen(true)}
                className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white rounded-full px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Calculator className="mr-2 w-5 h-5" />
                Book Free Assessment
              </Button>
              <Button 
                onClick={() => {
                  const coursesSection = document.getElementById('courses');
                  if (coursesSection) {
                    coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                variant="outline" 
                className="border-2 border-gray-400 text-gray-700 bg-white/60 hover:bg-white hover:text-[#1F396D] rounded-full px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300 shadow-lg"
              >
                <Eye className="mr-2 w-5 h-5" />
                View Programs
              </Button>
            </div>
          </div>

          {/* Integrated "Why Choose Our High School Math" */}
          <div className="bg-gradient-to-br from-blue-100/30 via-indigo-100/20 to-purple-200/30 backdrop-blur-lg rounded-[32px] border border-blue-200/30 p-8 lg:p-12 shadow-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Why Choose Our <span className="text-[#1F396D]">High School Math Programs</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                At GrowWise, our High School Math courses are designed to guide students through Algebra I, Geometry, Algebra II, and Precalculus with clarity and confidence.
              </p>
            </div>

            {/* Three Feature Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {programFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card 
                    key={index}
                    className={`${feature.isWhiteCard ? 'bg-white/80 backdrop-blur-sm border-2 border-gray-200' : 'bg-gradient-to-r from-[#F16112] to-[#F1894F]'} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${feature.isOrangeCard ? 'text-white border-[#F16112]' : ''}`}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className={`${feature.isWhiteCard ? 'bg-[#F16112]/10' : 'bg-white/20'} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                          <IconComponent className={`w-7 h-7 ${feature.isWhiteCard ? 'text-[#F16112]' : 'text-white'}`} />
                        </div>
                        <h3 className={`font-bold text-lg mb-3 ${feature.isWhiteCard ? 'text-gray-900' : 'text-white'}`}>
                          {feature.title}
                        </h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${feature.isWhiteCard ? 'text-gray-600' : 'text-white/95'}`}>
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* High School Math Courses Section */}
      <section id="courses" className="py-16 px-4 lg:px-8" style={{
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
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#1F396D]">High School Math Courses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible learning options designed for every student's needs
            </p>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600 text-center">
              Showing {highSchoolMathCourses.length} high school math programs
            </p>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {highSchoolMathCourses.map((course) => {
              const isHovered = hoveredCourse === course.id;
              const courseGradients = getCourseGradients(course);
              const IconComponent = course.icon;

              return (
                <div
                  key={course.id}
                  className={`relative h-[500px] cursor-pointer group ${!isTouchDevice ? 'perspective-1000' : ''}`}
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
                          
                          {/* Pricing Display */}
                          <div className="mb-4 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#F16112]" />
                                <span className="text-sm text-gray-700 font-medium">Group Classes</span>
                              </div>
                              <span className="font-bold text-lg text-[#1F396D]">${course.groupPrice}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl">
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-[#1F396D]" />
                                <span className="text-sm text-gray-700 font-medium">1-on-1 Classes</span>
                              </div>
                              <span className="font-bold text-lg text-[#1F396D]">${course.oneOnOnePrice}</span>
                            </div>
                          </div>

                          {/* Duration Info */}
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                            <Clock className="w-3.5 h-3.5 text-[#F16112]" />
                            <span>{course.sessions} per session</span>
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
                        <CardContent className="p-5 relative flex flex-col h-full overflow-hidden">
                          {/* Top Section - Course Header */}
                          <div className="flex-shrink-0 mb-3">
                            <div className="text-center mb-2">
                              <h4 className={`font-bold text-base ${courseGradients.iconColor} mb-1`}>High School Math Curriculum</h4>
                              <p className="text-[10px] text-gray-600">(Aligned with California Common Core Standards)</p>
                            </div>
                          </div>
                          
                          {/* Middle Section - Curriculum Content */}
                          <div className="flex-grow overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-3">
                              {course.curriculum.map((curriculumItem, idx) => {
                                const isAlgebraI = curriculumItem.course === 'Algebra I';
                                const isGeometry = curriculumItem.course === 'Geometry';
                                const isAlgebraII = curriculumItem.course === 'Algebra II';
                                const isPrecalculus = curriculumItem.course === 'Precalculus';
                                
                                return (
                                  <div 
                                    key={idx}
                                    className={`p-3 rounded-xl border-2 ${
                                      isAlgebraI || isPrecalculus
                                        ? 'bg-[#1F396D]/5 border-[#1F396D]/20'
                                        : 'bg-[#F16112]/5 border-[#F16112]/20'
                                    }`}
                                  >
                                    <div className={`text-center py-2 px-3 rounded-lg mb-2 ${
                                      isAlgebraI || isPrecalculus
                                        ? 'bg-[#1F396D] text-white'
                                        : 'bg-[#F16112] text-white'
                                    }`}>
                                      <h5 className="text-xs font-bold">{curriculumItem.course}</h5>
                                    </div>
                                    <ul className="space-y-1.5">
                                      {curriculumItem.topics.map((topic, topicIdx) => (
                                        <li key={topicIdx} className="flex items-start gap-1.5">
                                          <span className={`inline-block w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                                            isAlgebraI || isPrecalculus ? 'bg-[#1F396D]' : 'bg-[#F16112]'
                                          }`}></span>
                                          <span className={`text-[10px] leading-tight ${
                                            isAlgebraI || isPrecalculus ? 'text-[#1F396D]' : 'text-[#F16112]'
                                          }`}>
                                            {topic}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Bottom Section - Pricing & CTA */}
                          <div className="flex-shrink-0 mt-3 pt-3 border-t border-gray-200">
                            <div className="mb-2 text-center">
                              <div className="text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Group: ${course.groupPrice}</span>
                                <span className="mx-2">•</span>
                                <span className="font-semibold">1-on-1: ${course.oneOnOnePrice}</span>
                              </div>
                              <p className="text-[10px] text-gray-500">{course.sessions} per session</p>
                            </div>
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
            Ready to Excel in High School Math?
          </h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Start your journey to mathematical excellence with GrowWise's expert instruction
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsAssessmentModalOpen(true)}
              className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Book Free Assessment
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsContactModalOpen(true)}
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Methods Modal */}
      <AlertDialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-3xl border-2 border-gray-200/50 shadow-[0px_30px_90px_rgba(31,57,109,0.25)] rounded-[20px] max-w-4xl w-[calc(100%-2rem)] p-0 overflow-hidden max-h-[70vh]">
          {/* Enhanced Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/5 via-transparent to-[#F16112]/5"></div>
          
          {/* Custom Close Button */}
          <button
            onClick={() => setIsContactModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
          
          {/* Scrollable content area */}
          <div className="relative z-10 p-4 lg:p-6">
            <AlertDialogHeader className="text-center mb-4 lg:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1F396D]/10 via-white to-[#F16112]/10 border border-gray-200 shadow-sm mb-3">
                <Sparkles className="w-4 h-4 text-[#F16112]" />
                <span className="text-xs font-semibold text-gray-700 tracking-wide">Get in touch</span>
                <Sparkles className="w-4 h-4 text-[#1F396D]" />
              </div>
              <AlertDialogTitle className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Multiple Ways to <span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Connect</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Choose the method that works best for you
              </AlertDialogDescription>
              <div className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </AlertDialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);
                const isPhone = item.icon === 'Phone';
                const isEmail = item.icon === 'Mail';
                const isLiveChat = item.icon === 'MessageCircle';
                const isVisitUs = item.icon === 'MapPin';
                const isClickable = isPhone || isEmail || isLiveChat || isVisitUs;
                
                const href = isPhone 
                  ? `tel:${item.primary.replace(/[\s\(\)\-]/g, '')}`
                  : isEmail 
                  ? `mailto:${item.primary}`
                  : isLiveChat
                  ? '#' // Will be handled by onClick
                  : isVisitUs
                  ? 'https://maps.google.com/?q=4564+Dublin+Blvd,+Dublin,+CA'
                  : '#';
                
                const CardWrapper = isClickable ? 'a' : 'div';
                const cardProps = isClickable ? { 
                  href: href, 
                  title: isPhone ? 'Click to call' : isEmail ? 'Click to email' : isVisitUs ? 'Click to view on map' : 'Click to start chat',
                  onClick: isLiveChat ? (e: React.MouseEvent) => { e.preventDefault(); setIsContactModalOpen(false); openChatbot(); } : undefined
                } : {};
                
                return (
                  <Card key={index} className="relative bg-white/95 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group hover:border-[#F16112]/50 overflow-hidden hover:-translate-y-0.5">
                    <CardWrapper {...cardProps} className="block h-full no-underline">
                      <CardContent className="relative p-5 lg:p-6">
                        <div className={`${item.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-md ring-1 ring-white/40`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.title}</h3>
                        <div>
                          <p
                            className={`text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-snug ${isClickable ? 'text-[#F16112] group-hover:text-[#d54f0a] transition-colors' : 'text-gray-800'}`}
                            title={item.primary}
                          >
                            {item.primary}
                          </p>
                        </div>
                        {/* Shortened: primary only for compact height */}
                      </CardContent>
                    </CardWrapper>
                  </Card>
                );
              })}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Free Assessment Modal */}
      <FreeAssessmentModal 
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
      />
    </div>
  );
};

export default HighSchoolMathPage;

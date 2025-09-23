'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Bot, Clock, Users, Star, Filter, ShoppingCart, CheckCircle, Award, BookOpen, Target, GraduationCap, TrendingUp, Shield, ChevronRight, DollarSign, Eye, Sparkles, ArrowRight, HelpCircle, MessageCircle, Phone, Mail, Calendar, X, Smartphone, Cpu, Database, Network, Zap, Lightbulb, Gamepad2, Monitor, Rocket } from "lucide-react";
import { useCart } from '@/components/gw/CartContext';
import { useChatbot } from '@/contexts/ChatbotContext';
import ImageWithFallback from '@/components/gw/ImageWithFallback';
import CourseCustomizationModal from '@/components/gw/CourseCustomizationModal';

// ML/AI Programming Course Data
interface MLAICourse {
  id: string;
  name: string;
  description: string;
  price: number;
  priceRange: string;
  duration: string;
  level: string;
  gradeLevel: string[];
  courseType: string[];
  alignment: string[];
  features: string[];
  image: string;
  originalPrice?: number;
  instructor: string;
  rating: number;
  studentsEnrolled: number;
  tags: string[];
}

const mlaiCourses: MLAICourse[] = [
  {
    id: 'python-programming',
    name: 'Python Programming',
    description: 'Master Python Programming - From Beginner to Advanced',
    price: 460,
    priceRange: '$460–$650',
    duration: '12 weeks',
    level: 'All Levels',
    gradeLevel: ['Elementary', 'Middle School', 'High School'],
    courseType: ['Programming', 'STEAM'],
    alignment: ['CSTA Standards', 'Computer Science'],
    features: [
      'Complete Python programming curriculum',
      'Hands-on coding projects and exercises',
      'Interactive learning environment',
      'Real-world application development',
      'Portfolio building opportunities',
      'Industry-standard tools and practices'
    ],
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
    instructor: 'Dr. Alex Martinez',
    rating: 4.9,
    studentsEnrolled: 156,
    tags: ['Python', 'Programming', 'STEAM']
  },
  {
    id: 'appspark-app-development',
    name: 'AppSpark - App Development',
    description: 'App development - Learn to Code & Build Apps',
    price: 480,
    priceRange: '$480–$1260',
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    gradeLevel: ['Middle School', 'High School'],
    courseType: ['App Development', 'Programming', 'STEAM'],
    alignment: ['CSTA Standards', 'Computer Science', 'Mobile Development'],
    features: [
      'Cross-platform mobile app development',
      'iOS and Android app creation',
      'User interface and experience design',
      'Database integration and API usage',
      'App store deployment strategies',
      'Real-world project portfolio',
      'Industry-standard development tools',
      'Collaborative coding practices'
    ],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    instructor: 'Sarah Chen',
    rating: 4.8,
    studentsEnrolled: 89,
    tags: ['App Development', 'Mobile', 'Programming', 'STEAM']
  },
  {
    id: 'machine-learning-generative-ai',
    name: 'Machine Learning and Generative AI',
    description: 'Learn real-world AI and machine learning for middle and high school',
    price: 499,
    priceRange: '$499–$799',
    duration: '14 weeks',
    level: 'Intermediate to Advanced',
    gradeLevel: ['Middle School', 'High School'],
    courseType: ['Machine Learning', 'AI', 'Programming', 'STEAM'],
    alignment: ['CSTA Standards', 'Computer Science', 'AI/ML Standards'],
    features: [
      'Introduction to machine learning concepts',
      'Hands-on experience with AI tools',
      'Generative AI and large language models',
      'Computer vision and neural networks',
      'Real-world AI project development',
      'Ethical AI and responsible development',
      'Industry-standard ML frameworks',
      'Portfolio of AI/ML projects'
    ],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
    instructor: 'Dr. Priya Patel',
    rating: 4.9,
    studentsEnrolled: 124,
    tags: ['Machine Learning', 'AI', 'Generative AI', 'STEAM']
  }
];

const MLAICoursesPage: React.FC = () => {
  const { addItem } = useCart();
  const { openChatbot } = useChatbot();
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
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
    { value: 'Elementary', label: 'Elementary', icon: '🔢', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Middle School', label: 'Middle School', icon: '🤖', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'High School', label: 'High School', icon: '🎯', color: 'bg-purple-100 text-purple-800 border-purple-200' }
  ];

  const courseTypeFilters = [
    { value: 'Programming', label: 'Programming', icon: '💻', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { value: 'App Development', label: 'App Development', icon: '📱', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'Machine Learning', label: 'Machine Learning', icon: '🤖', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'AI', label: 'AI', icon: '🧠', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'STEAM', label: 'STEAM', icon: '🔬', color: 'bg-teal-100 text-teal-800 border-teal-200' }
  ];

  const levelFilters = [
    { value: 'All Levels', label: 'All Levels', icon: '🌟', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'Beginner to Advanced', label: 'Beginner to Advanced', icon: '🚀', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'Intermediate to Advanced', label: 'Intermediate to Advanced', icon: '⚡', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
  ];

  // Filter functions
  const toggleGradeLevel = (gradeLevel: string) => {
    setSelectedGradeLevels(prev => 
      prev.includes(gradeLevel) 
        ? prev.filter(g => g !== gradeLevel)
        : [...prev, gradeLevel]
    );
  };

  const toggleCourseType = (courseType: string) => {
    setSelectedCourseTypes(prev => 
      prev.includes(courseType) 
        ? prev.filter(t => t !== courseType)
        : [...prev, courseType]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const clearAllFilters = () => {
    setSelectedGradeLevels([]);
    setSelectedCourseTypes([]);
    setSelectedLevels([]);
  };

  // Filter and sort courses
  const filteredAndSortedCourses = mlaiCourses.filter(course => {
    const gradeMatch = selectedGradeLevels.length === 0 || 
      selectedGradeLevels.some(grade => course.gradeLevel.includes(grade));
    
    const typeMatch = selectedCourseTypes.length === 0 || 
      selectedCourseTypes.some(type => course.courseType.includes(type));
    
    const levelMatch = selectedLevels.length === 0 || 
      selectedLevels.includes(course.level);

    return gradeMatch && typeMatch && levelMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      default:
        return 0;
    }
  });

  const openCustomizationModal = (course: any) => {
    let modalCourse;
    
    if (course.id === 'python-programming') {
      modalCourse = {
        id: 'python-programming',
        name: 'Python Programming',
        description: 'Choose your Python learning path - from complete beginner to advanced programming mastery.',
      };
    } else if (course.id === 'appspark-app-development') {
      modalCourse = {
        id: 'appspark-app-development',
        name: 'AppSpark - App Development',
        description: 'Choose your app development journey - from beginner mobile apps to advanced cross-platform development.',
      };
    } else if (course.id === 'machine-learning-generative-ai') {
      modalCourse = {
        id: 'machine-learning-generative-ai',
        name: 'Machine Learning and Generative AI',
        description: 'Choose your AI learning path - from AI fundamentals to advanced machine learning mastery.',
      };
    } else {
      modalCourse = {
        id: course.id,
        name: course.name,
        description: course.description,
      };
    }
    
    setSelectedCourse(modalCourse);
    setModalOpen(true);
  };

  // Enhanced Program Features for the Header
  const enhancedProgramFeatures = [
    {
      icon: Shield,
      title: 'Industry-Standard Tools',
      description: 'Learn with real AI tools like Python, OpenAI, TensorFlow, and industry APIs used by professionals',
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10',
      delay: '0ms'
    },
    {
      icon: Brain,
      title: 'Future-Ready Skills',
      description: 'Master AI and machine learning concepts that will define the next generation of technology',
      color: 'text-[#F16112]',
      bgColor: 'bg-[#F16112]/10',
      delay: '100ms'
    },
    {
      icon: Target,
      title: 'Project-Based Learning',
      description: 'Build real AI applications and machine learning models through hands-on, practical projects',
      color: 'text-[#F1894F]',
      bgColor: 'bg-[#F1894F]/10',
      delay: '200ms'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Learn from AI professionals and industry experts with small class sizes for personalized attention',
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10',
      delay: '300ms'
    }
  ];

  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>

      {/* Enhanced Creative Header Section - AI Theme */}
      <section className="relative overflow-hidden">
        {/* Animated Background - AI-themed gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 via-indigo-50 to-teal-50">
          {/* Floating AI/tech symbols */}
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
                {['🤖', '🧠', '💻', '⚡', '🔬', '📊', '🎯', '🚀', '💡', '⚙️', '🔍', '📈', '🌟', '🎨', '🔮'][Math.floor(Math.random() * 15)]}
              </div>
            ))}
          </div>
          
          {/* Gradient overlay circles - AI theme colors */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-100/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">
          {/* Main Header Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-white/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50">
              <Brain className="w-5 h-5 text-[#F1894F]" />
              <span className="text-gray-700 font-medium">GET READY FOR FUTURE WITH GROWWISE</span>
              <Sparkles className="w-5 h-5 text-[#F1894F]" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Master <br />
              Python Programming <br />
              <span className="block bg-gradient-to-r from-[#F1894F] to-[#F16112] bg-clip-text text-transparent">
                From Beginner to Advanced
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Learn Python programming through hands-on projects and comprehensive curriculum designed for students grades 5-12. Build real applications, master programming fundamentals, and prepare for future tech careers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-2 border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Enhanced Program Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {enhancedProgramFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title} 
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-500 group hover:scale-105"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className={`${feature.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Courses Section */}
      <section 
        className="py-20 px-4 lg:px-8 relative" 
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(31, 57, 109, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 80% 30%, rgba(241, 97, 18, 0.04) 0%, transparent 25%),
            radial-gradient(circle at 40% 80%, rgba(241, 137, 79, 0.03) 0%, transparent 25%),
            radial-gradient(circle at 60% 90%, rgba(241, 137, 79, 0.06) 0%, transparent 25%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(255, 255, 255, 0.9) 100%)
          `
        }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F16112]">Python Courses</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of Python programming courses designed for every skill level and goal.
            </p>
          </div>

          {/* Chip-Style Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            {/* Filter Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filter Courses</h3>
                {(selectedGradeLevels.length > 0 || selectedCourseTypes.length > 0 || selectedLevels.length > 0) && (
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

            {/* Level Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Difficulty Level</h4>
              <div className="flex flex-wrap gap-2">
                {levelFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => toggleLevel(filter.value)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                      selectedLevels.includes(filter.value)
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

          {/* Course Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Python Programming Courses 
                <span className="text-[#F16112] ml-2">({filteredAndSortedCourses.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCourses.map((course) => {
                const isHovered = hoveredCourse === course.id;
                const courseGradients = {
                  gradient: 'from-[#1F396D] to-[#29335C]',
                  bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
                  iconColor: 'text-[#1F396D]'
                };

                return (
                  <div
                    key={course.id}
                    className={`relative h-[450px] cursor-pointer group ${!isTouchDevice ? 'perspective-1000' : ''}`}
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
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
                                <Brain className="w-5 h-5 text-white" />
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
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-800 border-blue-200"
                                  >
                                    <span>🎓</span>
                                    {grade}
                                  </span>
                                ))}
                                {course.courseType.map((type) => (
                                  <span
                                    key={type}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-purple-50 text-purple-800 border-purple-200"
                                  >
                                    <span>🔬</span>
                                    {type}
                                  </span>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {course.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-800 border-green-200"
                                  >
                                    <span>🚀</span>
                                    {tag}
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
                                  <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
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
                              onClick={() => openCustomizationModal(course)}
                              className={`w-full bg-gradient-to-r ${courseGradients.gradient} text-white rounded-xl py-2.5 text-sm transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105`}
                            >
                              {/* Desktop button text - Only for non-touch devices */}
                              {!isTouchDevice && (
                                <div className="hidden md:flex items-center justify-center">
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  <span>Customize & Enroll</span>
                                </div>
                              )}
                              {/* Mobile button text */}
                              <div className={`${!isTouchDevice ? 'md:hidden' : ''} flex items-center justify-center`}>
                                <span>Enroll Now</span>
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </div>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Back Side - Learning Path & Success (Only for non-touch devices) */}
                      {!isTouchDevice && (
                        <Card className={`absolute inset-0 w-full h-full ${courseGradients.bgGradient} rounded-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1)] border-2 border-white/50 backface-hidden rotate-y-180`}>
                          <CardContent className="p-6 relative flex flex-col h-full justify-between">
                            {/* Back Header */}
                            <div className="flex-shrink-0">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${courseGradients.gradient} shadow-lg`}>
                                  <Target className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className={`font-bold text-sm ${courseGradients.iconColor}`}>Learning Path</h4>
                                  <p className="text-xs text-gray-600">Your journey to success</p>
                                </div>
                              </div>
                            </div>

                            {/* Condensed Learning Steps */}
                            <div className="flex-grow mb-6">
                              <div className="space-y-3">
                                {(course.id === 'python-programming' ? [
                                  'Master Python fundamentals',
                                  'Build real applications',
                                  'Create project portfolio'
                                ] : course.id === 'appspark-app-development' ? [
                                  'Design app interfaces',
                                  'Code mobile apps',
                                  'Deploy to app stores'
                                ] : [
                                  'Learn AI/ML concepts',
                                  'Use real AI tools',
                                  'Build smart apps'
                                ]).map((step, idx) => (
                                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-white/40">
                                    <div className="w-5 h-5 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-white text-xs font-bold">{idx + 1}</span>
                                    </div>
                                    <span className="text-xs text-gray-700 font-medium leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Enhanced Back CTA */}
                            <div className="flex-shrink-0">
                              <Button 
                                onClick={() => openCustomizationModal(course)}
                                className={`w-full bg-gradient-to-r ${courseGradients.gradient} text-white rounded-xl py-2 text-sm transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group`}
                              >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                                <div className="relative flex items-center justify-center">
                                  <Rocket className="w-4 h-4 mr-2" />
                                  <span>Start Journey</span>
                                </div>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* No Results Message */}
          {filteredAndSortedCourses.length === 0 && (
            <div className="text-center py-16">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more courses.</p>
              <Button onClick={clearAllFilters} className="bg-[#1F396D] text-white hover:bg-[#29335C]">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose GrowWise for Python */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Why Choose <span className="text-[#F16112]">GrowWise Python</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code,
                title: "Real Coding Experience",
                description: "Build actual Python applications and projects that you can showcase in your portfolio"
              },
              {
                icon: Users,
                title: "Expert Instructors",
                description: "Learn from industry professionals with years of Python development experience"
              },
              {
                icon: Target,
                title: "Personalized Learning",
                description: "Customized curriculum that adapts to your pace and learning style"
              },
              {
                icon: Award,
                title: "Certification & Portfolio",
                description: "Upon course completion, students receive certificates and projects they can add to resumes or share with peers and mentors."
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-[#1F396D] to-[#29335C] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <benefit.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Ready to Start Your <span className="text-[#F16112]">Python Journey</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Have questions about our Python programming courses? Our education specialists are here to help you choose the perfect program.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1F396D] rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">(925) 456-4606</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F16112] rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">connect@thegrowwise.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F1894F] rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Schedule</h3>
              <p className="text-gray-600">Free Consultation</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={openChatbot}
              className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Free Consultation
            </Button>
            <Button variant="outline" className="border-2 border-[#1F396D] text-[#1F396D] hover:bg-[#1F396D] hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
              <HelpCircle className="w-5 h-5 mr-2" />
              View Course Details
            </Button>
          </div>
        </div>
      </section>

      {/* Course Customization Modal */}
      {modalOpen && selectedCourse && (
        <CourseCustomizationModal
          course={selectedCourse}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAddToCart={addItem}
        />
      )}
    </div>
  );
};

export default MLAICoursesPage;


'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  Code, 
  Gamepad2, 
  Brain, 
  Lightbulb, 
  Rocket, 
  Zap, 
  Bot, 
  Sparkles, 
  Target, 
  Users, 
  Award, 
  Clock, 
  CheckCircle,
  Star,
  Monitor,
  Palette,
  Cpu,
  Database,
  Globe,
  Smartphone,
  TrendingUp,
  BookOpen,
  Play,
  Download,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { publicPath } from '@/lib/publicPath';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { generateFAQPageSchema } from '@/lib/seo/structuredData';

// ImageWithFallback component
const ImageWithFallback: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==" alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
};

const STEAM_FAQS = [
  {
    question: "My child wants to get into coding or robotics — where should they start if they have no experience?",
    answer: "Scratch is the recommended starting point for students with no prior coding experience. It teaches core logic and sequencing through visual block-based programming. Students who have some block coding exposure can move into Roblox Studio, which uses Lua scripting to build and publish games. Students ready for text-based programming start with Python. GrowWise offers all three as year-round programs.",
  },
  {
    question: "What is the difference between a coding program and an AI program at GrowWise?",
    answer: "Coding programs teach programming languages and how to build software. GrowWise coding tracks include Scratch, Roblox Studio, Python, and Unity. AI programs teach how artificial intelligence systems work — how they learn from data, how to communicate with them effectively, and how to build simple AI-powered projects. GrowWise AI programs cover AI Fundamentals, Machine Learning Basics, and Prompt Engineering. Students can take coding and AI programs concurrently.",
  },
  {
    question: "What does my child actually build in a GrowWise STEAM program?",
    answer: "It depends on the program. Scratch students complete an animated interactive project. Roblox students script and publish a playable game. Python students build a working application. Unity students complete a 2D or 3D game. AI Fundamentals students finish a hands-on AI project. Machine Learning students train and evaluate a model. Prompt Engineering students complete a practical AI communication challenge. Every program ends with a real output, not just completed exercises.",
  },
  {
    question: "Do students need any prior coding experience to join a GrowWise STEAM program?",
    answer: "No prior experience is required to start. Scratch and AI Fundamentals are both designed for complete beginners. Students with some coding exposure can enter at Roblox Studio or Python level. The program entry point is matched to the student — not to a fixed class schedule.",
  },
];

export default function SteamPage() {
  const locale = useLocale();
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);

  const createLocaleUrl = (path: string) => publicPath(path, locale);

  // STEAM Programs Overview Data
  const steamPrograms = [
    {
      id: 'game-development',
      title: 'Game Development',
      description: 'Create immersive games and interactive experiences using industry-standard tools',
      icon: Gamepad2,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]',
      features: [
        'Roblox Studio Development',
        'Scratch Programming',
        'Minecraft Modding',
        'Unity Game Engine',
        'Game Design Principles',
        '3D Modeling Basics'
      ]
    }
  ];

  // Python Programming and AI/ML Data (for two-column card)
  const pythonProgram = {
    id: 'python-programming',
    title: 'Python Programming',
    description: 'Master the world\'s most popular programming language from basics to advanced',
    icon: Code,
    gradient: 'from-[#1F396D] to-[#29335C]',
    bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
    iconColor: 'text-[#1F396D]',
    features: [
      'Python Fundamentals',
      'Object-Oriented Programming',
      'Data Structures & Algorithms',
      'Web Development with Flask',
      'API Development',
      'Project-Based Learning'
    ]
  };

  const aiMlProgram = {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    description: 'Explore artificial intelligence and machine learning concepts for the future',
    icon: Brain,
    gradient: 'from-[#1F396D] to-[#F16112]',
    bgGradient: 'bg-gradient-to-br from-[#29335C]/5 to-[#1F396D]/10',
    iconColor: 'text-[#1F396D]',
    features: [
      'AI Fundamentals',
      'Machine Learning Basics',
      'Prompt Engineering',
      'Computer Vision',
      'Natural Language Processing',
      'Ethics in AI'
    ]
  };

  // Game Development Detailed Programs
  const gameDevelopmentPrograms = [
    {
      id: 1,
      title: 'Roblox Studio Mastery',
      level: 'Beginner to Advanced',
      duration: '12 weeks',
      color: 'bg-gradient-to-br from-[#F16112]/20 to-[#F1894F]/30',
      textColor: 'text-[#F16112]',
      borderColor: 'border-[#F16112]/30',
      features: [
        'Game Design Fundamentals',
        'Scripting with Lua',
        'Building Interactive Worlds',
        'Character Animation',
        'Monetization Strategies',
        'Publishing Games'
      ]
    },
    {
      id: 2,
      title: 'Scratch Game Creation',
      level: 'Beginner Friendly',
      duration: '8 weeks',
      color: 'bg-gradient-to-br from-[#1F396D]/20 to-[#29335C]/30',
      textColor: 'text-[#1F396D]',
      borderColor: 'border-[#1F396D]/30',
      features: [
        'Visual Programming Concepts',
        'Sprite Animation',
        'Sound Integration',
        'Game Logic Development',
        'Creative Storytelling',
        'Project Showcase'
      ]
    },
    {
      id: 3,
      title: 'Unity Game Engine',
      level: 'Intermediate to Advanced',
      duration: '16 weeks',
      color: 'bg-gradient-to-br from-[#F1894F]/20 to-[#F16112]/30',
      textColor: 'text-[#F1894F]',
      borderColor: 'border-[#F1894F]/30',
      features: [
        'C# Programming',
        '2D & 3D Game Development',
        'Physics Simulation',
        'UI/UX Design',
        'Cross-Platform Publishing',
        'Team Collaboration'
      ]
    }
  ];

  // Programming Languages & Tools
  const programmingTools = [
    {
      id: 1,
      name: 'Python',
      description: 'Versatile, beginner-friendly language',
      icon: Code,
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10'
    },
    {
      id: 2,
      name: 'JavaScript',
      description: 'Web development powerhouse',
      icon: Globe,
      color: 'text-[#F16112]',
      bgColor: 'bg-[#F16112]/10'
    },
    {
      id: 3,
      name: 'Scratch',
      description: 'Visual programming for beginners',
      icon: Palette,
      color: 'text-[#F1894F]',
      bgColor: 'bg-[#F1894F]/10'
    },
    {
      id: 4,
      name: 'Unity',
      description: 'Professional game development',
      icon: Gamepad2,
      color: 'text-[#29335C]',
      bgColor: 'bg-[#29335C]/10'
    },
    {
      id: 5,
      name: 'AI Tools',
      description: 'Machine learning platforms',
      icon: Brain,
      color: 'text-[#1F396D]',
      bgColor: 'bg-[#1F396D]/10'
    },
    {
      id: 6,
      name: 'Web Tech',
      description: 'HTML, CSS, React',
      icon: Monitor,
      color: 'text-[#F16112]',
      bgColor: 'bg-[#F16112]/10'
    }
  ];

  // AI & ML Learning Paths
  const aiLearningPaths = [
    {
      id: 1,
      title: 'AI Fundamentals',
      description: 'Introduction to artificial intelligence concepts and applications',
      duration: '6 weeks',
      level: 'Beginner',
      topics: [
        'What is Artificial Intelligence?',
        'Types of AI Systems',
        'AI in Daily Life',
        'Ethical Considerations',
        'Future of AI Technology'
      ]
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      description: 'Hands-on introduction to machine learning algorithms',
      duration: '10 weeks',
      level: 'Intermediate',
      topics: [
        'Supervised Learning',
        'Unsupervised Learning',
        'Data Preprocessing',
        'Model Training',
        'Performance Evaluation'
      ]
    },
    {
      id: 3,
      title: 'Prompt Engineering',
      description: 'Master the art of communicating with AI systems',
      duration: '4 weeks',
      level: 'All Levels',
      topics: [
        'Understanding Large Language Models',
        'Effective Prompt Design',
        'Creative Applications',
        'Problem-Solving with AI',
        'AI-Assisted Programming'
      ]
    }
  ];

  // Success Stories Data
  const successStories = [
    {
      id: 1,
      name: 'Alex Chen',
      age: 14,
      program: 'Python Programming',
      achievement: 'Built a web app that tracks homework for his entire school',
      image: '/assets/photos/photo-1472099645785-5658abf4ff4e.jpg',
      quote: 'GrowWise taught me that coding isn\'t just about syntax - it\'s about solving real problems.'
    },
    {
      id: 2,
      name: 'Sophia Rodriguez',
      age: 16,
      program: 'Game Development',
      achievement: 'Published her first game on Roblox with 10,000+ plays',
      image: '/assets/photos/photo-1494790108755-2616b612b786.jpg',
      quote: 'Creating games taught me creativity, problem-solving, and how to turn ideas into reality.'
    },
  ];

  // Why Choose STEAM
  const whyChooseSTEAM = [
    {
      icon: Rocket,
      title: 'Future-Ready Skills',
      description: 'Learn technologies and concepts that will be essential in tomorrow\'s job market',
      bgColor: 'bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/20',
      color: 'text-[#1F396D]',
      borderColor: 'border-[#1F396D]/30'
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Work on team projects that mirror real-world development environments',
      bgColor: 'bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/20',
      color: 'text-[#F16112]',
      borderColor: 'border-[#F16112]/30'
    },
    {
      icon: Target,
      title: 'Project-Based Approach',
      description: 'Build real applications and games that showcase your skills',
      bgColor: 'bg-gradient-to-br from-[#F1894F]/10 to-[#F16112]/20',
      color: 'text-[#F1894F]',
      borderColor: 'border-[#F1894F]/30'
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Earn certificates and build portfolios that impress colleges and employers',
      bgColor: 'bg-gradient-to-br from-[#29335C]/10 to-[#1F396D]/20',
      color: 'text-[#29335C]',
      borderColor: 'border-[#29335C]/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#F16112]/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-[#1F396D]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              STEAM Programs in Dublin, CA
              <span className="block bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">
                Coding, AI & Game Dev for Kids
              </span>
            </h1>
            <Badge className="bg-[#F16112] text-white mb-6 px-6 py-2 rounded-full">
              STEAM PROGRAMS
            </Badge>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Prepare for the future with hands-on STEAM education. From coding and game development to AI and entrepreneurship, 
              our programs combine creativity with cutting-edge technology.
            </p>
            <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed mt-4">
              During school break, many families choose our{' '}
              <Link href={publicPath('/camps/summer', locale)} className="text-[#1F396D] font-semibold underline hover:text-[#F16112]">
                summer STEAM camps in Dublin CA
              </Link>
              .
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <Card className="bg-white/30 backdrop-blur-3xl rounded-[40px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.25)] border-2 border-white/60 overflow-hidden ring-1 ring-white/30">
              <CardContent className="p-0">
                <div className="relative w-full h-[400px]">
                  <Image
                    src="/assets/photos/photo-1581091226825-a6a2a5aee158.jpg"
                    alt="Students coding and learning STEAM subjects"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Link href={createLocaleUrl('/book-assessment')}>
                        Book a Free Assessment
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-8 py-4 rounded-full transition-all duration-300"
                    >
                      <Link href={createLocaleUrl('/workshop-calendar')}>
                        Join Free Saturday Workshop
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* STEAM Programs Overview */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">STEAM Programs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive programs designed to prepare students for the digital future
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Game Development Card */}
            {steamPrograms.map((program, index) => {
              const IconComponent = program.icon;
              const isHovered = hoveredProgram === program.id;
              
              return (
                <Card 
                  key={program.id}
                  className={`bg-white/35 backdrop-blur-3xl rounded-[32px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 transition-all duration-700 cursor-pointer group overflow-hidden relative ring-1 ring-white/30 ${
                    isHovered ? 'shadow-[0px_40px_120px_0px_rgba(31,57,109,0.35)] scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setHoveredProgram(program.id)}
                  onMouseLeave={() => setHoveredProgram(null)}
                >
                  <div className={`absolute inset-0 ${program.bgGradient} opacity-60`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                  
                  <CardContent className="p-10 relative z-10">
                    <div className="flex items-center gap-6 mb-8">
                      <div className={`p-5 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-xl ring-2 ring-white/50`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${program.iconColor} mb-2`}>
                          {program.title}
                        </h3>
                        <p className="text-gray-600 text-lg">
                          {program.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {program.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${program.iconColor} flex-shrink-0`} />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={createLocaleUrl('/steam/game-development')}>
                      <Button className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${
                        isHovered ? 'scale-105 shadow-xl' : ''
                      }`}>
                        Book a Free Assessment
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

            {/* Python Programming & AI/ML Two-Column Card */}
            {(() => {
              const isHovered = hoveredProgram === 'python-ai-ml';
              return (
                <Card 
                  className={`bg-white/35 backdrop-blur-3xl rounded-[32px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 transition-all duration-700 cursor-pointer group overflow-hidden relative ring-1 ring-white/30 ${
                    isHovered ? 'shadow-[0px_40px_120px_0px_rgba(31,57,109,0.35)] scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setHoveredProgram('python-ai-ml')}
                  onMouseLeave={() => setHoveredProgram(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/10 opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                  
                  <CardContent className="p-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                      {/* Python Programming Column */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F396D] to-[#29335C] shadow-xl ring-2 ring-white/50">
                            <Code className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#1F396D] mb-1">
                              {pythonProgram.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {pythonProgram.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-grow">
                          {pythonProgram.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent -translate-x-1/2"></div>

                      {/* AI & Machine Learning Column */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F396D] to-[#F16112] shadow-xl ring-2 ring-white/50">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-[#1F396D] mb-1">
                              {aiMlProgram.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {aiMlProgram.description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-grow">
                          {aiMlProgram.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Link href={createLocaleUrl('/steam/ml-ai-coding')}>
                      <Button className={`w-full bg-gradient-to-r from-[#1F396D] to-[#F16112] hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${
                        isHovered ? 'scale-105 shadow-xl' : ''
                      }`}>
                        Book a Free Assessment
                        <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Game Development Section */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F16112] mb-6">
              Game Development Mastery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create engaging games and interactive experiences using industry-standard tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {gameDevelopmentPrograms.map((program, index) => (
              <Card key={program.id} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 overflow-hidden hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
                {/* Enhanced Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                
                <div className={`${program.color} p-6 relative z-10`}>
                  <h3 className={`text-xl font-bold ${program.textColor} mb-2 drop-shadow-sm`}>
                    {program.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {program.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {program.duration}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 relative z-10">
                  {/* Glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-b-[28px]"></div>
                  <ul className="space-y-3 relative z-10">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#F16112] rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programming Tools & Technologies */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Technologies & <span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Tools We Teach</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the most in-demand programming languages and development tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {programmingTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card key={tool.id} className="bg-white/35 backdrop-blur-3xl rounded-[20px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.15)] border-2 border-white/50 hover:shadow-[0px_30px_80px_0px_rgba(31,57,109,0.25)] transition-all duration-500 hover:-translate-y-2 group ring-1 ring-white/30">
                  <CardContent className="p-6 text-center relative">
                    {/* Glass reflection overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[20px]"></div>
                    <div className="relative z-10">
                      <div className={`${tool.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20`}>
                        <IconComponent className={`w-8 h-8 ${tool.color} drop-shadow-sm`} />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 drop-shadow-sm">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI & Machine Learning Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-16 w-40 h-40 bg-[#1F396D]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-[#F16112]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-[#1F396D] text-white mb-4 px-6 py-2 rounded-full">
              ARTIFICIAL INTELLIGENCE
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI & Machine Learning
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the fascinating world of artificial intelligence and prepare for the AI-driven future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiLearningPaths.map((path, index) => (
              <Card key={path.id} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 overflow-hidden hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
                {/* Enhanced Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                
                <CardContent className="p-8 relative z-10">
                  {/* Glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-[28px]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="bg-[#1F396D] text-white px-3 py-1 text-xs">
                        {path.level}
                      </Badge>
                      <Badge className="bg-[#F16112] text-white px-3 py-1 text-xs">
                        {path.duration}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 drop-shadow-sm">
                      {path.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {path.description}
                    </p>
                    
                    <div className="space-y-3">
                      {path.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-start gap-3">
                          <Brain className="w-4 h-4 text-[#1F396D] mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Student <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Success Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how our STEAM programs have transformed student futures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {successStories.map((story, index) => (
              <Card key={story.id} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.2)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
                <CardContent className="p-8 relative">
                  {/* Glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover shadow-[0px_8px_20px_rgba(255,255,255,0.4)] border-2 border-white/70 ring-1 ring-white/50"
                      />
                      <div>
                        <p className="font-bold text-gray-900 drop-shadow-sm">{story.name}</p>
                        <p className="text-sm text-gray-600">Age {story.age} • {story.program}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <Badge className="bg-[#F16112] text-white mb-3">
                        {story.program}
                      </Badge>
                      <h4 className="font-bold text-gray-900 mb-2 drop-shadow-sm">
                        {story.achievement}
                      </h4>
                    </div>
                    
                    <p className="text-gray-700 italic leading-relaxed">"{story.quote}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our STEAM Programs */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-16 w-40 h-40 bg-[#F16112]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-[#1F396D]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">STEAM Programs</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology education designed for future innovators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseSTEAM.map((item, index) => (
              <Card key={index} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 text-center ring-1 ring-white/30">
                <CardContent className="p-8 relative">
                  {/* Glass reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[28px]"></div>
                  <div className="relative z-10">
                    <div className={`${item.bgColor} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_10px_30px_rgba(255,255,255,0.3)] backdrop-blur-xl border-2 border-white/40 ring-1 ring-white/20`}>
                      <item.icon className={`w-10 h-10 ${item.color} drop-shadow-sm`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 drop-shadow-sm">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 lg:px-8 bg-gray-50" aria-labelledby="steam-faq-heading">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQPageSchema(STEAM_FAQS)) }} />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="steam-faq-heading" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-[#F16112]">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Common questions from families about GrowWise STEAM programs.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {STEAM_FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
            Ready to Code Your Future?
          </h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">
            Join our STEAM programs and develop the skills that will shape tomorrow's world.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href={createLocaleUrl('/book-assessment')}>
                Book a Free Assessment
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105"
            >
              <Link href={createLocaleUrl('/workshop-calendar')}>Join Free Saturday Workshop</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
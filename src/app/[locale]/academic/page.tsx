'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageWithFallback } from '@/components/gw/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import {
  BookOpen,
  Calculator,
  Users,
  Clock,
  CheckCircle,
  Award,
  Target,
  PenTool,
  Lightbulb,
  Brain,
  ChevronRight,
  GraduationCap,
  Sparkles,
  UserCheck,
  Calendar,
  HeartHandshake,
  TrendingUp,
  X
} from 'lucide-react';

const AcademicPage: React.FC = () => {
  const router = useRouter();
  const [hoveredProgram, setHoveredProgram] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLearnMoreModalOpen, setIsLearnMoreModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const academicPrograms = [
    {
      id: 1,
      title: 'Math Courses',
      description: 'Build strong mathematical foundations from elementary to advanced levels',
      icon: Calculator,
      gradient: 'from-[#1F396D] to-[#29335C]',
      bgGradient: 'bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10',
      iconColor: 'text-[#1F396D]',
      features: [
        'DUSD & PUSD Aligned Curriculum',
        'Grade-Level Math (CACCS)',
        'Accelerated Math Programs',
        'Integrated Math 1 & 2',
        'One-on-One & Small Group Options'
      ]
    },
    {
      id: 2,
      title: 'English Language Arts',
      description: 'Comprehensive English mastery program for all grade levels',
      icon: BookOpen,
      gradient: 'from-[#F16112] to-[#F1894F]',
      bgGradient: 'bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10',
      iconColor: 'text-[#F16112]',
      features: [
        'Reading Comprehension Mastery',
        'Vocabulary Development',
        'Grammar & Mechanics',
        'Essay Writing Excellence',
        'California Common Core Aligned'
      ]
    }
  ];

  const englishMasteryComponents = [
    {
      id: 1,
      title: 'Reading Comprehension',
      color: 'bg-[#1F396D]',
      textColor: 'text-white',
      features: [
        'Identify main idea, evidence, and inference',
        'Analyze informational & literary texts',
        'Question stems aligned with school rubrics',
        'Timed reading drills to build stamina'
      ]
    },
    {
      id: 2,
      title: 'Vocabulary Development',
      color: 'bg-[#29335C]',
      textColor: 'text-white',
      features: [
        'Roots, prefixes, suffixes & word families',
        'Context clues & academic vocabulary',
        'Spiral review for long-term retention',
        'Weekly quizzes & progress tracking'
      ]
    },
    {
      id: 3,
      title: 'Grammar & Mechanics',
      color: 'bg-[#F16112]',
      textColor: 'text-white',
      features: [
        'Sentence types, clauses, and punctuation',
        'Subject-verb agreement & pronoun usage',
        'Common error correction with mini-lessons',
        'Application in authentic writing'
      ]
    },
    {
      id: 4,
      title: 'Essay Writing',
      color: 'bg-[#F1894F]',
      textColor: 'text-white',
      features: [
        'Planning, outlining, drafting, revising',
        'Clear thesis, evidence, and commentary',
        'Narrative, argumentative, & informative essays',
        'Rubric-based feedback every week'
      ]
    }
  ];

  const mathPrograms = [
    {
      id: 1,
      title: 'Grade-Level Math (CACCS)',
      color: 'bg-[#1F396D]',
      textColor: 'text-white',
      borderColor: 'border-[#1F396D]',
      features: [
        'Conceptual learning & real-world application',
        'Fluency practice with "show-your-work" habits',
        'Skills to Pre-Algebra & Algebra foundations',
        'Benchmark-style quizzes & progress checks'
      ]
    },
    {
      id: 2,
      title: 'Accelerated Math',
      color: 'bg-[#F16112]',
      textColor: 'text-white',
      borderColor: 'border-[#F16112]',
      features: [
        'Course 1/2: Integers, fractions, ratios, percents etc',
        'Course 3: Expressions, equations, inequalities',
        'Statistics & probability with real datasets',
        'Readiness for Integrated Math pathway'
      ]
    },
    {
      id: 3,
      title: 'Integrated Math 1 & 2',
      color: 'bg-[#29335C]',
      textColor: 'text-white',
      borderColor: 'border-[#29335C]',
      features: [
        'Linear relationships, functions & sequences',
        'Systems, compound inequalities, exponentials',
        'Geometry: triangles, congruence, quadrilaterals',
        'Trigonometry, transformations & statistics'
      ]
    }
  ];

  const pricingOptions = [
    { id: 1, title: 'Affordable, Accessible Pricing', description: 'Small-Group $35/hr • One-on-One from $45/hr', icon: '💰', color: 'bg-white', borderColor: 'border-[#F16112]/30' },
    { id: 2, title: 'Study your way', description: 'Choose from online, in-person, or hybrid classes to fit your schedule.', icon: '📚', color: 'bg-[#F16112]', textColor: 'text-white' },
    { id: 3, title: 'Personalized Assistance', description: 'Receive dedicated support and personalized help to reach your goals.', icon: '🎯', color: 'bg-white', borderColor: 'border-[#F16112]/30' }
  ];

  const writingFeatures = [
    { label: 'Essay Labs', color: 'bg-[#F16112]' },
    { label: 'Grammar Editing', color: 'bg-[#F1894F]' },
    { label: 'Rubric Feedback', color: 'bg-[#F16112]' },
    { label: 'Timed Writing', color: 'bg-[#F1894F]' }
  ];

  const writingOutcomes = [
    'Clear thesis & coherent paragraphs',
    'Evidence + explanation (no plot summary)',
    'Fewer grammar errors; stronger style',
    'Confidence under time limits'
  ];

  const whyChooseAcademic = [
    { icon: Target, title: 'Standards-Aligned Curriculum', description: "100% aligned with California Common Core, DUSD, and PUSD standards, ensuring your child's learning directly supports their classroom progress.", color: 'text-[#1F396D]', bgColor: 'bg-[#1F396D]/10' },
    { icon: UserCheck, title: 'Personalized Learning', description: 'Every student receives personalized academic programs tailored to their learning style and pace for maximum growth.', color: 'text-[#F16112]', bgColor: 'bg-[#F16112]/10' },
    { icon: Award, title: 'Expert Instructors', description: 'Learn from certified K-12 teachers with years of experience in Math and English instruction.', color: 'text-[#F1894F]', bgColor: 'bg-[#F1894F]/10' },
    { icon: TrendingUp, title: 'Proven Results', description: 'Our students consistently show measurable improvement in their academic performance and confidence.', color: 'text-[#1F396D]', bgColor: 'bg-[#1F396D]/10' }
  ];

  const successStories = [
    { name: 'Emma Rodriguez', grade: '7th Grade', subject: 'Math', improvement: 'From C to A+ in Algebra', quote: 'GrowWise helped me understand math concepts I never thought I could master!', image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop&crop=face' },
    { name: 'Michael Chen', grade: '5th Grade', subject: 'English', improvement: 'Reading level increased by 2 grades', quote: 'My writing has improved so much. I actually enjoy writing essays now!', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
    { name: 'Sarah Johnson', grade: '9th Grade', subject: 'Integrated Math', improvement: 'Passed to Honors Math', quote: 'The personalized attention helped me catch up and even get ahead in math.', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative py-16 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#1F396D]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-[#F16112]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-[#F1894F]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Card className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0px_30px_80px_0px_rgba(31,57,109,0.15)] border border-white/30 overflow-hidden">
            <CardContent className="p-12 lg:p-16">
              <div className="text-center">
                <Badge className="bg-[#F16112] text-white mb-6 px-6 py-3 rounded-full text-lg">ACADEMIC PROGRAMS</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-[#1F396D] mb-8 leading-tight">Math & English Programs Aligned with DUSD & PUSD</h1>

                <div className="max-w-4xl mx-auto mb-10">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">GrowWise School: Dublin's Learning Hub for K-12 Excellence</h2>
                  <p className="text-gray-700 text-xl leading-relaxed mb-6">Welcome to <span className="font-semibold text-[#1F396D]">GrowWise School</span>, your local destination for <span className="font-semibold">personalized academic programs</span>. Serving students from grades 1-12 in Dublin, Pleasanton, and the entire Tri-Valley area, we are committed to nurturing success.</p>
                  <p className="text-gray-700 text-xl leading-relaxed mb-8">Our curriculum is <span className="font-semibold text-[#F16112]">100% aligned with California Common Core, DUSD, and PUSD standards</span>, ensuring your child's learning directly supports their classroom progress.</p>
                  <p className="text-gray-600 text-lg mb-12">Enroll now!</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button onClick={() => setIsLearnMoreModalOpen(true)} className="bg-[#1F396D] hover:bg-[#29335C] text-white rounded-full px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">Learn more →</Button>
                  <Button className="bg-[#F16112] hover:bg-[#F1894F] text-white rounded-full px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">Enroll Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing & Options */}
      <section className="py-16 px-4 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Flexible Learning Options</h2>
            <p className="text-xl text-gray-600">Choose the learning style that works best for your child</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingOptions.map(option => (
              <Card key={option.id} className={`${option.color} ${option.borderColor ? `border-2 ${option.borderColor}` : ''} backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105`}>
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6">{option.icon}</div>
                  <h3 className={`font-bold text-xl mb-4 ${option.textColor || 'text-gray-900'}`}>{option.title}</h3>
                  <p className={`text-base ${option.textColor || 'text-gray-600'}`}>{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs Overview */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our <span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Academic Programs</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Comprehensive K-12 academic support designed to help every student excel</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {academicPrograms.map(program => {
              const IconComponent = program.icon;
              const isHovered = hoveredProgram === program.id;
              return (
                <Card
                  key={program.id}
                  className={`bg-white/80 backdrop-blur-lg rounded-[32px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.12)] border border-white/40 transition-all duration-700 cursor-pointer group overflow-hidden relative ${
                    isHovered ? 'shadow-[0px_30px_80px_0px_rgba(31,57,109,0.25)] scale-[1.02]' : ''
                  }`}
                  onMouseEnter={() => setHoveredProgram(program.id)}
                  onMouseLeave={() => setHoveredProgram(null)}
                >
                  <div className={`absolute inset-0 ${program.bgGradient} opacity-60`}></div>
                  <CardContent className="p-10 relative z-10">
                    <div className="flex items-center gap-6 mb-8">
                      <div className={`p-5 rounded-2xl bg-gradient-to-br ${program.gradient} shadow-xl`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${program.iconColor} mb-2`}>{program.title}</h3>
                        <p className="text-gray-600 text-lg">{program.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${program.iconColor} flex-shrink-0`} />
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className={`w-full bg-gradient-to-r ${program.gradient} hover:shadow-2xl text-white rounded-xl py-4 transition-all duration-500 transform ${
                      isHovered ? 'scale-105 shadow-xl' : ''
                    }`}>
                      Start Learning
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mastery in English */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1F396D] mb-6">Mastery in English</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive English Language Arts program covering all essential skills</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {englishMasteryComponents.map(component => (
              <Card key={component.id} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 overflow-hidden hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30">
                <div className={`${component.color} p-6 relative z-10`}>
                  <h3 className={`text-xl font-bold ${component.textColor} mb-4 drop-shadow-sm`}>{component.title}</h3>
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-b-[28px]"></div>
                  <ul className="space-y-3 relative z-10">
                    {component.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
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

      {/* Math Programs */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1F396D] mb-6">Math Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive mathematics curriculum from foundational to advanced levels</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mathPrograms.map(program => (
              <Card key={program.id} className={`bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 ${program.borderColor} overflow-hidden hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 ring-1 ring-white/30`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                <div className={`${program.color} p-6 relative z-10`}>
                  <h3 className={`text-xl font-bold ${program.textColor} mb-4 drop-shadow-sm`}>{program.title}</h3>
                </div>
                <CardContent className="p-6 relative z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent rounded-b-[28px]"></div>
                  <ul className="space-y-3 relative z-10">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
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

      {/* Strong Writers */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-[#F1894F]/5 to-[#F16112]/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1F396D] mb-6">Strong Writers. Strong Thinkers.</h2>
          </div>
          <Card className="bg-white/90 backdrop-blur-lg rounded-[32px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.12)] border border-white/40 overflow-hidden">
            <CardContent className="p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Weekly Writing Emphasis</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">Every student writes weekly — planning, drafting, revising, and polishing. We combine mini-lessons with targeted feedback so students improve structure, clarity, and voice.</p>
                  <div className="flex flex-wrap gap-3">
                    {writingFeatures.map((feature, idx) => (
                      <Badge key={idx} className={`${feature.color} text-white px-4 py-2 rounded-full font-medium`}>{feature.label}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Outcomes You'll See</h3>
                  <ul className="space-y-4">
                    {writingOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-[#F16112] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg leading-relaxed">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Weekly Timed Practice Sessions */}
      <section className="py-16 px-4 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-[0px_30px_80px_0px_rgba(31,57,109,0.15)] border border-white/30 overflow_hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-[#1F396D] to-[#29335C] p-12 text-center text-white relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">Weekly Timed Practice Sessions</h2>
                  <div className="flex items-center justify-center gap-2 text-xl">
                    <Calendar className="w-6 h-6" />
                    <span>Every Saturday • 11:00 AM - 12:00 PM</span>
                  </div>
                </div>
              </div>
              <div className="p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <Card className="bg-gradient-to-br from-[#1F396D]/5 to-[#29335C]/10 border-l-4 border-[#1F396D] hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#1F396D] rounded-lg"><Calculator className="w-6 h-6 text-white" /></div>
                        <h3 className="text-xl font-bold text-[#1F396D]">Math Session</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">Timed tests to build speed & accuracy while ensuring students show complete work on every problem.</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/10 border-l-4 border-[#F16112] hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-[#F16112] rounded-lg"><PenTool className="w-6 h-6 text-white" /></div>
                        <h3 className="text-xl font-bold text-[#F16112]">English Session</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">Writing practice and grammar editing with real-time feedback to strengthen clarity and structure.</p>
                    </CardContent>
                  </Card>
                </div>
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Pricing</h3>
                    <div className="flex items-center justify-center gap-8 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#1F396D] mb-2">FREE</div>
                        <div className="text-sm text-gray-600">for GrowWisers</div>
                      </div>
                      <div className="w-px h-12 bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#F16112] mb-2">$8</div>
                        <div className="text-sm text-gray-600">for non-GrowWisers</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-lg mb-6">Helps build speed, accuracy, and confidence under pressure.</p>
                    <Button className="bg-gradient-to-r from-[#1F396D] to-[#F16112] hover:from-[#29335C] hover:to-[#F1894F] text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      Register for Practice Sessions
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Our Academic Programs */}
      <section className="py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Why Choose Our <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Academic Programs</span>?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Comprehensive support designed for K-12 academic excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseAcademic.map((item, index) => (
              <Card key={index} className="bg-white/35 backdrop-blur-3xl rounded-[28px] shadow-[0px_25px_60px_0px_rgba(31,57,109,0.18)] border-2 border-white/50 hover:shadow-[0px_40px_100px_0px_rgba(31,57,109,0.3)] transition-all duration-500 hover:-translate-y-2 text-center ring-1 ring-white/30">
                <CardContent className="p-8 relative">
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

      {/* Why Choose GrowWise */}
      <section className="py-16 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 left-16 w-40 h-40 bg-[#1F396D]/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-[#F16112]/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-[#F16112] text-white mb-4 px-6 py-2 rounded-full">WHY CHOOSE US</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1F396D] mb-4">Why Choose GrowWise for Education Courses?</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Card className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0px_20px_50px_0px_rgba(31,57,109,0.12)] border border-white/40 overflow-hidden">
                <CardContent className="p-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1532788592275-3f310c81dd95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHN0dWRlbnQlMjBsZWFybmluZyUyMHdpdGglMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc1NzI2Nzg1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Happy student learning with headphones"
                    className="w-full h-auto object-cover"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1F396D] mb-2">Personalized Attention</h4>
                      <p className="text-gray-600 leading-relaxed">We provide individualized support to ensure each student reaches their maximum potential and academic goals.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1F396D] mb-2">Engaging Curriculum</h4>
                      <p className="text-gray-600 leading-relaxed">Innovative and interactive curriculum and engaging thinking learning experience for each student.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#F16112] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1F396D] mb-2">Expert Instructors</h4>
                      <p className="text-gray-600 leading-relaxed">Our courses are taught by experienced educators who are passionate about teaching and dedicated to student success.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg_white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#F1894F] to-[#F16112] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HeartHandshake className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1F396D] mb-2">Comprehensive Support</h4>
                      <p className="text-gray-600 leading-relaxed">We offer resources and support to help students excel in their studies and achieve sustained success.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 px-4 lg:px-8 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Student Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Real results from our academic programs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, idx) => (
              <Card key={idx} className="bg-white/80 backdrop-blur-lg rounded-[28px] shadow-[0px_20px_40px_0px_rgba(31,57,109,0.12)] border border-white/40 hover:shadow-[0px_30px_60px_0px_rgba(31,57,109,0.18)] transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <ImageWithFallback src={story.image} alt={story.name} className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-[#F16112]" />
                    <h3 className="text-xl font-bold text-gray-900">{story.name}</h3>
                    <p className="text-gray-600">{story.grade} • {story.subject}</p>
                  </div>
                  <div className="text-center mb-6">
                    <Badge className="bg-[#F16112] text-white px-4 py-2 rounded-full">{story.improvement}</Badge>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed text-center">"{story.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F16112]/10 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">Ready to Excel in Academics?</h2>
          <p className="text-xl lg:text-2xl mb-12 text-white/90 leading-relaxed">Join hundreds of students who have improved their academic performance with our personalized programs.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105" size="lg">
              Book Free Assessment
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1F396D] px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      <AlertDialog open={isLearnMoreModalOpen} onOpenChange={setIsLearnMoreModalOpen}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-3xl border-2 border-white/60 shadow-[0px_40px_120px_rgba(31,57,109,0.3)] rounded-[32px] max-w-2xl p-0 overflow-hidden ring-1 ring-white/30">
          {/* Enhanced Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/8 via-transparent to-[#F16112]/8"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
          
          {/* Custom Close Button */}
          <button
            onClick={() => setIsLearnMoreModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/60 group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
          
          <div className="relative z-10 p-8">
            <AlertDialogHeader className="text-center mb-8">
              <AlertDialogTitle className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your <span className="bg-gradient-to-r from-[#1F396D] to-[#F16112] bg-clip-text text-transparent">Academic Path</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-lg text-gray-600 leading-relaxed">
                Select the subject that matches your learning goals and start your academic journey
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card onClick={() => { router.push('/math-courses'); setIsLearnMoreModalOpen(false); }} className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/10 to-[#29335C]/15 opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
                <CardContent className="p-8 text-center flex flex-col items-center justify-between relative z-10 h-full">
                  <div className="flex flex-col items-center">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0px_15px_40px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
                        <Calculator className="w-10 h-10 text-[#1F396D] drop-shadow-sm" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1F396D] transition-colors">Math Courses</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Master mathematics from basics to advanced levels with personalized instruction</p>
                    <div className="space-y-2 mb-6 text-left w-full">
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" /><span className="text-sm text-gray-700">DUSD & PUSD Aligned</span></div>
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" /><span className="text-sm text-gray-700">Grade-Level & Accelerated</span></div>
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#1F396D] flex-shrink-0" /><span className="text-sm text-gray-700">One-on-One Support</span></div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
                    View More
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card onClick={() => { router.push('/english-courses'); setIsLearnMoreModalOpen(false); }} className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F16112]/10 to-[#F1894F]/15 opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
                <CardContent className="p-8 text-center flex flex-col items-center justify-between relative z-10 h-full">
                  <div className="flex flex-col items-center">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-20 bg-white/50 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0px_15px_40px_rgba(255,255,255,0.4)] border-2 border-white/60 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/30">
                        <BookOpen className="w-10 h-10 text-[#F16112] drop-shadow-sm" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F16112] transition-colors">English Language Arts</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">Comprehensive English language arts skills from reading to writing excellence</p>
                    <div className="space-y-2 mb-6 text-left w-full">
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" /><span className="text-sm text-gray-700">Reading Comprehension</span></div>
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" /><span className="text-sm text-gray-700">Essay Writing</span></div>
                      <div className="flex items-center gap-3"><CheckCircle className="w-4 h-4 text-[#F16112] flex-shrink-0" /><span className="text-sm text-gray-700">Grammar & Vocabulary</span></div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20 mt-auto">
                    View More
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">Not sure which path to choose? <Button variant="ghost" className="text-[#1F396D] font-medium hover:underline p-0 h-auto" onClick={() => setIsLearnMoreModalOpen(false)}>Contact us for guidance</Button></p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AcademicPage;




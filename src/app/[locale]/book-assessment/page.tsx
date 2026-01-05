'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { BookOpen, BookMarked, CheckCircle, Clock, Users, Award, TrendingUp, Brain, FileText, PenTool, Sparkles, Eye, ChevronRight, Lightbulb, Trophy, Star, Shield, ArrowRight, Calendar, Target, GraduationCap, User, Mail, Phone as PhoneIcon, MessageSquare, Send, ThumbsUp, BarChart3, Globe, Video, CheckSquare, Heart, Calculator, X } from 'lucide-react';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface FormData {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  assessmentType: string;
  mode: string;
  schedule: string;
  notes: string;
}

export default function BookAssessmentPage() {
  const t = useTranslations();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isExploreCoursesModalOpen, setIsExploreCoursesModalOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    studentName: '',
    grade: '',
    subjects: [],
    assessmentType: '',
    mode: '',
    schedule: '',
    notes: ''
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const availableSubjects = [
    { value: 'Math', icon: '📐' },
    { value: 'English', icon: '📚' },
    { value: 'Reading Comprehension', icon: '📖' },
    { value: 'Writing', icon: '✍️' },
    { value: 'Science', icon: '🔬' },
    { value: 'SAT/ACT', icon: '🎯' }
  ];

  const scheduleOptions = [
    'Weekdays Morning', 'Weekdays After School', 'Weekends Morning', 'Weekends Afternoon'
  ];

  const assessmentTypes = [
    { value: 'English Reading Assessment', price: '$49', icon: '📚', popular: false },
    { value: 'Math Skills Assessment', price: '$49', icon: '📐', popular: false },
    { value: 'Complete Academic Assessment', price: '$89', icon: '🎓', popular: true }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subject: string, checked: boolean | 'indeterminate' | undefined) => {
    // Ensure checked is a boolean
    const isChecked = checked === true;
    
    setFormData(prev => {
      // Ensure subjects is always an array
      const currentSubjects = Array.isArray(prev.subjects) ? prev.subjects : [];
      
      return {
        ...prev,
        subjects: isChecked
          ? [...currentSubjects, subject]
          : currentSubjects.filter(s => s !== subject)
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setFormData({
        parentName: '',
        email: '',
        countryCode: '+1',
        phone: '',
        studentName: '',
        grade: '',
        subjects: [],
        assessmentType: '',
        mode: '',
        schedule: '',
        notes: ''
      });
      setIsSubmitted(false);
    }, 5000);
  };

  const assessmentFeatures = [
    { icon: FileText, title: 'Detailed Report', description: 'Comprehensive analysis of strengths and growth areas', color: 'from-blue-500 to-blue-600', stats: '15+ Pages' },
    { icon: Users, title: 'Expert Evaluators', description: 'Certified teachers with 10+ years of experience', color: 'from-purple-500 to-purple-600', stats: 'Certified Pros' },
    { icon: Lightbulb, title: 'Actionable Insights', description: 'Clear recommendations for next steps', color: 'from-amber-500 to-amber-600', stats: 'Personalized' },
    { icon: Calendar, title: 'Flexible Scheduling', description: 'Book at your convenience', color: 'from-green-500 to-green-600', stats: '24/7 Booking' }
  ];

  const processSteps = [
    { number: '1', title: 'Book Your Assessment', description: 'Choose your package and schedule a convenient time', icon: Calendar, color: 'from-[#1F396D] to-[#29335C]' },
    { number: '2', title: 'Take the Assessment', description: 'Complete the evaluation with our expert teachers', icon: PenTool, color: 'from-[#F16112] to-[#F1894F]' },
    { number: '3', title: 'Receive Your Report', description: 'Get detailed insights within 48 hours', icon: FileText, color: 'from-[#1F396D] to-[#F16112]' },
    { number: '4', title: 'Plan Your Path', description: 'Schedule a consultation to discuss next steps', icon: Lightbulb, color: 'from-[#F1894F] to-[#1F396D]' }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Parent of 5th Grader', content: 'The assessment was incredibly thorough and helped us identify exactly where our daughter needed support. Highly recommend!', rating: 5 },
    { name: 'Michael Chen', role: 'Parent of 8th Grader', content: "Outstanding service! The detailed report gave us a clear roadmap for our son's academic improvement.", rating: 5 },
    { name: 'Emily Rodriguez', role: 'Parent of 3rd Grader', content: 'The evaluators were professional and made my child feel comfortable. The insights were invaluable.', rating: 5 }
  ];

  const stats = [
    { number: '5000+', label: 'Assessments Completed', icon: BarChart3 },
    { number: '98%', label: 'Parent Satisfaction', icon: Heart },
    { number: '48hr', label: 'Report Delivery', icon: Clock },
    { number: '15+', label: 'Years Experience', icon: Award }
  ];

  const benefits = [
    { icon: Clock, text: 'Flexible scheduling' },
    { icon: Video, text: 'Online & in-person' },
    { icon: FileText, text: 'Detailed reports' },
    { icon: Target, text: 'Personalized insights' },
    { icon: Shield, text: '100% confidential' },
    { icon: Award, text: 'Expert evaluators' }
  ];

  const scrollToForm = () => {
    const formSection = document.getElementById('assessment-form');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.15 }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }} className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-white to-[#F16112] rounded-full blur-3xl"></motion.div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.15 }} transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }} className="absolute bottom-20 right-10 w-[700px] h-[700px] bg-gradient-to-br from-[#F16112] to-white rounded-full blur-3xl"></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}>
              <Badge className="mb-8 bg-white/20 backdrop-blur-xl text-white border-2 border-white/30 px-8 py-3 shadow-2xl">
                <Sparkles className="w-5 h-5 mr-2" />
                Professional Assessment Services
              </Badge>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-white mb-8 text-5xl lg:text-6xl">
              Discover Your Child's <br />
              <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Academic Potential</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-white/90 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
              Get a comprehensive evaluation from certified educators. Understand strengths, identify growth areas, and receive a personalized learning roadmap for your child's success.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
              <Button onClick={scrollToForm} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white px-8 sm:px-10 py-6 sm:py-7 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 group text-base sm:text-lg w-full sm:w-auto">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Book Free Assessment
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => setIsExploreCoursesModalOpen(true)} variant="outline" className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-[#1F396D] px-8 sm:px-10 py-6 sm:py-7 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl text-base sm:text-lg w-full sm:w-auto">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Explore Courses
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon as any;
                return (
                  <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }} whileHover={{ scale: 1.05 }}>
                    <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-3">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto"><path fill="#F9FAFB" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path></svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">Why Book With Us</Badge>
            <h2 className="text-gray-900 mb-4">Everything You Need to Know</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon as any;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -5 }}>
                  <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-[#F16112]/30 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 rounded-2xl mb-4">
                        <IconComponent className="w-7 h-7 text-[#F16112]" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium leading-snug">{benefit.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white border-0 px-6 py-2">Simple Process</Badge>
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our streamlined 4-step process makes it easy to get the insights you need</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[72px] left-0 right-0 h-1 bg-gradient-to-r from-[#1F396D] via-[#F16112] to-[#1F396D] opacity-20"></div>
            {processSteps.map((step, index) => {
              const IconComponent = step.icon as any;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} className="relative">
                  <Card className="bg-white/90 backdrop-blur-xl border-2 border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className="relative inline-block mb-6">
                        <motion.div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-2 mx-auto shadow-2xl group-hover:shadow-xl transition-all`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                          <span className="text-3xl font-bold">{step.number}</span>
                        </motion.div>
                        <div className="absolute -bottom-3 -right-3 bg-white/95 backdrop-blur-xl p-3 rounded-xl shadow-lg border-2 border-white/60">
                          <IconComponent className="w-6 h-6 text-[#F16112]" />
                        </div>
                      </div>
                      <h3 className="text-gray-900 mb-3 group-hover:text-[#F16112] transition-colors">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-[56px] -right-4 z-10">
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: index * 0.15 + 0.3 }}>
                        <ChevronRight className="w-8 h-8 text-[#F16112]/40" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="assessment-form" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#1F396D]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#F16112]/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-8 py-3 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              100% Free - No Credit Card Required
            </Badge>
            <h2 className="text-gray-900 mb-4">Book Your <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Free Assessment</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Fill out the form below and our academic advisors will contact you within 24 hours</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-white/60 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-10 lg:p-14">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6 p-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-2xl border-2 border-[#1F396D]/10">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-[#1F396D]/20">
                        <div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-xl"><User className="w-6 h-6 text-white" /></div>
                        <div><h3 className="text-gray-900 text-xl">Parent Information</h3><p className="text-sm text-gray-500">Tell us about yourself</p></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="parentName" className="text-gray-700 font-medium text-base flex items-center gap-2"><User className="w-4 h-4 text-[#F16112]" />Parent Name <span className="text-red-500">*</span></Label>
                          <Input id="parentName" type="text" value={formData.parentName} onChange={(e) => handleInputChange('parentName', e.target.value)} onFocus={() => setFocusedField('parentName')} onBlur={() => setFocusedField(null)} className={`bg-white border-2 rounded-xl transition-all duration-300 h-14 text-base ${focusedField === 'parentName' ? 'border-[#F16112] shadow-lg ring-4 ring-[#F16112]/10 scale-[1.02]' : 'border-gray-300 hover:border-gray-400'}`} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-gray-700 font-medium text-base flex items-center gap-2"><Mail className="w-4 h-4 text-[#1F396D]" />Email Address <span className="text-red-500">*</span></Label>
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={`bg-white border-2 rounded-xl transition-all duration-300 h-14 text-base ${focusedField === 'email' ? 'border-[#F16112] shadow-lg ring-4 ring-[#F16112]/10 scale-[1.02]' : 'border-gray-300 hover:border-gray-400'}`} placeholder="john@example.com" required />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="text-gray-700 font-medium text-base flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-[#F16112]" />Phone Number <span className="text-red-500">*</span></Label>
                        <div className="flex items-stretch gap-0">
                          <CountryCodeSelector 
                            value={formData.countryCode} 
                            onChange={(countryCode) => handleInputChange('countryCode', countryCode)} 
                            className={`flex-shrink-0 ${focusedField === 'phone' ? 'border-[#F16112]' : ''}`}
                          />
                          <div className="w-px h-14 bg-gray-300 flex-shrink-0 self-center"></div>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={formData.phone} 
                            onChange={(e) => handleInputChange('phone', e.target.value)} 
                            onFocus={() => setFocusedField('phone')} 
                            onBlur={() => setFocusedField(null)} 
                            className={`bg-white border-2 rounded-r-xl rounded-l-none transition-all duration-300 flex-1 h-14 text-base ${focusedField === 'phone' ? 'border-[#F16112] shadow-lg ring-4 ring-[#F16112]/10' : 'border-gray-300 hover:border-gray-400'}`} 
                            placeholder="(555) 123-4567" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 p-8 bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/5 rounded-2xl border-2 border-[#F16112]/10">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-[#F16112]/20"><div className="p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-xl"><GraduationCap className="w-6 h-6 text-white" /></div><div><h3 className="text-gray-900 text-xl">Student Information</h3><p className="text-sm text-gray-500">Tell us about your child</p></div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3"><Label htmlFor="studentName" className="text-gray-700 font-medium text-base flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#F16112]" />Student Name <span className="text-red-500">*</span></Label><Input id="studentName" type="text" value={formData.studentName} onChange={(e) => handleInputChange('studentName', e.target.value)} onFocus={() => setFocusedField('studentName')} onBlur={() => setFocusedField(null)} className={`bg-white border-2 rounded-xl transition-all duration-300 h-14 text-base ${focusedField === 'studentName' ? 'border-[#F16112] shadow-lg ring-4 ring-[#F16112]/10 scale-[1.02]' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Jane Doe" required /></div>
                        <div className="space-y-3"><Label htmlFor="grade" className="text-gray-700 font-medium text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#1F396D]" />Grade / Level <span className="text-red-500">*</span></Label><Select onValueChange={(value) => handleInputChange('grade', value)} required><SelectTrigger className="bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all h-14 text-base"><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">{grades.map((grade) => (<SelectItem key={grade} value={grade} className="hover:bg-[#F16112]/10 py-3">{grade}</SelectItem>))}</SelectContent></Select></div>
                      </div>
                    </div>

                    <div className="space-y-6 p-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-2xl border-2 border-[#1F396D]/10">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-[#1F396D]/20"><div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#F16112] rounded-xl"><BookMarked className="w-6 h-6 text-white" /></div><div><h3 className="text-gray-900 text-xl">Assessment Preferences</h3><p className="text-sm text-gray-500">Customize your assessment experience</p></div></div>
                      <div className="space-y-3">
                        <Label htmlFor="assessmentType" className="text-gray-700 font-medium text-base flex items-center gap-2"><Target className="w-4 h-4 text-[#F16112]" />Assessment Type <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(value) => handleInputChange('assessmentType', value)} required>
                          <SelectTrigger className="bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all h-14 text-base"><SelectValue placeholder="Select assessment type" /></SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">
                            {assessmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="hover:bg-[#F16112]/10 py-4 text-base">
                                <div className="flex items-center justify-between w-full gap-4"><span className="flex items-center gap-2"><span>{type.icon}</span>{type.value}</span><div className="flex items-center gap-2"><Badge className="bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white border-0">{type.price}</Badge>{type.popular && (<Badge className="bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0"><Star className="w-3 h-3 mr-1" />Popular</Badge>)}</div></div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium mb-4 block flex items-center gap-2 text-base"><CheckSquare className="w-4 h-4 text-[#F16112]" />Areas of Focus <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {availableSubjects.map((subject) => {
                            const isSelected = Array.isArray(formData.subjects) && formData.subjects.includes(subject.value);
                            
                            return (
                              <div 
                                key={subject.value} 
                                onClick={() => handleSubjectChange(subject.value, !isSelected)} 
                                className={`flex items-center space-x-3 p-4 bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${isSelected ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-lg' : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-md'}`}
                              >
                                <Checkbox 
                                  id={subject.value} 
                                  checked={isSelected} 
                                  onCheckedChange={(checked) => {
                                    // Prevent event bubbling to avoid double toggle
                                    handleSubjectChange(subject.value, checked);
                                  }} 
                                  className="border-2 border-gray-400 data-[state=checked]:bg-[#F16112] data-[state=checked]:border-[#F16112] w-5 h-5" 
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Label 
                                  htmlFor={subject.value} 
                                  className="cursor-pointer text-gray-700 font-medium flex-1 flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>{subject.icon}</span>{subject.value}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label className="text-gray-700 font-medium flex items-center gap-2 text-base"><Globe className="w-4 h-4 text-[#1F396D]" />Preferred Mode <span className="text-red-500">*</span></Label>
                          <RadioGroup value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)} className="flex flex-col gap-4">
                            <div onClick={() => handleInputChange('mode', 'in-person')} className={`flex items-center space-x-4 p-4 bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${formData.mode === 'in-person' ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-lg' : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-md'}`}>
                              <RadioGroupItem value="in-person" id="in-person" className="border-2 border-gray-400 text-[#F16112] w-5 h-5 pointer-events-none" />
                              <Label htmlFor="in-person" className="cursor-pointer text-gray-700 font-medium flex-1 pointer-events-none">In-person at Dublin, CA</Label>
                            </div>
                            <div onClick={() => handleInputChange('mode', 'online')} className={`flex items-center space-x-4 p-4 bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${formData.mode === 'online' ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-lg' : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-md'}`}>
                              <RadioGroupItem value="online" id="online" className="border-2 border-gray-400 text-[#F16112] w-5 h-5 pointer-events-none" />
                              <Label htmlFor="online" className="cursor-pointer text-gray-700 font-medium flex-1 flex items-center gap-2 pointer-events-none"><Video className="w-4 h-4" />Online (Virtual)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="schedule" className="text-gray-700 font-medium flex items-center gap-2 text-base"><Calendar className="w-4 h-4 text-[#F16112]" />Preferred Schedule <span className="text-red-500">*</span></Label>
                          <Select onValueChange={(value) => handleInputChange('schedule', value)} required>
                            <SelectTrigger className="bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all h-14 text-base"><SelectValue placeholder="Select preferred time" /></SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">{scheduleOptions.map((option) => (<SelectItem key={option} value={option} className="hover:bg-[#F16112]/10 py-3">{option}</SelectItem>))}</SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-2 border-blue-200/50">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-blue-300/50"><div className="p-3 bg-blue-500 rounded-xl"><MessageSquare className="w-6 h-6 text-white" /></div><div><h3 className="text-gray-900 text-xl">Additional Information</h3><p className="text-sm text-gray-600">Any special requirements or questions?</p></div></div>
                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-gray-700 font-medium flex items-center gap-2 text-base"><PenTool className="w-4 h-4 text-blue-600" />Special Requirements or Questions (Optional)</Label>
                        <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} onFocus={() => setFocusedField('notes')} onBlur={() => setFocusedField(null)} className={`bg-white border-2 rounded-xl transition-all duration-300 min-h-[140px] resize-none text-base ${focusedField === 'notes' ? 'border-blue-500 shadow-lg ring-4 ring-blue-500/10' : 'border-gray-300 hover:border-gray-400'}`} placeholder="Let us know if you have any specific concerns or questions about the assessment..." />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#F16112] via-[#F1894F] to-[#F16112] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white h-16 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-500 disabled:opacity-50 text-lg font-semibold group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {isSubmitting ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full mr-3"></motion.div>
                            Processing Your Request...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
                            Book Free Assessment Now
                            <Sparkles className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform" />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-green-600" />By submitting, you agree to be contacted by GrowWise School</p>
                    </div>
                  </form>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="w-28 h-28 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"><CheckCircle className="w-14 h-14 text-white" /></motion.div>
                    <motion.h3 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-gray-900 mb-6 text-4xl">🎉 Thank You for Your Request!</motion.h3>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="text-gray-600 max-w-lg mx-auto mb-10 text-xl leading-relaxed">We've received your free assessment booking request. Our team will contact you within 24 hours to confirm your appointment.</motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="space-y-4">
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button onClick={() => setIsSubmitted(false)} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"><Calendar className="w-6 h-6 mr-2" />Book Another Assessment</Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
                        {[
                          { icon: Clock, text: '24-hour response guaranteed' },
                          { icon: Shield, text: 'Your data is secure' },
                          { icon: ThumbsUp, text: 'Welcome to GrowWise!' }
                        ].map((item, idx) => {
                          const IconComponent = item.icon as any;
                          return (
                            <div key={idx} className="flex flex-col items-center gap-3">
                              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl"><IconComponent className="w-6 h-6 text-green-700" /></div>
                              <p className="text-sm text-gray-600 font-medium">{item.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, text: '24-hour response time guaranteed', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, text: 'SSL Encrypted & 100% Secure', color: 'from-green-500 to-green-600' },
              { icon: Award, text: 'Certified Expert Evaluators', color: 'from-purple-500 to-purple-600' }
            ].map((item, index) => {
              const IconComponent = item.icon as any;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }} whileHover={{ y: -5, scale: 1.02 }} className="text-center">
                  <motion.div className={`inline-flex p-5 bg-gradient-to-r ${item.color} rounded-2xl shadow-xl mb-4`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  <p className="text-gray-700 font-semibold text-lg">{item.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white border-0 px-6 py-2">Parent Reviews</Badge>
            <h2 className="text-gray-900 mb-4">What Parents Are Saying</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Hear from families who have benefited from our assessment services</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} whileHover={{ y: -10, scale: 1.02 }}>
                <Card className="bg-white backdrop-blur-xl border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112]" />))}</div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed text-base">"{testimonial.content}"</p>
                    <div className="border-t-2 border-gray-100 pt-6"><p className="font-bold text-gray-900 text-lg">{testimonial.name}</p><p className="text-sm text-gray-500 mt-1">{testimonial.role}</p></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">Why Choose Us</Badge>
            <h2 className="text-gray-900 mb-4">Why GrowWise Assessments?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">We combine expertise, technology, and personalized attention to deliver exceptional results</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Award, title: 'Expert Educators', description: 'Certified teachers with 10+ years of experience in academic assessment and curriculum design', color: 'from-[#F16112] to-[#F1894F]' },
              { icon: Brain, title: 'Comprehensive Analysis', description: 'In-depth evaluation covering multiple dimensions of academic performance and learning styles', color: 'from-[#1F396D] to-[#29335C]' },
              { icon: TrendingUp, title: 'Actionable Roadmap', description: 'Personalized learning path with specific recommendations for academic growth and success', color: 'from-[#F1894F] to-[#1F396D]' }
            ].map((item, index) => {
              const IconComponent = item.icon as any;
              return (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.15 }} whileHover={{ y: -10 }}>
                  <Card className="bg-white backdrop-blur-xl border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full group">
                    <CardContent className="p-10 text-center">
                      <motion.div className={`inline-flex p-6 bg-gradient-to-r ${item.color} rounded-3xl mb-6 shadow-2xl group-hover:shadow-xl transition-all`} whileHover={{ rotate: 360, scale: 1.15 }} transition={{ duration: 0.8 }}>
                        <IconComponent className="w-12 h-12 text-white" />
                      </motion.div>
                      <h3 className="text-gray-900 mb-4 group-hover:text-[#F16112] transition-colors text-xl">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1F396D] via-[#29335C] to-[#1F396D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div><div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#F16112] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-white mb-6 text-4xl lg:text-5xl">Ready to Unlock Your Child's Potential?</h2>
            <p className="text-white/90 mb-10 text-xl leading-relaxed">Book a free assessment today and get personalized insights into your child's academic journey</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button onClick={scrollToForm} className="bg-white text-[#1F396D] hover:bg-gray-100 px-10 py-7 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-200 hover:scale-105 group text-lg"><Calendar className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />Book Free Assessment<ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" /></Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-10 py-7 rounded-2xl transition-all duration-200 text-lg backdrop-blur-xl"><PhoneIcon className="w-5 h-5 mr-2" />(925) 456-4606</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Explore Courses Modal */}
      <AlertDialog open={isExploreCoursesModalOpen} onOpenChange={setIsExploreCoursesModalOpen}>
        <AlertDialogContent className="bg-white/90 backdrop-blur-3xl border-2 border-white/60 shadow-[0px_40px_120px_rgba(31,57,109,0.3)] rounded-[32px] max-w-2xl p-0 overflow-hidden ring-1 ring-white/30">
          {/* Enhanced Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F396D]/8 via-transparent to-[#F16112]/8"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5"></div>
          
          {/* Custom Close Button */}
          <button
            onClick={() => setIsExploreCoursesModalOpen(false)}
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
              <Card onClick={() => { router.push('/math-courses'); setIsExploreCoursesModalOpen(false); }} className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full">
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

              <Card onClick={() => { router.push('/english-courses'); setIsExploreCoursesModalOpen(false); }} className="bg-white/40 backdrop-blur-2xl border-2 border-white/50 rounded-[24px] shadow-[0px_20px_50px_rgba(255,255,255,0.3)] hover:shadow-[0px_30px_80px_rgba(255,255,255,0.4)] transition-all duration-500 cursor-pointer group hover:scale-105 transform overflow-hidden relative ring-1 ring-white/40 h-full">
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
              <p className="text-sm text-gray-500">Not sure which path to choose? <Button variant="ghost" className="text-[#1F396D] font-medium hover:underline p-0 h-auto" onClick={() => setIsExploreCoursesModalOpen(false)}>Contact us for guidance</Button></p>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

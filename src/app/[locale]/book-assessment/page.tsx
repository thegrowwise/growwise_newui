'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { BookOpen, BookMarked, CheckCircle, Clock, Users, Award, TrendingUp, Brain, FileText, PenTool, Sparkles, Eye, ChevronRight, Lightbulb, Trophy, Star, Shield, ArrowRight, Calendar, Target, GraduationCap, User, Mail, Phone as PhoneIcon, MessageSquare, Send, ThumbsUp, BarChart3, Globe, Video, CheckSquare, Heart, Calculator, X, AlertCircle } from 'lucide-react';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import { useRouter } from 'next/navigation';
import { PHONE_PLACEHOLDER, CONTACT_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { validatePhone, getPhonePlaceholder, getCallingCode } from '@/lib/phoneValidation';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isExploreCoursesModalOpen, setIsExploreCoursesModalOpen] = useState(false);

  const [agreeToCommunications, setAgreeToCommunications] = useState(false);
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

  // Move availableSubjects outside component or use useMemo to prevent recreation
  const availableSubjects = useMemo(() => [
    { value: 'Math', icon: '📐' },
    { value: 'English', icon: '📚' },
    { value: 'SAT/ACT', icon: '🎯' }
  ], []);

  const scheduleOptions = [
    'Weekdays Morning', 'Weekdays After School', 'Weekends Morning', 'Weekends Afternoon'
  ];

  const assessmentTypes = [
    { value: 'English Reading Assessment', icon: '📚', label: 'English Reading Assessment' },
    { value: 'Math Skills Assessment', icon: '📐', label: 'Math Skills Assessment' },
    { value: 'Complete Academic Assessment', icon: '🎓', label: '(English + Maths) Complete Academic Assessment' }
  ];

  // Map dial code to ISO2 country code
  const dialCodeToIso2: Record<string, string> = {
    '+1': 'US', // Default to US for +1 (could be CA too)
    '+91': 'IN',
    '+44': 'GB',
    '+971': 'AE',
    '+65': 'SG',
    '+61': 'AU',
    '+49': 'DE',
    '+33': 'FR'
  };

  const getCountryIso2 = (dialCode: string): string => {
    return dialCodeToIso2[dialCode] || 'US';
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Clear phone error when user starts typing
    if (field === 'phone' && phoneError) {
      setPhoneError(null);
    }
  };

  const handlePhoneBlur = () => {
    if (formData.phone.trim()) {
      const countryIso2 = getCountryIso2(formData.countryCode);
      const result = validatePhone(countryIso2, formData.phone);
      setPhoneError(result.errorMessage);
    } else {
      setPhoneError(null);
    }
  };

  const handleCountryCodeChange = (dialCode: string) => {
    handleInputChange('countryCode', dialCode);
    // Re-validate phone when country changes
    if (formData.phone.trim()) {
      const countryIso2 = getCountryIso2(dialCode);
      const result = validatePhone(countryIso2, formData.phone);
      setPhoneError(result.errorMessage);
    }
  };

  // Use ref to store handlers to prevent recreation
  const handlersRef = useRef<Record<string, (checked: boolean | 'indeterminate') => void>>({});
  
  // Initialize handlers only once
  if (Object.keys(handlersRef.current).length === 0) {
    availableSubjects.forEach(subject => {
      handlersRef.current[subject.value] = (checked: boolean | 'indeterminate') => {
        const isChecked = checked === true;
        setFormData(prev => {
          const currentSubjects = Array.isArray(prev.subjects) ? prev.subjects : [];
          return {
            ...prev,
            subjects: isChecked
              ? [...currentSubjects, subject.value]
              : currentSubjects.filter(s => s !== subject.value)
          };
        });
      };
    });
  }

  // Validate all form fields
  const validateForm = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    // Validate parent name
    if (!formData.parentName.trim()) {
      errors.parentName = 'Parent name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Validate phone
    const countryIso2 = getCountryIso2(formData.countryCode);
    const phoneValidation = validatePhone(countryIso2, formData.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.errorMessage || 'Phone number is invalid';
    }
    
    // Validate student name
    if (!formData.studentName.trim()) {
      errors.studentName = 'Student name is required';
    }
    
    // Validate grade
    if (!formData.grade.trim()) {
      errors.grade = 'Grade level is required';
    }
    
    // Validate assessment type
    if (!formData.assessmentType.trim()) {
      errors.assessmentType = 'Please select an assessment type';
    }
    
    // Validate mode
    if (!formData.mode.trim()) {
      errors.mode = 'Please select a mode (Online or In-Person)';
    }
    
    // Validate schedule
    if (!formData.schedule.trim()) {
      errors.schedule = 'Please select a preferred schedule';
    }
    
    // Validate communication consent
    if (!agreeToCommunications) {
      errors.agreeToCommunications = 'Please agree to receive communications to continue';
    }
    
    setFormErrors(errors);
    setPhoneError(errors.phone || null);
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }, [formData, agreeToCommunications]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling
    
    // Clear previous general errors
    setErrorMessage('');
    
    // Validate all form fields
    const validation = validateForm();
    
    if (!validation.isValid) {
      // Scroll to first error field after state update
      setTimeout(() => {
        const firstErrorId = Object.keys(validation.errors)[0];
        if (firstErrorId) {
          // Map field names to input IDs
          const fieldIdMap: Record<string, string> = {
            parentName: 'parentName',
            email: 'email',
            phone: 'phone',
            studentName: 'studentName',
            grade: 'grade',
            assessmentType: 'assessmentType',
            mode: 'mode',
            schedule: 'schedule',
            agreeToCommunications: 'agreeToCommunications'
          };
          const inputId = fieldIdMap[firstErrorId] || firstErrorId;
          const errorInput = document.getElementById(inputId);
          if (errorInput) {
            errorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorInput.focus();
          }
        }
      }, 100);
      return; // CRITICAL: Prevent form submission - don't set isSubmitting
    }
    
    // Clear all errors if validation passes
    setFormErrors({});
    setPhoneError(null);
    
    // Validate phone and get E.164 format
    const countryIso2 = getCountryIso2(formData.countryCode);
    const phoneValidation = validatePhone(countryIso2, formData.phone);
    
    setIsSubmitting(true);

    try {
      const assessmentData = {
        parentName: formData.parentName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: phoneValidation.e164 || formData.phone, // Use E.164 format if available
        studentName: formData.studentName,
        grade: formData.grade,
        subjects: formData.subjects,
        assessmentType: formData.assessmentType,
        mode: formData.mode,
        schedule: formData.schedule,
        notes: formData.notes,
        agreeToCommunications
      };

      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || result.message || `Server error (${response.status})`);
        setIsSubmitting(false);
        return;
      }

      if (result.success) {
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Reset form after success
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
          setAgreeToCommunications(false);
          setIsSubmitted(false);
        }, 5000);
      } else {
        setErrorMessage(result.error || 'Failed to submit assessment booking');
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const assessmentFeatures = [
    { icon: FileText, title: 'Detailed Report', description: 'Comprehensive analysis of strengths and growth areas', color: 'from-blue-500 to-blue-600', stats: '15+ Pages' },
    { icon: Users, title: 'Expert Evaluators', description: 'Certified teachers with 10+ years of experience', color: 'from-purple-500 to-purple-600', stats: 'Certified Pros' },
    { icon: Lightbulb, title: 'Actionable Insights', description: 'Clear recommendations for next steps', color: 'from-amber-500 to-amber-600', stats: 'Personalized' },
    { icon: Calendar, title: 'Flexible Scheduling', description: 'Book at your convenience', color: 'from-green-500 to-green-600', stats: '24/7 Booking' }
  ];

  // const processSteps = [
  //   { number: '1', title: 'Book Your Assessment', description: 'Choose your package and schedule a convenient time', icon: Calendar, color: 'from-[#1F396D] to-[#29335C]' },
  //   { number: '2', title: 'Take the Assessment', description: 'Complete the evaluation with our expert teachers', icon: PenTool, color: 'from-[#F16112] to-[#F1894F]' },
  //   { number: '3', title: 'Receive Your Report', description: 'Get detailed insights within 48 hours', icon: FileText, color: 'from-[#1F396D] to-[#F16112]' },
  //   { number: '4', title: 'Plan Your Path', description: 'Schedule a consultation to discuss next steps', icon: Lightbulb, color: 'from-[#F1894F] to-[#1F396D]' }
  // ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Parent of 5th Grader', content: 'The assessment was incredibly thorough and helped us identify exactly where our daughter needed support. Highly recommend!', rating: 5 },
    { name: 'Michael Chen', role: 'Parent of 8th Grader', content: "Outstanding service! The detailed report gave us a clear roadmap for our son's academic improvement.", rating: 5 },
    { name: 'Emily Rodriguez', role: 'Parent of 3rd Grader', content: 'The evaluators were professional and made my child feel comfortable. The insights were invaluable.', rating: 5 }
  ];

  const stats = [
    { number: '500+', label: 'Assessments Completed', icon: BarChart3 },
    { number: '98%', label: 'Parent Satisfaction', icon: Heart },
    { number: '48hr', label: 'Report Delivery', icon: Clock },
    { number: '15+', label: 'Years Experience', icon: Award }
  ];

  // const benefits = [
  //   { icon: Clock, text: 'Flexible scheduling' },
  //   { icon: Video, text: 'Online & in-person' },
  //   { icon: FileText, text: 'Detailed reports' },
  //   { icon: Target, text: 'Personalized insights' },
  //   { icon: Shield, text: '100% confidential' },
  //   { icon: Award, text: 'Expert evaluators' }
  // ];

  const scrollToForm = () => {
    const formSection = document.getElementById('assessment-form');
    if (formSection) formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50" suppressHydrationWarning>
      

      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">Why Book With Us</Badge>
            <h2 className="text-gray-900 mb-4">Everything You Need to Know</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon as any;
              return (
                <div key={index}>
                  <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-[#F16112]/30 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex p-4 bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 rounded-2xl mb-4">
                        <IconComponent className="w-7 h-7 text-[#F16112]" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium leading-snug">{benefit.text}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#1F396D] to-[#29335C] text-white border-0 px-6 py-2">Simple Process</Badge>
            <h2 className="text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Our streamlined 4-step process makes it easy to get the insights you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[72px] left-0 right-0 h-1 bg-gradient-to-r from-[#1F396D] via-[#F16112] to-[#1F396D] opacity-20"></div>
            {processSteps.map((step, index) => {
              const IconComponent = step.icon as any;
              return (
                <div key={index} className="relative">
                  <Card className="bg-white/90 backdrop-blur-xl border-2 border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div className="relative inline-block mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white mb-2 mx-auto shadow-2xl group-hover:shadow-xl transition-all`}>
                          <span className="text-3xl font-bold">{step.number}</span>
                        </div>
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
                      <div>
                        <ChevronRight className="w-8 h-8 text-[#F16112]/40" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      <section id="assessment-form" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#1F396D]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#F16112]/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-8 py-3 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              100% Free - No Credit Card Required
            </Badge>
            <h2 className="text-gray-900 mb-4">Book Your <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Free Assessment</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Fill out the form below and our academic advisors will contact you within 24 hours</p>
          </div>
          <div suppressHydrationWarning>
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-white/60 shadow-2xl rounded-xl md:rounded-3xl overflow-hidden" suppressHydrationWarning>
              <CardContent className="p-4 sm:p-6 md:p-8 lg:p-10 pt-4 sm:pt-6 md:pt-8 lg:pt-10" suppressHydrationWarning>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8" suppressHydrationWarning noValidate>
                    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-xl md:rounded-2xl border-2 border-[#1F396D]/10">
                      <div className="flex items-center gap-2 sm:gap-3 pb-3 md:pb-4 border-b-2 border-[#1F396D]/20">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-lg md:rounded-xl"><User className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                        <div><h3 className="text-gray-900 text-lg sm:text-xl">Parent Information</h3><p className="text-xs sm:text-sm text-gray-500">Tell us about yourself</p></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="parentName" className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2"><User className="w-4 h-4 text-[#F16112]" />Parent Name <span className="text-red-500">*</span></Label>
                          <Input id="parentName" type="text" value={formData.parentName} onChange={(e) => handleInputChange('parentName', e.target.value)} onFocus={() => setFocusedField('parentName')} onBlur={() => setFocusedField(null)} className={cn("bg-white border-2 rounded-lg md:rounded-xl transition-all h-12 md:h-14 text-sm sm:text-base", focusedField === 'parentName' ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10' : 'border-gray-300 hover:border-gray-400')} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2"><Mail className="w-4 h-4 text-[#1F396D]" />Email Address <span className="text-red-500">*</span></Label>
                          <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={cn("bg-white border-2 rounded-lg md:rounded-xl transition-all h-12 md:h-14 text-sm sm:text-base", focusedField === 'email' ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10' : 'border-gray-300 hover:border-gray-400')} placeholder="john@example.com" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-[#F16112]" />Phone Number <span className="text-red-500">*</span></Label>
                        <div className={cn(
                          "flex items-center gap-0 border-2 rounded-lg md:rounded-xl bg-white overflow-hidden transition-all",
                          phoneError ? 'border-red-500 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/10' : 'border-gray-300 focus-within:border-[#F16112] focus-within:ring-2 focus-within:ring-[#F16112]/10'
                        )}>
                          <CountryCodeSelector 
                            value={formData.countryCode} 
                            onChange={handleCountryCodeChange} 
                            className={cn("flex-shrink-0", focusedField === 'phone' && 'border-[#F16112]')}
                          />
                          <div className="w-px h-8 md:h-10 bg-gray-300 flex-shrink-0"></div>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={formData.phone} 
                            onChange={(e) => handleInputChange('phone', e.target.value)} 
                            onFocus={() => setFocusedField('phone')} 
                            onBlur={() => {
                              setFocusedField(null);
                              handlePhoneBlur();
                            }}
                            className={cn(
                              "bg-transparent border-0 rounded-none transition-all flex-1 h-12 md:h-14 text-sm sm:text-base text-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0",
                              phoneError && "text-red-600"
                            ).trim()} 
                            placeholder={getPhonePlaceholder(getCountryIso2(formData.countryCode))} 
                            required
                            suppressHydrationWarning
                          />
                        </div>
                        {phoneError && (
                          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {phoneError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/5 rounded-xl md:rounded-2xl border-2 border-[#F16112]/10">
                      <div className="flex items-center gap-2 sm:gap-3 pb-3 md:pb-4 border-b-2 border-[#F16112]/20">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-lg md:rounded-xl"><GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                        <div><h3 className="text-gray-900 text-lg sm:text-xl">Student Information</h3><p className="text-xs sm:text-sm text-gray-500">Tell us about your child</p></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="studentName" className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#F16112]" />Student Name <span className="text-red-500">*</span></Label>
                          <Input id="studentName" type="text" value={formData.studentName} onChange={(e) => handleInputChange('studentName', e.target.value)} onFocus={() => setFocusedField('studentName')} onBlur={() => setFocusedField(null)} className={cn("bg-white border-2 rounded-lg md:rounded-xl transition-all h-12 md:h-14 text-sm sm:text-base", focusedField === 'studentName' ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10' : 'border-gray-300 hover:border-gray-400')} placeholder="Jane Doe" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="grade" className="text-gray-700 font-medium text-sm sm:text-base flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#1F396D]" />Grade / Level <span className="text-red-500">*</span></Label>
                          <Select onValueChange={(value) => handleInputChange('grade', value)} required>
                            <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg md:rounded-xl hover:border-gray-400 transition-all h-12 md:h-14 text-sm sm:text-base">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">
                              {grades.map((grade) => (
                                <SelectItem key={grade} value={grade} className="hover:bg-[#F16112]/10 py-3">{grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-xl md:rounded-2xl border-2 border-[#1F396D]/10">
                      <div className="flex items-center gap-2 sm:gap-3 pb-3 md:pb-4 border-b-2 border-[#1F396D]/20">
                        <div className="p-2 sm:p-3 bg-gradient-to-br from-[#1F396D] to-[#F16112] rounded-lg md:rounded-xl"><BookMarked className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                        <div><h3 className="text-gray-900 text-lg sm:text-xl">Assessment Preferences</h3><p className="text-xs sm:text-sm text-gray-500">Customize your assessment experience</p></div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="assessmentType" className="text-gray-700 font-medium text-base flex items-center gap-2"><Target className="w-4 h-4 text-[#F16112]" />Assessment Type <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(value) => handleInputChange('assessmentType', value)} required>
                          <SelectTrigger className="bg-white border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all h-14 text-base"><SelectValue placeholder="Select assessment type" /></SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">
                            {assessmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="hover:bg-[#F16112]/10 py-4 text-base">
                                <div className="flex items-center w-full gap-4">
                                  <span className="flex items-center gap-2">
                                    <span>{type.icon}</span>
                                    {type.label ?? type.value}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium mb-3 md:mb-4 block flex items-center gap-2 text-sm sm:text-base"><CheckSquare className="w-4 h-4 text-[#F16112]" />Areas of Focus <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                          {availableSubjects.map((subject) => {
                            const isSelected = Array.isArray(formData.subjects) && formData.subjects.includes(subject.value);
                            
                            return (
                              <div 
                                key={subject.value} 
                                className={cn(
                                  "flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-white rounded-lg md:rounded-xl border-2 transition-all cursor-pointer",
                                  isSelected 
                                    ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-md' 
                                    : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-sm'
                                )}
                              >
                                <Checkbox 
                                  id={subject.value} 
                                  checked={isSelected} 
                                  onCheckedChange={handlersRef.current[subject.value]}
                                  className="border-2 border-gray-400 data-[state=checked]:bg-[#F16112] data-[state=checked]:border-[#F16112] w-5 h-5 flex-shrink-0" 
                                  suppressHydrationWarning
                                />
                                <Label 
                                  htmlFor={subject.value} 
                                  className="cursor-pointer text-gray-700 font-medium flex-1 flex items-center gap-2"
                                >
                                  <span>{subject.icon}</span>{subject.value}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-3 md:space-y-4">
                          <Label className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"><Globe className="w-4 h-4 text-[#1F396D]" />Preferred Mode <span className="text-red-500">*</span></Label>
                          <RadioGroup value={formData.mode} onValueChange={(value) => handleInputChange('mode', value)} className="flex flex-col gap-3 md:gap-4">
                            <div onClick={() => handleInputChange('mode', 'in-person')} className={cn("flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg md:rounded-xl border-2 transition-all cursor-pointer", formData.mode === 'in-person' ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-md' : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-sm')}>
                              <RadioGroupItem value="in-person" id="in-person" className="border-2 border-gray-400 text-[#F16112] w-5 h-5 pointer-events-none" />
                              <Label htmlFor="in-person" className="cursor-pointer text-gray-700 font-medium text-sm sm:text-base flex-1 pointer-events-none">In-person at {CONTACT_INFO.city}</Label>
                            </div>
                            <div onClick={() => handleInputChange('mode', 'online')} className={cn("flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg md:rounded-xl border-2 transition-all cursor-pointer", formData.mode === 'online' ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5 shadow-md' : 'border-gray-300 hover:border-[#F16112]/30 hover:shadow-sm')}>
                              <RadioGroupItem value="online" id="online" className="border-2 border-gray-400 text-[#F16112] w-5 h-5 pointer-events-none" />
                              <Label htmlFor="online" className="cursor-pointer text-gray-700 font-medium text-sm sm:text-base flex-1 flex items-center gap-2 pointer-events-none"><Video className="w-4 h-4" />Online (Virtual)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"><Calendar className="w-4 h-4 text-[#F16112]" />Preferred Schedule <span className="text-red-500">*</span></Label>
                          <Select onValueChange={(value) => handleInputChange('schedule', value)} required>
                            <SelectTrigger className="bg-white border-2 border-gray-300 rounded-lg md:rounded-xl hover:border-gray-400 transition-all h-12 md:h-14 text-sm sm:text-base">
                              <SelectValue placeholder="Select preferred time" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-2xl">
                              {scheduleOptions.map((option) => (
                                <SelectItem key={option} value={option} className="hover:bg-[#F16112]/10 py-3">{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:space-y-6 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl md:rounded-2xl border-2 border-blue-200/50">
                      <div className="flex items-center gap-2 sm:gap-3 pb-3 md:pb-4 border-b-2 border-blue-300/50">
                        <div className="p-2 sm:p-3 bg-blue-500 rounded-lg md:rounded-xl"><MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                        <div><h3 className="text-gray-900 text-lg sm:text-xl">Additional Information</h3><p className="text-xs sm:text-sm text-gray-600">Any special requirements or questions?</p></div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-gray-700 font-medium flex items-center gap-2 text-sm sm:text-base"><PenTool className="w-4 h-4 text-blue-600" />Special Requirements or Questions (Optional)</Label>
                        <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} onFocus={() => setFocusedField('notes')} onBlur={() => setFocusedField(null)} className={cn("bg-white border-2 rounded-lg md:rounded-xl transition-all min-h-[100px] sm:min-h-[140px] resize-none text-sm sm:text-base", focusedField === 'notes' ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10' : 'border-gray-300 hover:border-gray-400')} placeholder="Let us know if you have any specific concerns or questions about the assessment..." />
                      </div>
                    </div>

                    {/* Privacy & Data Protection */}
                    <div className="space-y-4 p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl md:rounded-2xl border border-gray-200">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2.5 sm:p-3 bg-[#1F396D] rounded-xl flex-shrink-0">
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold text-lg sm:text-xl mb-1">Privacy & Data Protection</h3>
                          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">We only use your personal information to provide the requested services. From time to time, we may contact you about programs and content that may be of interest.</p>
                        </div>
                      </div>
                    </div>

                    {/* Communication Consent */}
                    <div className="space-y-4 p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl md:rounded-2xl border border-gray-200">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <Checkbox
                          id="agreeToCommunications"
                          checked={agreeToCommunications}
                          onCheckedChange={(checked) => {
                            setAgreeToCommunications(checked === true);
                            if (checked === true && formErrors.agreeToCommunications) {
                              setFormErrors((prev) => {
                                const next = { ...prev };
                                delete next.agreeToCommunications;
                                return next;
                              });
                            }
                          }}
                          className={cn(
                            "mt-0.5 border-2 border-gray-400 data-[state=checked]:bg-[#1F396D] data-[state=checked]:border-[#1F396D] w-5 h-5 flex-shrink-0",
                            formErrors.agreeToCommunications && "border-red-500"
                          )}
                          suppressHydrationWarning
                        />
                        <Label htmlFor="agreeToCommunications" className="cursor-pointer text-gray-700 text-sm sm:text-base leading-relaxed flex-1">
                          I agree to receive communications from GrowWise about academic programs, updates, and educational content.
                        </Label>
                      </div>
                      {formErrors.agreeToCommunications && (
                        <p className="text-sm text-red-600 flex items-center gap-1 pl-8 sm:pl-12">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {formErrors.agreeToCommunications}
                        </p>
                      )}
                    </div>

                    {/* Form Validation Errors Summary */}
                    {Object.keys(formErrors).length > 0 && (
                      <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-red-800 font-semibold text-sm sm:text-base mb-2">
                              Please fix the following issues to submit the form:
                            </h3>
                            <ul className="space-y-1.5 text-sm text-red-700">
                              {formErrors.parentName && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Parent Name:</strong> {formErrors.parentName}</span>
                                </li>
                              )}
                              {formErrors.email && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Email:</strong> {formErrors.email}</span>
                                </li>
                              )}
                              {formErrors.phone && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Phone Number:</strong> {formErrors.phone}</span>
                                </li>
                              )}
                              {formErrors.studentName && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Student Name:</strong> {formErrors.studentName}</span>
                                </li>
                              )}
                              {formErrors.grade && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Grade:</strong> {formErrors.grade}</span>
                                </li>
                              )}
                              {formErrors.assessmentType && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Assessment Type:</strong> {formErrors.assessmentType}</span>
                                </li>
                              )}
                              {formErrors.mode && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Mode:</strong> {formErrors.mode}</span>
                                </li>
                              )}
                              {formErrors.schedule && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Schedule:</strong> {formErrors.schedule}</span>
                                </li>
                              )}
                              {formErrors.agreeToCommunications && (
                                <li className="flex items-center gap-2">
                                  <X className="w-4 h-4" />
                                  <span><strong>Consent:</strong> {formErrors.agreeToCommunications}</span>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Error Message */}
                    {errorMessage && (
                      <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl md:rounded-2xl">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-red-700 text-sm sm:text-base">{errorMessage}</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 md:pt-4">
                      <Button type="submit" disabled={isSubmitting || !agreeToCommunications || Object.keys(formErrors).length > 0} className="w-full bg-gradient-to-r from-[#F16112] via-[#F1894F] to-[#F16112] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white h-14 md:h-16 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl hover:shadow-xl transition-all duration-500 disabled:opacity-50 text-base md:text-lg font-semibold group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {isSubmitting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full mr-3"></div>
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
                      {errorMessage && (
                        <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                          <p className="text-red-700 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {errorMessage}
                          </p>
                        </div>
                      )}
                      <p className="text-center text-gray-500 mt-6 flex items-center justify-center gap-2"><Shield className="w-4 h-4 text-green-600" />By submitting, you agree to be contacted by GrowWise School</p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-20">
                    <div className="w-28 h-28 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"><CheckCircle className="w-14 h-14 text-white" /></div>
                    <p className="text-green-700 font-semibold mb-2">Submission completed successfully.</p>
                    <h3 className="text-gray-900 mb-6 text-4xl">🎉 Thank You for Your Request!</h3>
                    <p className="text-gray-600 max-w-lg mx-auto mb-10 text-xl leading-relaxed">We've received your free assessment booking request. Our team will contact you within 24 hours to confirm your appointment.</p>
                    <div className="space-y-4">
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
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, text: '24-hour response time guaranteed', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, text: 'SSL Encrypted & 100% Secure', color: 'from-green-500 to-green-600' },
              { icon: Award, text: 'Certified Expert Evaluators', color: 'from-purple-500 to-purple-600' }
            ].map((item, index) => {
              const IconComponent = item.icon as any;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex p-5 bg-gradient-to-r ${item.color} rounded-2xl shadow-xl mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-white to-[#F16112] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-[700px] h-[700px] bg-gradient-to-br from-[#F16112] to-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div>
              <Badge className="mb-8 bg-white/20 backdrop-blur-xl text-white border-2 border-white/30 px-8 py-3 shadow-2xl">
                <Sparkles className="w-5 h-5 mr-2" />
                Professional Assessment Services
              </Badge>
            </div>
            <h1 className="text-white mb-8 text-5xl lg:text-6xl">
              Discover Your Child's <br />
              <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Academic Potential</span>
            </h1>
            <p className="text-white/90 max-w-3xl mx-auto mb-12 text-xl leading-relaxed">
              Get a comprehensive evaluation from certified educators. Understand strengths, identify growth areas, and receive a personalized learning roadmap for your child's success.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-12">
              <Button onClick={scrollToForm} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#d54f0a] hover:to-[#F16112] text-white px-8 sm:px-10 py-6 sm:py-7 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 group text-base sm:text-lg w-full sm:w-auto">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:rotate-12 transition-transform" />
                Book Free Assessment
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={() => setIsExploreCoursesModalOpen(true)} variant="outline" className="border-2 border-white bg-white/20 text-white hover:bg-white hover:text-[#1F396D] px-8 sm:px-10 py-6 sm:py-7 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl text-base sm:text-lg w-full sm:w-auto">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Explore Courses
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon as any;
                return (
                  <div key={index}>
                    <Card className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-3">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto"><path fill="#F9FAFB" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path></svg>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#1F396D] to-[#F16112] text-white border-0 px-6 py-2">Parent Reviews</Badge>
            <h2 className="text-gray-900 mb-4">What Parents Are Saying</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Hear from families who have benefited from our assessment services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <Card className="bg-white backdrop-blur-xl border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-6">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#F16112] text-[#F16112]" />))}</div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed text-base">"{testimonial.content}"</p>
                    <div className="border-t-2 border-gray-100 pt-6"><p className="font-bold text-gray-900 text-lg">{testimonial.name}</p><p className="text-sm text-gray-500 mt-1">{testimonial.role}</p></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">Why Choose Us</Badge>
            <h2 className="text-gray-900 mb-4">Why GrowWise Assessments?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">We combine expertise, technology, and personalized attention to deliver exceptional results</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Award, title: 'Expert Educators', description: 'Certified teachers with 10+ years of experience in academic assessment and curriculum design', color: 'from-[#F16112] to-[#F1894F]' },
              { icon: Brain, title: 'Comprehensive Analysis', description: 'In-depth evaluation covering multiple dimensions of academic performance and learning styles', color: 'from-[#1F396D] to-[#29335C]' },
              { icon: TrendingUp, title: 'Actionable Roadmap', description: 'Personalized learning path with specific recommendations for academic growth and success', color: 'from-[#F1894F] to-[#1F396D]' }
            ].map((item, index) => {
              const IconComponent = item.icon as any;
              return (
                <div key={index}>
                  <Card className="bg-white backdrop-blur-xl border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-300 h-full group">
                    <CardContent className="p-10 text-center">
                      <div className={`inline-flex p-6 bg-gradient-to-r ${item.color} rounded-3xl mb-6 shadow-2xl group-hover:shadow-xl transition-all`}>
                        <IconComponent className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-gray-900 mb-4 group-hover:text-[#F16112] transition-colors text-xl">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-base">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-[#1F396D] via-[#29335C] to-[#1F396D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div><div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#F16112] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div>
            <h2 className="text-white mb-6 text-4xl lg:text-5xl">Ready to Unlock Your Child's Potential?</h2>
            <p className="text-white/90 mb-10 text-xl leading-relaxed">Book a free assessment today and get personalized insights into your child's academic journey</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button onClick={scrollToForm} className="bg-white text-[#1F396D] hover:bg-gray-100 px-10 py-7 rounded-2xl shadow-2xl hover:shadow-xl transition-all duration-200 hover:scale-105 group text-lg"><Calendar className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />Book Free Assessment<ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" /></Button>
              <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 rounded-2xl transition-all duration-200 text-lg backdrop-blur-xl"><PhoneIcon className="w-5 h-5 mr-2" />{CONTACT_INFO.phone}</Button>
            </div>
          </div>
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

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { BACKEND_URL } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle, User, Mail, Phone as PhoneIcon, GraduationCap, MapPin, Target, BookOpen, Code } from 'lucide-react';
import { useFormTracking, usePageTracking } from '@/lib/analytics/hooks';
import { TrackedForm } from '@/lib/analytics/components';

export default function EnrollPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [agree, setAgree] = useState(false);
  const [programType, setProgramType] = useState<'academic' | 'steam' | undefined>(undefined);
  const [bootcamp, setBootcamp] = useState<string | undefined>(undefined);
  const [course, setCourse] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Analytics hooks
  usePageTracking('Enrollment Page');
  const { trackFormStart, trackFormSubmit, trackFormAbandon } = useFormTracking();

  // Memoize checkbox handler to prevent infinite loops
  const handleAgreeChange = useCallback((checked: boolean | 'indeterminate') => {
    setAgree(checked === true);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Track form start
    trackFormStart('enrollment_form');

    try {
      const formData = new FormData(e.currentTarget);
      const enrollmentData = {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        city: formData.get('city') as string,
        postal: formData.get('postal') as string,
        bootcamp: programType === 'steam' ? (bootcamp || 'None') : 'None',
        course: programType === 'academic' ? (course || 'None') : 'None',
        level: level as string,
        agree: agree
      };

      const response = await fetch(`${BACKEND_URL}/api/enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitStatus('error');
        setErrorMessage(result.error || result.message || `Server error (${response.status})`);
        return;
      }

      if (result.success) {
        setSubmitStatus('success');
        // Track successful form submission
        trackFormSubmit('enrollment_form', true);
        
        // Reset form by clearing all state and form fields
        setAgree(false);
        setProgramType(undefined);
        setBootcamp(undefined);
        setCourse(undefined);
        setLevel(undefined);
        
        // Reset form fields using ref
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle');
        }, 5000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit enrollment');
        // Track failed form submission
        trackFormSubmit('enrollment_form', false, result.error);
      }
    } catch (error) {
      console.error('Enrollment submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
      // Track failed form submission due to network error
      trackFormSubmit('enrollment_form', false, 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Simple hero header to match other pages */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">Register for Assessment</h1>
            <p className="text-white/90 max-w-2xl mx-auto">Please fill out the form below and our advisors will contact you within 24 hours.</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="text-green-800 font-semibold">Enrollment Successful!</h3>
              <p className="text-green-700 text-sm">Thank you for enrolling with GrowWise. We will contact you within 24 hours.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-red-800 font-semibold">Enrollment Failed</h3>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <TrackedForm 
          ref={formRef} 
          formName="enrollment_form"
          onSubmit={handleSubmit} 
          className="bg-white/95 backdrop-blur-xl border-2 border-white/60 ring-1 ring-white/30 rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Section: Applicant Information */}
          <div className="space-y-6 p-8 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-2xl border-2 border-[#1F396D]/10 mb-8">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-[#1F396D]/20">
              <div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-xl"><User className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-gray-900">Applicant Information</h3>
                <p className="text-sm text-gray-500">Tell us how we can reach you</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2"><User className="w-4 h-4 text-[#F16112]" />Your Full Name <span className="text-red-500">*</span></Label>
                <Input id="fullName" name="fullName" placeholder="Your full name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#1F396D]" />Email <span className="text-red-500">*</span></Label>
                <Input id="email" name="email" type="email" placeholder="Email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 text-[#F16112]" />Mobile phone number <span className="text-red-500">*</span></Label>
                <Input id="mobile" name="mobile" type="tel" placeholder="Mobile phone number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1F396D]" />City <span className="text-red-500">*</span></Label>
                <Input id="city" name="city" placeholder="City" required />
              </div>
            </div>
          </div>

          {/* Section: Program Preferences */}
          <div className="space-y-6 p-8 bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/5 rounded-2xl border-2 border-[#F16112]/10 mb-8">
            <div className="flex items-center gap-3 pb-4 border-b-2 border-[#F16112]/20">
              <div className="p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-xl"><GraduationCap className="w-5 h-5 text-white" /></div>
              <div>
                <h3 className="text-gray-900">Program Preferences</h3>
                <p className="text-sm text-gray-500">Choose the area and level you are interested in</p>
              </div>
            </div>

            {/* Program type: Academic or STEAM */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700">Program type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setProgramType('academic'); setBootcamp(undefined); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    programType === 'academic'
                      ? 'border-[#1F396D] bg-[#1F396D]/10 ring-2 ring-[#1F396D]/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${programType === 'academic' ? 'bg-[#1F396D] text-white' : 'bg-[#1F396D]/10 text-[#1F396D]'}`}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Academic</span>
                    <p className="text-sm text-gray-500">Math, ELA, Writing Lab, SAT/ACT Prep</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => { setProgramType('steam'); setCourse(undefined); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    programType === 'steam'
                      ? 'border-[#F16112] bg-[#F16112]/10 ring-2 ring-[#F16112]/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${programType === 'steam' ? 'bg-[#F16112] text-white' : 'bg-[#F16112]/10 text-[#F16112]'}`}>
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">STEAM</span>
                    <p className="text-sm text-gray-500">Python, ML/AI, Game Development</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic: Course dropdown */}
              {programType === 'academic' && (
                <div className="space-y-2">
                  <Label htmlFor="course" className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#1F396D]" />Course <span className="text-red-500">*</span></Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger id="course">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Math Courses</SelectItem>
                      <SelectItem value="english">ELA / English Courses</SelectItem>
                      <SelectItem value="writing">Writing Lab</SelectItem>
                      <SelectItem value="sat-act">SAT / ACT Prep</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="course" value={course ?? ''} />
                </div>
              )}
              {/* STEAM: Bootcamp dropdown */}
              {programType === 'steam' && (
                <div className="space-y-2">
                  <Label htmlFor="bootcamp" className="flex items-center gap-2"><Target className="w-4 h-4 text-[#F16112]" />Program <span className="text-red-500">*</span></Label>
                  <Select value={bootcamp} onValueChange={setBootcamp}>
                    <SelectTrigger id="bootcamp">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python Programming</SelectItem>
                      <SelectItem value="ml-ai">ML / AI</SelectItem>
                      <SelectItem value="game-dev">Game Development</SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="bootcamp" value={bootcamp ?? ''} />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="level" className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-[#F16112]" />Level <span className="text-red-500">*</span></Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Please Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high">High School</SelectItem>
                    <SelectItem value="test-prep">Test Prep</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" name="level" value={level ?? ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal" className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1F396D]" />Postal code</Label>
                <Input id="postal" name="postal" placeholder="Postal code" />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-500">
              GrowWise is committed to protecting and respecting your privacy, and we'll only use your personal
              information to provide the products and services you requested from us. From time to time, we would
              like to contact you about our products and services, as well as other content that may be of interest to you.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2">
            <Checkbox id="agree" checked={agree} onCheckedChange={handleAgreeChange} />
            <Label htmlFor="agree" className="text-sm text-gray-700">I agree to receive communications from GrowWise.</Label>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500">
              By clicking submit below, you consent to allow GrowWise to store and process the personal information submitted above to provide you the content requested.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              type="submit" 
              disabled={
                !agree ||
                isSubmitting ||
                !level ||
                !programType ||
                (programType === 'academic' && !course) ||
                (programType === 'steam' && !bootcamp)
              } 
              className="w-full md:w-auto bg-gradient-to-r from-[#1F396D] via-[#29335C] to-[#1F396D] text-white rounded-2xl px-8 py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Enrollment...
                </>
              ) : (
                'Register for Assessment'
              )}
            </Button>
          </div>
        </TrackedForm>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {["SSL Encrypted & Secure", "24-Hour Response", "Trusted by 5,000+ Families"].map((txt) => (
            <div key={txt} className="bg-white/70 backdrop-blur-xl border-2 border-white/60 rounded-2xl p-4 text-gray-700 font-semibold">
              {txt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



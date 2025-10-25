'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function EnrollPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [agree, setAgree] = useState(false);
  const [bootcamp, setBootcamp] = useState<string | undefined>(undefined);
  const [course, setCourse] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData(e.currentTarget);
      const enrollmentData = {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        mobile: formData.get('mobile') as string,
        city: formData.get('city') as string,
        postal: formData.get('postal') as string,
        bootcamp: bootcamp || 'None',
        course: course || 'None',
        level: level as string,
        agree: agree
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/enrollment`, {
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
        // Reset form by clearing all state
        setAgree(false);
        setBootcamp(undefined);
        setCourse(undefined);
        setLevel(undefined);
        // Reset form fields using ref
        if (formRef.current) {
          formRef.current.reset();
        }
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit enrollment');
      }
    } catch (error) {
      console.error('Enrollment submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Register for Professional Courses</h1>
          <p className="text-gray-600 mt-2">Please fill out the form below and we will get back to you shortly.</p>
        </div>

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

        <form ref={formRef} onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-xl border-2 border-white/60 ring-1 ring-white/30 rounded-2xl shadow-[0_20px_60px_rgba(31,57,109,0.15)] p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Your Full Name *</Label>
              <Input id="fullName" name="fullName" placeholder="Your full name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bootcamp">Bootcamps</Label>
              <Select value={bootcamp} onValueChange={setBootcamp}>
                <SelectTrigger id="bootcamp">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="python">Python Programming</SelectItem>
                  <SelectItem value="ml-ai">ML / AI</SelectItem>
                  <SelectItem value="game-dev">Game Development</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="bootcamp" value={bootcamp ?? ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Courses</Label>
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

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile phone number *</Label>
              <Input id="mobile" name="mobile" type="tel" placeholder="Mobile phone number" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
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
              <Label htmlFor="city">City *</Label>
              <Input id="city" name="city" placeholder="City" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" placeholder="Email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal">Postal code</Label>
              <Input id="postal" name="postal" placeholder="Postal code" />
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
            <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
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
              disabled={!agree || isSubmitting} 
              className="w-full md:w-auto bg-[#1F396D] hover:bg-[#29335C] text-white rounded-full px-8 py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Enrollment...
                </>
              ) : (
                'Register for Professional Courses'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}



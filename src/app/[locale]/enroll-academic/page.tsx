"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Users, Shield, Star, Send, Target, Clock, Award } from "lucide-react";
import { PHONE_PLACEHOLDER } from '@/lib/constants';

interface EnrollFormData {
  parentName: string;
  studentName: string;
  subject: string;
  grade: string;
  mobilePhone: string;
  email: string;
  city: string;
  postalCode: string;
  agreeToContact: boolean;
}

export default function EnrollAcademicPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EnrollFormData>({
    parentName: "",
    studentName: "",
    subject: "",
    grade: "",
    mobilePhone: "",
    email: "",
    city: "",
    postalCode: "",
    agreeToContact: false,
  });

  const subjects = [
    { value: "Math", label: "Math" },
    { value: "English", label: "English" },
    { value: "High School Math", label: "High School Math" },
    { value: "SAT Prep", label: "SAT Prep" },
  ];

  const grades = [
    "Kindergarten",
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const handleInputChange = (field: keyof EnrollFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map form data to backend API format
      const enrollmentData = {
        fullName: formData.studentName || formData.parentName, // Use student name, fallback to parent name
        email: formData.email,
        mobile: formData.mobilePhone,
        city: formData.city,
        postal: formData.postalCode,
        bootcamp: 'None', // Not used in academic enrollment
        course: formData.subject || 'None', // Map subject to course
        level: formData.grade || 'Not specified', // Map grade to level
        agree: formData.agreeToContact
      };

      // Validate required fields
      if (!enrollmentData.fullName || !enrollmentData.email || !enrollmentData.mobile || 
          !enrollmentData.city || !enrollmentData.postal || !enrollmentData.agree) {
        alert('Please fill in all required fields and agree to receive communications.');
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/enrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || `Server error (${response.status})`);
      }

      if (result.success) {
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to submit enrollment');
      }
    } catch (error) {
      console.error('Enrollment submission error:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit enrollment. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#1F396D] via-[#29335C] to-[#1F396D]">
        {/* Static glowing gradient orbs (no JS animations) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-[520px] h-[520px] bg-gradient-to-br from-white to-[#F16112] rounded-full blur-3xl opacity-15" />
          <div className="absolute bottom-20 right-10 w-[620px] h-[620px] bg-gradient-to-br from-[#F16112] to-white rounded-full blur-3xl opacity-15" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-white/20 backdrop-blur-xl text-white border-2 border-white/30 px-6 py-2">
              Start Your Academic Journey Today
            </Badge>
            <h1 className="text-white mb-6 text-4xl lg:text-6xl">
              Enroll Now – <br />
              <span className="bg-gradient-to-r from-[#F16112] to-[#F1894F] bg-clip-text text-transparent">Academic Excellence Awaits</span>
            </h1>
            <p className="text-white/90 max-w-3xl mx-auto text-lg">
              Join thousands of successful students. Register today for our comprehensive academic programs and unlock your child's full potential.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            {[
              { number: "5000+", label: "Students Enrolled" },
              { number: "98%", label: "Success Rate" },
              { number: "15+", label: "Years Experience" },
              { number: "4.9/5", label: "Average Rating" },
            ].map((s, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-white mb-1">{s.number}</div>
                  <div className="text-sm text-white/80">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto block -mb-px">
            <path fill="#FFFFFF" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">
              Why Choose GrowWise
            </Badge>
            <h2 className="text-gray-900 mb-2">Everything You Need for Success</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Clock, text: "Flexible scheduling options" },
              { icon: Target, text: "Goal-oriented curriculum" },
              { icon: Users, text: "Small group & 1:1 options" },
              { icon: Shield, text: "Secure and trusted" },
              { icon: Award, text: "Accredited programs" },
              { icon: Star, text: "Top-rated instructors" },
            ].map((b, i) => (
              <Card key={i} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100">
                <CardContent className="p-5 text-center">
                  <div className="inline-flex p-3 bg-gradient-to-br from-[#1F396D]/10 to-[#F16112]/10 rounded-2xl mb-3">
                    <b.icon className="w-6 h-6 text-[#F16112]" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium leading-snug">{b.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="enrollment-form" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white border-0 px-6 py-2">
              <GraduationCap className="w-4 h-4 mr-2" /> Registration Form
            </Badge>
            <h2 className="text-gray-900 mb-2">Complete Your Enrollment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Fill out the form below and our academic advisors will contact you within 24 hours</p>
          </div>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-white/60 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-10">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6 p-6 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 rounded-2xl border-2 border-[#1F396D]/10">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-[#1F396D]/20">
                      <div className="p-3 bg-gradient-to-br from-[#1F396D] to-[#29335C] rounded-xl">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900">Student Information</h3>
                        <p className="text-sm text-gray-500">Tell us about the student</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="parentName">Parent Name</Label>
                        <Input id="parentName" value={formData.parentName} onChange={(e) => handleInputChange("parentName", e.target.value)} placeholder="Parent's Name (Only for minors)" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student/Candidate Name <span className="text-red-500">*</span></Label>
                        <Input id="studentName" value={formData.studentName} onChange={(e) => handleInputChange("studentName", e.target.value)} placeholder="Student's Full Name" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                        <Select onValueChange={(v) => handleInputChange("subject", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Select onValueChange={(v) => handleInputChange("grade", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            {grades.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 p-6 bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/5 rounded-2xl border-2 border-[#F16112]/10">
                    <div className="flex items-center gap-3 pb-4 border-b-2 border-[#F16112]/20">
                      <div className="p-3 bg-gradient-to-br from-[#F16112] to-[#F1894F] rounded-xl">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-gray-900">Contact Details</h3>
                        <p className="text-sm text-gray-500">How can we reach you?</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="mobilePhone">Mobile Phone Number <span className="text-red-500">*</span></Label>
                        <Input id="mobilePhone" type="tel" value={formData.mobilePhone} onChange={(e) => handleInputChange("mobilePhone", e.target.value)} placeholder={PHONE_PLACEHOLDER} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="your.email@example.com" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                        <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Dublin" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                        <Input id="postalCode" value={formData.postalCode} onChange={(e) => handleInputChange("postalCode", e.target.value)} placeholder="94568" required />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl p-6 border-2 border-gray-100 bg-gray-50">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500 rounded-xl text-white">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Privacy & Data Protection</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          We only use your personal information to provide the requested services. From time to time, we may contact you about programs and content that may be of interest.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl border-2 border-gray-200">
                    <Checkbox
                      id="agreeToContact"
                      checked={formData.agreeToContact}
                      onCheckedChange={(checked) => handleInputChange("agreeToContact", checked as boolean)}
                      className="border-2 border-gray-400 data-[state=checked]:bg-[#F16112] data-[state=checked]:border-[#F16112] w-5 h-5 mt-0.5"
                      required
                    />
                    <Label htmlFor="agreeToContact" className="cursor-pointer text-gray-700 leading-relaxed flex-1">
                      I agree to receive communications from GrowWise about academic programs, updates, and educational content.
                    </Label>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#1F396D] via-[#29335C] to-[#1F396D] text-white h-14 rounded-2xl">
                      {isSubmitting ? "Processing Registration..." : (
                        <div className="flex items-center justify-center gap-2">
                          <GraduationCap className="w-5 h-5" />
                          <span>Complete Registration</span>
                          <Send className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                    <p className="text-center text-gray-500 mt-3 text-sm flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Your information is secure and will never be shared
                    </p>
                  </div>
                </form>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h3 className="text-gray-900 mb-4 text-3xl">Registration Successful!</h3>
                  <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg">
                    Thank you for enrolling! Our team will contact you within 24 hours to complete the process and answer any questions.
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={() => setIsSubmitted(false)} className="bg-gradient-to-r from-[#F16112] to-[#F1894F] text-white px-8 py-6 rounded-xl">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Enroll Another Student
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, text: "SSL Encrypted & Secure" },
              { icon: Award, text: "Accredited Programs" },
              { icon: Clock, text: "24-Hour Response Time" },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex p-4 bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 rounded-2xl mb-2">
                  <t.icon className="w-6 h-6 text-[#1F396D]" />
                </div>
                <p className="text-gray-700 font-semibold">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

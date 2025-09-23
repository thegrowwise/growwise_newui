'use client';

import React, { useState } from 'react';
import { X, CheckCircle, User, GraduationCap, BookOpen, Users, MessageSquare } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import CountryCodeSelector from "./CountryCodeSelector";

interface FreeAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  mode: string;
  schedule: string;
  notes: string;
}

const FreeAssessmentModal: React.FC<FreeAssessmentModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    studentName: '',
    grade: '',
    subjects: [],
    mode: '',
    schedule: '',
    notes: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const availableSubjects = [
    'Math', 'English', 'Coding', 'AI/ML', 'Game Development', 'Robotics', 'SAT/ACT'
  ];

  const scheduleOptions = [
    'Weekdays After School', 'Weekends Morning', 'Weekends Afternoon'
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setFormData({
      parentName: '',
      email: '',
      countryCode: '+1',
      phone: '',
      studentName: '',
      grade: '',
      subjects: [],
      mode: '',
      schedule: '',
      notes: ''
    });
    setIsSubmitted(false);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <Card className="bg-white/95 backdrop-blur-3xl rounded-[32px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.3)] border-2 border-white/60 ring-1 ring-white/30 h-full">
          <button
            onClick={resetAndClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border border-white/50 z-10"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
            <CardContent className="p-8 lg:p-12">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0px_15px_40px_rgba(241,97,18,0.4)]">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      Free Assessment
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg">
                      Get personalized learning recommendations for your child
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Parent Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Parent Name *</Label>
                          <Input
                            id="parentName"
                            type="text"
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="flex items-stretch relative">
                          <CountryCodeSelector
                            value={formData.countryCode}
                            onChange={(countryCode) => handleInputChange('countryCode', countryCode)}
                            className="flex-shrink-0"
                          />
                          <div className="w-px h-10 bg-gray-300 flex-shrink-0"></div>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-r-xl rounded-l-none focus:border-[#F16112] transition-colors flex-1 border-l-0 h-10"
                            placeholder="(555) 123-4567"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Student Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="studentName">Student Name *</Label>
                          <Input
                            id="studentName"
                            type="text"
                            value={formData.studentName}
                            onChange={(e) => handleInputChange('studentName', e.target.value)}
                            className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="grade">Grade / Level *</Label>
                          <Select onValueChange={(value) => handleInputChange('grade', value)} required>
                            <SelectTrigger className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-xl">
                              {grades.map((grade) => (
                                <SelectItem key={grade} value={grade} className="hover:bg-[#F16112]/10">
                                  {grade}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Learning Preferences
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium mb-3 block">Preferred Subject(s) *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSubjects.map((subject) => (
                              <div key={subject} className="flex items-center space-x-2">
                                <Checkbox
                                  id={subject}
                                  checked={formData.subjects.includes(subject)}
                                  onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                                  className="border-2 border-gray-300 data-[state=checked]:bg-[#F16112] data-[state=checked]:border-[#F16112]"
                                />
                                <Label htmlFor={subject} className="text-sm font-normal cursor-pointer">
                                  {subject}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-medium">Preferred Mode *</Label>
                          <RadioGroup
                            value={formData.mode}
                            onValueChange={(value) => handleInputChange('mode', value)}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="in-person"
                                id="in-person"
                                className="border-2 border-gray-300 text-[#F16112]"
                              />
                              <Label htmlFor="in-person" className="cursor-pointer">In-person</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="online"
                                id="online"
                                className="border-2 border-gray-300 text-[#F16112]"
                              />
                              <Label htmlFor="online" className="cursor-pointer">Online</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="schedule">Preferred Days/Time *</Label>
                          <Select onValueChange={(value) => handleInputChange('schedule', value)} required>
                            <SelectTrigger className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors">
                              <SelectValue placeholder="Select preferred schedule" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-xl">
                              {scheduleOptions.map((option) => (
                                <SelectItem key={option} value={option} className="hover:bg-[#F16112]/10">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Additional Information
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors min-h-[100px]"
                          placeholder="Tell us about your child's learning goals, challenges, or any specific areas of focus..."
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white rounded-xl py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] text-lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                          </div>
                        ) : (
                          <>
                            Submit for Free Assessment
                            <CheckCircle className="ml-2 w-5 h-5" />
                          </>
                        )}
                      </Button>

                      <p className="text-sm text-gray-500 text-center mt-4 leading-relaxed">
                        We respect your privacy. Your details will only be used for scheduling assessments.
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0px_20px_50px_rgba(34,197,94,0.4)]">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Thank You!
                  </h2>

                  <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md mx-auto">
                    Our team will contact you within 24 hours to confirm your free assessment.
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-[#1F396D]/10 to-[#F16112]/10 rounded-xl p-6 backdrop-blur-xl border-2 border-white/60">
                      <h3 className="font-semibold text-[#1F396D] mb-2">What happens next?</h3>
                      <ul className="text-sm text-gray-600 space-y-1 text-left">
                        <li>✓ We'll review your child's information</li>
                        <li>✓ Schedule a convenient assessment time</li>
                        <li>✓ Provide personalized learning recommendations</li>
                      </ul>
                    </div>

                    <Button
                      onClick={resetAndClose}
                      className="bg-gradient-to-r from-[#1F396D] to-[#29335C] hover:from-[#29335C] hover:to-[#1F396D] text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FreeAssessmentModal;


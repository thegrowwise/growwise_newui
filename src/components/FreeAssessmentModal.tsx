'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { publicPath } from '@/lib/publicPath';
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
import { PHONE_PLACEHOLDER } from '@/lib/constants';
import FormPrivacyConsent from '@/components/form/FormPrivacyConsent';
import { validatePhoneWithCountryCode } from '@/lib/phoneValidation';

/** Matches `assessmentTypes` value on `src/app/[locale]/book-assessment/page.tsx` for general Grades 1–12 intake. */
const DEFAULT_ASSESSMENT_TYPE = 'Complete Academic Assessment' as const;

interface FreeAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GradeKey = 'k' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
type WeekdayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
type PreferredDay = WeekdayKey | 'sunday' | '';

interface FormData {
  parentName: string;
  email: string;
  countryCode: string;
  phone: string;
  studentName: string;
  grade: GradeKey | '';
  schoolDistrict: string;
  subjects: string[];
  mode: string;
  preferredDay: PreferredDay;
  preferredTime: string;
  notes: string;
}

const FreeAssessmentModal: React.FC<FreeAssessmentModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    email: '',
    countryCode: '+1',
    phone: '',
    studentName: '',
    grade: '',
    schoolDistrict: '',
    subjects: [],
    mode: '',
    preferredDay: '',
    preferredTime: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [agreeToCommunications, setAgreeToCommunications] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitError('');
    }
  }, [isOpen]);

  const gradeOptions = useMemo(
    () =>
      (
        [
          ['k', 'assessment.grades.kindergarten'],
          ['1', 'assessment.grades.grade1'],
          ['2', 'assessment.grades.grade2'],
          ['3', 'assessment.grades.grade3'],
          ['4', 'assessment.grades.grade4'],
          ['5', 'assessment.grades.grade5'],
          ['6', 'assessment.grades.grade6'],
          ['7', 'assessment.grades.grade7'],
          ['8', 'assessment.grades.grade8'],
          ['9', 'assessment.grades.grade9'],
          ['10', 'assessment.grades.grade10'],
          ['11', 'assessment.grades.grade11'],
          ['12', 'assessment.grades.grade12'],
        ] as const
      ).map(([key, msg]) => ({ key: key as GradeKey, label: t(msg) })),
    [t]
  );

  const weekdayTimeSlots = useMemo(
    () =>
      [t('assessment.timeSlots.weekday34'), t('assessment.timeSlots.weekday45'), t('assessment.timeSlots.weekday56')],
    [t]
  );

  const sundayAssessmentSlot = useMemo(() => t('assessment.timeSlots.sunday1112'), [t]);

  const dayOptions = useMemo(
    () =>
      (
        [
          ['mon', 'assessment.days.mon'],
          ['tue', 'assessment.days.tue'],
          ['wed', 'assessment.days.wed'],
          ['thu', 'assessment.days.thu'],
          ['fri', 'assessment.days.fri'],
          ['sunday', 'assessment.days.sunday'],
        ] as const
      ).map(([value, msg]) => ({ value: value as PreferredDay, label: t(msg) })),
    [t]
  );

  const isWeekday = (d: PreferredDay): d is WeekdayKey =>
    d === 'mon' || d === 'tue' || d === 'wed' || d === 'thu' || d === 'fri';

  const timeSlotsForDay =
    formData.preferredDay === 'sunday' ? [sundayAssessmentSlot] : isWeekday(formData.preferredDay) ? weekdayTimeSlots : [];

  const availableSubjects = [
    t('assessment.subjects.math'), t('assessment.subjects.english'), t('assessment.subjects.sat')
  ];


  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as FormData));
  };

  const handlePreferredDayChange = (value: string) => {
    const day = value as PreferredDay;
    setFormData((prev) => ({
      ...prev,
      preferredDay: day,
      preferredTime: day === 'sunday' ? sundayAssessmentSlot : '',
    }));
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
    if (!formData.grade || !formData.preferredDay || !formData.preferredTime || !formData.mode.trim()) {
      return;
    }
    setSubmitError('');

    const phoneValidation = validatePhoneWithCountryCode(formData.countryCode, formData.phone);
    if (!phoneValidation.isValid) {
      setSubmitError(phoneValidation.errorMessage || 'Please enter a valid phone number.');
      return;
    }

    const dayLabel =
      dayOptions.find((d) => d.value === formData.preferredDay)?.label ?? String(formData.preferredDay);
    const schedule = `${dayLabel} — ${formData.preferredTime}`;
    const gradeLabel =
      gradeOptions.find((o) => o.key === formData.grade)?.label ?? String(formData.grade);

    const notesParts: string[] = [];
    if (formData.schoolDistrict.trim()) {
      notesParts.push(`School district: ${formData.schoolDistrict.trim()}`);
    }
    if (formData.notes.trim()) {
      notesParts.push(formData.notes.trim());
    }
    const notesCombined = notesParts.join('\n\n');

    const payload = {
      parentName: formData.parentName.trim(),
      email: formData.email.trim(),
      countryCode: formData.countryCode.trim(),
      phone: phoneValidation.e164 ?? formData.phone.trim(),
      studentName: formData.studentName.trim(),
      grade: gradeLabel,
      subjects: formData.subjects,
      assessmentType: DEFAULT_ASSESSMENT_TYPE,
      mode: formData.mode.trim(),
      schedule,
      notes: notesCombined,
      hearAboutUs: 'Website — free assessment modal (not specified)',
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: { success?: boolean; error?: string; message?: string } = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || result.message || `Request failed (${response.status})`);
        return;
      }

      if (result.success) {
        router.replace(publicPath('/book-assessment/thank-you', locale));
        resetAndClose();
        return;
      } else {
        setSubmitError(result.error || 'Failed to submit assessment booking.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFormData({
      parentName: '',
      email: '',
      countryCode: '+1',
      phone: '',
      studentName: '',
      grade: '',
      schoolDistrict: '',
      subjects: [],
      mode: '',
      preferredDay: '',
      preferredTime: '',
      notes: ''
    });
    setIsSubmitting(false);
    setSubmitError('');
    setAgreeToCommunications(false);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
        <Card className="bg-white/95 backdrop-blur-3xl rounded-[32px] shadow-[0px_40px_120px_0px_rgba(31,57,109,0.3)] border-2 border-white/60 ring-1 ring-white/30 flex flex-col min-h-0 flex-1">
          <div className="flex flex-col min-h-0 flex-1 overflow-hidden relative">
            <button
              onClick={resetAndClose}
              className="absolute top-6 right-6 w-10 h-10 bg-white/50 hover:bg-white/70 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl border border-white/50 z-10"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="overflow-y-auto max-h-[78vh] min-h-0 custom-scrollbar">
              <CardContent className="p-8 lg:p-12">
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#F16112] to-[#F1894F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0px_15px_40px_rgba(241,97,18,0.4)]">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {t('assessment.title')}
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg">
                      {t('assessment.subtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {t('assessment.form.parentName')}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">{t('assessment.form.parentName')} *</Label>
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
                          <Label htmlFor="email">{t('assessment.form.email')} *</Label>
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
                        <Label htmlFor="phone">{t('assessment.form.phone')} *</Label>
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
                            placeholder={PHONE_PLACEHOLDER}
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
                          <Label htmlFor="studentName">{t('assessment.form.studentName')} *</Label>
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
                          <Label htmlFor="grade">{t('assessment.form.grade')} *</Label>
                          <Select
                            value={formData.grade || undefined}
                            onValueChange={(value) => handleInputChange('grade', value)}
                          >
                            <SelectTrigger
                              id="grade"
                              className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors"
                            >
                              <SelectValue placeholder={t('assessment.form.grade')} />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-xl">
                              {gradeOptions.map(({ key, label }) => (
                                <SelectItem key={key} value={key} className="hover:bg-[#F16112]/10">
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schoolDistrict">{t('assessment.form.schoolDistrict')} *</Label>
                        <Textarea
                          id="schoolDistrict"
                          value={formData.schoolDistrict}
                          onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                          className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors min-h-[80px]"
                          placeholder="Enter your school district (e.g., Dublin USD, Pleasanton USD, San Ramon USD, etc.)"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#1F396D] flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Learning Preferences
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium mb-3 block">{t('assessment.form.subjects')} *</Label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="preferred-day">{t('assessment.form.preferredDays')} *</Label>
                            <Select
                              value={formData.preferredDay || undefined}
                              onValueChange={handlePreferredDayChange}
                            >
                              <SelectTrigger
                                id="preferred-day"
                                className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors"
                              >
                                <SelectValue placeholder={t('assessment.form.preferredDays')} />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-xl">
                                {dayOptions.map(({ value, label }) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="preferred-time">{t('assessment.form.preferredTime')} *</Label>
                            <Select
                              value={formData.preferredTime || undefined}
                              onValueChange={(value) => handleInputChange('preferredTime', value)}
                              disabled={!formData.preferredDay || formData.preferredDay === 'sunday'}
                            >
                              <SelectTrigger
                                id="preferred-time"
                                className="bg-white/80 backdrop-blur-xl border-2 border-gray-200 rounded-xl focus:border-[#F16112] transition-colors disabled:opacity-60"
                              >
                                <SelectValue placeholder={t('assessment.form.preferredTime')} />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-white/60 rounded-xl shadow-xl">
                                {timeSlotsForDay.map((slot) => (
                                  <SelectItem key={slot} value={slot} className="hover:bg-[#F16112]/10">
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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

                    <FormPrivacyConsent
                      checkboxId="free-assessment-agree"
                      checked={agreeToCommunications}
                      onCheckedChange={setAgreeToCommunications}
                      required
                      showSubmitDisclaimer
                      variant="compact"
                    />

                    {submitError ? (
                      <p className="text-sm text-red-600" role="alert">
                        {submitError}
                      </p>
                    ) : null}

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !agreeToCommunications ||
                          !formData.grade ||
                          !formData.preferredDay ||
                          !formData.preferredTime ||
                          !formData.mode.trim() ||
                          !formData.schoolDistrict.trim()
                        }
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
                    </div>
                  </form>
                </>
              </CardContent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default FreeAssessmentModal;


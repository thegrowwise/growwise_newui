'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  getWorkshopEventsMap,
  WORKSHOP_MONTHS,
  EVENT_TYPE_CLASSES,
  GRADES_LIST,
  HOW_DID_YOU_HEAR_OPTIONS,
  getScheduleLine,
  PROGRAM_TYPE_BADGE,
  formatProgramTime,
  type Program,
  type ProgramType
} from './workshopEvents';
import { buildGoogleCalendarUrl, buildIcsContent } from '@/lib/programs';
import FormPrivacyConsent from '@/components/form/FormPrivacyConsent';

interface CalendarDay {
  dayNum: number;
  isOtherMonth: boolean;
  dateStr: string;
  event: Program | null;
  isToday: boolean;
}

interface FormData {
  parentName: string;
  email: string;
  studentName: string;
  grade: string;
  schoolDistrict: string;
  howDidYouHear: string;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function getEventTypeForApi(program: Program): 'webinar' | 'workshop' {
  return program.type === 'webinar' ? 'webinar' : 'workshop';
}

export default function WorkshopCalendar(): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasOpenedModal, setHasOpenedModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Program | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    parentName: '',
    email: '',
    studentName: '',
    grade: '',
    schoolDistrict: '',
    howDidYouHear: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [agreeToCommunications, setAgreeToCommunications] = useState(false);

  const changeMonth = useCallback((delta: number) => {
    setCurrentMonth((m) => {
      let next = m + delta;
      if (next > 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      if (next < 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return next;
    });
  }, []);

  const eventsMap = useMemo(() => getWorkshopEventsMap(), []);

  const weeks = useMemo((): CalendarDay[][] => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const weeksOut: CalendarDay[][] = [];
    let dayCount = 1;
    let prevMonthDay = prevMonthLastDay - startDay + 1;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    for (let week = 0; week < 6; week++) {
      if (dayCount > totalDays && week > 3) break;
      const days: CalendarDay[] = [];
      for (let day = 0; day < 7; day++) {
        let dayNum: number;
        let isOtherMonth = false;
        let dateStr: string;
        if (week === 0 && day < startDay) {
          dayNum = prevMonthDay++;
          isOtherMonth = true;
          const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        } else if (dayCount > totalDays) {
          dayNum = dayCount - totalDays;
          dayCount++;
          isOtherMonth = true;
          const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
          const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
          dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        } else {
          dayNum = dayCount++;
          dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        }
        const event = isOtherMonth ? null : (eventsMap[dateStr] ?? null);
        days.push({
          dayNum,
          isOtherMonth,
          dateStr,
          event,
          isToday: dateStr === todayStr
        });
      }
      weeksOut.push(days);
    }
    return weeksOut;
  }, [currentMonth, currentYear, eventsMap]);

  const openModal = useCallback((dateStr: string) => {
    const event = eventsMap[dateStr];
    if (!event) return;
    setHasOpenedModal(true);
    setSelectedEvent(event);
    setSelectedDate(dateStr);
    setModalOpen(true);
    setFormSubmitted(false);
    setSubmitError(null);
    setFormErrors({});
    setFormData({
      parentName: '',
      email: '',
      studentName: '',
      grade: '',
      schoolDistrict: '',
      howDidYouHear: ''
    });
  }, [eventsMap]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate('');
  }, []);

  const validateForm = useCallback((): boolean => {
    const err: Partial<Record<keyof FormData, string>> = {};
    if (!formData.parentName.trim()) err.parentName = 'Required';
    if (!formData.email.trim()) err.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = 'Invalid email';
    if (!formData.studentName.trim()) err.studentName = 'Required';
    if (!formData.grade.trim()) err.grade = 'Required';
    if (!formData.schoolDistrict.trim()) err.schoolDistrict = 'Required';
    if (!formData.howDidYouHear.trim()) err.howDidYouHear = 'Required';
    setFormErrors(err);
    return Object.keys(err).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitError(null);
      if (!validateForm() || !selectedEvent) return;
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/webinar-workshop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parentName: formData.parentName.trim(),
            email: formData.email.trim(),
            studentName: formData.studentName.trim(),
            grade: formData.grade.trim(),
            schoolDistrict: formData.schoolDistrict.trim(),
            howDidYouHear: formData.howDidYouHear.trim(),
            eventType: getEventTypeForApi(selectedEvent),
            eventTitle: selectedEvent.name,
            eventDate: selectedDate,
            eventTime: formatProgramTime(selectedEvent.time),
            eventGrades: selectedEvent.grades ?? ''
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setSubmitError(data.error ?? 'Registration failed');
          return;
        }
        setFormSubmitted(true);
      } catch {
        setSubmitError('Network error. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, selectedEvent, selectedDate, validateForm]
  );

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-6 text-center">
        <h1 className="text-3xl font-bold text-[#F16112]" style={{ fontFamily: 'Georgia, serif' }}>
          Workshop Calendar
        </h1>
        <p className="text-gray-600 mt-1">Free Saturday Skill Workshops for Kids · GrowWise</p>
      </header>

      <section aria-label="Month navigation" className="flex items-center justify-center gap-6 py-6 bg-white border-b border-gray-200">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="min-w-[44px] min-h-[44px] w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#F16112] hover:text-[#F16112] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800 min-w-[200px] text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {WORKSHOP_MONTHS[currentMonth]} {currentYear}
        </h2>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="min-w-[44px] min-h-[44px] w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-[#F16112] hover:text-[#F16112] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </section>

      <main className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex justify-center gap-6 py-4 flex-wrap" role="list" aria-label="Event types">
          {(Object.entries(EVENT_TYPE_CLASSES) as [ProgramType, string][]).map(([type]) => (
            <div key={type} className="flex items-center gap-2 text-sm text-gray-600" role="listitem">
              <div className={`w-3 h-3 rounded ${type === 'reading' ? 'bg-blue-500' : type === 'math' ? 'bg-purple-500' : type === 'coding' ? 'bg-amber-500' : type === 'ai' ? 'bg-pink-500' : 'bg-emerald-500'}`} aria-hidden />
              <span>{type === 'webinar' ? 'Parent Webinar' : type === 'reading' ? 'Reading Comprehension' : type === 'math' ? 'Math Olympiad' : type === 'coding' ? 'Scratch Coding' : 'AI Studio'}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200" role="row">
            <div className="p-3 text-center text-sm font-semibold text-gray-600 border-r border-gray-200" aria-hidden />
            {WEEKDAYS.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide" role="columnheader">
                {day}
              </div>
            ))}
          </div>
          <div className="flex flex-col" role="grid" aria-label="Calendar">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-8 border-b border-gray-200 last:border-b-0" role="row">
                <div className="flex items-center justify-center border-r border-gray-200 bg-gray-50 text-gray-400 text-sm" aria-hidden />
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`min-h-[100px] p-2 border-r border-gray-100 last:border-r-0 transition-colors hover:bg-orange-50/30 ${
                      day.isOtherMonth ? 'bg-gray-50' : ''
                    } ${day.isToday ? 'bg-orange-50' : ''}`}
                    role="gridcell"
                  >
                    <span
                      className={`font-semibold text-sm mb-1 block ${
                        day.isOtherMonth
                          ? 'text-gray-300'
                          : day.isToday
                            ? 'text-white bg-[#F16112] rounded-full w-7 h-7 flex items-center justify-center'
                            : 'text-gray-800'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                    {day.event && (
                      <button
                        type="button"
                        onClick={() => openModal(day.dateStr)}
                        className={`w-full min-h-[44px] text-left px-2 py-2 rounded text-xs font-medium cursor-pointer transition-all hover:translate-x-0.5 hover:shadow-md truncate focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-1 ${EVENT_TYPE_CLASSES[day.event.type ?? 'reading']}`}
                      >
                        {day.event.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {hasOpenedModal && (
      <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent
          className="max-w-md max-h-[90vh] overflow-y-auto"
          aria-describedby={selectedEvent ? 'workshop-dialog-desc' : undefined}
        >
          {selectedEvent ? (
            <DialogTitle className="text-center">
              <span className="block text-5xl mb-3" aria-hidden>{PROGRAM_TYPE_BADGE[selectedEvent.type ?? 'reading']}</span>
              {selectedEvent.name}
            </DialogTitle>
          ) : (
            <VisuallyHidden asChild>
              <DialogTitle>Event registration</DialogTitle>
            </VisuallyHidden>
          )}
          {selectedEvent && (
            <DialogDescription id="workshop-dialog-desc">
              {formatDisplayDate(selectedDate)} · {getScheduleLine(selectedEvent)}
            </DialogDescription>
          )}
            {selectedEvent && (
              <>

                {!formSubmitted ? (
                  <>
                    <div className="flex justify-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl" aria-label="Event details">
                      <div className="text-center">
                        <div className="font-bold text-gray-800">{getScheduleLine(selectedEvent)}</div>
                        <div className="text-xs text-gray-600 uppercase">Schedule</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-800">{selectedEvent.durationMinutes} min</div>
                        <div className="text-xs text-gray-600 uppercase">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-800">{selectedEvent.grades ?? '—'}</div>
                        <div className="text-xs text-gray-600 uppercase">For</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-gray-800">{selectedEvent.seats ?? '—'}</div>
                        <div className="text-xs text-gray-600 uppercase">Seats Left</div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      <div>
                        <Label htmlFor="workshop-parentName">Parent Name *</Label>
                        <Input
                          id="workshop-parentName"
                          type="text"
                          value={formData.parentName}
                          onChange={(e) => handleInputChange('parentName', e.target.value)}
                          required
                          placeholder="Your full name"
                          className="mt-1"
                          aria-invalid={!!formErrors.parentName}
                          aria-describedby={formErrors.parentName ? 'err-parentName' : undefined}
                        />
                        {formErrors.parentName && (
                          <p id="err-parentName" className="text-sm text-red-600 mt-1" role="alert">{formErrors.parentName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="workshop-email">Email *</Label>
                        <Input
                          id="workshop-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="mt-1"
                          aria-invalid={!!formErrors.email}
                          aria-describedby={formErrors.email ? 'err-email' : undefined}
                        />
                        {formErrors.email && (
                          <p id="err-email" className="text-sm text-red-600 mt-1" role="alert">{formErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="workshop-studentName">Student Name *</Label>
                        <Input
                          id="workshop-studentName"
                          type="text"
                          value={formData.studentName}
                          onChange={(e) => handleInputChange('studentName', e.target.value)}
                          required
                          placeholder="Your child's name"
                          className="mt-1"
                          aria-invalid={!!formErrors.studentName}
                          aria-describedby={formErrors.studentName ? 'err-studentName' : undefined}
                        />
                        {formErrors.studentName && (
                          <p id="err-studentName" className="text-sm text-red-600 mt-1" role="alert">{formErrors.studentName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="workshop-grade">Grade *</Label>
                        <Select
                          value={formData.grade}
                          onValueChange={(v) => handleInputChange('grade', v)}
                          required
                        >
                          <SelectTrigger id="workshop-grade" className="mt-1" aria-invalid={!!formErrors.grade} aria-describedby={formErrors.grade ? 'err-grade' : undefined}>
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADES_LIST.map((g) => (
                              <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.grade && (
                          <p id="err-grade" className="text-sm text-red-600 mt-1" role="alert">{formErrors.grade}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="workshop-schoolDistrict">School District *</Label>
                        <Input
                          id="workshop-schoolDistrict"
                          type="text"
                          value={formData.schoolDistrict}
                          onChange={(e) => handleInputChange('schoolDistrict', e.target.value)}
                          required
                          placeholder="e.g. Dublin Unified"
                          className="mt-1"
                          aria-invalid={!!formErrors.schoolDistrict}
                          aria-describedby={formErrors.schoolDistrict ? 'err-schoolDistrict' : undefined}
                        />
                        {formErrors.schoolDistrict && (
                          <p id="err-schoolDistrict" className="text-sm text-red-600 mt-1" role="alert">{formErrors.schoolDistrict}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="workshop-howDidYouHear">How did you hear about us? *</Label>
                        <Select
                          value={formData.howDidYouHear}
                          onValueChange={(v) => handleInputChange('howDidYouHear', v)}
                          required
                        >
                          <SelectTrigger id="workshop-howDidYouHear" className="mt-1" aria-invalid={!!formErrors.howDidYouHear} aria-describedby={formErrors.howDidYouHear ? 'err-howDidYouHear' : undefined}>
                            <SelectValue placeholder="Select one" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOW_DID_YOU_HEAR_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.howDidYouHear && (
                          <p id="err-howDidYouHear" className="text-sm text-red-600 mt-1" role="alert">{formErrors.howDidYouHear}</p>
                        )}
                      </div>
                      <FormPrivacyConsent
                        checkboxId="workshop-register-agree"
                        checked={agreeToCommunications}
                        onCheckedChange={setAgreeToCommunications}
                        required
                        showSubmitDisclaimer
                        variant="compact"
                      />
                      {submitError && (
                        <p className="text-sm text-red-600" role="alert">{submitError}</p>
                      )}
                      <Button type="submit" className="w-full" disabled={isSubmitting || !agreeToCommunications}>
                        {isSubmitting ? 'Submitting…' : 'Register — It\'s Free!'}
                      </Button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5" aria-hidden>
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                      You&apos;re Registered
                    </h3>
                    <p className="text-gray-600 mb-5">We&apos;ve saved a spot. Check your email for confirmation.</p>
                    <div className="bg-gray-50 p-4 rounded-xl mb-5 text-left text-sm">
                      <div className="flex justify-between py-1.5"><span className="text-gray-600">Program</span><span className="font-semibold text-gray-800">{selectedEvent.name}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-gray-600">Schedule</span><span className="font-semibold text-gray-800">{getScheduleLine(selectedEvent)}</span></div>
                      <div className="flex justify-between py-1.5"><span className="text-gray-600">Date</span><span className="font-semibold text-gray-800">{formatDisplayDate(selectedDate)}</span></div>
                    </div>
                    <div className="flex flex-col gap-2 mb-5">
                      <Button
                        type="button"
                        asChild
                        className="w-full"
                      >
                        <a href={buildGoogleCalendarUrl(selectedEvent, selectedDate)} target="_blank" rel="noopener noreferrer">
                          Add to Google Calendar
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const ics = buildIcsContent(selectedEvent, selectedDate);
                          const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedEvent.name.replace(/\s+/g, '-')}-${selectedDate}.ics`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        Download .ics
                      </Button>
                    </div>
                    <Button type="button" variant="outline" onClick={closeModal}>Done</Button>
                  </div>
                )}
              </>
            )}
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}

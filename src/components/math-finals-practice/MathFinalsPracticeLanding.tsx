'use client'

import { useCallback, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import FormPrivacyConsent from '@/components/form/FormPrivacyConsent'
import { MATH_FINALS_PRACTICE_FAQS } from '@/data/math-finals-practice-faqs'
import {
  isMathFinalsPracticeInterest,
  type MathFinalsPracticeInterest,
} from '@/data/math-finals-practice-interest'
import {
  MATH_FINALS_PRACTICE_SUBJECTS,
  type MathFinalsPracticeSubject,
} from '@/data/math-finals-practice-subjects'
import { PHONE_PLACEHOLDER } from '@/lib/constants'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { publicPath } from '@/lib/publicPath'
import { cn } from '@/lib/utils'
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  ListChecks,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  School,
  User,
} from 'lucide-react'

const sectionClass = 'mx-auto max-w-3xl px-4 sm:px-6'
const h2Class = 'text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl'

/** Discourages password-manager extensions (LastPass, etc.) from injecting extra DOM; avoids hydration mismatch vs SSR. */
const PM_NO_INJECT = { 'data-lpignore': 'true' } as const

const HS_GRADES = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'] as const

const WHAT_TO_EXPECT_BULLETS: readonly string[] = [
  'School-aligned Quarter 4 topics preparation',
  'Fast-paced 2-hour session: 1 hour of teaching and 1 hour of practice',
  'One complimentary session per student',
  'New topics in each session; previous topics are not repeated',
]

const INTEREST_OPTIONS: ReadonlyArray<{ value: MathFinalsPracticeInterest; label: string }> = [
  {
    value: 'structured_prep',
    label: 'Request the four-session structured finals prep course',
  },
  {
    value: 'free_sunday',
    label: 'Request the complimentary Sunday finals session (12–1 pm)',
  },
]

type FormState = {
  interest: string
  parentName: string
  studentName: string
  grade: string
  school: string
  subject: string
  parentEmail: string
  parentPhone: string
  notes: string
}

const initialForm: FormState = {
  interest: '',
  parentName: '',
  studentName: '',
  grade: '',
  school: '',
  subject: '',
  parentEmail: '',
  parentPhone: '',
  notes: '',
}

export function MathFinalsPracticeLanding() {
  const router = useRouter()
  const locale = useLocale()
  const agendaInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [agree, setAgree] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const setField = useCallback(
    (k: keyof FormState, v: string) => {
      setForm((f) => ({ ...f, [k]: v }))
      setErrors((e) => {
        const n = { ...e }
        delete n[k]
        return n
      })
      if (submitError) setSubmitError(null)
    },
    [submitError],
  )

  const validate = useCallback((): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.interest || !isMathFinalsPracticeInterest(form.interest)) {
      e.interest = 'Please select which option you want.'
    }
    if (!form.parentName.trim()) e.parentName = 'Please enter the parent or guardian name.'
    if (!form.studentName.trim()) e.studentName = "Please enter the student's name."
    if (!form.grade) e.grade = 'Please select a grade level.'
    if (!MATH_FINALS_PRACTICE_SUBJECTS.includes(form.subject as MathFinalsPracticeSubject)) {
      e.subject = 'Please select a current math course.'
    }
    if (!form.parentEmail.trim()) e.parentEmail = 'Please enter an email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail.trim())) {
      e.parentEmail = 'Please enter a valid email address.'
    }
    if (!form.parentPhone.trim()) e.parentPhone = 'Please enter a phone number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!agree) {
      setSubmitError('Please agree to the communications opt-in to submit this form.')
      return
    }
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.set('interest', form.interest)
      fd.set('parentName', form.parentName.trim())
      fd.set('studentName', form.studentName.trim())
      fd.set('grade', form.grade)
      fd.set('school', form.school.trim())
      fd.set('subject', form.subject)
      fd.set('parentEmail', form.parentEmail.trim())
      fd.set('parentPhone', form.parentPhone.trim())
      fd.set('notes', form.notes.trim())
      const file = agendaInputRef.current?.files?.[0]
      if (file && file.size > 0) {
        fd.set('q4Agenda', file)
      }

      const res = await fetch('/api/math-finals-practice', {
        method: 'POST',
        body: fd,
      })
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; error?: string; message?: string }
      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        return
      }
      if (data.success) {
        setForm(initialForm)
        if (agendaInputRef.current) agendaInputRef.current.value = ''
        router.push(publicPath('/math-finals-practice-session/thank-you', locale))
      } else {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-slate-50/80 text-slate-800">
      {/* 1. Hero */}
      <section
        className="border-b border-slate-200/80 bg-white pb-16 pt-14 sm:pb-24 sm:pt-20"
        aria-labelledby="math-finals-hero-title"
      >
        <div className={cn(sectionClass, 'max-w-4xl text-center')}>
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span>GrowWise In-center</span>
            <span className="h-1 w-1 rounded-full bg-slate-400" aria-hidden />
            <span>Sunday 12–1 pm</span>
          </div>
          <h1
            id="math-finals-hero-title"
            className="mt-6 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            High School Math Finals Practice in Dublin, CA
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            One complimentary hour of exam-style practice covering <strong>Algebra 1</strong>, <strong>Geometry</strong>,
            <strong> Algebra 2</strong>, and <strong>Pre-Calculus</strong>. This session is dedicated to finals-style
            review—not foundational tutoring.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-[#F16112]">
            Strictly limited to one complimentary session per student.
          </p>
          <div className="mt-10 flex w-full max-w-2xl flex-col items-center justify-center gap-3 sm:mx-auto sm:flex-row sm:gap-4">
            <Button
              asChild
              className="h-11 w-full max-w-[280px] rounded-full bg-gradient-to-r from-[#F16112] to-[#F1894F] px-7 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#d54f0a] hover:to-[#F16112] hover:shadow-xl sm:max-w-none sm:w-auto"
            >
              <a href="#signup">Reserve Free Practice Spot</a>
            </Button>
            <a
              href="#what-to-expect"
              className="text-center text-sm font-semibold text-slate-600 underline-offset-4 hover:underline"
            >
              What to expect
            </a>
          </div>
        </div>
      </section>

      {/* 2. What to expect — free session offer (2 hours: teach + practice) */}
      <section
        id="what-to-expect"
        className="border-b border-slate-200/80 bg-slate-50/90 py-8 sm:py-10"
        aria-labelledby="what-to-expect-heading"
      >
        <div className={cn(sectionClass, 'max-w-3xl')}>
          <h2
            id="what-to-expect-heading"
            className="text-center text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl"
          >
            What to expect in your free session
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            In-center in Dublin, CA. One complimentary session per student.
          </p>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:mt-6" role="list">
            {WHAT_TO_EXPECT_BULLETS.map((line) => (
              <li
                key={line}
                className="flex gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 text-left text-sm leading-snug text-slate-700 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#F16112]" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Signup form — Book Assessment style (navy/orange, card + gradient panels) */}
      <section
        id="signup"
        className="scroll-mt-20 py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        aria-labelledby="signup-heading"
      >
        <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden" aria-hidden>
          <div className="absolute top-20 left-4 w-72 h-72 bg-gradient-to-br from-[#1F396D]/10 to-transparent rounded-full blur-3xl sm:left-10" />
          <div className="absolute bottom-10 right-4 w-80 h-80 bg-gradient-to-br from-[#F16112]/10 to-transparent rounded-full blur-3xl sm:right-10" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <h2 id="signup-heading" className={cn(h2Class, 'text-center text-gray-900')}>
            Request Your Spot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">We’ll follow up by email or phone.</p>

          <Card className="mt-8 border-2 border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl rounded-xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-4 sm:p-6 md:p-8 lg:pt-8">
              {/* data-* attrs: keep password manager extensions from injecting DOM (hydration mismatch vs SSR). */}
              <form
                onSubmit={onSubmit}
                className="space-y-6 md:space-y-8"
                noValidate
                data-lpignore="true"
                data-1p-ignore
                data-bwignore
                data-dashlane-ignore="true"
              >
                {/* Your request */}
                <div className="space-y-4 rounded-xl md:rounded-2xl border-2 border-[#1F396D]/10 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-[#1F396D]/20 pb-3 md:pb-4">
                    <div className="rounded-lg bg-gradient-to-br from-[#1F396D] to-[#29335C] p-2 sm:rounded-xl sm:p-3">
                      <ListChecks className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 sm:text-xl">Your request</h3>
                      <p className="text-xs text-gray-500 sm:text-sm">Structured prep (paid) or complimentary Sunday session</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span id="interest-label" className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base">
                      <ListChecks className="h-4 w-4 shrink-0 text-[#F16112]" aria-hidden />
                      Which option would you like? <span className="text-red-500">*</span>
                    </span>
                    <RadioGroup
                      value={form.interest || undefined}
                      onValueChange={(v) => setField('interest', v)}
                      className="flex flex-col gap-2.5"
                      aria-labelledby="interest-label"
                    >
                      {INTEREST_OPTIONS.map(({ value, label }) => (
                        <label
                          key={value}
                          htmlFor={`interest-${value}`}
                          className={cn(
                            'flex cursor-pointer gap-3 rounded-lg border-2 p-3 transition-colors md:rounded-xl md:p-3.5',
                            form.interest === value
                              ? 'border-[#F16112] bg-gradient-to-r from-[#F16112]/5 to-[#F1894F]/5'
                              : 'border-gray-200 bg-white hover:border-[#F16112]/30',
                          )}
                        >
                          <RadioGroupItem
                            value={value}
                            id={`interest-${value}`}
                            className="mt-0.5 shrink-0 border-2 border-gray-400 text-[#F16112]"
                          />
                          <span className="text-sm font-medium leading-snug text-gray-800">{label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                    {errors.interest && (
                      <p className="text-sm text-red-600" role="alert">
                        {errors.interest}
                      </p>
                    )}
                  </div>
                </div>

                {/* Parent & contact */}
                <div className="space-y-4 md:space-y-6 rounded-xl md:rounded-2xl border-2 border-[#1F396D]/10 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-[#1F396D]/20 pb-3 md:pb-4">
                    <div className="rounded-lg bg-gradient-to-br from-[#1F396D] to-[#29335C] p-2 sm:rounded-xl sm:p-3">
                      <User className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 sm:text-xl">Parent & contact</h3>
                      <p className="text-xs text-gray-500 sm:text-sm">How we reach you</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="parentName"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <User className="h-4 w-4 text-[#F16112]" aria-hidden />
                        Parent name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...PM_NO_INJECT}
                        id="parentName"
                        value={form.parentName}
                        onChange={(e) => setField('parentName', e.target.value)}
                        onFocus={() => setFocusedField('parentName')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                          focusedField === 'parentName'
                            ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                            : 'border-gray-300 hover:border-gray-400',
                          errors.parentName && 'border-red-500',
                        )}
                        autoComplete="name"
                      />
                      {errors.parentName && <p className="text-sm text-red-600">{errors.parentName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="parentEmail"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <Mail className="h-4 w-4 text-[#1F396D]" aria-hidden />
                        Parent email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...PM_NO_INJECT}
                        id="parentEmail"
                        type="email"
                        inputMode="email"
                        value={form.parentEmail}
                        onChange={(e) => setField('parentEmail', e.target.value)}
                        onFocus={() => setFocusedField('parentEmail')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                          focusedField === 'parentEmail'
                            ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                            : 'border-gray-300 hover:border-gray-400',
                          errors.parentEmail && 'border-red-500',
                        )}
                        autoComplete="email"
                      />
                      {errors.parentEmail && <p className="text-sm text-red-600">{errors.parentEmail}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="studentName"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <GraduationCap className="h-4 w-4 text-[#F16112]" aria-hidden />
                        Student name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...PM_NO_INJECT}
                        id="studentName"
                        value={form.studentName}
                        onChange={(e) => setField('studentName', e.target.value)}
                        onFocus={() => setFocusedField('studentName')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                          focusedField === 'studentName'
                            ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                            : 'border-gray-300 hover:border-gray-400',
                          errors.studentName && 'border-red-500',
                        )}
                      />
                      {errors.studentName && <p className="text-sm text-red-600">{errors.studentName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="parentPhone"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <Phone className="h-4 w-4 text-[#F16112]" aria-hidden />
                        Parent phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...PM_NO_INJECT}
                        id="parentPhone"
                        type="tel"
                        inputMode="tel"
                        placeholder={PHONE_PLACEHOLDER}
                        value={form.parentPhone}
                        onChange={(e) => setField('parentPhone', e.target.value)}
                        onFocus={() => setFocusedField('parentPhone')}
                        onBlur={() => setFocusedField(null)}
                        className={cn(
                          'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                          focusedField === 'parentPhone'
                            ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                            : 'border-gray-300 hover:border-gray-400',
                          errors.parentPhone && 'border-red-500',
                        )}
                        autoComplete="tel"
                      />
                      {errors.parentPhone && <p className="text-sm text-red-600">{errors.parentPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Course details */}
                <div className="space-y-4 md:space-y-6 rounded-xl md:rounded-2xl border-2 border-[#F16112]/10 bg-gradient-to-br from-[#F16112]/5 to-[#F1894F]/5 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-[#F16112]/20 pb-3 md:pb-4">
                    <div className="rounded-lg bg-gradient-to-br from-[#F16112] to-[#F1894F] p-2 sm:rounded-xl sm:p-3">
                      <BookOpen className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 sm:text-xl">Course details</h3>
                      <p className="text-xs text-gray-500 sm:text-sm">Grade, course, and school</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="grade-select"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <BookOpen className="h-4 w-4 text-[#1F396D]" aria-hidden />
                        Grade <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(v) => setField('grade', v)} value={form.grade || undefined}>
                        <SelectTrigger
                          {...PM_NO_INJECT}
                          id="grade-select"
                          className={cn(
                            'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                            errors.grade
                              ? 'border-red-500'
                              : 'border-gray-300 hover:border-gray-400',
                          )}
                        >
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl">
                          {HS_GRADES.map((g) => (
                            <SelectItem key={g} value={g} className="py-2.5 hover:bg-[#F16112]/10">
                              {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.grade && <p className="text-sm text-red-600">{errors.grade}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="subject-select"
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <Calculator className="h-4 w-4 text-[#F16112]" aria-hidden />
                        Current math course <span className="text-red-500">*</span>
                      </Label>
                      <Select value={form.subject || undefined} onValueChange={(v) => setField('subject', v)}>
                        <SelectTrigger
                          {...PM_NO_INJECT}
                          id="subject-select"
                          className={cn(
                            'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                            errors.subject
                              ? 'border-red-500'
                              : 'border-gray-300 hover:border-gray-400',
                          )}
                          aria-describedby="subject-hint"
                        >
                          <SelectValue placeholder="Select current course" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-white/60 bg-white/95 shadow-2xl backdrop-blur-xl">
                          {MATH_FINALS_PRACTICE_SUBJECTS.map((s) => (
                            <SelectItem key={s} value={s} className="py-2.5 hover:bg-[#F16112]/10">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p id="subject-hint" className="text-xs text-gray-500">
                        Algebra 1, Geometry, Algebra 2, or Pre-Calculus.
                      </p>
                      {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="school"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                    >
                      <School className="h-4 w-4 text-[#1F396D]" aria-hidden />
                      School (optional)
                    </Label>
                    <Input
                      {...PM_NO_INJECT}
                      id="school"
                      value={form.school}
                      onChange={(e) => setField('school', e.target.value)}
                      onFocus={() => setFocusedField('school')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        'h-12 rounded-lg border-2 bg-white text-sm transition-all sm:text-base md:rounded-xl',
                        focusedField === 'school'
                          ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                          : 'border-gray-300 hover:border-gray-400',
                      )}
                      autoComplete="organization"
                      placeholder="High school name"
                    />
                  </div>
                </div>

                {/* Optional upload & notes */}
                <div className="space-y-4 rounded-xl md:rounded-2xl border-2 border-[#1F396D]/10 bg-gradient-to-br from-[#1F396D]/5 to-[#F16112]/5 p-4 sm:p-6 md:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-[#1F396D]/20 pb-3 md:pb-4">
                    <div className="rounded-lg bg-gradient-to-br from-[#1F396D] to-[#F16112] p-2 sm:rounded-xl sm:p-3">
                      <FileText className="h-5 w-5 text-white sm:h-6 sm:w-6" aria-hidden />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900 sm:text-xl">Optional</h3>
                      <p className="text-xs text-gray-500 sm:text-sm">Helps us align the session to your class</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="q4-agenda"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                    >
                      <FileText className="h-4 w-4 text-[#F16112]" aria-hidden />
                      Upload Quarter 4 topics or class outline (optional)
                    </Label>
                    <p className="text-xs text-gray-500">PDF or image, max 5 MB.</p>
                    <input
                      {...PM_NO_INJECT}
                      ref={agendaInputRef}
                      id="q4-agenda"
                      name="q4Agenda"
                      type="file"
                      accept=".pdf,image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-[#1F396D]/10 file:to-[#F16112]/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-800 hover:file:from-[#1F396D]/15 hover:file:to-[#F16112]/15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base"
                    >
                      <MessageSquare className="h-4 w-4 text-[#1F396D]" aria-hidden />
                      Notes (optional)
                    </Label>
                    <Textarea
                      {...PM_NO_INJECT}
                      id="notes"
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setField('notes', e.target.value)}
                      onFocus={() => setFocusedField('notes')}
                      onBlur={() => setFocusedField(null)}
                      className={cn(
                        'min-h-[52px] max-h-32 resize-y rounded-lg border-2 text-sm leading-snug transition-all md:rounded-xl',
                        focusedField === 'notes'
                          ? 'border-[#F16112] shadow-md ring-2 ring-[#F16112]/10'
                          : 'border-gray-300 hover:border-gray-400',
                        'bg-white',
                      )}
                      placeholder="Anything we should know about your student or timing."
                    />
                  </div>
                </div>

                <FormPrivacyConsent
                  checkboxId="math-finals-consent"
                  checked={agree}
                  onCheckedChange={(c) => setAgree(!!c)}
                  required
                  showSubmitDisclaimer
                  variant="compact"
                  alignPrivacyWithConsent
                />
                {submitError && (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  We usually reply within <strong>one business day</strong>. Your information is only used to schedule
                  this request and follow up about GrowWise programs—you can ask us to stop anytime.
                </p>
                <div className="flex w-full justify-center">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="h-11 w-auto min-w-[8.25rem] rounded-full bg-[#1F396D] px-6 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#162a52]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-4">
              Questions parents and students usually ask before booking
            </h2>
            <p className="text-lg text-gray-600 mx-auto max-w-3xl">
              This free high school math finals practice is designed for students who want one focused, exam-style
              review session before finals. It is not a long-term tutoring program and it is not meant to reteach an
              entire course in one hour.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {MATH_FINALS_PRACTICE_FAQS.map((faq, i) => (
              <AccordionItem
                value={`q-${i}`}
                key={faq.question}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F16112]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-4 h-4 text-[#F16112]" aria-hidden />
                    </div>
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-slate-100/60 py-8">
        <div className={cn(sectionClass, 'text-center')}>
          <p className="text-sm text-slate-500">
            Questions before you sign up? Use the form above and we will respond directly.
          </p>
          <div className="mt-4 flex w-full justify-center">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-full border-2 border-[#1F396D] px-5 text-base font-semibold text-[#1F396D] hover:bg-slate-50"
            >
              <a href="#signup">Reserve Free Practice Spot</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { PHONE_PLACEHOLDER } from "@/lib/constants";
import { validatePhoneSimple } from "@/lib/phoneValidation";
import FormPrivacyConsent from "@/components/form/FormPrivacyConsent";
import { chatbotFormSource } from "@/lib/chatbotScope";
import { FIELD_MAX } from "@/lib/inputLimits";

/**
 * In-chat assessment booking form.
 *
 * Mirrors the field set used by `src/components/FreeAssessmentModal.tsx` and
 * `src/app/[locale]/book-assessment/page.tsx`, and posts to the SAME endpoint
 * (`/api/assessment`). Sends `hearAboutUs` so leads can be filtered downstream.
 */

const GRADE_OPTIONS = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"] as const;
const WEEKDAY_TIMES = ["3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM"] as const;
const SUNDAY_TIME = "11:00 AM - 12:00 PM" as const;

const DEFAULT_ASSESSMENT_TYPE = "Complete Academic Assessment" as const;

interface AssessmentState {
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  grade: string;
  mode: "in-person" | "online" | "";
  preferredDay: string;
  preferredTime: string;
  notes: string;
  _hp: string;
}

interface ChatAssessmentFormProps {
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

const initialState: AssessmentState = {
  parentName: "",
  email: "",
  phone: "",
  studentName: "",
  grade: "",
  mode: "",
  preferredDay: "",
  preferredTime: "",
  notes: "",
  _hp: "",
};

export default function ChatAssessmentForm({ onSuccess, onCancel }: ChatAssessmentFormProps) {
  const [data, setData] = useState<AssessmentState>(initialState);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof AssessmentState>(field: K, value: AssessmentState[K]) => {
    setData((prev) => {
      const next = { ...prev, [field]: value } as AssessmentState;
      if (field === "preferredDay") {
        next.preferredTime = value === "Sunday" ? SUNDAY_TIME : "";
      }
      return next;
    });
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const timeOptions = data.preferredDay === "Sunday" ? [SUNDAY_TIME] : WEEKDAY_TIMES;

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!data.parentName.trim()) next.parentName = "Required";
    if (!data.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Invalid email";
    const phoneCheck = validatePhoneSimple(data.phone);
    if (!phoneCheck.isValid) next.phone = phoneCheck.errorMessage || "Invalid phone";
    if (!data.studentName.trim()) next.studentName = "Required";
    if (!data.grade) next.grade = "Required";
    if (!data.mode) next.mode = "Required";
    if (!data.preferredDay) next.preferredDay = "Required";
    if (!data.preferredTime) next.preferredTime = "Required";
    if (!agree) next.agree = "Please agree to be contacted.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const schedule = `${data.preferredDay} — ${data.preferredTime}`;
    const payload = {
      parentName: data.parentName.trim(),
      email: data.email.trim(),
      countryCode: "+1",
      phone: data.phone.trim(),
      studentName: data.studentName.trim(),
      grade: data.grade,
      assessmentType: DEFAULT_ASSESSMENT_TYPE,
      mode: data.mode,
      schedule,
      notes: data.notes.trim() || undefined,
      hearAboutUs: chatbotFormSource("assessment"),
      _hp: data._hp,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok || json.success === false) {
        setSubmitError(json.message || json.error || `Request failed (${res.status})`);
        return;
      }
      setSubmitted(true);
      setTimeout(() => {
        onSuccess(
          `Thanks, ${data.parentName.trim()}! We'll reach out within 24 hours to confirm your free assessment for ${data.studentName.trim()}. 🎓`,
        );
      }, 650);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-800 font-medium">Assessment requested!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative bg-white/95 backdrop-blur-sm border-2 border-white/50">
      <CardContent className="p-4">
        <div
          className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
          aria-hidden
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data._hp}
            onChange={(e) => setField("_hp", e.target.value)}
          />
        </div>
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Free assessment</h3>
          <p className="text-xs text-gray-600">60 minutes — we'll suggest the right plan after.</p>
        </div>

        {submitError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="asm-parentName" className="text-xs font-medium text-gray-700">
              Parent name *
            </Label>
            <Input
              id="asm-parentName"
              value={data.parentName}
              onChange={(e) => setField("parentName", e.target.value.slice(0, FIELD_MAX.name))}
              maxLength={FIELD_MAX.name}
              className={`mt-1 ${errors.parentName ? "border-red-300" : ""}`}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.parentName && <p className="text-xs text-red-600 mt-1">{errors.parentName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="asm-email" className="text-xs font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="asm-email"
                type="email"
                value={data.email}
                onChange={(e) => setField("email", e.target.value.slice(0, FIELD_MAX.email))}
                maxLength={FIELD_MAX.email}
                className={`mt-1 ${errors.email ? "border-red-300" : ""}`}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="asm-phone" className="text-xs font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="asm-phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setField("phone", e.target.value.slice(0, FIELD_MAX.phone))}
                maxLength={FIELD_MAX.phone}
                className={`mt-1 ${errors.phone ? "border-red-300" : ""}`}
                placeholder={PHONE_PLACEHOLDER}
                disabled={isSubmitting}
                autoComplete="tel"
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="asm-studentName" className="text-xs font-medium text-gray-700">
                Student *
              </Label>
              <Input
                id="asm-studentName"
                value={data.studentName}
                onChange={(e) => setField("studentName", e.target.value.slice(0, FIELD_MAX.name))}
                maxLength={FIELD_MAX.name}
                className={`mt-1 ${errors.studentName ? "border-red-300" : ""}`}
                disabled={isSubmitting}
              />
              {errors.studentName && <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>}
            </div>
            <div>
              <Label htmlFor="asm-grade" className="text-xs font-medium text-gray-700">
                Grade *
              </Label>
              <select
                id="asm-grade"
                value={data.grade}
                onChange={(e) => setField("grade", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                  errors.grade ? "border-red-300" : "border-input"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g === "K" ? "Kindergarten" : `Grade ${g}`}
                  </option>
                ))}
              </select>
              {errors.grade && <p className="text-xs text-red-600 mt-1">{errors.grade}</p>}
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-700">Mode *</Label>
            <div className="mt-1 flex gap-3 text-sm">
              {(["in-person", "online"] as const).map((m) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="asm-mode"
                    value={m}
                    checked={data.mode === m}
                    onChange={() => setField("mode", m)}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                  />
                  <span className="capitalize">{m === "in-person" ? "In-person" : "Online"}</span>
                </label>
              ))}
            </div>
            {errors.mode && <p className="text-xs text-red-600 mt-1">{errors.mode}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="asm-day" className="text-xs font-medium text-gray-700">
                Day *
              </Label>
              <select
                id="asm-day"
                value={data.preferredDay}
                onChange={(e) => setField("preferredDay", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                  errors.preferredDay ? "border-red-300" : "border-input"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                {DAY_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.preferredDay && (
                <p className="text-xs text-red-600 mt-1">{errors.preferredDay}</p>
              )}
            </div>
            <div>
              <Label htmlFor="asm-time" className="text-xs font-medium text-gray-700">
                Time *
              </Label>
              <select
                id="asm-time"
                value={data.preferredTime}
                onChange={(e) => setField("preferredTime", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50 ${
                  errors.preferredTime ? "border-red-300" : "border-input"
                }`}
                disabled={isSubmitting || !data.preferredDay}
              >
                <option value="">Select</option>
                {timeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.preferredTime && (
                <p className="text-xs text-red-600 mt-1">{errors.preferredTime}</p>
              )}
            </div>
          </div>

          <FormPrivacyConsent
            checkboxId="chatbot-asm-agree"
            checked={agree}
            onCheckedChange={setAgree}
            error={errors.agree}
            required
            showSubmitDisclaimer={false}
            variant="compact"
          />

          <div className="flex gap-2 pt-1">
            <Button
              type="submit"
              disabled={isSubmitting || !agree}
              className="flex-1 bg-gradient-to-r from-[#F16112] to-[#F1894F] hover:from-[#F1894F] hover:to-[#F16112] text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Request assessment
                </>
              )}
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting} className="px-4">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

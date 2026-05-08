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
import { FIELD_MAX } from "@/lib/inputLimits";

/**
 * In-chat enrollment inquiry form.
 *
 * Mirrors the non-payment payload accepted by `/api/enroll` (see
 * `src/app/api/enroll/route.ts`). Required fields: fullName, email, mobile,
 * city, postal, level. Free-text `course` carries the chatbot source so leads
 * can be filtered downstream (the API does not accept a `source` field on the
 * non-payment branch).
 */

const LEVEL_OPTIONS = [
  "Elementary (K-5)",
  "Middle School (6-8)",
  "High School (9-12)",
  "College Prep / Test Prep",
] as const;

const PROGRAM_TYPES = ["Academic", "STEAM"] as const;

interface EnrollState {
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  postal: string;
  programType: string;
  course: string;
  level: string;
  _hp: string;
}

interface ChatEnrollFormProps {
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

const initialState: EnrollState = {
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  postal: "",
  programType: "",
  course: "",
  level: "",
  _hp: "",
};

export default function ChatEnrollForm({ onSuccess, onCancel }: ChatEnrollFormProps) {
  const [data, setData] = useState<EnrollState>(initialState);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof EnrollState>(field: K, value: EnrollState[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!data.fullName.trim()) next.fullName = "Required";
    if (!data.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Invalid email";
    const phoneCheck = validatePhoneSimple(data.mobile);
    if (!phoneCheck.isValid) next.mobile = phoneCheck.errorMessage || "Invalid phone";
    if (!data.city.trim()) next.city = "Required";
    if (!data.postal.trim()) next.postal = "Required";
    if (!data.level) next.level = "Required";
    if (!data.programType) next.programType = "Required";
    if (!data.course.trim()) next.course = "Tell us which course or program";
    if (!agree) next.agree = "Please agree to be contacted.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const courseField = `${data.course.trim()} (source: chatbot-enroll)`;
    const payload = {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      city: data.city.trim(),
      postal: data.postal.trim(),
      level: data.level,
      [data.programType === "STEAM" ? "bootcamp" : "course"]: courseField,
      agree: true,
      _hp: data._hp,
    };

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enroll", {
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
          `Thanks, ${data.fullName.trim()}! Our enrollment team will reach out about ${data.course.trim()} within 24 hours. 📚`,
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
          <p className="text-sm text-green-800 font-medium">Enrollment inquiry sent!</p>
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
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Enroll inquiry</h3>
          <p className="text-xs text-gray-600">Share a few details and we'll confirm next steps.</p>
        </div>

        {submitError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="enroll-fullName" className="text-xs font-medium text-gray-700">
              Full name *
            </Label>
            <Input
              id="enroll-fullName"
              value={data.fullName}
              onChange={(e) => setField("fullName", e.target.value.slice(0, FIELD_MAX.name))}
              maxLength={FIELD_MAX.name}
              className={`mt-1 ${errors.fullName ? "border-red-300" : ""}`}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="enroll-email" className="text-xs font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="enroll-email"
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
              <Label htmlFor="enroll-mobile" className="text-xs font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="enroll-mobile"
                type="tel"
                value={data.mobile}
                onChange={(e) => setField("mobile", e.target.value.slice(0, FIELD_MAX.phone))}
                maxLength={FIELD_MAX.phone}
                className={`mt-1 ${errors.mobile ? "border-red-300" : ""}`}
                placeholder={PHONE_PLACEHOLDER}
                disabled={isSubmitting}
                autoComplete="tel"
              />
              {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="enroll-city" className="text-xs font-medium text-gray-700">
                City *
              </Label>
              <Input
                id="enroll-city"
                value={data.city}
                onChange={(e) => setField("city", e.target.value.slice(0, FIELD_MAX.shortText))}
                maxLength={FIELD_MAX.shortText}
                className={`mt-1 ${errors.city ? "border-red-300" : ""}`}
                placeholder="Dublin"
                disabled={isSubmitting}
                autoComplete="address-level2"
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label htmlFor="enroll-postal" className="text-xs font-medium text-gray-700">
                ZIP *
              </Label>
              <Input
                id="enroll-postal"
                value={data.postal}
                onChange={(e) => setField("postal", e.target.value.slice(0, FIELD_MAX.shortText))}
                maxLength={FIELD_MAX.shortText}
                className={`mt-1 ${errors.postal ? "border-red-300" : ""}`}
                placeholder="94568"
                disabled={isSubmitting}
                autoComplete="postal-code"
              />
              {errors.postal && <p className="text-xs text-red-600 mt-1">{errors.postal}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="enroll-level" className="text-xs font-medium text-gray-700">
                Level *
              </Label>
              <select
                id="enroll-level"
                value={data.level}
                onChange={(e) => setField("level", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                  errors.level ? "border-red-300" : "border-input"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                {LEVEL_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {errors.level && <p className="text-xs text-red-600 mt-1">{errors.level}</p>}
            </div>
            <div>
              <Label htmlFor="enroll-programType" className="text-xs font-medium text-gray-700">
                Program *
              </Label>
              <select
                id="enroll-programType"
                value={data.programType}
                onChange={(e) => setField("programType", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                  errors.programType ? "border-red-300" : "border-input"
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select</option>
                {PROGRAM_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.programType && (
                <p className="text-xs text-red-600 mt-1">{errors.programType}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="enroll-course" className="text-xs font-medium text-gray-700">
              Course / program *
            </Label>
            <Input
              id="enroll-course"
              value={data.course}
              onChange={(e) => setField("course", e.target.value.slice(0, FIELD_MAX.shortText))}
              maxLength={FIELD_MAX.shortText}
              className={`mt-1 ${errors.course ? "border-red-300" : ""}`}
              placeholder="e.g., Accelerated Math, Python, Robotics..."
              disabled={isSubmitting}
            />
            {errors.course && <p className="text-xs text-red-600 mt-1">{errors.course}</p>}
          </div>

          <FormPrivacyConsent
            checkboxId="chatbot-enroll-agree"
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
                  Send inquiry
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

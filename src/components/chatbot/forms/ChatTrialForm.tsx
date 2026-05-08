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
 * In-chat 30-minute trial class form.
 *
 * Mirrors the field set used by `STEAMTrialModal` / `BookTrialModal` (which
 * are mock-only today) and posts to `/api/contact` with `source=chatbot-trial`
 * so leads are persisted by the same intake the marketing site uses for camp
 * inquiries. This is the FIRST real persistence path for trial leads.
 */

const GRADE_OPTIONS = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
const SUBJECTS = ["Coding", "AI/ML", "Game Development", "Robotics"] as const;

interface TrialState {
  parentName: string;
  email: string;
  phone: string;
  studentName: string;
  grade: string;
  subjects: string[];
  mode: "in-person" | "online" | "";
  notes: string;
  /** Honeypot — leave empty */
  _hp: string;
}

interface ChatTrialFormProps {
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

const initialState: TrialState = {
  parentName: "",
  email: "",
  phone: "",
  studentName: "",
  grade: "",
  subjects: [],
  mode: "",
  notes: "",
  _hp: "",
};

export default function ChatTrialForm({ onSuccess, onCancel }: ChatTrialFormProps) {
  const [data, setData] = useState<TrialState>(initialState);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof TrialState>(field: K, value: TrialState[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) setErrors((prev) => ({ ...prev, [field as string]: "" }));
  };

  const toggleSubject = (s: string) => {
    setData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(s)
        ? prev.subjects.filter((x) => x !== s)
        : [...prev.subjects, s],
    }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!data.parentName.trim()) next.parentName = "Required";
    if (!data.email.trim()) next.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Invalid email";
    const phoneCheck = validatePhoneSimple(data.phone);
    if (!phoneCheck.isValid) next.phone = phoneCheck.errorMessage || "Invalid phone";
    if (!data.studentName.trim()) next.studentName = "Required";
    if (!data.grade) next.grade = "Required";
    if (data.subjects.length === 0) next.subjects = "Pick at least one subject";
    if (!data.mode) next.mode = "Required";
    if (!agree) next.agree = "Please agree to be contacted.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const messageBody = [
      `Trial request: 30-minute STEAM trial`,
      `Student: ${data.studentName.trim()} (Grade ${data.grade})`,
      `Subjects: ${data.subjects.join(", ")}`,
      `Mode: ${data.mode}`,
      data.notes.trim() ? `Notes: ${data.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.parentName.trim(),
          email: data.email.trim(),
          phone: data.phone.trim(),
          message: messageBody,
          source: chatbotFormSource("trial"),
          _hp: data._hp,
        }),
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
          `Thanks, ${data.parentName.trim()}! We'll reach out within 24 hours to schedule a 30-minute trial in ${data.subjects.join(", ")}. 🚀`,
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
          <p className="text-sm text-green-800 font-medium">Trial requested!</p>
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
          <h3 className="text-sm font-semibold text-gray-900 mb-1">30-minute trial</h3>
          <p className="text-xs text-gray-600">Try a STEAM session before committing.</p>
        </div>

        {submitError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="trial-parentName" className="text-xs font-medium text-gray-700">
              Parent name *
            </Label>
            <Input
              id="trial-parentName"
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
              <Label htmlFor="trial-email" className="text-xs font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="trial-email"
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
              <Label htmlFor="trial-phone" className="text-xs font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="trial-phone"
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
              <Label htmlFor="trial-studentName" className="text-xs font-medium text-gray-700">
                Student *
              </Label>
              <Input
                id="trial-studentName"
                value={data.studentName}
                onChange={(e) => setField("studentName", e.target.value.slice(0, FIELD_MAX.name))}
                maxLength={FIELD_MAX.name}
                className={`mt-1 ${errors.studentName ? "border-red-300" : ""}`}
                disabled={isSubmitting}
              />
              {errors.studentName && (
                <p className="text-xs text-red-600 mt-1">{errors.studentName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="trial-grade" className="text-xs font-medium text-gray-700">
                Grade *
              </Label>
              <select
                id="trial-grade"
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
            <Label className="text-xs font-medium text-gray-700">Subjects *</Label>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {SUBJECTS.map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.subjects.includes(s)}
                    onChange={() => toggleSubject(s)}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            {errors.subjects && <p className="text-xs text-red-600 mt-1">{errors.subjects}</p>}
          </div>

          <div>
            <Label className="text-xs font-medium text-gray-700">Mode *</Label>
            <div className="mt-1 flex gap-3 text-sm">
              {(["in-person", "online"] as const).map((m) => (
                <label key={m} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="trial-mode"
                    value={m}
                    checked={data.mode === m}
                    onChange={() => setField("mode", m)}
                    disabled={isSubmitting}
                    className="h-4 w-4"
                  />
                  <span>{m === "in-person" ? "In-person" : "Online"}</span>
                </label>
              ))}
            </div>
            {errors.mode && <p className="text-xs text-red-600 mt-1">{errors.mode}</p>}
          </div>

          <FormPrivacyConsent
            checkboxId="chatbot-trial-agree"
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
                  Request trial
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

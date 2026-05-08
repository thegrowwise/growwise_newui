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
 * In-chat camp inquiry form.
 *
 * Mirrors the field set used by `src/components/camps/CampInquiryForm.tsx`
 * and posts to the SAME endpoint (`/api/contact`) so leads are captured
 * by the same intake the marketing site uses today. `source` is suffixed
 * with `chatbot-camp` so leads can be filtered downstream.
 *
 * Designed to fit inside the 420 px chat panel: stacked fields, no portal.
 */

const GRADE_OPTIONS = [
  "K",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
] as const;

export interface ChatCampFormPrefill {
  campInterest?: string;
}

interface ChatCampFormProps {
  prefill?: ChatCampFormPrefill;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

interface CampFormState {
  parentName: string;
  email: string;
  phone: string;
  childGrade: string;
  city: string;
  campInterest: string;
  message: string;
  _hp: string;
}

const initialState = (prefill?: ChatCampFormPrefill): CampFormState => ({
  parentName: "",
  email: "",
  phone: "",
  childGrade: "",
  city: "",
  campInterest: prefill?.campInterest ?? "",
  message: "",
  _hp: "",
});

export default function ChatCampForm({ prefill, onSuccess, onCancel }: ChatCampFormProps) {
  const [data, setData] = useState<CampFormState>(() => initialState(prefill));
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = <K extends keyof CampFormState>(field: K, value: CampFormState[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!data.parentName.trim()) next.parentName = "Please enter a name.";
    if (!data.email.trim()) next.email = "Please enter an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Enter a valid email address.";
    const phoneCheck = validatePhoneSimple(data.phone);
    if (!phoneCheck.isValid) next.phone = phoneCheck.errorMessage || "Please enter a valid phone number.";
    if (!data.childGrade) next.childGrade = "Please select a grade.";
    if (!data.city.trim()) next.city = "Please enter your city.";
    if (!data.campInterest.trim()) next.campInterest = "Please tell us which camp interests you.";
    if (!agree) next.agree = "Please agree to be contacted.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    const messageBody = [
      `Camp interest: ${data.campInterest}`,
      `Child grade: ${data.childGrade}`,
      `City: ${data.city}`,
      data.message.trim() ? `Message: ${data.message.trim()}` : null,
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
          source: chatbotFormSource("camp"),
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
          `Thanks, ${data.parentName.trim()}! Our team will reach out about ${data.campInterest.trim()} within 24 hours. 🏕️`,
        );
      }, 650);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-800 font-medium">Inquiry sent!</p>
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
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Camp inquiry</h3>
          <p className="text-xs text-gray-600">
            Our team confirms availability and next steps directly with your family.
          </p>
        </div>

        {submitError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <Label htmlFor="camp-parentName" className="text-xs font-medium text-gray-700">
              Parent / guardian name *
            </Label>
            <Input
              id="camp-parentName"
              type="text"
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
              <Label htmlFor="camp-email" className="text-xs font-medium text-gray-700">
                Email *
              </Label>
              <Input
                id="camp-email"
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
              <Label htmlFor="camp-phone" className="text-xs font-medium text-gray-700">
                Phone *
              </Label>
              <Input
                id="camp-phone"
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
              <Label htmlFor="camp-grade" className="text-xs font-medium text-gray-700">
                Child grade *
              </Label>
              <select
                id="camp-grade"
                value={data.childGrade}
                onChange={(e) => setField("childGrade", e.target.value)}
                className={`mt-1 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                  errors.childGrade ? "border-red-300" : "border-input"
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
              {errors.childGrade && <p className="text-xs text-red-600 mt-1">{errors.childGrade}</p>}
            </div>
            <div>
              <Label htmlFor="camp-city" className="text-xs font-medium text-gray-700">
                City *
              </Label>
              <Input
                id="camp-city"
                type="text"
                value={data.city}
                onChange={(e) => setField("city", e.target.value.slice(0, FIELD_MAX.shortText))}
                maxLength={FIELD_MAX.shortText}
                className={`mt-1 ${errors.city ? "border-red-300" : ""}`}
                placeholder="Dublin, San Ramon..."
                disabled={isSubmitting}
                autoComplete="address-level2"
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="camp-interest" className="text-xs font-medium text-gray-700">
              Camp interest *
            </Label>
            <Input
              id="camp-interest"
              type="text"
              value={data.campInterest}
              onChange={(e) => setField("campInterest", e.target.value.slice(0, FIELD_MAX.shortText))}
              maxLength={FIELD_MAX.shortText}
              className={`mt-1 ${errors.campInterest ? "border-red-300" : ""}`}
              placeholder="e.g., AI Studio, Robotics, Coding"
              disabled={isSubmitting}
            />
            {errors.campInterest && (
              <p className="text-xs text-red-600 mt-1">{errors.campInterest}</p>
            )}
          </div>

          <div>
            <Label htmlFor="camp-message" className="text-xs font-medium text-gray-700">
              Message <span className="font-normal text-gray-400">(optional)</span>
            </Label>
            <textarea
              id="camp-message"
              rows={2}
              value={data.message}
              onChange={(e) => setField("message", e.target.value.slice(0, FIELD_MAX.longText))}
              maxLength={FIELD_MAX.longText}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
              placeholder="Goals, scheduling notes..."
              disabled={isSubmitting}
            />
          </div>

          <FormPrivacyConsent
            checkboxId="chatbot-camp-agree"
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
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isSubmitting}
              className="px-4"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

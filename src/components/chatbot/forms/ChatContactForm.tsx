"use client";

/**
 * Chat-friendly wrapper around the existing src/components/chatbot/ContactForm.tsx.
 *
 * The original ContactForm is parent-controlled (parent owns the submit + state).
 * The other in-chat forms (assessment / trial / enroll / camp) self-submit and
 * call back via `onSuccess` / `onCancel`. This wrapper normalizes the contracts
 * so `ChatFormSlot` can render every form with the SAME props without duplicating
 * the contact form's UI.
 */

import React, { useState } from "react";
import ContactForm, { type ContactFormData } from "../ContactForm";
import { Card, CardContent } from "../../ui/card";
import { CheckCircle } from "lucide-react";
import { contactService } from "@/lib/contactService";
import { chatbotFormSource } from "@/lib/chatbotScope";

interface ChatContactFormProps {
  onSuccess: (message: string) => void;
  onCancel: () => void;
}

export default function ChatContactForm({ onSuccess, onCancel }: ChatContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const payload = { ...data, source: chatbotFormSource("contact") };
      const result = await contactService.submitContactForm(payload);
      if (result.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        setTimeout(() => {
          onSuccess(
            `Thanks, ${data.name ?? "friend"}! We've received your information and will reach out within 24 hours. 📧`,
          );
        }, 650);
        return;
      }
      setError(result.error || result.message || "Something went wrong. Please try again.");
      if (result.errors?.length) {
        setFieldErrors(
          result.errors.reduce<Record<string, string>>((acc, { field, message }) => {
            acc[field] = message;
            return acc;
          }, {}),
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 text-center">
          <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-800 font-medium">Message sent!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ContactForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isSubmitting}
      error={error}
      fieldErrors={fieldErrors}
    />
  );
}

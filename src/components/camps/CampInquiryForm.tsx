"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CampLandingPage } from "@/lib/camps/camp-types";

import { SectionContainer } from "./SectionContainer";

type CampInquiryFormProps = {
  page: CampLandingPage;
};

export type CampInquiryPayload = {
  parentName: string;
  email: string;
  phone: string;
  childGrade: string;
  city: string;
  campInterest: string;
  message: string;
};

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

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm sm:text-base text-slate-900 shadow-sm " +
  "placeholder:text-slate-400 focus:border-[#1F396D] focus:outline-none focus:ring-2 focus:ring-[#1F396D]/25";

export function CampInquiryForm({ page }: CampInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CampInquiryPayload>({
    defaultValues: {
      campInterest: page.formConfig.defaultCampInterest,
      parentName: "",
      email: "",
      phone: "",
      childGrade: "",
      city: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: CampInquiryPayload) => {
    clearErrors("root");

    const messageBody = [
      `Camp program page: ${page.slug}`,
      `Camp interest: ${data.campInterest}`,
      `Child grade: ${data.childGrade}`,
      `City: ${data.city}`,
      data.message.trim() ? `Optional message:\n${data.message.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.parentName,
          email: data.email,
          phone: data.phone,
          message: messageBody,
          source: `camp-landing:${page.slug}`,
        }),
      });

      const json = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || json.success === false) {
        setError("root", {
          message:
            json.message ??
            "We could not send your inquiry. Please try again or call (925) 456-4606.",
        });
        return;
      }

      setSubmitted(true);
      reset({ ...data, message: "" });
    } catch {
      setError("root", {
        message: "Network error. Please check your connection and try again.",
      });
    }
  };

  /** Slug-suffixed ids so field/label pairs stay unique if the tree ever reuses without remount (parent passes key={slug}). */
  const fid = (field: string) => `${field}-${page.slug}`;

  return (
    <SectionContainer
      id="inquiry"
      className="bg-white border-t border-slate-100 pb-44 sm:pb-52 scroll-mt-4"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">{page.formConfig.sectionEyebrow}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{page.formConfig.sectionTitle}</h2>
        {page.formConfig.sectionSubtext ? (
          <p className="mt-3 text-slate-600">{page.formConfig.sectionSubtext}</p>
        ) : null}

        <form
          className="mt-10 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          suppressHydrationWarning
        >
          <div>
            <label htmlFor={fid("parentName")} className="block text-sm font-semibold text-slate-800">
              Parent / guardian name
            </label>
            <input
              id={fid("parentName")}
              type="text"
              autoComplete="name"
              className={`${inputClass} mt-1.5`}
              aria-invalid={errors.parentName ? "true" : "false"}
              aria-describedby={errors.parentName ? "parentName-error" : undefined}
              {...register("parentName", { required: "Please enter a name.", minLength: { value: 2, message: "Enter at least 2 characters." } })}
            />
            {errors.parentName ? (
              <p id="parentName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.parentName.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
            <label htmlFor={fid("email")} className="block text-sm font-semibold text-slate-800">
              Email
            </label>
              <input
                id={fid("email")}
                type="email"
                autoComplete="email"
                className={`${inputClass} mt-1.5`}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email", {
                  required: "Please enter an email address.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
              {errors.email ? (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div>
            <label htmlFor={fid("phone")} className="block text-sm font-semibold text-slate-800">
              Phone
            </label>
              <input
                id={fid("phone")}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                className={`${inputClass} mt-1.5`}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                {...register("phone", {
                  required: "Please enter a phone number.",
                  validate: (v) => {
                    const digits = v.replace(/\D/g, "");
                    return digits.length >= 10 || "Enter at least 10 digits (numbers only count toward this check).";
                  },
                })}
              />
              {errors.phone ? (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={fid("childGrade")} className="block text-sm font-semibold text-slate-800">
                Child&apos;s grade (upcoming school year)
              </label>
              <select
                id={fid("childGrade")}
                className={`${inputClass} mt-1.5`}
                aria-invalid={errors.childGrade ? "true" : "false"}
                aria-describedby={errors.childGrade ? "childGrade-error" : undefined}
                {...register("childGrade", { required: "Please select a grade." })}
              >
                <option value="">Select grade</option>
                {GRADE_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g === "K" ? "Kindergarten" : `Grade ${g}`}
                  </option>
                ))}
              </select>
              {errors.childGrade ? (
                <p id="childGrade-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.childGrade.message}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor={fid("city")} className="block text-sm font-semibold text-slate-800">
                City you commute from
              </label>
              <input
                id={fid("city")}
                type="text"
                autoComplete="address-level2"
                className={`${inputClass} mt-1.5`}
                placeholder="e.g., Dublin, San Ramon"
                aria-invalid={errors.city ? "true" : "false"}
                aria-describedby={errors.city ? "city-error" : undefined}
                {...register("city", { required: "Please enter your city." })}
              />
              {errors.city ? (
                <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.city.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor={fid("campInterest")} className="block text-sm font-semibold text-slate-800">
              Camp interest
            </label>
            <input
              id={fid("campInterest")}
              type="text"
              className={`${inputClass} mt-1.5`}
              aria-invalid={errors.campInterest ? "true" : "false"}
              aria-describedby={errors.campInterest ? "campInterest-error" : undefined}
              {...register("campInterest", { required: "Please enter a camp interest." })}
            />
            {errors.campInterest ? (
              <p id="campInterest-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.campInterest.message}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-slate-500">Pre-filled for this page; adjust if you are deciding between multiple options.</p>
          </div>

          <div>
            <label htmlFor={fid("message")} className="block text-sm font-semibold text-slate-800">
              Message <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id={fid("message")}
              rows={4}
              className={`${inputClass} mt-1.5 resize-y min-h-[120px]`}
              placeholder="Goals, scheduling constraints, prior experience—anything that helps us respond quickly."
              {...register("message")}
            />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-semibold">Important</p>
            <p className="mt-1 leading-relaxed">{page.formConfig.notConnectedNotice}</p>
          </div>

          {errors.root ? (
            <p className="text-sm text-red-600" role="alert">
              {errors.root.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-[#F16112] px-6 py-3 text-base font-semibold text-white hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F16112] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending…" : page.formConfig.submitLabel}
          </button>

          {submitted ? (
            <p className="text-sm text-slate-700" role="status">
              Thanks — we received your inquiry. Our team will follow up using the contact information you provided.
            </p>
          ) : null}
        </form>
      </div>
    </SectionContainer>
  );
}

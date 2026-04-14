"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { CampLandingPage } from "@/lib/camps/camp-types";
import CountryCodeSelector from "@/components/CountryCodeSelector";
import {
  DIAL_CODE_TO_ISO2,
  getPhonePlaceholder,
  validatePhoneWithCountryCode,
} from "@/lib/phoneValidation";

import { SectionContainer } from "./SectionContainer";

type CampInquiryFormProps = {
  page: CampLandingPage;
};

export type CampInquiryPayload = {
  parentName: string;
  email: string;
  countryCode: string;
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<CampInquiryPayload>({
    defaultValues: {
      campInterest: page.formConfig.defaultCampInterest,
      parentName: "",
      email: "",
      countryCode: "+1",
      phone: "",
      childGrade: "",
      city: "",
      message: "",
    },
    mode: "onBlur",
  });

  const countryCode = watch("countryCode");
  const phonePlaceholder = getPhonePlaceholder(DIAL_CODE_TO_ISO2[countryCode]);

  const onSubmit = (data: CampInquiryPayload) => {
    const phoneValidation = validatePhoneWithCountryCode(data.countryCode, data.phone);
    // Placeholder: structured payload for a future API route — no network call yet.
    if (process.env.NODE_ENV === "development") {
      console.info("[camp-inquiry] payload (not sent)", {
        ...data,
        phone: phoneValidation.e164 ?? data.phone,
      });
    }
    setSubmitted(true);
    reset({ ...data, message: "" });
  };

  return (
    <SectionContainer id="inquiry" className="bg-white border-t border-slate-100 pb-28 sm:pb-32">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1F396D]">{page.formConfig.sectionEyebrow}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">{page.formConfig.sectionTitle}</h2>
        {page.formConfig.sectionSubtext ? (
          <p className="mt-3 text-slate-600">{page.formConfig.sectionSubtext}</p>
        ) : null}

        <form className="mt-10 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="parentName" className="block text-sm font-semibold text-slate-800">
              Parent / guardian name
            </label>
            <input
              id="parentName"
              type="text"
              autoComplete="name"
              className={`${inputClass} mt-1.5`}
              aria-invalid={errors.parentName ? "true" : "false"}
              aria-describedby={errors.parentName ? "parentName-error" : undefined}
              {...register("parentName", {
                required: "Please enter a name.",
                setValueAs: (v: string) => v.trim(),
                minLength: { value: 2, message: "Enter at least 2 characters." },
              })}
            />
            {errors.parentName ? (
              <p id="parentName-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.parentName.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                id="email"
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
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-800">
                Phone
              </label>
              <div
                className={[
                  "mt-1.5 flex items-center gap-0 overflow-hidden rounded-lg border bg-white shadow-sm",
                  errors.phone ? "border-red-500" : "border-slate-300",
                  "focus-within:border-[#1F396D] focus-within:ring-2 focus-within:ring-[#1F396D]/25",
                ].join(" ")}
              >
                <CountryCodeSelector
                  value={countryCode}
                  onChange={(v) => setValue("countryCode", v, { shouldDirty: true, shouldValidate: true })}
                  className="flex-shrink-0"
                />
                <div className="w-px h-10 bg-slate-300 flex-shrink-0" aria-hidden />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full bg-transparent px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  placeholder={phonePlaceholder}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  {...register("phone", {
                    required: "Please enter a phone number.",
                    validate: (v) => {
                      const res = validatePhoneWithCountryCode(countryCode, v);
                      return res.isValid || res.errorMessage || "Please enter a valid phone number.";
                    },
                  })}
                />
              </div>
              {errors.phone ? (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="childGrade" className="block text-sm font-semibold text-slate-800">
                Child&apos;s grade (upcoming school year)
              </label>
              <select
                id="childGrade"
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
              <label htmlFor="city" className="block text-sm font-semibold text-slate-800">
                City you commute from
              </label>
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                className={`${inputClass} mt-1.5`}
                placeholder="e.g., Dublin, San Ramon"
                aria-invalid={errors.city ? "true" : "false"}
                aria-describedby={errors.city ? "city-error" : undefined}
                {...register("city", { required: "Please enter your city.", setValueAs: (v: string) => v.trim() })}
              />
              {errors.city ? (
                <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.city.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="campInterest" className="block text-sm font-semibold text-slate-800">
              Camp interest
            </label>
            <input
              id="campInterest"
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
            <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
              Message <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <textarea
              id="message"
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

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex justify-center rounded-md bg-[#F16112] px-6 py-3 text-base font-semibold text-white hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F16112]"
          >
            {page.formConfig.submitLabel}
          </button>

          {submitted ? (
            <p className="text-sm text-slate-700" role="status">
              Nothing was transmitted to GrowWise servers. To enroll or get a timely response, call or email using the contact details in the notice above.
            </p>
          ) : null}
        </form>
      </div>
    </SectionContainer>
  );
}

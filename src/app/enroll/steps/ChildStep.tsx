'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePricingConfig } from '@/hooks/usePricingConfig';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import { validatePhoneWithCountryCode } from '@/lib/phoneValidation';

interface ChildStepProps {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number | '';
  onChange: (next: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    childName: string;
    childAge: number | '';
  }) => void;
  onContinue: () => void;
}

interface FieldErrors {
  parentName?: string;
  parentEmail?: string;
  childName?: string;
  childAge?: string;
  parentPhone?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ChildStep(props: ChildStepProps) {
  const { parentName, parentEmail, parentPhone, childName, childAge, onChange, onContinue } = props;
  const searchParams = useSearchParams();
  const { getProgramById } = usePricingConfig();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    parentName: false,
    parentEmail: false,
    childName: false,
    childAge: false,
    parentPhone: false,
  });
  const [countryCode, setCountryCode] = useState('+1');

  const program = useMemo(() => {
    const programId = searchParams.get('program');
    if (!programId) return null;
    return getProgramById(programId);
  }, [getProgramById, searchParams]);

  const ageRange = useMemo(() => {
    if (!program) return null;
    return { min: program.age_min, max: program.age_max };
  }, [program]);

  const validate = (state: {
    parentName: string;
    parentEmail: string;
    parentPhone: string;
    childName: string;
    childAge: number | '';
  }): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!state.parentName.trim()) {
      nextErrors.parentName = 'Parent name is required';
    }

    if (!state.parentEmail.trim()) {
      nextErrors.parentEmail = 'Parent email is required';
    } else if (!emailPattern.test(state.parentEmail.trim())) {
      nextErrors.parentEmail = 'Please enter a valid email address';
    }

    if (!state.childName.trim()) {
      nextErrors.childName = 'Child name is required';
    }

    if (state.parentPhone.trim()) {
      const result = validatePhoneWithCountryCode(countryCode, state.parentPhone);
      if (!result.isValid && result.errorMessage) {
        nextErrors.parentPhone = result.errorMessage;
      }
    }

    if (state.childAge === '' || Number.isNaN(state.childAge)) {
      nextErrors.childAge = 'Child age is required';
    } else if (ageRange) {
      const ageNumber = Number(state.childAge);
      if (Number.isNaN(ageNumber)) {
        nextErrors.childAge = 'Child age is required';
      } else if (ageNumber < ageRange.min || ageNumber > ageRange.max) {
        nextErrors.childAge = `This program is for ages ${ageRange.min}–${ageRange.max}. Check our other programs.`;
      }
    }

    return nextErrors;
  };

  useEffect(() => {
    const currentState = { parentName, parentEmail, parentPhone, childName, childAge };
    setErrors(validate(currentState));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentName, parentEmail, parentPhone, childName, childAge, ageRange?.min, ageRange?.max]);

  const handleBlur = (field: keyof FieldErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange = (
    field: keyof Omit<ChildStepProps, 'onChange' | 'onContinue'>,
    value: string,
  ) => {
    const nextState = {
      parentName,
      parentEmail,
      parentPhone,
      childName,
      childAge,
      [field]: field === 'childAge' ? (value === '' ? '' : Number(value)) : value,
    } as {
      parentName: string;
      parentEmail: string;
      parentPhone: string;
      childName: string;
      childAge: number | '';
    };
    onChange(nextState);
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const allRequiredTouched =
    touched.parentName && touched.parentEmail && touched.childName && touched.childAge;
  const canContinue = !hasErrors && !!parentName && !!parentEmail && !!childName && childAge !== '';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextTouched: Record<keyof FieldErrors, boolean> = {
      parentName: true,
      parentEmail: true,
      childName: true,
      childAge: true,
      parentPhone: true,
    };
    setTouched(nextTouched);

    const validationErrors = validate({ parentName, parentEmail, parentPhone, childName, childAge });
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    onContinue();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Your details</h2>
        <p className="text-sm text-gray-600">
          Tell us about you and your child so we can match the right experience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="enroll-parent-name" className="block text-sm font-medium text-gray-700">
            Parent name<span className="text-red-500">*</span>
          </label>
          <input
            id="enroll-parent-name"
            type="text"
            value={parentName}
            onChange={(e) => handleInputChange('parentName', e.target.value)}
            onBlur={() => handleBlur('parentName')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#F16112] focus:outline-none focus:ring-2 focus:ring-[#F16112]/20"
          />
          {touched.parentName && errors.parentName && (
            <p className="mt-1 text-xs text-red-600">{errors.parentName}</p>
          )}
        </div>

        <div>
          <label htmlFor="enroll-parent-email" className="block text-sm font-medium text-gray-700">
            Parent email<span className="text-red-500">*</span>
          </label>
          <input
            id="enroll-parent-email"
            type="email"
            value={parentEmail}
            onChange={(e) => handleInputChange('parentEmail', e.target.value)}
            onBlur={() => handleBlur('parentEmail')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#F16112] focus:outline-none focus:ring-2 focus:ring-[#F16112]/20"
          />
          {touched.parentEmail && errors.parentEmail && (
            <p className="mt-1 text-xs text-red-600">{errors.parentEmail}</p>
          )}
        </div>

        <div>
          <label htmlFor="enroll-parent-phone" className="block text-sm font-medium text-gray-700">
            Parent phone
          </label>
          <div className="mt-1 flex rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm focus-within:border-[#F16112] focus-within:ring-2 focus-within:ring-[#F16112]/20">
            <CountryCodeSelector
              value={countryCode}
              onChange={(dial) => {
                setCountryCode(dial);
                if (parentPhone.trim()) {
                  const result = validatePhoneWithCountryCode(dial, parentPhone);
                  setErrors((prev) => ({
                    ...prev,
                    parentPhone: !result.isValid && result.errorMessage ? result.errorMessage : undefined,
                  }));
                }
              }}
              className="border-r border-gray-200"
            />
            <input
              id="enroll-parent-phone"
              type="tel"
              value={parentPhone}
              onChange={(e) => handleInputChange('parentPhone', e.target.value)}
              onBlur={() => handleBlur('parentPhone')}
              className="flex-1 border-0 bg-transparent px-3 py-2 outline-none"
            />
          </div>
          {touched.parentPhone && errors.parentPhone && (
            <p className="mt-1 text-xs text-red-600">{errors.parentPhone}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="enroll-child-name" className="block text-sm font-medium text-gray-700">
            Child name<span className="text-red-500">*</span>
          </label>
          <input
            id="enroll-child-name"
            type="text"
            value={childName}
            onChange={(e) => handleInputChange('childName', e.target.value)}
            onBlur={() => handleBlur('childName')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#F16112] focus:outline-none focus:ring-2 focus:ring-[#F16112]/20"
          />
          {touched.childName && errors.childName && (
            <p className="mt-1 text-xs text-red-600">{errors.childName}</p>
          )}
        </div>

        <div>
          <label htmlFor="enroll-child-age" className="block text-sm font-medium text-gray-700">
            Child age<span className="text-red-500">*</span>
          </label>
          <input
            id="enroll-child-age"
            type="number"
            min={ageRange?.min}
            max={ageRange?.max}
            value={childAge === '' ? '' : childAge}
            onChange={(e) => handleInputChange('childAge', e.target.value)}
            onBlur={() => handleBlur('childAge')}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#F16112] focus:outline-none focus:ring-2 focus:ring-[#F16112]/20"
          />
          {ageRange && (
            <p className="mt-1 text-xs text-gray-500">
              Program recommended for ages {ageRange.min}–{ageRange.max}.
            </p>
          )}
          {touched.childAge && errors.childAge && (
            <p className="mt-1 text-xs text-red-600">{errors.childAge}</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={!canContinue || (!allRequiredTouched && hasErrors)}
          className="inline-flex items-center justify-center rounded-lg bg-[#F16112] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d4520c] disabled:cursor-not-allowed disabled:bg-gray-300"
          data-testid="enroll-child-continue"
        >
          Continue to payment
        </button>
      </div>
    </form>
  );
}


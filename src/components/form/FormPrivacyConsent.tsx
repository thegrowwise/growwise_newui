'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormPrivacyConsentProps {
  /** Unique id for the consent checkbox (required for a11y) */
  checkboxId: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Validation error message when consent is required but not given */
  error?: string | null;
  /** Whether the checkbox is required to submit */
  required?: boolean;
  /** Show the "By submitting, you agree to be contacted..." line below the checkbox block */
  showSubmitDisclaimer?: boolean;
  /** Layout variant: default (full blocks), compact (single block, smaller spacing) */
  variant?: 'default' | 'compact';
  /** When true, one card: privacy + consent share column alignment; smaller privacy text (math-finals style). */
  alignPrivacyWithConsent?: boolean;
  /** Optional class for the wrapper */
  className?: string;
}

/**
 * Shared Privacy & Data Protection + consent checkbox for all forms.
 * Use on every form that collects contact info and submits to GrowWise.
 */
export default function FormPrivacyConsent({
  checkboxId,
  checked,
  onCheckedChange,
  error = null,
  required = true,
  showSubmitDisclaimer = true,
  variant = 'default',
  alignPrivacyWithConsent = false,
  className,
}: FormPrivacyConsentProps) {
  const t = useTranslations('commonForm.privacy');

  const blockClass = variant === 'compact'
    ? 'space-y-3 p-4 bg-gray-100 rounded-xl border border-gray-200'
    : 'space-y-4 p-4 sm:p-6 md:p-8 bg-gray-100 rounded-xl md:rounded-2xl border border-gray-200';

  const colIcon = 'w-10 flex shrink-0 justify-center';

  if (alignPrivacyWithConsent) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className={blockClass}>
          <div className="flex items-start gap-2.5">
            <div className={colIcon}>
              <div className="rounded-lg bg-[#1F396D] p-1.5">
                <Shield className="h-4 w-4 text-white" aria-hidden />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="mb-0.5 text-sm font-semibold text-gray-900">{t('title')}</h3>
              <p className="text-xs leading-relaxed text-gray-600">{t('description')}</p>
            </div>
          </div>
          <div className="mt-3 border-t border-gray-200/90 pt-3">
            <div className="flex items-start gap-2.5">
              <div className={cn(colIcon, 'pt-0.5')}>
                <Checkbox
                  id={checkboxId}
                  checked={checked}
                  onCheckedChange={(value) => onCheckedChange(value === true)}
                  required={required}
                  className={cn(
                    'h-5 w-5 flex-shrink-0 border-2 border-gray-400 data-[state=checked]:border-[#1F396D] data-[state=checked]:bg-[#1F396D]',
                    error && 'border-red-500',
                  )}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${checkboxId}-error` : undefined}
                />
              </div>
              <Label
                htmlFor={checkboxId}
                id={`${checkboxId}-label`}
                className="flex-1 cursor-pointer text-sm leading-relaxed text-gray-700"
              >
                {t('agreeLabel')}
              </Label>
            </div>
            {error && (
              <p
                id={`${checkboxId}-error`}
                className="mt-2 flex items-center gap-1 pl-0 text-xs text-red-600 sm:pl-12"
                role="alert"
              >
                <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                {error}
              </p>
            )}
          </div>
        </div>
        {showSubmitDisclaimer && (
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
            <Shield className="h-3.5 w-3.5 flex-shrink-0 text-green-600" aria-hidden />
            {t('submitDisclaimer')}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Privacy & Data Protection */}
      <div className={blockClass}>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={cn(
            'bg-[#1F396D] rounded-xl flex-shrink-0',
            variant === 'compact' ? 'p-2' : 'p-2.5 sm:p-3'
          )}>
            <Shield className={cn('text-white', variant === 'compact' ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6')} />
          </div>
          <div>
            <h3 className={cn(
              'text-gray-900 font-semibold mb-1',
              variant === 'compact' ? 'text-base' : 'text-lg sm:text-xl'
            )}>
              {t('title')}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Communication consent checkbox */}
      <div className={blockClass}>
        <div className="flex items-start gap-3 sm:gap-4">
          <Checkbox
            id={checkboxId}
            checked={checked}
            onCheckedChange={(value) => onCheckedChange(value === true)}
            required={required}
            className={cn(
              'mt-0.5 border-2 border-gray-400 data-[state=checked]:bg-[#1F396D] data-[state=checked]:border-[#1F396D] w-5 h-5 flex-shrink-0',
              error && 'border-red-500'
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
          />
          <Label
            htmlFor={checkboxId}
            id={`${checkboxId}-label`}
            className="cursor-pointer text-gray-700 text-sm sm:text-base leading-relaxed flex-1"
          >
            {t('agreeLabel')}
          </Label>
        </div>
        {error && (
          <p
            id={`${checkboxId}-error`}
            className="text-sm text-red-600 flex items-center gap-1 mt-2 pl-8 sm:pl-12"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </p>
        )}
      </div>

      {showSubmitDisclaimer && (
        <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
          {t('submitDisclaimer')}
        </p>
      )}
    </div>
  );
}

'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { EnrollStepper, type EnrollStep } from '@/components/enroll/EnrollStepper';
import { DEFAULT_LOCALE } from '@/i18n/localeConfig';
import enMessages from '@/i18n/messages/en.json';
import { ReviewStep } from './steps/ReviewStep';
import { ChildStep } from './steps/ChildStep';
import { PaymentStep } from './steps/PaymentStep';

function EnrollPhase3Inner() {
  const searchParams = useSearchParams();
  const enrollStepperT = useTranslations('enroll.stepper');
  const commonT = useTranslations('common');

  const requestedStep = useMemo<EnrollStep>(() => {
    const raw = searchParams.get('step');
    const stepNum = raw ? Number(raw) : 1;
    if (stepNum === 1 || stepNum === 2 || stepNum === 3) return stepNum as EnrollStep;
    return 1;
  }, [searchParams]);

  // Read URL params from Phase 2 (program/tier/etc). Phase 1 validation only requires no-load errors.
  const program = searchParams.get('program') || '';
  const tier = searchParams.get('tier') || '';
  void program;
  void tier;

  // If someone attempts to load `step=3` directly, we prevent it by forcing them back to step 2.
  const initialStep = requestedStep === 3 ? 2 : requestedStep;
  const [currentStep, setCurrentStep] = useState<EnrollStep>(initialStep);
  const [parentName, setParentName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number | ''>('');

  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? (prev - 1) as EnrollStep : prev));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const showBack = currentStep > 1;
  const canAdvance = currentStep === 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EnrollStepper currentStep={currentStep} />

        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex-1">
            {showBack && (
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="enroll-step-back"
                className="w-full sm:w-auto"
              >
                {enrollStepperT('back')}
              </Button>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            {canAdvance && (
              <Button
                onClick={handleNext}
                data-testid="enroll-step-next"
                className="w-full sm:w-auto bg-[#F16112] text-white"
              >
                {commonT('next')}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-white/70 backdrop-blur p-4" data-testid="enroll-phase3-content">
          <div data-testid={`enroll-phase3-step-${currentStep}`}>
            {currentStep === 1 && <ReviewStep onContinue={handleNext} />}
            {currentStep === 2 && (
              <ChildStep
                parentName={parentName}
                parentEmail={parentEmail}
                parentPhone={parentPhone}
                childName={childName}
                childAge={childAge}
                onChange={(next) => {
                  setParentName(next.parentName);
                  setParentEmail(next.parentEmail);
                  setParentPhone(next.parentPhone);
                  setChildName(next.childName);
                  setChildAge(next.childAge);
                }}
                onContinue={handleNext}
              />
            )}
            {currentStep === 3 && (
              <PaymentStep
                parentName={parentName}
                parentEmail={parentEmail}
                parentPhone={parentPhone}
                childName={childName}
                childAge={childAge}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnrollPhase3Page() {
  return (
    <NextIntlClientProvider locale={DEFAULT_LOCALE} messages={enMessages}>
      <Suspense fallback={null}>
        <EnrollPhase3Inner />
      </Suspense>
    </NextIntlClientProvider>
  );
}


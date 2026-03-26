'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type EnrollStep = 1 | 2 | 3;

export function EnrollStepper({ currentStep }: { currentStep: EnrollStep }) {
  const t = useTranslations('enroll.stepper');

  const steps = [
    { step: 1 as const, label: t('review') },
    { step: 2 as const, label: t('details') },
    { step: 3 as const, label: t('payment') },
  ];

  const segment1State = currentStep >= 2 ? (currentStep === 2 ? 'active' : 'completed') : 'future';
  const segment2State = currentStep >= 3 ? (currentStep === 3 ? 'active' : 'completed') : 'future';

  const segmentClass = (state: 'active' | 'completed' | 'future') => {
    if (state === 'completed') return 'bg-green-600';
    if (state === 'active') return 'bg-[#F16112]';
    return 'bg-gray-300';
  };

  return (
    <div className="w-full">
      {/* Line behind circles */}
      <div className="relative w-full pb-2">
        <div className="absolute left-0 right-0 top-[18px] h-[2px] bg-gray-300" />
        <div className={`absolute left-0 top-[18px] h-[2px] w-1/2 ${segmentClass(segment1State)}`} />
        <div className={`absolute left-1/2 top-[18px] h-[2px] w-1/2 ${segmentClass(segment2State)}`} />

        <div className="relative flex items-start justify-between">
          {steps.map((s) => {
            const isCompleted = s.step < currentStep;
            const isActive = s.step === currentStep;

            const circleClass = isCompleted
              ? 'bg-green-600 border-green-600 text-white'
              : isActive
                ? 'bg-[#F16112] border-[#F16112] text-white'
                : 'bg-white border-gray-300 text-gray-500';

            return (
              <div key={s.step} className="flex-1 flex flex-col items-center">
                <div
                  data-testid={`enroll-step-circle-${s.step}`}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center ${circleClass}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden />
                  ) : (
                    <span className="text-sm font-semibold">{s.step}</span>
                  )}
                </div>
                <div className="mt-3 text-sm font-medium text-gray-700">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


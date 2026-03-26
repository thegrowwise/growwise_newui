import React from 'react';
import { render, screen } from '@/test-utils';
import { EnrollStepper } from '../EnrollStepper';

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    if (namespace === 'enroll.stepper') {
      return (key: string) => {
        const map: Record<string, string> = {
          review: 'Review',
          details: 'Your details',
          payment: 'Payment',
          back: 'Back',
        };
        return map[key] ?? key;
      };
    }
    return () => '';
  },
}));

describe('EnrollStepper', () => {
  it('renders step labels and highlights step 1', () => {
    render(<EnrollStepper currentStep={1} />);

    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Your details')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();

    expect(screen.getByTestId('enroll-step-circle-1')).toHaveClass('bg-[#F16112]');
    expect(screen.getByTestId('enroll-step-circle-2')).toHaveClass('border-gray-300');
    expect(screen.getByTestId('enroll-step-circle-3')).toHaveClass('border-gray-300');
  });

  it('marks step 1 completed and highlights step 2', () => {
    render(<EnrollStepper currentStep={2} />);

    expect(screen.getByTestId('enroll-step-circle-1')).toHaveClass('bg-green-600');
    expect(screen.getByTestId('enroll-step-circle-2')).toHaveClass('bg-[#F16112]');
    expect(screen.getByTestId('enroll-step-circle-3')).toHaveClass('border-gray-300');
  });

  it('marks steps 1-2 completed and highlights step 3', () => {
    render(<EnrollStepper currentStep={3} />);

    expect(screen.getByTestId('enroll-step-circle-1')).toHaveClass('bg-green-600');
    expect(screen.getByTestId('enroll-step-circle-2')).toHaveClass('bg-green-600');
    expect(screen.getByTestId('enroll-step-circle-3')).toHaveClass('bg-[#F16112]');
  });
});


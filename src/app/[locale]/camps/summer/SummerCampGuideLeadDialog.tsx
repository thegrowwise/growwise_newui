'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LOTTERY_GRADES,
  LOTTERY_INTERESTS,
  type LotteryGrade,
  type LotteryInterest,
} from '@/lib/summer-lottery-keys';

export type GuideLeadCopy = {
  guideModalTitle: string;
  guideModalSubtitle: string;
  parentNameLabel: string;
  parentNamePlaceholder: string;
  guideSubmitCta: string;
};

export type LotteryErrorKind = 'invalid_form' | 'invalid_email' | 'server' | null;

export function SummerCampGuideLeadDialog({
  open,
  onOpenChange,
  copy,
  lotterySelectClassName,
  formAriaLabel,
  parentName,
  email,
  childGrade,
  campInterest,
  status,
  errorKind,
  errorDetail,
  onParentNameChange,
  onEmailChange,
  onChildGradeChange,
  onCampInterestChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: GuideLeadCopy;
  lotterySelectClassName: string;
  formAriaLabel: string;
  parentName: string;
  email: string;
  childGrade: LotteryGrade | '';
  campInterest: LotteryInterest | '';
  status: 'idle' | 'loading' | 'error';
  errorKind: LotteryErrorKind;
  errorDetail: string | null;
  onParentNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onChildGradeChange: (v: LotteryGrade | '') => void;
  onCampInterestChange: (v: LotteryInterest | '') => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const t = useTranslations('summerCamp');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id="lead-capture" className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-slate-900">{copy.guideModalTitle}</DialogTitle>
          <DialogDescription id="lead-modal-description" className="text-slate-600">
            {copy.guideModalSubtitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="mt-2 space-y-4" noValidate aria-label={formAriaLabel}>
          <div className="space-y-2">
            <Label htmlFor="summer-lead-parent">{copy.parentNameLabel}</Label>
            <Input
              id="summer-lead-parent"
              name="parentName"
              type="text"
              autoComplete="name"
              placeholder={copy.parentNamePlaceholder}
              value={parentName}
              onChange={(ev) => onParentNameChange(ev.target.value)}
              disabled={status === 'loading'}
              aria-invalid={status === 'error' && errorKind === 'invalid_form'}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summer-lottery-email">{t('lottery.emailLabel')}</Label>
            <Input
              id="summer-lottery-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={t('lottery.emailPlaceholder')}
              value={email}
              onChange={(ev) => onEmailChange(ev.target.value)}
              disabled={status === 'loading'}
              aria-invalid={
                status === 'error' && (errorKind === 'invalid_email' || errorKind === 'invalid_form')
              }
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summer-lottery-grade">{t('lottery.childGradeLabel')}</Label>
            <select
              id="summer-lottery-grade"
              name="childGrade"
              value={childGrade}
              onChange={(ev) => onChildGradeChange(ev.target.value as LotteryGrade | '')}
              disabled={status === 'loading'}
              aria-invalid={status === 'error' && errorKind === 'invalid_form'}
              className={lotterySelectClassName}
            >
              <option value="">{t('lottery.gradePlaceholder')}</option>
              {LOTTERY_GRADES.map((g) => (
                <option key={g} value={g}>
                  {t(`lottery.grades.${g}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summer-lottery-interest">{t('lottery.campInterestLabel')}</Label>
            <select
              id="summer-lottery-interest"
              name="campInterest"
              value={campInterest}
              onChange={(ev) => onCampInterestChange(ev.target.value as LotteryInterest | '')}
              disabled={status === 'loading'}
              aria-invalid={status === 'error' && errorKind === 'invalid_form'}
              className={lotterySelectClassName}
            >
              <option value="">{t('lottery.interestPlaceholder')}</option>
              {LOTTERY_INTERESTS.map((key) => (
                <option key={key} value={key}>
                  {t(`lottery.interests.${key}`)}
                </option>
              ))}
            </select>
          </div>
          {status === 'error' && errorKind ? (
            <p className="text-sm text-red-600" role="alert">
              {errorKind === 'invalid_email'
                ? t('lottery.errorInvalidEmail')
                : errorKind === 'invalid_form'
                  ? errorDetail ?? t('lottery.errorInvalidForm')
                  : errorDetail ?? t('lottery.errorGeneric')}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full font-bold bg-[#146c43] hover:bg-[#166534] text-white text-base"
          >
            {status === 'loading' ? t('lottery.submitting') : copy.guideSubmitCta}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

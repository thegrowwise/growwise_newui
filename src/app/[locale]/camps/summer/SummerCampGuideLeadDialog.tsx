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
  SUMMERCAMP_GRADES,
  SUMMERCAMP_INTERESTS,
  type SummerCampGrade,
  type SummerCampInterest,
} from '@/lib/summercamp-keys';

export type GuideLeadCopy = {
  guideModalTitle: string;
  guideModalSubtitle: string;
  parentNameLabel: string;
  parentNamePlaceholder: string;
  guideSubmitCta: string;
};

export type SummerCampErrorKind = 'invalid_form' | 'invalid_email' | 'server' | null;

export function SummerCampGuideLeadDialog({
  open,
  onOpenChange,
  copy,
  summerCampSelectClassName,
  formAriaLabel,
  parentName,
  email,
  phone,
  childGrade,
  campInterest,
  status,
  errorKind,
  errorDetail,
  onParentNameChange,
  onEmailChange,
  onPhoneChange,
  onChildGradeChange,
  onCampInterestChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copy: GuideLeadCopy;
  summerCampSelectClassName: string;
  formAriaLabel: string;
  parentName: string;
  email: string;
  phone: string;
  childGrade: SummerCampGrade | '';
  campInterest: SummerCampInterest | '';
  status: 'idle' | 'loading' | 'error';
  errorKind: SummerCampErrorKind;
  errorDetail: string | null;
  onParentNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onChildGradeChange: (v: SummerCampGrade | '') => void;
  onCampInterestChange: (v: SummerCampInterest | '') => void;
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
            <Label htmlFor="summercamp-email">{t('summercamp.emailLabel')}</Label>
            <Input
              id="summercamp-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={t('summercamp.emailPlaceholder')}
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
            <Label htmlFor="summercamp-phone">{t('summercamp.phoneLabel')}</Label>
            <Input
              id="summercamp-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t('summercamp.phonePlaceholder')}
              value={phone}
              onChange={(ev) => onPhoneChange(ev.target.value)}
              disabled={status === 'loading'}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summercamp-grade">{t('summercamp.childGradeLabel')}</Label>
            <select
              id="summercamp-grade"
              name="childGrade"
              value={childGrade}
              onChange={(ev) => onChildGradeChange(ev.target.value as SummerCampGrade | '')}
              disabled={status === 'loading'}
              aria-invalid={status === 'error' && errorKind === 'invalid_form'}
              className={summerCampSelectClassName}
            >
              <option value="">{t('summercamp.gradePlaceholder')}</option>
              {SUMMERCAMP_GRADES.map((g) => (
                <option key={g} value={g}>
                  {t(`summercamp.grades.${g}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summercamp-interest">{t('summercamp.campInterestLabel')}</Label>
            <select
              id="summercamp-interest"
              name="campInterest"
              value={campInterest}
              onChange={(ev) => onCampInterestChange(ev.target.value as SummerCampInterest | '')}
              disabled={status === 'loading'}
              aria-invalid={status === 'error' && errorKind === 'invalid_form'}
              className={summerCampSelectClassName}
            >
              <option value="">{t('summercamp.interestPlaceholder')}</option>
              {SUMMERCAMP_INTERESTS.map((key) => (
                <option key={key} value={key}>
                  {t(`summercamp.interests.${key}`)}
                </option>
              ))}
            </select>
          </div>
          {status === 'error' && errorKind ? (
            <p className="text-sm text-red-600" role="alert">
              {errorKind === 'invalid_email'
                ? t('summercamp.errorInvalidEmail')
                : errorKind === 'invalid_form'
                  ? errorDetail ?? t('summercamp.errorInvalidForm')
                  : errorDetail ?? t('summercamp.errorGeneric')}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 w-full font-bold bg-[#146c43] hover:bg-[#166534] text-white text-base"
          >
            {status === 'loading' ? t('summercamp.submitting') : copy.guideSubmitCta}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

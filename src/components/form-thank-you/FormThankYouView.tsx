import Link from 'next/link';
import { CheckCircle, Clock, Shield, ThumbsUp } from 'lucide-react';
import type { FormThankYouContent } from '@/data/form-thank-you/types';
import { publicPath } from '@/lib/publicPath';

const HIGHLIGHT_ICONS = [Clock, Shield, ThumbsUp] as const;

type Props = {
  content: FormThankYouContent;
  /** next-intl / [locale] segment */
  locale: string;
};

/**
 * Centered thank-you content driven by JSON; CTA hrefs are locale-prefixed via publicPath.
 */
export function FormThankYouView({ content, locale }: Props) {
  const p = (path: string) => publicPath(path, locale);
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-sans"
      data-testid="form-thank-you"
    >
      <div className="container mx-auto max-w-xl px-4 py-14 md:px-6 md:py-20">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" aria-hidden />
          </div>
        </div>
        {content.kicker && (
          <p className="text-center text-sm font-medium text-emerald-800">{content.kicker}</p>
        )}
        <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {content.title}
        </h1>
        <div className="mt-6 space-y-4 text-center text-slate-700">
          {content.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        {content.highlights && content.highlights.length > 0 && (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {content.highlights.map((h, i) => {
              const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
              return (
                <li
                  key={h.text}
                  className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-4 text-center"
                >
                  {Icon && <Icon className="h-6 w-6 text-emerald-700" aria-hidden />}
                  <span className="text-sm text-slate-600">{h.text}</span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-10 flex flex-col gap-3 sm:mx-auto sm:max-w-md">
          <Link
            href={p(content.primaryCta.path)}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#F16112] px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#d3540f] md:text-base"
          >
            {content.primaryCta.label}
          </Link>
          {content.secondaryCta && (
            <Link
              href={p(content.secondaryCta.path)}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-[#1F396D] bg-white px-7 py-3.5 text-center text-sm font-semibold text-[#1F396D] transition-colors hover:bg-slate-50 md:text-base"
            >
              {content.secondaryCta.label}
            </Link>
          )}
        </div>
        <p className="mt-10 text-center">
          <Link
            href={p(content.backLink.path)}
            className="text-sm font-semibold text-[#1F396D] hover:underline"
          >
            {content.backLink.label}
          </Link>
        </p>
      </div>
    </div>
  );
}

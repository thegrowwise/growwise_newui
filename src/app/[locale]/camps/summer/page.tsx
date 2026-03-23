'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { SummerCampFaqItem } from './SummerCampPageFaq';
import { fetchSummerCampData, type Program, type OlympiadTierConfig } from '@/lib/summer-camp-data';
import { createLocaleUrl } from '@/components/layout/Header/utils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trackLotteryEntry, trackBrochureDownload, trackEarlyBirdReveal } from '@/lib/meta-pixel';
import {
  LOTTERY_GRADES,
  LOTTERY_INTERESTS,
  type LotteryGrade,
  type LotteryInterest,
} from '@/lib/summer-lottery-keys';

const ProgramList = dynamic(
  () => import('@/components/camps/SummerCampProgramList').then((m) => ({ default: m.ProgramList })),
  { ssr: true }
);
const SummerCampPageFaq = dynamic(
  () => import('./SummerCampPageFaq').then((m) => ({ default: m.SummerCampPageFaq })),
  {
    ssr: false,
    loading: () => (
      <section className="py-16 md:py-24 bg-white border-t border-slate-200" aria-hidden>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    ),
  }
);
// Radix Select/Dialog generate non-deterministic aria-controls IDs; render only on client to avoid hydration mismatch.
const SlotsPanel = dynamic(
  () => import('@/components/camps/SummerCampUI').then((m) => ({ default: m.SlotsPanel })),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-2xl border border-slate-200 bg-white/80 p-6 animate-pulse min-h-[320px]"
        aria-hidden
      />
    ),
  }
);

export type { SummerCampFaqItem };

export interface SummerCampFaqData {
  faqs: SummerCampFaqItem[];
}

type CampTypeFilter = 'all' | Program['category'];

const lotterySelectClass = cn(
  'flex h-11 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm md:text-base',
  'text-foreground outline-none transition-[color,box-shadow]',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
);

const DESKTOP_CAMP_CATEGORY_ORDER: Program['category'][] = ['Half-Day Camps', 'Full Day Camps'];

function orderSummerProgramsForGrid(list: Program[]): Program[] {
  return DESKTOP_CAMP_CATEGORY_ORDER.flatMap((cat) => list.filter((p) => p.category === cat));
}

/** Defer work off the critical path (FAQ fetch, route prefetch). Falls back to setTimeout. */
function scheduleIdleTask(cb: () => void, timeoutMs = 2200): () => void {
  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(() => cb(), { timeout: timeoutMs });
    return () => cancelIdleCallback(id);
  }
  const id = window.setTimeout(cb, 1);
  return () => clearTimeout(id);
}

export default function SummerCampPage() {
  const t = useTranslations('summerCamp');
  const locale = useLocale();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [olympiadTierConfigs, setOlympiadTierConfigs] = useState<OlympiadTierConfig[]>([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [campTypeFilter, setCampTypeFilter] = useState<CampTypeFilter>('all');
  const [faqs, setFaqs] = useState<SummerCampFaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [lotteryEmail, setLotteryEmail] = useState('');
  const [lotteryCampInterest, setLotteryCampInterest] = useState<LotteryInterest | ''>('');
  const [lotteryChildGrade, setLotteryChildGrade] = useState<LotteryGrade | ''>('');
  const [lotteryStatus, setLotteryStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [lotteryErrorKind, setLotteryErrorKind] = useState<
    'invalid_form' | 'invalid_email' | 'server' | null
  >(null);
  /** API `error` string or dev hint when the response was not JSON (e.g. HTML error page). */
  const [lotteryErrorDetail, setLotteryErrorDetail] = useState<string | null>(null);
  const [faqMount, setFaqMount] = useState(false);
  const slotsSectionRef = useRef<HTMLElement>(null);
  const faqSentinelRef = useRef<HTMLDivElement>(null);

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSelectProgram = useCallback((p: Program) => {
    setSelectedProgram(p);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.getElementById('slots-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const clearLotteryError = () => {
    if (lotteryStatus === 'error') {
      setLotteryStatus('idle');
      setLotteryErrorKind(null);
      setLotteryErrorDetail(null);
    }
  };

  const handleLotterySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrim = lotteryEmail.trim();
    const gradeOk = lotteryChildGrade !== '';
    const interestOk = lotteryCampInterest !== '';
    const emailOk = EMAIL_REGEX.test(emailTrim);

    if (!gradeOk || !interestOk) {
      setLotteryStatus('error');
      setLotteryErrorKind('invalid_form');
      return;
    }
    if (!emailOk) {
      setLotteryStatus('error');
      setLotteryErrorKind('invalid_email');
      return;
    }

    setLotteryStatus('loading');
    setLotteryErrorKind(null);
    setLotteryErrorDetail(null);
    try {
      const res = await fetch('/api/summer-camp-lottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childGrade: lotteryChildGrade,
          campInterest: lotteryCampInterest,
          email: emailTrim,
          locale,
        }),
      });
      const raw = await res.text();
      let parsed: { success?: boolean; error?: string } = {};
      let jsonInvalid = false;
      if (raw.trim()) {
        try {
          parsed = JSON.parse(raw) as typeof parsed;
        } catch {
          jsonInvalid = true;
        }
      }

      const apiError =
        typeof parsed.error === 'string' && parsed.error.trim()
          ? parsed.error.trim().slice(0, 280)
          : null;

      if (!res.ok || parsed.success !== true) {
        setLotteryStatus('error');
        const kind = res.status === 400 ? 'invalid_form' : 'server';
        setLotteryErrorKind(kind);
        if (jsonInvalid && raw.trim()) {
          const html = raw.trimStart().startsWith('<');
          setLotteryErrorDetail(
            html && process.env.NODE_ENV === 'development'
              ? 'Server returned an error page instead of JSON — check the terminal running next dev.'
              : apiError
          );
          if (process.env.NODE_ENV === 'development' && html) {
            console.error('[summer lottery] Non-JSON error response (first 200 chars):', raw.slice(0, 200));
          }
        } else {
          setLotteryErrorDetail(apiError);
        }
        return;
      }
      trackLotteryEntry(lotteryCampInterest, lotteryChildGrade);
      const qs = new URLSearchParams({
        interest: lotteryCampInterest,
        grade: lotteryChildGrade,
      });
      router.push(
        `${createLocaleUrl('/camps/summer/lottery-success', locale)}?${qs.toString()}`
      );
      setLotteryChildGrade('');
      setLotteryCampInterest('');
      setLotteryEmail('');
      setLotteryStatus('idle');
    } catch (err) {
      setLotteryStatus('error');
      setLotteryErrorKind('server');
      setLotteryErrorDetail(
        process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : null
      );
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setProgramsLoading(true);
      try {
        const { programs: p, olympiadTierConfigs: o } = await fetchSummerCampData(locale);
        if (!cancelled) {
          setPrograms(p);
          setOlympiadTierConfigs(o);
          const isMobileViewport =
            typeof window !== 'undefined' && window.innerWidth <= 768;
          setSelectedProgram((prev) => {
            const mapped = prev ? p.find((x) => x.id === prev.id) : undefined;
            if (isMobileViewport) return mapped ?? null;
            return mapped ?? p[0] ?? null;
          });
        }
      } catch {
        if (!cancelled) {
          setPrograms([]);
          setOlympiadTierConfigs([]);
          setSelectedProgram(null);
        }
      } finally {
        if (!cancelled) setProgramsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // FAQ JSON after programs settle — avoids competing with hero + program images on the critical network path.
  useEffect(() => {
    if (programsLoading) return;
    let cancelled = false;
    const cancelIdle = scheduleIdleTask(() => {
      if (cancelled) return;
      void (async () => {
        setFaqsLoading(true);
        try {
          const res = await fetch(`/api/mock/${locale}/summer-camp-faq.json`);
          if (!res.ok) {
            const fallback = locale !== 'en' ? await fetch('/api/mock/en/summer-camp-faq.json') : null;
            if (fallback?.ok && !cancelled) {
              const data: SummerCampFaqData = await fallback.json();
              setFaqs(data.faqs ?? []);
            } else if (!cancelled) {
              setFaqs([]);
            }
          } else {
            const data: SummerCampFaqData = await res.json();
            if (!cancelled) setFaqs(data.faqs ?? []);
          }
        } catch {
          if (!cancelled) setFaqs([]);
        } finally {
          if (!cancelled) setFaqsLoading(false);
        }
      })();
    });
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [programsLoading, locale]);

  // Warm the slots/cart chunk before first interaction (same module as SlotsPanel).
  useEffect(() => {
    if (programsLoading) return;
    let cancelled = false;
    const cancelIdle = scheduleIdleTask(() => {
      if (!cancelled) void import('@/components/camps/SummerCampUI');
    }, 2800);
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [programsLoading]);

  const filteredPrograms = useMemo(() => {
    if (campTypeFilter === 'all') return programs;
    return programs.filter((p) => p.category === campTypeFilter);
  }, [programs, campTypeFilter]);

  const campCategoryOrder = useMemo(() => {
    const present = new Set(programs.map((p) => p.category));
    return DESKTOP_CAMP_CATEGORY_ORDER.filter((c) => present.has(c));
  }, [programs]);

  useEffect(() => {
    if (programsLoading || programs.length === 0) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const list =
      campTypeFilter === 'all'
        ? programs
        : programs.filter((p) => p.category === campTypeFilter);
    const ordered = orderSummerProgramsForGrid(list);
    setSelectedProgram((prev) => {
      if (prev && ordered.some((p) => p.id === prev.id)) return prev;
      // Mobile: no auto-select when changing filter (stay unselected until user taps Enroll).
      if (isMobile) return null;
      return ordered[0] ?? null;
    });
  }, [programs, programsLoading, campTypeFilter]);

  const scrollToSlots = () => {
    slotsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let lastWide = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const handleResize = () => {
      const wide = window.innerWidth >= 1024;
      // Only react when crossing the desktop/tablet boundary — avoids scroll jank on every resize tick.
      if (lastWide && !wide && selectedProgram) {
        document.getElementById('slots-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      lastWide = wide;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProgram]);

  useEffect(() => {
    setFaqMount(false);
  }, [locale]);

  useEffect(() => {
    if (faqMount) return;
    const el = faqSentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setFaqMount(true);
        }
      },
      { rootMargin: '320px 0px', threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [locale, faqMount]);

  useEffect(() => { if (!programsLoading) trackEarlyBirdReveal(); }, [programsLoading]);

  const scrollToLottery = () => {
    document.getElementById('lottery')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-[#1F396D]/20 selection:text-[#1F396D] max-[768px]:pb-[60px]">
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      <main>
        {/* Hero Banner */}
        <section className="relative w-full overflow-hidden max-[768px]:overflow-visible">
          {/* Fixed hero height for stable LCP; next/image serves AVIF/WebP per next.config */}
          <div className="relative w-full h-[min(65vh,42rem)]">
            <Image
              src="/assets/camps/summer-camp-banner.png"
              alt="GrowWise Summer Camp 2026 in Dublin, California — half-day and full-day camps in math, coding, robotics, and enrichment for grades 3–12"
              fill
              priority
              fetchPriority="high"
              quality={72}
              sizes="100vw"
              className="object-cover object-top select-none"
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[12%] gap-8">
            {/* Early bird notification badge — just above the buttons */}
            <div
              className="flex justify-center px-4 hero-fade-in"
              role="status"
              aria-live="polite"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 shadow-lg border border-white/80 text-[#1F396D] font-bold text-sm sm:text-base text-center md:backdrop-blur-sm">
                {/* Static dot — avoids continuous animate-ping repaints (major CPU saver) */}
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                <span>15% off for early bird on any course is live now — Use code: <strong className="font-extrabold">GWSUMMER15</strong></span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 hero-fade-in hero-fade-in-delay">
              <button
                onClick={scrollToSlots}
                className="px-10 py-4 rounded-full bg-[#1F396D] text-white font-extrabold text-base md:text-lg uppercase tracking-wider hover:bg-[#162d57] transition-shadow duration-300 shadow-[0_0_12px_rgba(31,57,109,0.35)] hover:shadow-[0_0_20px_rgba(31,57,109,0.45)]"
              >
                Explore
              </button>
              <a
                href="/assets/camps/final%20brochure.pdf"
                onClick={trackBrochureDownload}
                className="px-10 py-4 rounded-full bg-white/95 text-[#1F396D] font-extrabold text-base md:text-lg uppercase tracking-wider hover:bg-white transition-shadow duration-300 border border-white/50 shadow-[0_0_10px_rgba(255,255,255,0.35)] md:backdrop-blur-sm"
              >
                Download Brochure
              </a>
            </div>
          </div>
          <style>{`
            @keyframes summerHeroFadeIn {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .hero-fade-in {
              opacity: 0;
              animation: summerHeroFadeIn 0.45s ease-out 0.08s forwards;
            }
            .hero-fade-in-delay {
              animation-delay: 0.16s;
            }
            @media (prefers-reduced-motion: reduce) {
              .hero-fade-in {
                animation: none;
                opacity: 1;
                transform: none;
              }
            }
          `}</style>
        </section>

        {/* Programs & Slots Section */}
        <section
          id="slots-section"
          ref={slotsSectionRef}
          className="py-20 relative border-y border-slate-100"
          style={{
            background:
              'linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #fff7ed 70%, #fed7aa 100%)',
          }}
        >
          {/* Subtle radial accents — overflow is clipped by the section's clip-path wrapper below */}
          {/* Large blur-3xl orbs are expensive on mobile GPUs — desktop only */}
          <div
            className="absolute inset-0 pointer-events-none overflow-clip max-[768px]:overflow-visible hidden md:block"
            style={{ zIndex: 0 }}
            aria-hidden="true"
          >
            <div className="absolute top-0 left-0 w-[45%] h-[50%] rounded-full blur-3xl opacity-30 bg-[#1F396D]/20" />
            <div className="absolute bottom-0 right-0 w-[45%] h-[50%] rounded-full blur-3xl opacity-30 bg-orange-400/20" />
          </div>

          <div className="container mx-auto px-4 md:px-6" style={{ position: 'relative', zIndex: 1 }}>
            {programsLoading ? (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4 animate-pulse" aria-busy="true" aria-label="Loading programs">
                  <div className="h-10 bg-slate-200 rounded w-48" />
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-48 bg-slate-100 rounded-xl" />
                    ))}
                  </div>
                </div>
                <div
                  className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white/80 p-6 animate-pulse min-h-[320px]"
                  aria-hidden
                />
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 items-start relative">
                {/* Left Column: Program List */}
                <div className="lg:col-span-7">
                  {/* Mobile sticky sub-nav (≤768px) */}
                  <div
                    className="min-[769px]:hidden flex items-center justify-between gap-3 py-3 -mx-4 px-4 mb-4"
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 100,
                      background: 'white',
                      borderBottom: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Link
                      href={createLocaleUrl('/', locale)}
                      className="flex-shrink-0 relative h-8 w-[120px]"
                      aria-label="GrowWise home"
                    >
                      <Image
                        src="/assets/growwise-logo.png"
                        alt="GrowWise"
                        fill
                        sizes="120px"
                        className="object-contain object-left"
                        draggable={false}
                      />
                    </Link>
                    <button
                      type="button"
                      className="text-sm font-semibold text-[#1F396D] whitespace-nowrap"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      {t('mobile.viewAllCamps')}
                    </button>
                  </div>

                  <div className="mb-10">
                    {/* Desktop filter bar (≥769px) */}
                    <div
                      className="flex flex-wrap"
                      style={{
                        gap: 12,
                        padding: '16px 0 20px',
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        marginBottom: 24,
                      }}
                      role="group"
                      aria-label={t('filter.ariaLabel')}
                    >
                      <button
                        type="button"
                        onClick={() => setCampTypeFilter('all')}
                        className="cursor-pointer rounded-[20px] px-[18px] py-2 text-sm font-medium"
                        style={
                          campTypeFilter === 'all'
                            ? {
                                background: '#1D9E75',
                                border: '1px solid #1D9E75',
                                color: 'white',
                              }
                            : {
                                background: 'white',
                                border: '1px solid #d0d5dd',
                                color: '#344054',
                              }
                        }
                      >
                        {t('filter.allCamps')} {programs.length}
                      </button>
                      {campCategoryOrder.map((cat) => {
                        const count = programs.filter((p) => p.category === cat).length;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCampTypeFilter(cat)}
                            className="cursor-pointer rounded-[20px] px-[18px] py-2 text-sm font-medium"
                            style={
                              campTypeFilter === cat
                                ? {
                                    background: '#1D9E75',
                                    border: '1px solid #1D9E75',
                                    color: 'white',
                                  }
                                : {
                                    background: 'white',
                                    border: '1px solid #d0d5dd',
                                    color: '#344054',
                                  }
                            }
                          >
                            {cat} {count}
                          </button>
                        );
                      })}
                    </div>

                    <h2 className="font-heading font-black text-3xl text-slate-900 mb-2 uppercase tracking-tight">
                      {t('page.title')}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {t('page.subtitle')}
                    </p>
                  </div>
                  <ProgramList
                    programs={filteredPrograms}
                    onSelectProgram={handleSelectProgram}
                    selectedProgramId={selectedProgram?.id ?? null}
                  />
                </div>

                {/* Right Column: Slots Panel (Sticky) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)] max-[768px]:min-h-0">
                  {selectedProgram && (
                    <SlotsPanel
                      program={selectedProgram}
                      olympiadTierConfigs={olympiadTierConfigs}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Free spot lottery — email capture; anchor for mobile CTA / accordion link */}
        <section
          id="lottery"
          className="py-14 md:py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200 scroll-mt-20 max-[768px]:scroll-mt-4"
          aria-labelledby="lottery-heading"
        >
          <div className="container mx-auto px-4 md:px-6 max-w-xl">
            <h2
              id="lottery-heading"
              className="font-heading font-black text-2xl md:text-3xl text-slate-900 uppercase tracking-tight text-center mb-2"
            >
              {t('lottery.title')}
            </h2>
            <p className="text-slate-600 text-sm md:text-base text-center mb-8 leading-relaxed">
              {t('lottery.subtitle')}
            </p>
            <form
              onSubmit={handleLotterySubmit}
              className="space-y-4"
              noValidate
              aria-label={t('lottery.formAriaLabel')}
            >
                <div className="space-y-2">
                  <Label htmlFor="summer-lottery-email">{t('lottery.emailLabel')}</Label>
                  <Input
                    id="summer-lottery-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder={t('lottery.emailPlaceholder')}
                    value={lotteryEmail}
                    onChange={(ev) => {
                      setLotteryEmail(ev.target.value);
                      clearLotteryError();
                    }}
                    disabled={lotteryStatus === 'loading'}
                    aria-invalid={
                      lotteryStatus === 'error' &&
                      (lotteryErrorKind === 'invalid_email' || lotteryErrorKind === 'invalid_form')
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summer-lottery-interest">{t('lottery.campInterestLabel')}</Label>
                  <select
                    id="summer-lottery-interest"
                    name="campInterest"
                    value={lotteryCampInterest}
                    onChange={(ev) => {
                      setLotteryCampInterest(ev.target.value as LotteryInterest | '');
                      clearLotteryError();
                    }}
                    disabled={lotteryStatus === 'loading'}
                    aria-invalid={lotteryStatus === 'error' && lotteryErrorKind === 'invalid_form'}
                    className={lotterySelectClass}
                  >
                    <option value="">{t('lottery.interestPlaceholder')}</option>
                    {LOTTERY_INTERESTS.map((key) => (
                      <option key={key} value={key}>
                        {t(`lottery.interests.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="summer-lottery-grade">{t('lottery.childGradeLabel')}</Label>
                  <select
                    id="summer-lottery-grade"
                    name="childGrade"
                    value={lotteryChildGrade}
                    onChange={(ev) => {
                      setLotteryChildGrade(ev.target.value as LotteryGrade | '');
                      clearLotteryError();
                    }}
                    disabled={lotteryStatus === 'loading'}
                    aria-invalid={lotteryStatus === 'error' && lotteryErrorKind === 'invalid_form'}
                    className={lotterySelectClass}
                  >
                    <option value="">{t('lottery.gradePlaceholder')}</option>
                    {LOTTERY_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {t(`lottery.grades.${g}`)}
                      </option>
                    ))}
                  </select>
                </div>
                {lotteryStatus === 'error' && lotteryErrorKind ? (
                  <p className="text-sm text-red-600" role="alert">
                    {lotteryErrorKind === 'invalid_email'
                      ? t('lottery.errorInvalidEmail')
                      : lotteryErrorKind === 'invalid_form'
                        ? lotteryErrorDetail ?? t('lottery.errorInvalidForm')
                        : lotteryErrorDetail ?? t('lottery.errorGeneric')}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  disabled={lotteryStatus === 'loading'}
                  className="w-full h-11 font-bold bg-[#1D9E75] hover:bg-[#178a66] text-white"
                >
                  {lotteryStatus === 'loading' ? t('lottery.submitting') : t('lottery.submit')}
                </Button>
            </form>
          </div>
        </section>

        {/* Sentinel: FAQ accordion chunk + Radix load only when near viewport */}
        <div ref={faqSentinelRef} className="h-px w-full shrink-0" aria-hidden />
        {faqMount ? (
          <SummerCampPageFaq faqs={faqs} loading={faqsLoading} />
        ) : null}
      </main>

      {/* Mobile fixed bottom bar */}
      <div
        className="min-[769px]:hidden fixed bottom-0 left-0 w-full z-[100] flex items-center justify-between"
        style={{
          background: '#085041',
          padding: '10px 16px',
        }}
      >
        <span className="text-[13px] font-medium pr-2" style={{ color: '#9FE1CB' }}>
          {t('mobile.earlyBirdBar')}
        </span>
        <button
          type="button"
          className="flex-shrink-0 font-semibold text-white"
          style={{
            background: '#1D9E75',
            borderRadius: 8,
            padding: '6px 14px',
          }}
          onClick={scrollToLottery}
        >
          {t('mobile.winFreeSpot')}
        </button>
      </div>
    </div>
  );
}

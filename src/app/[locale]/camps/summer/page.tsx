'use client';

import { useState, useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { SummerCampFaqItem } from './SummerCampPageFaq';
import { fetchSummerCampData, getDefaultSummerCampData, type Program, type OlympiadTierConfig } from '@/lib/summer-camp-data';
import { createLocaleUrl } from '@/components/layout/Header/utils';
import { cn } from '@/lib/utils';
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
import { trackSummerCampGuideLead, trackEarlyBirdReveal } from '@/lib/meta-pixel';
import {
  LOTTERY_GRADES,
  LOTTERY_INTERESTS,
  type LotteryGrade,
  type LotteryInterest,
} from '@/lib/summer-lottery-keys';
import enMessages from '@/i18n/messages/en.json';
import {
  SUMMER_CAMP_PROGRAM_GROUP_IDS,
  SUMMER_CAMP_PROGRAM_TRACK_ORDER,
  getSummerCampProgramTrack,
  orderProgramsBySummerCampTrack,
  type SummerCampProgramTrack,
} from '@/lib/summer-camp-program-groups';
import { SummerCampTrustBlock } from '@/components/camps/SummerCampTrustBlock';

/** Canonical English hero + conversion copy (en.json). */
const SUMMER_CAMP_HERO_EN = enMessages.summerCamp.hero;
type SummerCampConversion = {
  programGroupsHeading: string;
  programGroupsSub: string;
  exploreProgramCta: string;
  programGroups: Array<{ title: string; outcome: string; ages: string }>;
  trustBlockHeading: string;
  trustGoogleRatingLine: string;
  trustProofStrip: string;
  trustReviews: Array<{ quote: string; byline: string }>;
  trustBullets: string[];
  trustProjectsCta: string;
  trustProjectsUrl: string;
  guideModalTitle: string;
  guideModalSubtitle: string;
  parentNameLabel: string;
  parentNamePlaceholder: string;
  guideSubmitCta: string;
  finalHeading: string;
  finalSubtext: string;
  finalReserveCta: string;
  finalGuidePdfCta: string;
  bookingSectionTitle: string;
  bookingSectionSub: string;
};
const SC = (enMessages.summerCamp as { conversion: SummerCampConversion }).conversion;

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

/** Booking grid filter: all programs, one program track, or full-day-only (e.g. robotics, Young Authors). */
type ProgramTrackFilter = 'all' | SummerCampProgramTrack | 'fullDay';

const lotterySelectClass = cn(
  'flex h-11 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm md:text-base',
  'text-foreground outline-none transition-[color,box-shadow]',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
);

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
  const _defaultCampData = getDefaultSummerCampData();
  const [programs, setPrograms] = useState<Program[]>(_defaultCampData.programs);
  const [olympiadTierConfigs, setOlympiadTierConfigs] = useState<OlympiadTierConfig[]>(_defaultCampData.olympiadTierConfigs);
  // English data is already loaded from the static bundle; no skeleton needed on first render.
  const [programsLoading, setProgramsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(_defaultCampData.programs[0] ?? null);
  const [programTrackFilter, setProgramTrackFilter] = useState<ProgramTrackFilter>('all');
  const [faqs, setFaqs] = useState<SummerCampFaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [lotteryEmail, setLotteryEmail] = useState('');
  const [lotteryParentName, setLotteryParentName] = useState('');
  const [lotteryCampInterest, setLotteryCampInterest] = useState<LotteryInterest | ''>('');
  const [lotteryChildGrade, setLotteryChildGrade] = useState<LotteryGrade | ''>('');
  const [lotteryStatus, setLotteryStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [lotteryErrorKind, setLotteryErrorKind] = useState<
    'invalid_form' | 'invalid_email' | 'server' | null
  >(null);
  /** API `error` string or dev hint when the response was not JSON (e.g. HTML error page). */
  const [lotteryErrorDetail, setLotteryErrorDetail] = useState<string | null>(null);
  const [faqMount, setFaqMount] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const guideModalUserDismissedRef = useRef(false);
  /** Timestamp of last programmatic open; null until first open (avoid Date.now()-0 looking “old”). */
  const guideModalOpenedAtRef = useRef<number | null>(null);
  const slotsSectionRef = useRef<HTMLElement>(null);
  const faqSentinelRef = useRef<HTMLDivElement>(null);

  const openGuideModal = useCallback(() => {
    guideModalUserDismissedRef.current = false;
    guideModalOpenedAtRef.current = Date.now();
    setGuideModalOpen(true);
  }, []);

  const handleGuideModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      const openedAt = guideModalOpenedAtRef.current;
      // Radix + React Strict Mode in dev often emit a false right after open; do not commit that close.
      if (openedAt != null && Date.now() - openedAt < 500) return;
      if (openedAt != null) guideModalUserDismissedRef.current = true;
    } else {
      guideModalOpenedAtRef.current = Date.now();
    }
    setGuideModalOpen(open);
  }, []);

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
    const parentOk = lotteryParentName.trim().length >= 2;
    const gradeOk = lotteryChildGrade !== '';
    const interestOk = lotteryCampInterest !== '';
    const emailOk = EMAIL_REGEX.test(emailTrim);

    if (!parentOk || !gradeOk || !interestOk) {
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
          parentName: lotteryParentName.trim(),
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
      trackSummerCampGuideLead(lotteryCampInterest, lotteryChildGrade);
      const qs = new URLSearchParams({
        interest: lotteryCampInterest,
        grade: lotteryChildGrade,
      });
      router.push(
        `${createLocaleUrl('/camps/summer/guide-success', locale)}?${qs.toString()}`
      );
      setLotteryChildGrade('');
      setLotteryCampInterest('');
      setLotteryEmail('');
      setLotteryParentName('');
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
    // English data is already hydrated from the static bundle — no fetch needed.
    if (locale === 'en') {
      const p = _defaultCampData.programs;
      const isMobileViewport = typeof window !== 'undefined' && window.innerWidth <= 768;
      setSelectedProgram((prev) => {
        const mapped = prev ? p.find((x) => x.id === prev.id) : undefined;
        if (isMobileViewport) return mapped ?? null;
        return mapped ?? p[0] ?? null;
      });
      return;
    }
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
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (programTrackFilter === 'all') return programs;
    if (programTrackFilter === 'fullDay') {
      return programs.filter((p) => p.category === 'Full Day Camps');
    }
    return programs.filter((p) => getSummerCampProgramTrack(p.id) === programTrackFilter);
  }, [programs, programTrackFilter]);

  const fullDayCampCount = useMemo(
    () => programs.filter((p) => p.category === 'Full Day Camps').length,
    [programs]
  );

  const programTrackOrder = useMemo(() => {
    const present = new Set<SummerCampProgramTrack>();
    for (const p of programs) {
      const tr = getSummerCampProgramTrack(p.id);
      if (tr) present.add(tr);
    }
    return SUMMER_CAMP_PROGRAM_TRACK_ORDER.filter((tr) => present.has(tr));
  }, [programs]);

  const scrollToSlots = useCallback(() => {
    slotsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const selectGroupAndScrollToBooking = useCallback(
    (groupIndex: number) => {
      const ids = SUMMER_CAMP_PROGRAM_GROUP_IDS[groupIndex];
      let picked: Program | null = null;
      for (const id of ids) {
        const p = programs.find((x) => x.id === id);
        if (p) {
          picked = p;
          break;
        }
      }
      if (picked) setSelectedProgram(picked);
      setProgramTrackFilter('all');
      guideModalUserDismissedRef.current = true;
      setGuideModalOpen(false);
      requestAnimationFrame(() => scrollToSlots());
    },
    [programs, scrollToSlots]
  );

  useEffect(() => {
    if (programsLoading || programs.length === 0) return;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const list =
      programTrackFilter === 'all'
        ? programs
        : programTrackFilter === 'fullDay'
          ? programs.filter((p) => p.category === 'Full Day Camps')
          : programs.filter((p) => getSummerCampProgramTrack(p.id) === programTrackFilter);
    const ordered = orderProgramsBySummerCampTrack(list);
    setSelectedProgram((prev) => {
      if (prev && ordered.some((p) => p.id === prev.id)) return prev;
      // Mobile: no auto-select when changing filter (stay unselected until user taps Enroll).
      if (isMobile) return null;
      return ordered[0] ?? null;
    });
  }, [programs, programsLoading, programTrackFilter]);

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

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      setShowStickyCta(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /**
   * Deep links #lead-capture / #lottery open the lead modal.
   * In dev, Strict Mode can flip Radix Dialog closed without a real user dismiss; the follow-up
   * effect re-opens while `guideModalUserDismissedRef` is false. Intentional closes set the ref
   * (overlay/X, or “Explore program” navigation) so we do not fight the user.
   */
  useLayoutEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash;
      if (h === '#lead-capture' || h === '#lottery') {
        guideModalUserDismissedRef.current = false;
        guideModalOpenedAtRef.current = Date.now();
        setGuideModalOpen(true);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  useEffect(() => {
    if (guideModalUserDismissedRef.current) return;
    const h = typeof window !== 'undefined' ? window.location.hash : '';
    if (!guideModalOpen && (h === '#lead-capture' || h === '#lottery')) {
      guideModalOpenedAtRef.current = Date.now();
      setGuideModalOpen(true);
    }
  }, [guideModalOpen]);

  return (
    <div
      className={cn(
        'min-h-screen bg-background font-sans selection:bg-[#1F396D]/20 selection:text-[#1F396D]',
        showStickyCta ? 'pb-28 md:pb-24' : 'max-[768px]:pb-[60px]'
      )}
    >
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
        {/* Hero: single image + overlay, headline → context → price → CTAs → trust → discount */}
        <section className="relative isolate min-h-[min(70vh,44rem)] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/camps/summer-camp-banner.png"
              alt="Students in coding, robotics, and math summer programs at GrowWise, Dublin, California"
              fill
              priority
              fetchPriority="high"
              quality={72}
              sizes="100vw"
              className="object-cover object-center select-none"
              draggable={false}
            />
            <div className="absolute inset-0 z-[1] bg-[rgba(0,0,0,0.6)]" aria-hidden />
          </div>
          <div
            className={cn(
              'relative z-10 mx-auto flex w-full max-w-[1100px] flex-col justify-center text-left',
              'px-10 py-10 md:py-[120px] md:pl-20 md:pr-12'
            )}
          >
            <h1 className="font-heading max-w-[700px] text-[1.625rem] font-bold leading-[1.2] text-white sm:text-[1.875rem] md:text-[2.75rem] lg:text-[3rem]">
              {SUMMER_CAMP_HERO_EN.h1}
            </h1>
            <p className="mt-3 max-w-[650px] text-lg text-zinc-200 md:text-xl">
              {SUMMER_CAMP_HERO_EN.subhead}
            </p>
            <div className="mt-6 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
              <Link
                href="#slots-section"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#10b981] px-7 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#059669] sm:w-auto sm:min-w-[220px] sm:text-base"
              >
                {SUMMER_CAMP_HERO_EN.primaryCta}
              </Link>
              <a
                href={SUMMER_CAMP_HERO_EN.brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg border border-white/90 bg-transparent px-5 py-2.5 text-center text-xs font-medium text-white/95 transition-colors hover:bg-white/10 sm:w-auto sm:min-w-[min(100%,11rem)] sm:max-w-[14rem] sm:text-sm"
                aria-label={`${SUMMER_CAMP_HERO_EN.secondaryCta.trim()} — ${SUMMER_CAMP_HERO_EN.downloadBrochure}`}
              >
                {SUMMER_CAMP_HERO_EN.secondaryCta}
              </a>
            </div>
            <p className="mt-3 max-w-2xl text-xs font-semibold leading-snug text-amber-100 sm:text-sm sm:leading-snug">
              {SUMMER_CAMP_HERO_EN.urgencyLine}
            </p>
            <p className="mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-zinc-200 sm:text-base sm:leading-relaxed">
              {SUMMER_CAMP_HERO_EN.trustMicro}
            </p>
          </div>
        </section>

        {/* Section 2 — Program grouping (3 cards) */}
        <section
          id="program-groups"
          className="scroll-mt-24 border-b border-slate-200 bg-white py-14 md:py-20"
          aria-labelledby="program-groups-heading"
        >
          <div className="mx-auto max-w-[1100px] px-10 md:px-12">
            <h2 id="program-groups-heading" className="font-heading text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {SC.programGroupsHeading}
            </h2>
            <p className="mt-2 max-w-2xl text-slate-600">{SC.programGroupsSub}</p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SC.programGroups.map((card, i) => (
                <div
                  key={`${card.title}-${i}`}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="font-heading text-lg font-bold text-[#1F396D]">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{card.outcome}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{card.ages}</p>
                  <button
                    type="button"
                    onClick={() => selectGroupAndScrollToBooking(i)}
                    className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[#1F396D] bg-white px-4 py-3 text-sm font-semibold text-[#1F396D] transition-colors hover:bg-[#1F396D]/5"
                  >
                    {SC.exploreProgramCta}
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                        onClick={() => setProgramTrackFilter('all')}
                        className="cursor-pointer rounded-[20px] px-[18px] py-2 text-sm font-medium"
                        style={
                          programTrackFilter === 'all'
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
                      {programTrackOrder.map((track) => {
                        const count = programs.filter((p) => getSummerCampProgramTrack(p.id) === track).length;
                        const label =
                          track === 'academic'
                            ? t('filter.trackAcademic')
                            : track === 'aiGameDev'
                              ? t('filter.trackAiGameDev')
                              : t('filter.trackCreativeWriting');
                        return (
                          <button
                            key={track}
                            type="button"
                            onClick={() => setProgramTrackFilter(track)}
                            className="cursor-pointer rounded-[20px] px-[18px] py-2 text-sm font-medium"
                            style={
                              programTrackFilter === track
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
                            {label} {count}
                          </button>
                        );
                      })}
                      {fullDayCampCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => setProgramTrackFilter('fullDay')}
                          className="cursor-pointer rounded-[20px] px-[18px] py-2 text-sm font-medium"
                          style={
                            programTrackFilter === 'fullDay'
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
                          {t('filter.fullDayCamps')} {fullDayCampCount}
                        </button>
                      ) : null}
                    </div>

                    <h2 className="font-heading font-black text-3xl text-slate-900 mb-2 uppercase tracking-tight">
                      {SC.bookingSectionTitle}
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {SC.bookingSectionSub}
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

        {/* Conversion after program cards: reserve vs camp guide */}
        <section className="border-b border-slate-200 bg-white py-14 md:py-20" aria-labelledby="final-cta-heading">
          <div className="mx-auto max-w-[1100px] px-10 text-center md:px-12">
            <h2 id="final-cta-heading" className="font-heading text-2xl font-bold text-slate-900 md:text-4xl">
              {SC.finalHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-700 md:text-base">{SC.finalSubtext}</p>
            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-lg">
              <button
                type="button"
                onClick={scrollToSlots}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#10b981] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#059669] md:text-base"
              >
                {SC.finalReserveCta}
              </button>
              <button
                type="button"
                onClick={openGuideModal}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border-2 border-[#1F396D] bg-white px-6 py-3 text-sm font-medium text-[#1F396D] transition-colors hover:bg-slate-50"
              >
                {SC.finalGuidePdfCta}
              </button>
            </div>
          </div>
        </section>

        {/* Trust — static copy from en.json (before FAQ) */}
        <SummerCampTrustBlock
          heading={SC.trustBlockHeading}
          googleRatingLine={SC.trustGoogleRatingLine}
          reviews={SC.trustReviews}
          proofStrip={SC.trustProofStrip}
          bullets={SC.trustBullets}
          projectsCta={SC.trustProjectsCta}
          projectsCtaHref={SC.trustProjectsUrl}
        />

        {/* Sentinel: FAQ accordion chunk + Radix load only when near viewport */}
        <div ref={faqSentinelRef} className="h-px w-full shrink-0" aria-hidden />
        {faqMount ? (
          <SummerCampPageFaq faqs={faqs} loading={faqsLoading} />
        ) : null}
      </main>

      <Dialog open={guideModalOpen} onOpenChange={handleGuideModalOpenChange}>
        <DialogContent id="lead-capture" className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-slate-900">{SC.guideModalTitle}</DialogTitle>
            <DialogDescription id="lead-modal-description" className="text-slate-600">
              {SC.guideModalSubtitle}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLotterySubmit} className="mt-2 space-y-4" noValidate aria-label={t('guideForm.ariaLabel')}>
            <div className="space-y-2">
              <Label htmlFor="summer-lead-parent">{SC.parentNameLabel}</Label>
              <Input
                id="summer-lead-parent"
                name="parentName"
                type="text"
                autoComplete="name"
                placeholder={SC.parentNamePlaceholder}
                value={lotteryParentName}
                onChange={(ev) => {
                  setLotteryParentName(ev.target.value);
                  clearLotteryError();
                }}
                disabled={lotteryStatus === 'loading'}
                aria-invalid={lotteryStatus === 'error' && lotteryErrorKind === 'invalid_form'}
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
              className="h-12 w-full font-bold bg-[#1D9E75] hover:bg-[#178a66] text-white text-base"
            >
              {lotteryStatus === 'loading' ? t('lottery.submitting') : SC.guideSubmitCta}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sticky conversion bar — reserve vs guide (hidden while guide modal is open) */}
      {showStickyCta && !guideModalOpen ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200/80 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm md:px-6">
          <div className="mx-auto flex max-w-[1100px] flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={scrollToSlots}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#10b981] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#059669] sm:w-auto md:text-base"
            >
              {SC.finalReserveCta}
            </button>
            <button
              type="button"
              onClick={openGuideModal}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-slate-300 bg-transparent px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto"
            >
              {SC.finalGuidePdfCta}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

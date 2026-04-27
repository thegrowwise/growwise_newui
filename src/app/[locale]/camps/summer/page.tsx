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
  type SummerCampGrade,
  type SummerCampInterest,
} from '@/lib/summercamp-keys';
import { isAutomatedAuditEnvironment } from '@/lib/consent';
import canonicalSummerCampEn from '@/i18n/messages/summer-camp-canonical-en.json';
import {
  SUMMER_CAMP_PROGRAM_GROUP_IDS,
  SUMMER_CAMP_PROGRAM_TRACK_ORDER,
  getSummerCampProgramTrack,
  orderProgramsBySummerCampTrack,
  type SummerCampProgramTrack,
} from '@/lib/summer-camp-program-groups';
import { SummerCampTrustBlock } from '@/components/camps/SummerCampTrustBlock';
import {
  SUMMER_CAMP_PROGRAM_GROUP_SEO_LINKS,
  summerCampProgramGroupMessagePath,
} from '@/lib/summer-camp-seo-links';
import { SummerCampGuideLeadDialog } from './SummerCampGuideLeadDialog';

/**
 * Slim English-only hero + conversion copy (~4KB) for this page.
 * Keeps marketing strings identical on every locale URL; update alongside `en.json` → `summerCamp.hero` / `conversion`.
 */
const SUMMER_CAMP_HERO_EN = canonicalSummerCampEn.hero;
const SC = canonicalSummerCampEn.conversion;

/** Module-scoped default data — avoids per-render `getDefaultSummerCampData()` calls (singleton inside that fn anyway). */
const DEFAULT_CAMP_DATA = getDefaultSummerCampData();

const ProgramList = dynamic(
  () => import('@/components/camps/SummerCampProgramList').then((m) => ({ default: m.ProgramList })),
  { ssr: true }
);
const SummerCampPageFaq = dynamic(
  () => import('./SummerCampPageFaq').then((m) => ({ default: m.SummerCampPageFaq })),
  {
    ssr: false,
    loading: () => (
      <section className="py-16 md:py-24 bg-white border-t border-slate-200" aria-hidden="true">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-xl animate-pulse"
              aria-hidden="true"
            />
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
        aria-hidden="true"
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

const summerCampSelectClass = cn(
  'flex h-11 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm md:text-base',
  'text-foreground outline-none transition-[color,box-shadow]',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-destructive aria-invalid:ring-destructive/20'
);

/** Timed guide modal: desktop only (see fire-time `innerWidth` check). */
const SUMMERCAMP_POPUP_DISMISSED_KEY = 'summercamp_popup_dismissed';
const SUMMERCAMP_SUBMITTED_KEY = 'summercamp_submitted';
const SUMMERCAMP_TIMED_POPUP_MS = 3000;
const SUMMERCAMP_TIMED_POPUP_MIN_WIDTH = 768;
/** Ignore Radix duplicate `onOpenChange(false)` immediately after open (timestamp set in `markGuideModalOpenIntent`). */
const GUIDE_MODAL_SPURIOUS_CLOSE_MS = 150;
/** `?openGuide=1` — force timed popup (bypass localStorage) and allow in webdriver/Lighthouse for QA. */
const OPEN_GUIDE_QUERY = 'openGuide';

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
  const [programs, setPrograms] = useState<Program[]>(DEFAULT_CAMP_DATA.programs);
  const [olympiadTierConfigs, setOlympiadTierConfigs] = useState<OlympiadTierConfig[]>(
    DEFAULT_CAMP_DATA.olympiadTierConfigs
  );
  // English data is already loaded from the static bundle; no skeleton needed on first render.
  const [programsLoading, setProgramsLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(DEFAULT_CAMP_DATA.programs[0] ?? null);
  const [programTrackFilter, setProgramTrackFilter] = useState<ProgramTrackFilter>('all');
  const [faqs, setFaqs] = useState<SummerCampFaqItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);
  const [summerCampEmail, setSummerCampEmail] = useState('');
  const [summerCampParentName, setSummerCampParentName] = useState('');
  const [summerCampPhone, setSummerCampPhone] = useState('');
  const [summerCampInterest, setSummerCampInterest] = useState<SummerCampInterest | ''>('');
  const [summerCampChildGrade, setSummerCampChildGrade] = useState<SummerCampGrade | ''>('');
  const [summerCampStatus, setSummerCampStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [summerCampErrorKind, setSummerCampErrorKind] = useState<
    'invalid_form' | 'invalid_email' | 'server' | null
  >(null);
  /** API `error` string or dev hint when the response was not JSON (e.g. HTML error page). */
  const [summerCampErrorDetail, setSummerCampErrorDetail] = useState<string | null>(null);
  const [faqMount, setFaqMount] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const guideModalUserDismissedRef = useRef(false);
  /** Set synchronously before `setGuideModalOpen(true)` so Radix never sees `onOpenChange(false)` with a null timestamp. */
  const guideModalOpenedAtRef = useRef<number | null>(null);
  const slotsSectionRef = useRef<HTMLElement>(null);
  const faqSentinelRef = useRef<HTMLDivElement>(null);
  /** Fires `trackEarlyBirdReveal` at most once per locale after programs are ready (idle + dynamic import). */
  const earlyBirdRevealFiredForLocaleRef = useRef<string | null>(null);

  const markGuideModalOpenIntent = useCallback(() => {
    guideModalOpenedAtRef.current = Date.now();
  }, []);

  const openGuideModal = useCallback(() => {
    guideModalUserDismissedRef.current = false;
    markGuideModalOpenIntent();
    setGuideModalOpen(true);
  }, [markGuideModalOpenIntent]);

  /** Timed desktop-only guide modal: 3s after load if not dismissed/submitted. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const shouldForce = () => {
      try {
        return new URLSearchParams(window.location.search).get(OPEN_GUIDE_QUERY) === '1';
      } catch {
        return false;
      }
    };

    if (!shouldForce() && isAutomatedAuditEnvironment()) return;

    const shouldSkipByStorage = () => {
      if (shouldForce()) return false;
      try {
        return (
          window.localStorage.getItem(SUMMERCAMP_POPUP_DISMISSED_KEY) === 'true' ||
          window.localStorage.getItem(SUMMERCAMP_SUBMITTED_KEY) === 'true'
        );
      } catch {
        return true;
      }
    };

    if (shouldSkipByStorage()) return;
    if (!window.matchMedia(`(min-width: ${SUMMERCAMP_TIMED_POPUP_MIN_WIDTH}px)`).matches) return;

    const id = window.setTimeout(() => {
      if (shouldSkipByStorage()) return;
      if (!window.matchMedia(`(min-width: ${SUMMERCAMP_TIMED_POPUP_MIN_WIDTH}px)`).matches) return;
      openGuideModal();
    }, SUMMERCAMP_TIMED_POPUP_MS);

    return () => window.clearTimeout(id);
  }, [openGuideModal]);

  const handleGuideModalOpenChange = useCallback((open: boolean) => {
    if (!open) {
      const openedAt = guideModalOpenedAtRef.current;
      if (openedAt == null) {
        setGuideModalOpen(false);
        return;
      }
      if (Date.now() - openedAt < GUIDE_MODAL_SPURIOUS_CLOSE_MS) return;
      guideModalUserDismissedRef.current = true;
      try {
        if (window.localStorage.getItem(SUMMERCAMP_SUBMITTED_KEY) !== 'true') {
          window.localStorage.setItem(SUMMERCAMP_POPUP_DISMISSED_KEY, 'true');
        }
      } catch {
        // storage blocked
      }
      guideModalOpenedAtRef.current = null;
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

  const clearSummerCampError = () => {
    if (summerCampStatus === 'error') {
      setSummerCampStatus('idle');
      setSummerCampErrorKind(null);
      setSummerCampErrorDetail(null);
    }
  };

  const handleSummerCampFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrim = summerCampEmail.trim();
    const phoneTrim = summerCampPhone.trim();
    const parentOk = summerCampParentName.trim().length >= 2;
    const gradeOk = summerCampChildGrade !== '';
    const interestOk = summerCampInterest !== '';
    const emailOk = EMAIL_REGEX.test(emailTrim);

    if (!parentOk || !gradeOk || !interestOk) {
      setSummerCampStatus('error');
      setSummerCampErrorKind('invalid_form');
      return;
    }
    if (!emailOk) {
      setSummerCampStatus('error');
      setSummerCampErrorKind('invalid_email');
      return;
    }

    setSummerCampStatus('loading');
    setSummerCampErrorKind(null);
    setSummerCampErrorDetail(null);
    try {
      const res = await fetch('/api/summer-camp-summercamp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: summerCampParentName.trim(),
          childGrade: summerCampChildGrade,
          campInterest: summerCampInterest,
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
        setSummerCampStatus('error');
        const kind = res.status === 400 ? 'invalid_form' : 'server';
        setSummerCampErrorKind(kind);
        if (jsonInvalid && raw.trim()) {
          const html = raw.trimStart().startsWith('<');
          setSummerCampErrorDetail(
            html && process.env.NODE_ENV === 'development'
              ? 'Server returned an error page instead of JSON — check the terminal running next dev.'
              : apiError
          );
          if (process.env.NODE_ENV === 'development' && html) {
            console.error('[summer camp summercamp] Non-JSON error response (first 200 chars):', raw.slice(0, 200));
          }
        } else {
          setSummerCampErrorDetail(apiError);
        }
        return;
      }
      try {
        window.localStorage.setItem(SUMMERCAMP_SUBMITTED_KEY, 'true');
      } catch {
        // storage blocked
      }
      void import('@/lib/meta-pixel').then(({ trackSummerCampGuideLead }) =>
        trackSummerCampGuideLead(summerCampInterest, summerCampChildGrade, {
          em: emailTrim,
          fn: summerCampParentName.trim(),
          ...(phoneTrim ? { ph: phoneTrim } : {}),
        })
      );
      const qs = new URLSearchParams({
        interest: summerCampInterest,
        grade: summerCampChildGrade,
      });
      router.push(
        `${createLocaleUrl('/camps/summer/guide-success', locale)}?${qs.toString()}`
      );
      setSummerCampChildGrade('');
      setSummerCampInterest('');
      setSummerCampEmail('');
      setSummerCampParentName('');
      setSummerCampPhone('');
      setSummerCampStatus('idle');
    } catch (err) {
      setSummerCampStatus('error');
      setSummerCampErrorKind('server');
      setSummerCampErrorDetail(
        process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : null
      );
    }
  };

  useEffect(() => {
    // English data is already hydrated from the static bundle — no fetch needed.
    if (locale === 'en') {
      const p = DEFAULT_CAMP_DATA.programs;
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
    const narrow =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
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
    }, narrow ? 4000 : 2200);
    return () => {
      cancelled = true;
      cancelIdle();
    };
  }, [programsLoading, locale]);

  // Warm the slots/cart chunk before first interaction (same module as SlotsPanel).
  // Phones: defer longer so hero + program thumbnails finish first (mobile Lighthouse / LCP).
  useEffect(() => {
    if (programsLoading) return;
    let cancelled = false;
    const narrow =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const cancelIdle = scheduleIdleTask(() => {
      if (!cancelled) void import('@/components/camps/SummerCampUI');
    }, narrow ? 5200 : 2800);
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

  /** AI & Game Development card: jump to booking with the existing `aiGameDev` track filter (grouped list). */
  const browseAiGameDevTrackAndScroll = useCallback(() => {
    const inTrack = programs.filter((p) => getSummerCampProgramTrack(p.id) === 'aiGameDev');
    const ordered = orderProgramsBySummerCampTrack(inTrack);
    const picked = ordered[0] ?? null;
    if (picked) setSelectedProgram(picked);
    setProgramTrackFilter('aiGameDev');
    guideModalUserDismissedRef.current = true;
    setGuideModalOpen(false);
    requestAnimationFrame(() => scrollToSlots());
  }, [programs, scrollToSlots]);

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

  useEffect(() => {
    if (programsLoading) return;
    if (earlyBirdRevealFiredForLocaleRef.current === locale) return;
    const localeWhenScheduled = locale;
    const narrow =
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    const cancel = scheduleIdleTask(() => {
      earlyBirdRevealFiredForLocaleRef.current = localeWhenScheduled;
      void import('@/lib/meta-pixel').then(({ trackEarlyBirdReveal }) => trackEarlyBirdReveal());
    }, narrow ? 4000 : 2800);
    return cancel;
  }, [programsLoading, locale]);

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
   * Deep links #lead-capture / #summercamp open the lead modal.
   * In dev, Strict Mode can flip Radix Dialog closed without a real user dismiss; the follow-up
   * effect re-opens while `guideModalUserDismissedRef` is false. Intentional closes set the ref
   * (overlay/X, or “Explore program” navigation) so we do not fight the user.
   */
  useLayoutEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash;
      if (h === '#lead-capture' || h === '#summercamp') {
        guideModalUserDismissedRef.current = false;
        markGuideModalOpenIntent();
        setGuideModalOpen(true);
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, [markGuideModalOpenIntent]);

  useEffect(() => {
    if (guideModalUserDismissedRef.current) return;
    const h = typeof window !== 'undefined' ? window.location.hash : '';
    if (!guideModalOpen && (h === '#lead-capture' || h === '#summercamp')) {
      markGuideModalOpenIntent();
      setGuideModalOpen(true);
    }
  }, [guideModalOpen, markGuideModalOpenIntent]);

  return (
    <div
      className={cn(
        'min-h-screen bg-background font-sans selection:bg-[#1F396D]/20 selection:text-[#1F396D]',
        showStickyCta ? 'pb-28 md:pb-24' : 'max-[768px]:pb-[60px]'
      )}
    >
      <main>
        {/* Hero: compact height so slots grid peeks; mobile keeps primary CTA above the fold */}
        <section
          className="relative isolate w-full min-h-[min(48svh,17rem)] max-h-[600px] overflow-hidden md:min-h-[min(40vh,22rem)]"
          aria-label="Summer camp hero"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/camps/summer-camp-banner.webp"
              alt="Students in coding, robotics, and math summer programs at GrowWise, Dublin, California"
              fill
              priority
              fetchPriority="high"
              decoding="async"
              quality={70}
              sizes="(max-width: 768px) 100vw, min(1100px, 85vw)"
              className="object-cover object-center select-none"
              draggable={false}
            />
            <div className="absolute inset-0 z-[1] bg-[rgba(0,0,0,0.6)]" aria-hidden />
          </div>
          <div
            className={cn(
              'relative z-10 mx-auto flex w-full max-w-[1100px] flex-col justify-center text-left',
              'px-5 py-8 sm:px-8 md:px-12 md:py-14 lg:px-16 lg:py-16'
            )}
          >
            <h1 className="font-heading max-w-[700px] text-[1.5rem] font-bold leading-[1.15] text-white sm:text-[1.75rem] md:text-[2.25rem] lg:text-[2.625rem]">
              {SUMMER_CAMP_HERO_EN.h1}
            </h1>
            <p className="mt-2 max-w-[650px] text-base leading-snug text-zinc-100 sm:mt-2.5 md:text-lg md:leading-snug">
              {SUMMER_CAMP_HERO_EN.subhead}
            </p>
            <div className="mt-4 flex w-full max-w-2xl flex-col gap-2.5 sm:mt-5 sm:flex-row sm:items-stretch sm:gap-3 md:gap-4">
              <Link
                href="#slots-section"
                className="inline-flex min-h-[44px] w-full min-w-0 flex-1 items-center justify-center rounded-lg bg-[#1F396D] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#183056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 sm:min-h-[48px] sm:px-6 sm:py-3 sm:text-base"
              >
                {SUMMER_CAMP_HERO_EN.primaryCta}
              </Link>
              <a
                href={SUMMER_CAMP_HERO_EN.brochurePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-full min-w-0 flex-1 items-center justify-center rounded-lg border border-white bg-white px-4 py-3 text-center text-xs font-medium leading-snug text-[#F16112] shadow-sm transition-colors hover:bg-[#FFF4ED] hover:text-[#d54f0a] sm:min-h-[48px] sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2"
                aria-label={`${SUMMER_CAMP_HERO_EN.secondaryCta.trim()} — ${SUMMER_CAMP_HERO_EN.downloadBrochure}`}
              >
                {SUMMER_CAMP_HERO_EN.secondaryCta}
              </a>
            </div>
            {/* Below CTAs: hidden on narrow phones so Reserve stays in first viewport; visible sm+ */}
            <p className="mt-3 hidden max-w-2xl text-xs font-semibold leading-snug text-amber-200 sm:block sm:text-sm sm:leading-snug md:mt-4">
              {SUMMER_CAMP_HERO_EN.urgencyLine}
            </p>
            <p className="mt-3 hidden max-w-2xl text-sm font-medium leading-relaxed text-zinc-100 sm:mt-4 sm:block md:text-base md:leading-relaxed">
              {SUMMER_CAMP_HERO_EN.trustMicro}
            </p>
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
                        fetchPriority="low"
                        decoding="async"
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
                                background: '#146c43',
                                border: '1px solid #146c43',
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
                                    background: '#146c43',
                                    border: '1px solid #146c43',
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
                                  background: '#146c43',
                                  border: '1px solid #146c43',
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
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#1F396D] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#183056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 md:text-base"
              >
                {SC.finalReserveCta}
              </button>
              <button
                type="button"
                onClick={openGuideModal}
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#F16112] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2"
              >
                {SC.finalGuidePdfCta}
              </button>
            </div>
          </div>
        </section>

        {/* Start with one track — after “Still not sure…” so users see guidance first */}
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
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              For year-round options, browse our{' '}
              <Link href={createLocaleUrl('/programs', locale)} className="font-semibold text-[#1F396D] underline hover:text-[#F16112]">
                programs overview
              </Link>
              ,{' '}
              <Link href={createLocaleUrl('/steam', locale)} className="font-semibold text-[#1F396D] underline hover:text-[#F16112]">
                STEAM courses
              </Link>
              , or{' '}
              <Link href={createLocaleUrl('/courses/math', locale)} className="font-semibold text-[#1F396D] underline hover:text-[#F16112]">
                math tutoring
              </Link>
              .
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {SC.programGroups.map((card, i) => (
                <div
                  key={`${card.title}-${i}`}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="font-heading text-lg font-bold text-[#1F396D]">{card.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-700">{card.outcome}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{card.ages}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    {SUMMER_CAMP_PROGRAM_GROUP_SEO_LINKS[i]?.map((link) => (
                      <Link
                        key={link.slug}
                        href={createLocaleUrl(`/camps/${link.slug}`, locale)}
                        className="text-[13px] font-semibold text-[#1F396D] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 rounded-sm"
                      >
                        {t(summerCampProgramGroupMessagePath(link.msgKey))}
                      </Link>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (i === 1) browseAiGameDevTrackAndScroll();
                      else selectGroupAndScrollToBooking(i);
                    }}
                    className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[#1F396D] bg-white px-4 py-3 text-sm font-semibold text-[#1F396D] transition-colors hover:bg-[#1F396D]/5"
                  >
                    {i === 0
                      ? t('programGroup.ctaViewMathOlympiad')
                      : i === 1
                        ? t('programGroup.ctaBrowseAiGameDev')
                        : t('programGroup.ctaViewYoungAuthors')}
                  </button>
                </div>
              ))}
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

      <SummerCampGuideLeadDialog
        open={guideModalOpen}
        onOpenChange={handleGuideModalOpenChange}
        copy={{
          guideModalTitle: SC.guideModalTitle,
          guideModalSubtitle: SC.guideModalSubtitle,
          parentNameLabel: SC.parentNameLabel,
          parentNamePlaceholder: SC.parentNamePlaceholder,
          guideSubmitCta: SC.guideSubmitCta,
        }}
        formAriaLabel={t('guideForm.ariaLabel')}
        summerCampSelectClassName={summerCampSelectClass}
        parentName={summerCampParentName}
        email={summerCampEmail}
        phone={summerCampPhone}
        childGrade={summerCampChildGrade}
        campInterest={summerCampInterest}
        status={summerCampStatus}
        errorKind={summerCampErrorKind}
        errorDetail={summerCampErrorDetail}
        onParentNameChange={(v) => {
          setSummerCampParentName(v);
          clearSummerCampError();
        }}
        onEmailChange={(v) => {
          setSummerCampEmail(v);
          clearSummerCampError();
        }}
        onPhoneChange={(v) => {
          setSummerCampPhone(v);
          clearSummerCampError();
        }}
        onChildGradeChange={(v) => {
          setSummerCampChildGrade(v);
          clearSummerCampError();
        }}
        onCampInterestChange={(v) => {
          setSummerCampInterest(v);
          clearSummerCampError();
        }}
        onSubmit={handleSummerCampFormSubmit}
      />

      {/* Sticky conversion bar — reserve vs guide (hidden while guide modal is open) */}
      {showStickyCta && !guideModalOpen ? (
        <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200/80 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm md:px-6">
          <div className="mx-auto flex max-w-[1100px] flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={scrollToSlots}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#1F396D] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#183056] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F396D] focus-visible:ring-offset-2 sm:w-auto md:text-base"
            >
              {SC.finalReserveCta}
            </button>
            <button
              type="button"
              onClick={openGuideModal}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#F16112] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#d54f0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F16112] focus-visible:ring-offset-2 sm:w-auto"
            >
              {SC.finalGuidePdfCta}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

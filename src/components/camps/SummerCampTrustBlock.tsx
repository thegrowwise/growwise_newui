import Link from 'next/link';

export interface TrustReview {
  quote: string;
  byline: string;
}

export interface SummerCampTrustBlockProps {
  heading: string;
  googleRatingLine: string;
  reviews: TrustReview[];
  proofStrip: string;
  bullets: string[];
  projectsCta: string;
  projectsCtaHref: string;
}

export function SummerCampTrustBlock({
  heading,
  googleRatingLine,
  reviews,
  proofStrip,
  bullets,
  projectsCta,
  projectsCtaHref,
}: SummerCampTrustBlockProps) {
  return (
    <section
      className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white py-14 md:py-20"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-[1100px] px-10 md:px-12">
        <h2
          id="trust-heading"
          className="font-heading text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium text-slate-600 md:text-base">
          {googleRatingLine}
        </p>

        <ul className="mt-10 grid list-none items-stretch gap-4 p-0 md:grid-cols-3 md:gap-5" role="list">
          {reviews.map((review, index) => (
            <li
              key={`trust-review-${index}`}
              className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm md:p-6"
            >
              <span className="text-base leading-none text-amber-500" aria-hidden="true">
                ★★★★★
              </span>
              <p className="mt-3 flex-1 text-sm font-normal leading-relaxed text-slate-800 md:text-[15px]">
                &ldquo;{review.quote}&rdquo;
              </p>
              <p className="mt-4 text-xs font-medium leading-snug text-slate-600 md:text-[13px]">
                {review.byline}
              </p>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-10 max-w-3xl text-center text-sm font-semibold tracking-tight text-slate-800 md:text-base">
          {proofStrip}
        </p>

        <ul className="mx-auto mt-8 max-w-3xl space-y-3 text-sm text-slate-700 md:text-base">
          {bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1D9E75]" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center">
          <Link
            href={projectsCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm font-semibold text-[#1F396D] underline-offset-4 transition-colors hover:text-[#152a52] hover:underline"
          >
            {projectsCta}
          </Link>
        </p>
      </div>
    </section>
  );
}

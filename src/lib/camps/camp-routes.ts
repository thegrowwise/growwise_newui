import { getCampSlugs } from "./get-camp-page";

/**
 * First path segment under `/camps/` already owned by static routes.
 * Data-driven `[slug]` pages must never collide with these (defensive; also used for SSG params).
 *
 * Deferred (planned later): 301 from each program landing `/camps/[slug]` — slugs such as
 * `ai-studio-dublin-ca`, `robotics-camp-dublin-ca`, `game-development-camp-dublin-ca`,
 * `math-olympiad-camp-dublin-ca`, `robotics-full-day-dublin-ca`, `young-authors-camp-dublin-ca`
 * — to the main summer hub `/camps/summer`. Not implemented yet.
 */
export const CAMPS_STATIC_PATH_SEGMENTS: ReadonlySet<string> = new Set([
  "summer",
  "winter",
]);

/** Params for `src/app/[locale]/camps/[slug]/page.tsx` — excludes static camp hubs. */
export function getCampLandingStaticParams(): { slug: string }[] {
  return getCampSlugs()
    .filter((slug) => !CAMPS_STATIC_PATH_SEGMENTS.has(slug))
    .map((slug) => ({ slug }));
}

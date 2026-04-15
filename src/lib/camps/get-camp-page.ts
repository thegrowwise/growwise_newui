import type { CampLandingPage } from "./camp-types";
import { CAMP_LANDING_PAGES } from "./camp-data";

const bySlug = new Map<string, CampLandingPage>(
  CAMP_LANDING_PAGES.map((p) => [p.slug, p]),
);

export function getCampPage(slug: string): CampLandingPage | undefined {
  return bySlug.get(slug);
}

export function getAllCampPages(): readonly CampLandingPage[] {
  return CAMP_LANDING_PAGES;
}

export function getCampSlugs(): readonly string[] {
  return CAMP_LANDING_PAGES.map((p) => p.slug);
}

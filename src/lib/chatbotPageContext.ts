/**
 * Page-aware chatbot context (Ask Growy).
 *
 * Pure SSOT mapping a route to:
 *  - which welcome string to show (i18n key)
 *  - which suggestion chips to show (i18n keys)
 *  - which form intent to default to for vague affirmatives ("yes", "interested")
 *  - any prefill values to seed into a form (e.g. campInterest from /camps/[slug])
 *  - a tiny LLM hint sentence appended ONLY when this context is active
 *
 * No React deps. The camp catalog is NOT imported at module top-level — it is
 * loaded lazily inside `getCampSlugContext()` so non-camp pages never pull
 * `CAMP_LANDING_PAGES` into the chatbot bundle.
 */

import type { ChatbotFormType } from "./chatbotScope";

export type ChatPageContextId =
  | "default"
  | "campsHub"
  | "campsSummer"
  | "campsWinter"
  | "campSlug"
  | "assessment"
  | "enroll"
  | "contact"
  | "courseTopic";

export type ChatPageContext = {
  id: ChatPageContextId;
  /** i18n key under chatbot.pageWelcome.* */
  welcomeKey: string;
  /** i18n keys under chatbot.suggestions.* (replaces default chip set) */
  suggestionKeys: readonly string[];
  /** Default form for vague affirmatives ("yes / interested") on this page */
  defaultFormType: ChatbotFormType | null;
  /** Optional prefill values that get merged into the chosen form */
  prefill?: Record<string, string>;
  /** Short hint appended to LLM system prompt ONLY when this context is active */
  llmHint?: string;
  /** Optional human-readable label of the current page (used in welcome interp) */
  pageLabel?: string;
};

const DEFAULT_CONTEXT: ChatPageContext = {
  id: "default",
  welcomeKey: "chatbot.pageWelcome.default",
  suggestionKeys: [
    "chatbot.suggestions.k12Programs",
    "chatbot.suggestions.steamCourses",
    "chatbot.suggestions.bookAssessment",
    "chatbot.suggestions.pricing",
    "chatbot.suggestions.getStarted",
  ],
  defaultFormType: null,
};

/** Strip `/<locale>` prefix when present (en/es/hi/zh). */
function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(en|es|hi|zh)(\/|$)/);
  if (!m) return pathname || "/";
  const stripped = pathname.slice(m[0].length - 1);
  return stripped || "/";
}

/**
 * Lightweight slug-derived context. Imports `CAMP_LANDING_PAGES` lazily via
 * `require` so the catalog never lands in the chatbot bundle on non-camp routes.
 *
 * Returns `null` (caller falls back to season-level context) if the slug is unknown.
 */
function getCampSlugContext(slug: string): ChatPageContext | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mod = require("./camps/get-camp-page") as typeof import("./camps/get-camp-page");
  const page = mod.getCampPage(slug);
  if (!page) return null;
  return {
    id: "campSlug",
    welcomeKey: "chatbot.pageWelcome.campSlug",
    suggestionKeys: [
      "chatbot.suggestions.openCampForm",
      "chatbot.suggestions.bookAssessment",
      "chatbot.suggestions.pricing",
    ],
    defaultFormType: "camp",
    prefill: { campInterest: page.formConfig.defaultCampInterest },
    llmHint: `User is on the camp landing page "${page.h1}" (slug: ${page.slug}). Default camp interest: "${page.formConfig.defaultCampInterest}". Keep answers focused on this specific camp.`,
    pageLabel: page.h1,
  };
}

/**
 * Resolve a route to a `ChatPageContext`. O(1) on the hot path: a small
 * sequence of cheap regex checks. Memoize at the call site (useMemo on pathname).
 */
export function resolveChatPageContext(rawPathname: string | null | undefined): ChatPageContext {
  if (!rawPathname) return DEFAULT_CONTEXT;
  const path = stripLocale(rawPathname);

  // Camps — most specific first.
  const slugMatch = path.match(/^\/camps\/([^/]+)\/?$/);
  if (slugMatch && slugMatch[1] !== "summer" && slugMatch[1] !== "winter") {
    const ctx = getCampSlugContext(slugMatch[1]);
    if (ctx) return ctx;
  }
  if (path === "/camps/summer" || path.startsWith("/camps/summer/")) {
    return {
      id: "campsSummer",
      welcomeKey: "chatbot.pageWelcome.campsSummer",
      suggestionKeys: [
        "chatbot.suggestions.campsCoding",
        "chatbot.suggestions.campsRobotics",
        "chatbot.suggestions.openCampForm",
      ],
      defaultFormType: "camp",
      llmHint:
        "User is browsing GrowWise summer camps. Help them pick a track (e.g. coding, robotics, AI, math, game dev) and offer to open the in-chat camp inquiry form.",
    };
  }
  if (path === "/camps/winter" || path.startsWith("/camps/winter/")) {
    return {
      id: "campsWinter",
      welcomeKey: "chatbot.pageWelcome.campsWinter",
      suggestionKeys: [
        "chatbot.suggestions.campsCoding",
        "chatbot.suggestions.campsRobotics",
        "chatbot.suggestions.openCampForm",
      ],
      defaultFormType: "camp",
      llmHint:
        "User is browsing GrowWise winter camps. Help them pick a track and offer to open the in-chat camp inquiry form.",
    };
  }
  if (path === "/camps" || path === "/camps/") {
    return {
      id: "campsHub",
      welcomeKey: "chatbot.pageWelcome.campsHub",
      suggestionKeys: [
        "chatbot.suggestions.campsSummer",
        "chatbot.suggestions.campsWinter",
        "chatbot.suggestions.openCampForm",
      ],
      defaultFormType: "camp",
      llmHint:
        "User is on the GrowWise camps hub. Ask which season interests them and which subject area, then offer the in-chat camp inquiry form.",
    };
  }

  // Single-purpose flows.
  if (path === "/book-assessment" || path.startsWith("/book-assessment/")) {
    return {
      id: "assessment",
      welcomeKey: "chatbot.pageWelcome.assessment",
      suggestionKeys: [
        "chatbot.suggestions.bookAssessment",
        "chatbot.suggestions.pricing",
        "chatbot.suggestions.k12Programs",
      ],
      defaultFormType: "assessment",
      llmHint: "User is on the Book Assessment page; bias toward opening the in-chat assessment form.",
    };
  }
  if (
    path === "/enroll" ||
    path.startsWith("/enroll/") ||
    path === "/enroll-academic" ||
    path.startsWith("/enroll-academic/")
  ) {
    return {
      id: "enroll",
      welcomeKey: "chatbot.pageWelcome.enroll",
      suggestionKeys: [
        "chatbot.suggestions.k12Programs",
        "chatbot.suggestions.steamCourses",
        "chatbot.suggestions.getStarted",
      ],
      defaultFormType: "enroll",
      llmHint: "User is on an enrollment page; bias toward opening the in-chat enroll form.",
    };
  }
  if (path === "/contact" || path.startsWith("/contact/")) {
    return {
      id: "contact",
      welcomeKey: "chatbot.pageWelcome.contact",
      suggestionKeys: [
        "chatbot.suggestions.bookAssessment",
        "chatbot.suggestions.pricing",
        "chatbot.suggestions.getStarted",
      ],
      defaultFormType: "contact",
      llmHint: "User is on the Contact page; offer to open the in-chat contact form.",
    };
  }

  // Course topical context (informational only — no auto form)
  if (path.startsWith("/courses/")) {
    return {
      id: "courseTopic",
      welcomeKey: "chatbot.pageWelcome.default",
      suggestionKeys: [
        "chatbot.suggestions.bookAssessment",
        "chatbot.suggestions.pricing",
        "chatbot.suggestions.getStarted",
      ],
      defaultFormType: null,
      llmHint: `User is on a course page (${path}); tailor examples to that subject when relevant.`,
    };
  }

  return DEFAULT_CONTEXT;
}

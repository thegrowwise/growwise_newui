# GrowWise NewUI – Automation Test Suite Plan

**Document version:** 1.0  
**Author:** Senior Automation Engineer  
**Scope:** End-to-end and critical UI workflow automation for `growwise_newui` (Next.js 16, App Router, i18n, Redux, Stripe, cart).

---

## 1. Executive Summary

This plan defines a full **UI automation test suite** for all user-facing workflows in the GrowWise frontend. The suite will cover:

- **Navigation & layout** (header, footer, mobile nav, locale)
- **Marketing & content** (home, about, programs, blogs, camps, STEAM, workshop calendar)
- **Forms** (enrollment, academic enrollment, book assessment, contact)
- **Commerce** (courses → add to cart → cart → checkout → success)
- **Integrations** (student login iframe, search, chatbot, testimonials)
- **i18n & routing** (locales, 404)

Recommended tool: **Playwright** (cross-browser, Next.js–friendly, stable selectors, API mocking).

---

## 2. Current Stack & Test Baseline

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 18, Tailwind, Radix UI |
| State | Redux Toolkit, Redux-Saga |
| i18n | next-intl (`/[locale]/...`) |
| Commerce | Cart (CartContext + localStorage), Stripe Checkout (redirect) |
| Existing tests | Jest + RTL (unit: `phoneValidation`, UI components, camp data, PageTracking) |

**Existing test config:** `jest.config.js`, `jest.setup.js`, `src/test-utils.tsx` (custom render with Redux).

---

## 3. Scenarios Mapped from Codebase

### 3.1 Routing & Pages (from `src/app/[locale]/`)

| Route | Type | Main scenarios |
|-------|------|-----------------|
| `/[locale]` | Home | Hero, sections, CTA links, testimonials |
| `/[locale]/about` | Static | Content, links |
| `/[locale]/programs` | Static | Program list, links to courses/camps |
| `/[locale]/contact` | Form | Contact form submit, validation, success/error |
| `/[locale]/enroll` | Form | Program type (academic/STEAM), bootcamp/course/level, submit to backend |
| `/[locale]/enroll-academic` | Form | Subject, grade, parent/student info, submit |
| `/[locale]/book-assessment` | Form | Assessment type, grade, schedule, country/phone, submit |
| `/[locale]/courses/math` | Listing + cart | Filters (grade, type, alignment), sort, course cards, “Add to cart” → modal → add |
| `/[locale]/courses/english` | Listing + cart | Same pattern |
| `/[locale]/courses/high-school-math` | Listing + cart | Same pattern |
| `/[locale]/courses/sat-prep` | Listing + cart | Same pattern |
| `/[locale]/cart` | Cart | List items, update qty, remove, clear, “Proceed to Checkout” |
| `/[locale]/checkout` | Checkout | Order summary, “Proceed to Payment” → redirect to Stripe (mock in E2E) |
| `/[locale]/checkout/success` | Success | session_id in URL, fetch session, clear cart, success message |
| `/[locale]/camps/summer` | Camp + cart | Camp cards, add to cart |
| `/[locale]/camps/winter` | Camp + cart | Same |
| `/[locale]/camps/winter/calendar` | Calendar + cart | Add to cart from calendar |
| `/[locale]/steam/game-development` | STEAM + cart | Add to cart |
| `/[locale]/steam/ml-ai-coding` | STEAM + cart | Add to cart |
| `/[locale]/workshop-calendar` | Calendar | View, links |
| `/[locale]/student-login` | Iframe/redirect | Iframe load or “Go to Login Page” redirect |
| `/[locale]/growwise-blogs` | List | Blog list, links to posts |
| `/[locale]/growwise-blogs/[slug]` | Blog post | Multiple slugs (see `growwise-blogs/` folder) |
| `/[locale]/privacy-policy` | Legal | Content |
| `/[locale]/terms-conditions` | Legal | Content |
| `/[locale]/testimonials-test` | Test | Testimonials display |
| Invalid path | 404 | `[...catchAll]` → notFound() |

### 3.2 Cross-Cutting Flows

- **Header:** Logo → home, nav links, cart icon + count, Enroll, Student Login, locale switcher (if enabled), mobile menu.
- **Footer:** Links, contact info, social.
- **Cart:** Persists in `localStorage` (`growwise_cart`); add from courses/camps/STEAM; cart badge updates.
- **Locale:** All routes under `/[locale]/`; `ENABLED_LOCALES` from env (e.g. en, es, zh, hi); locale in URL must be valid.
- **Search:** Website search (e.g. `useWebsiteSearch`, backend `/api/search` or similar).
- **Chatbot:** Open/close, possibly track events (analytics).
- **Testimonials:** Fetched from backend or fallback; displayed on home/testimonials-test.

---

## 4. Test Pyramid & Categories

```
                    ┌─────────────┐
                    │   E2E (UI)  │  Playwright – critical user journeys
                    │  ~15–25     │  (enrollment, cart→checkout→success, contact, key nav)
                    └──────┬──────┘
              ┌────────────┴────────────┐
              │  Integration (API/UI)   │  Playwright – form submit → API mock or test backend
              │  ~10–15                 │  (enroll, assessment, contact, checkout session)
              └────────────┬────────────┘
    ┌──────────────────────┴──────────────────────┐
    │  Component / Unit (Jest + RTL) – existing   │  Keep and extend (forms, cart logic, utils)
    │  + new for form validation, cart state      │
    └─────────────────────────────────────────────┘
```

- **E2E:** Full browser, real or mocked backend; focus on happy paths and critical error states.
- **Integration:** Same as E2E but with explicit API mocks (e.g. Stripe redirect, enrollment API).
- **Unit/component:** Jest + RTL; expand for form validation, CartContext, and new UI components.

---

## 5. Detailed Scenario List for Automation

### 5.1 Navigation & Layout

| ID | Scenario | Priority |
|----|----------|----------|
| N1 | Home link from header navigates to `/[locale]` | P1 |
| N2 | Main nav links (Programs, Courses, Camps, etc.) resolve to correct `/[locale]/...` | P1 |
| N3 | Cart icon shows count and links to `/[locale]/cart` | P1 |
| N4 | Enroll CTA links to `/[locale]/enroll` | P1 |
| N5 | Student Login links to `/[locale]/student-login` | P2 |
| N6 | Mobile menu opens and links work | P1 |
| N7 | Locale switcher (if present) changes URL to other enabled locale and content updates | P2 |
| N8 | Footer links (Privacy, Terms, Contact, etc.) work | P2 |

### 5.2 Home Page

| ID | Scenario | Priority |
|----|----------|----------|
| H1 | Home loads with hero and key sections | P1 |
| H2 | CTA buttons (e.g. Enroll, Courses) navigate correctly | P1 |
| H3 | Testimonials section loads (API or fallback) | P2 |

### 5.3 Enrollment Flows

| ID | Scenario | Priority |
|----|----------|----------|
| E1 | Enroll page: select program type (academic/STEAM), choose course/bootcamp and level, fill required fields, accept consent, submit → success message or error | P1 |
| E2 | Enroll page: validation (required fields, email, phone) shows errors | P1 |
| E3 | Enroll-academic: fill subject, grade, parent/student, contact, consent, submit → success or error | P1 |
| E4 | Enroll-academic: validation errors prevent submit | P2 |

### 5.4 Book Assessment

| ID | Scenario | Priority |
|----|----------|----------|
| A1 | Book assessment: select assessment type, grade, schedule, fill contact (with country code + phone), consent, submit → success or error | P1 |
| A2 | Phone validation (format/country) shows error when invalid | P2 |

### 5.5 Contact

| ID | Scenario | Priority |
|----|----------|----------|
| C1 | Contact form: fill name, email, phone, subject, message, consent, submit → success | P1 |
| C2 | Contact form: validation errors (e.g. empty required) | P2 |

### 5.6 Courses (Math, English, High School Math, SAT Prep)

| ID | Scenario | Priority |
|----|----------|----------|
| CR1 | Course list loads; filters (grade, type, alignment) and sort change visible courses | P1 |
| CR2 | Click “Add to cart” on a course opens customization modal (grade/duration/quantity) | P1 |
| CR3 | Submit from modal adds item to cart and updates cart count | P1 |
| CR4 | Cart persists after refresh (localStorage) | P2 |

### 5.7 Cart

| ID | Scenario | Priority |
|----|----------|----------|
| CT1 | Empty cart shows empty state and “Browse Courses” (or similar) | P1 |
| CT2 | Cart with items shows list, subtotal, “Proceed to Checkout” | P1 |
| CT3 | Update quantity updates line total and cart total | P1 |
| CT4 | Remove item removes from list and updates total | P1 |
| CT5 | Clear cart empties list and shows empty state | P2 |
| CT6 | “Proceed to Checkout” goes to `/[locale]/checkout` | P1 |

### 5.8 Checkout & Success

| ID | Scenario | Priority |
|----|----------|----------|
| CH1 | Checkout page with items shows order summary and “Proceed to Payment” | P1 |
| CH2 | Empty cart redirects to cart when opening checkout | P1 |
| CH3 | “Proceed to Payment” calls backend create-checkout-session; redirect to Stripe URL (E2E: mock redirect or stub API) | P1 |
| CH4 | After “payment” (e.g. redirect to success with `?session_id=...`), success page shows success message and cart is cleared | P1 |
| CH5 | Checkout error (e.g. network/API failure) shows error message and no redirect | P2 |

### 5.9 Camps & STEAM

| ID | Scenario | Priority |
|----|----------|----------|
| CP1 | Summer/Winter camp page loads; add to cart adds item and updates cart count | P1 |
| CP2 | Winter calendar page: add to cart from calendar | P2 |
| CP3 | STEAM (game-development, ml-ai-coding): add to cart | P2 |

### 5.10 Other Pages

| ID | Scenario | Priority |
|----|----------|----------|
| O1 | Student login: iframe loads or “Go to Login Page” visible/works | P2 |
| O2 | Programs page loads and links work | P2 |
| O3 | Workshop calendar loads | P2 |
| O4 | Blog list and at least one blog post load | P2 |
| O5 | Privacy policy and Terms pages load | P2 |
| O6 | Invalid path returns 404 | P2 |

### 5.11 Locale & i18n

| ID | Scenario | Priority |
|----|----------|----------|
| L1 | Default locale (e.g. `/en`) loads without redirect | P1 |
| L2 | `/[locale]/cart` with valid locale (en, es, etc.) loads | P1 |
| L3 | Unsupported locale or missing locale handled (redirect or 404 per next-intl config) | P2 |

### 5.12 Search & Chatbot (if in scope)

| ID | Scenario | Priority |
|----|----------|----------|
| S1 | Search opens, query returns results or empty state | P3 |
| S2 | Chatbot opens and closes | P3 |

---

## 6. Recommended Tooling & Setup

### 6.1 Playwright

- **Why:** Works well with Next.js, multi-browser, auto-wait, network/API mocking, trace/screenshot on failure.
- **Install:** `npm install -D @playwright/test`; `npx playwright install` (browsers).
- **Config:** `playwright.config.ts` with baseURL `http://localhost:3000`, projects for chromium/firefox/webkit, `locale` for i18n if needed.
- **Env:** Use `BASE_URL` and optional `BACKEND_URL`; for E2E, backend can be test instance or mocked.

### 6.2 Project Structure (suggestion)

```text
growwise_newui/
├── e2e/
│   ├── fixtures/           # test user data, cart payloads
│   │   └── enrollment.ts
│   ├── mocks/              # API mocks (optional)
│   │   └── stripe-checkout.ts
│   ├── pages/              # optional page objects
│   │   └── enroll.ts
│   ├── specs/
│   │   ├── navigation.spec.ts
│   │   ├── enrollment.spec.ts
│   │   ├── enroll-academic.spec.ts
│   │   ├── book-assessment.spec.ts
│   │   ├── contact.spec.ts
│   │   ├── courses-cart.spec.ts
│   │   ├── cart.spec.ts
│   │   ├── checkout-success.spec.ts
│   │   ├── camps.spec.ts
│   │   ├── student-login.spec.ts
│   │   ├── locale.spec.ts
│   │   └── 404.spec.ts
│   └── playwright.config.ts
├── src/
│   └── ... (existing Jest tests under __tests__)
```

### 6.3 Test Data & Backend

- **Test data:** Use fixtures (e.g. valid enrollment payloads, contact form data); no real PII in repo.
- **Backend:** For stable E2E, either:
  - **Option A:** Dedicated test backend (e.g. staging) with test keys (Stripe test mode), or
  - **Option B:** Playwright `route()` to mock `BACKEND_URL` APIs (enrollment, assessment, contact, create-checkout-session).
- **Stripe:** Use Stripe test mode; success flow can use real redirect to Stripe test checkout or mock `create-checkout-session` to return a fake success URL with `session_id`.

### 6.4 Environment

- `.env.test` or CI env: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test), optional `NEXT_PUBLIC_ENABLED_LOCALES`.
- Start app before E2E: `npm run build && npm run start` or `npm run dev` with a known port.

---

## 7. Implementation Phases

### Phase 1 – Foundation (Week 1)

- Add Playwright: `playwright.config.ts`, baseURL, one browser (e.g. chromium).
- Implement N1–N6, H1–H2, L1–L2 (navigation, home, locale).
- Add one full flow: e.g. Courses → Add to cart → Cart → Checkout (with mocked create-checkout-session and success redirect).

### Phase 2 – Forms & Cart (Week 2)

- E1–E3, E2/E4 (enrollment + validation).
- A1 (book assessment).
- C1 (contact).
- CT1–CT6, CH1–CH2, CH4–CH5 (cart + checkout success/error).

### Phase 3 – Checkout & Remaining Pages (Week 3)

- CH3 (Stripe redirect mock or test mode).
- CP1–CP3, O1–O6, L3, S1–S2 if in scope.
- Consolidate fixtures and page objects; add accessibility checks (e.g. Playwright a11y) if required.

### Phase 4 – CI & Maintenance

- Run E2E in CI (e.g. GitHub Actions) on push/PR: start app, run Playwright, upload artifacts on failure.
- Document how to run: `npm run test:e2e` (or `npx playwright test`).
- Add smoke suite (subset of P1) for fast feedback.

---

## 8. Success Criteria

- All **P1** scenarios automated and passing in at least one browser.
- **P2** scenarios covered where feasible; P3 optional.
- No P1 regressions before release (run E2E in CI).
- Clear docs for running tests locally and in CI, and for adding new scenarios.

---

## 9. References in Codebase

| Area | Key files |
|------|-----------|
| Routes | `src/app/[locale]/**/page.tsx` |
| Enroll | `src/app/[locale]/enroll/page.tsx`, backend `POST /api/enrollment` |
| Enroll academic | `src/app/[locale]/enroll-academic/page.tsx` |
| Book assessment | `src/app/[locale]/book-assessment/page.tsx`, `src/lib/phoneValidation.ts` |
| Contact | `src/components/sections/Contact.tsx`, `src/lib/contactService.ts` |
| Cart | `src/components/gw/CartContext.tsx`, `src/app/[locale]/cart/page.tsx` |
| Checkout | `src/app/[locale]/checkout/page.tsx`, `src/lib/paymentService.ts` (createCheckoutSession) |
| Success | `src/app/[locale]/checkout/success/page.tsx` (getCheckoutSession, clearCart) |
| Courses + modal | `src/app/[locale]/courses/math/page.tsx`, `src/components/gw/CourseCustomizationModal.tsx` |
| Locale | `src/i18n/localeConfig.ts`, `src/proxy.ts` (next-intl middleware) |
| Existing tests | `jest.config.js`, `src/test-utils.tsx`, `src/**/__tests__/*` |

---

*End of plan. Next step: create `playwright.config.ts` and implement Phase 1 specs.*

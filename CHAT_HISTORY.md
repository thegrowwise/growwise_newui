# GrowWise NewUI - Chat & Fix Log

This document records all troubleshooting and code changes made during the current conversation for future reference.

## Environment / Context
- Workspace: `c:\workspace\growwise_website\growwise_newui`
- Platform: Windows (win32)
- Next.js: 16.1.6 (Turbopack)
- Backend: `c:\workspace\growwise_website\growwise_backend` (Express)

## 1) Next.js build fails: `/coding` prerender error
### Reported error
- Next build failed during static export / prerendering:
  - `Error occurred prerendering page "/coding"...`
  - `Export encountered an error on /coding/page: /coding, exiting the build.`

### Investigation
- The repo contains both:
  - `src/app/coding/page.tsx` (non-locale route)
  - `src/app/[locale]/coding/page.tsx` (locale route with i18n provider via `src/app/[locale]/layout.tsx`)
- The non-locale `/coding` page was rendering without the locale layout/i18n context, which was causing prerender to fail.

### Fix applied
- Updated `src/app/coding/page.tsx` to do a server-side redirect to the locale-aware route:
  - `redirect(\`/${DEFAULT_LOCALE}/coding\`)`
- Updated `src/app/game-dev/page.tsx` the same way:
  - `redirect(\`/${DEFAULT_LOCALE}/game-dev\`)`

### Verification
- Ran `npm run build` and confirmed the build completed successfully after the redirect fix.

## 2) Runtime hydration warning on `/coding`
### Reported error (console)
- Hydration mismatch:
  - `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.`
  - Mismatch shown in `Dropdown` trigger styling:
    - server rendered class included `text-sm`
    - client rendered class included `text-base`

### Investigation
- The mismatch pointed to:
  - `src/components/layout/Header/Dropdown.tsx` (Camps dropdown trigger)
- The repo also contains global typography rules in:
  - `src/app/globals.css` (`@layer base` sets a `button` font-size to `var(--text-base)`).
- Tailwind class differences can drift between SSR and client depending on cascade/inheritance.

### Fix applied (stabilize nav trigger typography + reduce mismatch noise)
1. Updated `src/app/globals.css`
   - `.header-navlink` now uses `!text-sm`
   - Added `.header-dropdown-nav-trigger` with explicit `!text-sm`
2. Updated `src/components/layout/Header/Dropdown.tsx`
   - Refactored Camps trigger styling to use the shared trigger class:
     - `cn('header-dropdown-nav-trigger', triggerStateClass, 'group')`
   - Added `suppressHydrationWarning` on the Camps `<span>` and the dropdown `<Link>` triggers.

### Temporary build blocker discovered
- During the CSS edit, `@apply ... group ...` inside `globals.css` caused:
  - `CssSyntaxError: @apply should not be used with the 'group' utility`
- We corrected it by removing `group` from the `@apply` context and adding `group` in JSX (`cn()`).

### Verification
- Ran `npm run build` successfully after the hydration fix.

## 3) `/coding` “failed to load prices”: `GET /api/pricing-config` returns 500
### Reported error (browser/devtools)
- `usePricingConfig.ts:87 GET http://localhost:3000/api/pricing-config 500 (Internal Server Error)`
- UI showed: `failed to load prices.`

### Investigation
- Frontend uses:
  - `src/hooks/usePricingConfig.ts` → `fetch('/api/pricing-config')`
- Frontend proxy route:
  - `src/app/api/pricing-config/route.ts`
    - originally called a backend path `/pricing-config`
- Backend (`growwise_backend`) did not have a registered route for `/api/pricing-config`.
- Therefore, the Next proxy returned 500 because the backend endpoint was missing.

### Fix applied
#### Backend
- Added new route file:
  - `growwise_backend/src/routes/pricingConfig.js`
- The route implements:
  - `GET /api/pricing-config`
  - Reads pricing config from the in-repo mock JSON file:
    - `growwise_newui/public/api/mock/en/pricing-config.json`
  - Returns parsed JSON to the frontend.
- Mounted the router in:
  - `growwise_backend/src/server.js`
  - Also added endpoint info to the root `/` response.

#### Frontend (Next proxy)
- Updated:
  - `src/app/api/pricing-config/route.ts`
- Now fetches from backend using centralized config:
  - `BACKEND_URL` from `src/lib/config.ts`
- Removed the hard requirement for `NEXT_PUBLIC_BACKEND_URL` being set explicitly.

### Verification
- Confirmed directly (via node fetch) that:
  - `http://localhost:3000/api/pricing-config` returns `200`
  - response contains `{"success":true,"data":...}`
- Ran `npm run build` successfully after the pricing-config proxy fix.

## 4) Git merge conflict in i18n files (`en.json` and `es.json`)
### Reported situation
- `git pull` failed:
  - `Automatic merge failed; fix conflicts and then commit the result.`
- `git status --porcelain` showed unresolved conflict state previously:
  - `UU src/i18n/messages/en.json`
  - `UU src/i18n/messages/es.json`

### Investigation
- Both `src/i18n/messages/en.json` and `src/i18n/messages/es.json` contained unresolved conflict markers:
  - `<<<<<<< HEAD`
  - `=======`
  - `>>>>>>> ...`
- Those markers made the JSON invalid for runtime parsing.

### Fix applied
- Resolved both conflicts by merging the two sides into one valid JSON.
- In `en.json` we kept BOTH:
  - `pricingUi`, `codingPage`, `gameDevPage` blocks (from `HEAD` / `phase2`)
  - `enroll`, `notFound` blocks (from `main`)
- In `es.json` we did the equivalent merge:
  - `pricingUi`, `codingPage`, `gameDevPage` (from `HEAD`)
  - `enroll`, `notFound` (from `main`)
- Then staged the resolved files:
  - `git add src/i18n/messages/en.json src/i18n/messages/es.json`

### Verification
- `npm run build` succeeded after i18n JSON conflict resolution.

## Notes / Follow-ups
- Current changes include a backend pricing endpoint added solely to support frontend data loading.
- The hydration mismatch fix reduces mismatch noise and stabilizes class selection.


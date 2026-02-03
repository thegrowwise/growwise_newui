# Analytics QA Checklist

This document describes how to verify the GTM + GA4 setup for the GrowWise app (virtual_page_view flow).

## Preconditions
- `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA_ID` set in `.env.local` (or provided by your hosting env)
- Dev server running: `npm run dev`
- GTM container imported (optional): `gtm/virtual_page_view_import.json` or tags created manually

---

## Quick smoke tests (local)
1. Start the dev server:
   - `npm run dev`
2. Open the site in a normal browser window (disable adblock for this domain)
3. In DevTools Console, verify `dataLayer` exists:
   - `!!window.dataLayer` → should return `true` when `NEXT_PUBLIC_GTM_ID` is set
4. Navigate to a few pages and watch the console for the debug pushes:
   - Look for: `[Analytics][dataLayer] pushed {...}`
   - If GTM is not present, look for: `[Analytics][gtag] event page_view {...}`
5. Force a debug push from the console (if needed):
   - `window.dataLayer && window.dataLayer.push({ event: 'virtual_page_view', page_path: location.pathname, page_title: document.title, debug_mode: true })`

---

## GTM Preview verification
1. In Google Tag Manager → Workspace → **Preview**
2. Enter your local site URL and connect
3. In the preview pane, verify the following when navigating pages:
   - The `virtual_page_view` event appears
   - The **GA4 - virtual_page_view** tag fires for that event
4. Inspect the variables tab and verify `page_path`, `page_title`, and `debug_mode` carry the expected values

---

## GA4 DebugView / Realtime
1. In Google Analytics (GA4), open **DebugView** (or Realtime)
2. Perform navigation or push a dev debug event:
   - `window.dataLayer && window.dataLayer.push({ event:'virtual_page_view', page_path: location.pathname, page_title: document.title, debug_mode: true })`
3. Verify the event shows up in DebugView immediately (dev pushes include `debug_mode: true`)

---

## Production checks
1. Ensure `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_SITE_URL` are configured in your hosting provider (Amplify/Vercel/Netlify) env settings
2. Publish GTM workspace changes
3. Verify on production site (disable adblock) that the same events fire and appear in GA4 Realtime

---

## Optional: Lint & Tests
- Run locally: `npm run lint` and `npm test` to ensure there are no code regressions

---

## Troubleshooting
- If events do not appear:
  - Ensure GTM script is loaded: look for `gtm.js?id=GTM-...` in Network tab
  - Confirm GTM Preview is connected (it shows a debug panel)
  - Disable adblock/privacy extensions
  - Confirm the GA4 tag uses the expected Measurement ID
  - Use GA4 DebugView and look for `debug_mode` events

---

If you'd like, I can:
- Run more automated checks locally (lint/tests) if you want me to debug the earlier lint failure
- Prepare a small PR to add the QA checklist and an npm script that runs a headless smoke test

Which of the above would you like me to do next?
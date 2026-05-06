# GTM repo artifacts

## `virtual_page_view_import.json`

This file is an **import package** for the GrowWise GTM container (`GTM-TNFBBQJM`). It contains only:

- **GA4 Configuration** tag (`send_page_view`: false)
- **GA4 Event** tag for `virtual_page_view`
- Related triggers and data layer variables

There is **no Meta (Facebook) Pixel tag** in this export. The live GTM workspace may still include a Pixel or other tags that were added directly in the Tag Manager UI and never exported here.

## Avoiding duplicate Meta Pixel loads

If the **same** pixel ID is fired from **both** the Next app ([`src/components/analytics/MetaPixel.tsx`](../src/components/analytics/MetaPixel.tsx)) **and** a GTM tag, set:

`NEXT_PUBLIC_META_PIXEL_DISABLE_APP=true`

See [`env.local.example`](../env.local.example) and [`src/lib/metaPixelEnv.ts`](../src/lib/metaPixelEnv.ts).

**Manual check:** In Google Tag Manager → **Tags**, search for “Facebook”, “Meta”, or “Custom HTML” snippets that load `fbevents.js` or `connect.facebook.net`.

## Lighthouse “Uses deprecated APIs” (AttributionReporting)

Chrome may flag **`AttributionReporting`** as originating from Meta’s **`fbevents.js`**. That comes from the Pixel script, not from first-party React code. A **lab baseline** without loading Pixel/GTM is documented in [`docs/performance-tests-status.md`](../docs/performance-tests-status.md) (section on Best Practices / third-party).

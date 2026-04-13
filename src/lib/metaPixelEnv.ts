/**
 * When the same pixel ID is also loaded via GTM, set NEXT_PUBLIC_META_PIXEL_DISABLE_APP=true
 * so the app does not inject Meta Pixel twice (duplicate PageView / events).
 */
export function isAppMetaPixelScriptDisabled(): boolean {
  const v = process.env.NEXT_PUBLIC_META_PIXEL_DISABLE_APP?.trim().toLowerCase();
  return v === '1' || v === 'true' || v === 'yes';
}

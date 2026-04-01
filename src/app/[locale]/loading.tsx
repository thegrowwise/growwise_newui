/**
 * Route-level loading UI for [locale] pages. Header/footer from layout stay mounted;
 * this replaces only the main page shell while RSC payload streams (faster perceived perf).
 */
export default function LocaleLoading() {
  return (
    <div
      className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-9 w-44 max-w-full rounded-lg bg-[#1F396D]/15 animate-pulse" />
      <div className="h-3.5 w-64 max-w-full rounded bg-gray-200/80 animate-pulse" />
      <div className="h-3.5 w-48 max-w-full rounded bg-gray-100 animate-pulse" />
    </div>
  );
}

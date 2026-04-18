'use client';

import Script from 'next/script';

function gtmBootstrapInline(id: string): string {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`;
}

/** GTM bootstrap — `beforeInteractive` in root layout when not using consent; with `ConsentAndAnalytics`, use `afterInteractive` here only after opt-in. */
export function GTMHead({
  gtmId,
  strategy = 'beforeInteractive',
}: {
  gtmId?: string | null;
  /** Root layout: `beforeInteractive`. Consent-gated trees that cannot use root-only scripts: `afterInteractive`. */
  strategy?: 'beforeInteractive' | 'afterInteractive';
}) {
  const id = gtmId?.trim();
  if (!id) return null;
  return (
    <Script
      id="gtm-script"
      strategy={strategy}
      dangerouslySetInnerHTML={{ __html: gtmBootstrapInline(id) }}
    />
  );
}

/** Paste immediately after opening `<body>` (Google install snippet); iframe is hidden. */
export function GTMNoScript({ gtmId }: { gtmId?: string | null }) {
  const id = gtmId?.trim();
  if (!id) return null;
  return (
    <noscript
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      }}
    />
  );
}

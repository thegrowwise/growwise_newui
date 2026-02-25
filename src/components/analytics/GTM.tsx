'use client';

import Script from 'next/script';

interface GTMProps {
  gtmId?: string | null;
}

export default function GTM({ gtmId }: GTMProps) {
  if (!gtmId) return null;

  const inlineScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;

  return (
    <>
      <Script id="gtm-script" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: inlineScript }} />
      {/* noscript fallback - must be placed inside <body> */}
      <noscript dangerouslySetInnerHTML={{ __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>` }} />
    </>
  );
}

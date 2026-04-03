'use client';

import Script from 'next/script';

interface MetaPixelProps {
  pixelId?: string | null;
}

const PIXEL_ID_PATTERN = /^\d{8,20}$/;

/** Meta (Facebook) Pixel — PageView on load. Enable with NEXT_PUBLIC_META_PIXEL_ID. */
export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const id = pixelId?.trim();
  if (!id || !PIXEL_ID_PATTERN.test(id)) return null;

  const inlineScript = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
function _gwInitFBPixel(){
var t=document.createElement('script');t.async=true;
t.src='https://connect.facebook.net/en_US/fbevents.js';
document.head.appendChild(t);
fbq('init','${id}');fbq('track','PageView');
}
['scroll','click','touchstart'].forEach(function(e){
window.addEventListener(e,function _fb(){
_gwInitFBPixel();
['scroll','click','touchstart'].forEach(function(ev){
window.removeEventListener(ev,_fb);});
},{once:true,passive:true});
});`;

  return (
    <>
      <Script id="meta-pixel-fbq" strategy="lazyOnload" dangerouslySetInnerHTML={{ __html: inlineScript }} />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

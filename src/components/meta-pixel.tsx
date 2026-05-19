"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function MetaPixel() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname, search]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${PIXEL_ID}');
            fbq('track','PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/* ── Event helpers ─────────────────────────────────────── */

const CURRENCY = "BDT";

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

export function trackViewContent({
  contentId, contentName, value = 0,
}: { contentId: string | number; contentName?: string; value?: number }) {
  if (!contentId) return;
  fbq("track", "ViewContent", {
    content_ids: [String(contentId)],
    contents: [{ id: String(contentId), quantity: 1 }],
    content_type: "product",
    content_name: contentName || "",
    value: Number(value) || 0,
    currency: CURRENCY,
  });
}

export function trackAddToCart({
  contentId, contentName, value = 0, quantity = 1,
}: { contentId: string | number; contentName?: string; value?: number; quantity?: number }) {
  if (!contentId) return;
  const qty = Math.max(1, quantity);
  fbq("track", "AddToCart", {
    content_ids: [String(contentId)],
    contents: [{ id: String(contentId), quantity: qty }],
    content_type: "product",
    content_name: contentName || "",
    value: Number(value) || 0,
    currency: CURRENCY,
    num_items: qty,
  });
}

export function trackInitiateCheckout({
  contents, value = 0,
}: { contents: Array<{ id: string | number; quantity: number }>; value?: number }) {
  if (!contents?.length) return;
  fbq("track", "InitiateCheckout", {
    content_ids: contents.map((c) => String(c.id)),
    contents: contents.map((c) => ({ id: String(c.id), quantity: c.quantity })),
    content_type: "product",
    value,
    currency: CURRENCY,
    num_items: contents.reduce((s, c) => s + (c.quantity || 1), 0),
  });
}

export function trackPurchase({
  contents, value = 0,
}: { contents: Array<{ id: string | number; quantity: number }>; value?: number }) {
  if (!contents?.length) return;
  fbq("track", "Purchase", {
    content_ids: contents.map((c) => String(c.id)),
    contents: contents.map((c) => ({ id: String(c.id), quantity: c.quantity })),
    content_type: "product",
    value,
    currency: CURRENCY,
    num_items: contents.reduce((s, c) => s + (c.quantity || 1), 0),
  });
}

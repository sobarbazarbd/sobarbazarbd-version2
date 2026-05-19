"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const CURRENCY = "BDT";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type DLItem = {
  id: string | number;
  name?: string;
  price?: number;
  quantity?: number;
  category?: string;
};

function dlPush(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function toItem(i: DLItem) {
  return {
    id: String(i.id),
    item_id: String(i.id),
    item_name: i.name || "",
    currency: CURRENCY,
    price: Number(i.price) || 0,
    item_category: i.category || "",
    quantity: Math.max(1, Number(i.quantity) || 1),
  };
}

export function pushViewItem(item: DLItem) {
  if (!item?.id) return;
  // Reset ecommerce before push (GA4 best practice)
  dlPush({ ecommerce: null });
  dlPush({
    event: "view_item",
    pageType: "product-page",
    productType: "simple",
    ecommerce: {
      currency: CURRENCY,
      value: Number(item.price) || 0,
      items: [toItem(item)],
    },
  });
}

export function pushAddToCart(item: DLItem) {
  if (!item?.id) return;
  const qty = Math.max(1, Number(item.quantity) || 1);
  dlPush({ ecommerce: null });
  dlPush({
    event: "add_to_cart",
    pageType: "product-page",
    productType: "simple",
    ecommerce: {
      currency: CURRENCY,
      value: (Number(item.price) || 0) * qty,
      items: [toItem({ ...item, quantity: qty })],
    },
  });
}

export function pushBeginCheckout(items: DLItem[], value: number) {
  if (!items?.length) return;
  dlPush({ ecommerce: null });
  dlPush({
    event: "begin_checkout",
    pageType: "checkout",
    ecommerce: {
      currency: CURRENCY,
      value: Number(value) || 0,
      items: items.map(toItem),
    },
  });
}

export type PurchaseUserData = {
  first_name?: string;
  email?: string;
  street?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
};

export function pushPurchase(args: {
  transactionId: string | number;
  items: DLItem[];
  value: number;
  shipping?: number;
  tax?: number;
  newCustomer?: boolean;
  userData?: PurchaseUserData;
}) {
  if (!args.transactionId || !args.items?.length) return;
  dlPush({ ecommerce: null });
  dlPush({
    event: "purchase",
    pageType: "order-received",
    ecommerce: {
      transaction_id: String(args.transactionId),
      value: Number(args.value) || 0,
      tax: Number(args.tax) || 0,
      shipping: Number(args.shipping) || 0,
      currency: CURRENCY,
      items: args.items.map(toItem),
    },
    new_customer: !!args.newCustomer,
    user_data: args.userData || {},
  });
}

/* ── GTM loader ─────────────────────────────────────── */

export function GTM() {
  const pathname = usePathname();
  const search = useSearchParams();

  // Track SPA route changes as page_view (optional, GA4-style)
  useEffect(() => {
    if (!GTM_ID) return;
    dlPush({ event: "page_view", page_path: pathname + (search?.toString() ? `?${search}` : "") });
  }, [pathname, search]);

  if (!GTM_ID) return null;

  return (
    <>
      <Script
        id="gtm-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
}

export function GTMNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}

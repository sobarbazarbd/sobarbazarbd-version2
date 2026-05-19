"use client";

import { useEffect } from "react";
import { pushPurchase, type DLItem, type PurchaseUserData } from "@/components/gtm";

type StashedPayload = {
  transactionId: string;
  items: DLItem[];
  value: number;
  shipping?: number;
  tax?: number;
  newCustomer?: boolean;
  userData?: PurchaseUserData;
};

export function GTMPurchaseTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("dl_purchase");
      if (!raw) return;
      const data = JSON.parse(raw) as StashedPayload;
      if (data?.transactionId && data?.items?.length) {
        pushPurchase(data);
      }
    } catch {
      /* ignore */
    } finally {
      // One-shot — clear so refresh / re-entry doesn't double-fire
      try { sessionStorage.removeItem("dl_purchase"); } catch {}
    }
  }, []);

  return null;
}

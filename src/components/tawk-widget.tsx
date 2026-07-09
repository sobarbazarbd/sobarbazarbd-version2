"use client";

import { useEffect } from "react";

const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

/**
 * Ported from frontend/src/components/TawkToWidget.jsx.
 * NEEDS CONFIRMATION: NEXT_PUBLIC_TAWK_PROPERTY_ID / NEXT_PUBLIC_TAWK_WIDGET_ID
 * are not set in any local .env file in either app — frontend's component also
 * no-ops without them. Real values must come from the hosting platform's env
 * config (e.g. Vercel project settings) or the Tawk.to dashboard.
 */
export function TawkWidget() {
  useEffect(() => {
    const isConfigured =
      Boolean(TAWK_PROPERTY_ID) &&
      Boolean(TAWK_WIDGET_ID) &&
      !String(TAWK_PROPERTY_ID).includes("YOUR_") &&
      !String(TAWK_WIDGET_ID).includes("YOUR_");

    if (!isConfigured) return;

    const timer = window.setTimeout(() => {
      if (document.getElementById("tawk-script")) return;

      const script = document.createElement("script");
      script.id = "tawk-script";
      script.async = true;
      script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }, 4000);

    return () => {
      window.clearTimeout(timer);
      document.getElementById("tawk-script")?.remove();
      document.getElementById("tawkId")?.remove();
    };
  }, []);

  return null;
}

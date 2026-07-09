"use client";

import { useEffect, useState } from "react";
import { Cookie, Check } from "lucide-react";

/** Ported from frontend/src/components/CookieConsent.jsx — same localStorage keys/timing, restyled in Tailwind. */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("sobarbazar_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
        setDismissed(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => setDismissed(true), 300);
  };

  const handleAccept = () => {
    localStorage.setItem("sobarbazar_cookie_consent", "accepted");
    localStorage.setItem("sobarbazar_cookie_consent_date", new Date().toISOString());
    localStorage.setItem("sobarbazar_cache_enabled", "true");
    close();
  };

  const handleDecline = () => {
    localStorage.setItem("sobarbazar_cookie_consent", "declined");
    localStorage.setItem("sobarbazar_cache_enabled", "false");
    close();
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border bg-white p-4 shadow-2xl transition-all duration-300 sm:left-4 sm:right-auto ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="flex gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Cookie className="h-5 w-5" />
        </span>
        <div>
          <h4 className="text-sm font-bold text-neutral-900">আমরা কুকিজ ব্যবহার করি</h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং সাইট দ্রুত লোড করতে আমরা কুকিজ এবং ক্যাশিং ব্যবহার করি।{" "}
            <span className="font-medium text-primary">এটি সাইটকে আরও দ্রুত এবং কার্যকর করে তুলবে।</span>
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAccept}
              className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> গ্রহণ করুন
            </button>
            <button
              onClick={handleDecline}
              className="rounded-full border px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50"
            >
              প্রত্যাখ্যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

// Matches frontend/src/components/WhatsappFloat.jsx — same number/message.
const WA_NUMBER = "8801348080750";
const WA_MESSAGE = "Hello! I have a question about your products.";

/** Ported from frontend/src/components/WhatsappFloat.jsx — visible on every breakpoint (unlike FloatingWidgets, which is desktop-only). */
export function WhatsappFloat() {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-24 right-4 z-[55] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] shadow-[0_4px_12px_rgba(37,211,102,0.4),0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-300 lg:bottom-6 lg:right-6 ${
        visible ? "scale-100 opacity-100" : "scale-75 translate-y-5 opacity-0"
      }`}
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-40" />
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="26" height="26" className="relative z-10 text-white">
        <path d="M16.002 0h-.004C7.165 0 0 7.165 0 16c0 3.498 1.126 6.73 3.036 9.362L1.05 30.95l5.766-1.932C9.271 30.87 12.523 32 16.002 32 24.836 32 32 24.837 32 16S24.836 0 16.002 0zm9.38 22.775c-.393 1.104-1.943 2.025-3.18 2.292-.84.178-1.937.32-5.628-1.21-4.714-1.952-7.762-6.733-7.996-7.047-.226-.314-1.895-2.52-1.895-4.805s1.2-3.41 1.625-3.877c.354-.388.772-.485 1.03-.485.257 0 .515.002.74.013.237.012.556-.09.87.663.32.77 1.094 2.67 1.19 2.864.096.193.16.42.032.678-.128.257-.193.418-.385.644-.193.225-.405.503-.578.676-.193.193-.394.402-.17.787.226.385.998 1.646 2.143 2.666 1.473 1.313 2.715 1.722 3.1 1.914.385.193.61.16.835-.096.226-.257.966-1.125 1.223-1.51.257-.386.514-.322.867-.193.354.128 2.24 1.057 2.625 1.25.385.192.642.29.74.45.096.16.096.932-.297 2.036z" />
      </svg>

      {showTooltip && (
        <span className="absolute right-[72px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-lg lg:block">
          Chat with us on WhatsApp
        </span>
      )}
    </div>
  );
}

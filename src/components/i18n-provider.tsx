"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/context/i18nConfig";

/** Ported from frontend/src/components/I18nProvider.jsx */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("sobarbazar_language");
      if (savedLang && savedLang !== i18n.language) {
        i18n.changeLanguage(savedLang);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

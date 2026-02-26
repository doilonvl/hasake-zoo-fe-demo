"use client";

import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTranslationBase,
} from "react-i18next";
import { useMemo } from "react";
import { defaultLocale, type Locale, type Namespace } from "./config";
import viMessages from "./message/vi.json";
import enMessages from "./message/en.json";

// Build synchronous resources from imported JSON
const resources = {
  vi: Object.fromEntries(
    Object.entries(viMessages).map(([ns, data]) => [ns, data])
  ),
  en: Object.fromEntries(
    Object.entries(enMessages).map(([ns, data]) => [ns, data])
  ),
};

// Initialize i18next for client-side
const isInitialized = { current: false };

function initI18next() {
  if (isInitialized.current) return;
  isInitialized.current = true;

  i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLocale,
      fallbackLng: defaultLocale,
      supportedLngs: ["vi", "en"],
      defaultNS: "common",
      fallbackNS: "common",
      ns: [
        "common",
        "home",
        "notFound",
        "privacy",
        "reservation",
        "blog",
        "contact",
        "about",
        "services",
        "products",
        "projects",
      ],
      interpolation: {
        escapeValue: false, // React already escapes
      },
      react: {
        useSuspense: false,
      },
    });
}

// Eagerly initialize to prevent NO_I18NEXT_INSTANCE errors
// Works on both server (SSR of client components) and client
initI18next();

// Custom hook for translations
export function useTranslation(namespace: Namespace = "common") {
  const translation = useTranslationBase(namespace);

  return useMemo(
    () => ({
      ...translation,
      t: translation.t,
    }),
    [translation]
  );
}

// Hook to get current locale
export function useLocale(): Locale {
  const { i18n } = useTranslationBase();
  return (i18n.language as Locale) || defaultLocale;
}

// Function to change language
export function changeLanguage(locale: Locale) {
  i18next.changeLanguage(locale);
}

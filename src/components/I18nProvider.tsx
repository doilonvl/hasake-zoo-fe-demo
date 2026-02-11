"use client";

import { useEffect } from "react";
import { changeLanguage } from "@/i18n/client";
import type { Locale } from "@/i18n/config";

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  useEffect(() => {
    changeLanguage(locale);
  }, [locale]);

  return <>{children}</>;
}

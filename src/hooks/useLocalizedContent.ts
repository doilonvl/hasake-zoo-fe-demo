/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import type { Locale } from "@/i18n/config";
import { resolveLocalizedString } from "@/lib/i18n";

/**
 * Hook to automatically resolve all *_i18n fields in an object
 * @param data - Object containing *_i18n fields
 * @param locale - Current locale
 * @returns Object with resolved localized fields
 */
export function useLocalizedContent<T extends Record<string, any>>(
  data: T,
  locale: Locale
): T {
  return useMemo(() => {
    if (!data) return data;

    const resolved = { ...data } as any;

    // Iterate through all keys and resolve *_i18n fields
    for (const key in resolved) {
      if (key.endsWith("_i18n")) {
        const value = resolved[key];
        if (value && typeof value === "object") {
          resolved[key] = resolveLocalizedString(value, locale);
        }
      }
    }

    return resolved as T;
  }, [data, locale]);
}

import type { Locale, LocalizedString } from "@/types/content";
import { defaultLocale } from "@/i18n/config";

/**
 * Enhanced resolveLocalizedString with multi-locale fallback chain
 * Fallback order: exact locale -> base locale -> default locale -> first available -> fallback
 */
export function resolveLocalizedString(
  value: LocalizedString | string | undefined,
  locale: Locale,
  fallback = ""
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;

  // 1. Exact match (e.g., "en-US" -> value["en-US"])
  if (value[locale]) return value[locale];

  // 2. Base locale match (e.g., "en-US" -> value["en"])
  const baseLocale = locale.split("-")[0];
  if (baseLocale !== locale && value[baseLocale]) {
    return value[baseLocale];
  }

  // 3. Default locale fallback
  if (value[defaultLocale]) return value[defaultLocale];

  // 4. First available value
  const firstValue = Object.values(value)[0];
  return firstValue || fallback;
}

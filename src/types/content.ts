// Re-export Locale from i18n config for backward compatibility
export type { Locale } from "@/i18n/config";

// Generic LocalizedString for any locale
export type LocalizedString = Record<string, string>;

// Strict type for backward compatibility
export type StrictLocalizedString = {
  vi?: string;
  en?: string;
};


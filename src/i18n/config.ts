export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const namespaces = [
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
] as const;

export type Namespace = (typeof namespaces)[number];

// Helper to check if a string is a valid locale
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

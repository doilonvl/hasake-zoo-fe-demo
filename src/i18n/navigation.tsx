"use client";

import NextLink from "next/link";
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
} from "next/navigation";
import { useLocale } from "./client";
import type { Locale } from "./config";
import type { ComponentProps } from "react";

// Pathnames configuration (for future use with localized routes)
export const pathnames = {
  "/": "/",
  "/admin": {
    vi: "/admin",
    en: "/admin",
  },
  "/privacy-policy": {
    vi: "/chinhsach-baomat",
    en: "/privacy-policy",
  },
} as const;

// Get locale prefix for URL
// Vietnamese (default) has no prefix - proxy.ts rewrites / → /vi internally
// English gets /en prefix
function getLocalePrefix(locale: Locale): string {
  return locale === "en" ? "/en" : "";
}

// Add locale prefix to pathname
function localizePathname(pathname: string, locale: Locale): string {
  const prefix = getLocalePrefix(locale);

  // Remove any existing locale prefix
  const cleanPath = pathname.replace(/^\/(en|vi)/, "");

  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  return prefix + normalizedPath;
}

// Custom Link component with i18n support
export function Link({
  href,
  locale: propLocale,
  ...props
}: ComponentProps<typeof NextLink> & { locale?: Locale }) {
  const currentLocale = useLocale();
  const locale = propLocale ?? currentLocale;

  // Handle string href
  const localizedHref =
    typeof href === "string" ? localizePathname(href, locale) : href;

  return <NextLink {...props} href={localizedHref} />;
}

// Resolve href (string or object) into a localized URL string
type HrefInput = string | { pathname: string; query?: Record<string, string | string[]>; params?: Record<string, string | string[]> };

function resolveHref(href: HrefInput, locale: Locale): string {
  const rawPathname = typeof href === "string" ? href : href.pathname;
  const localized = localizePathname(rawPathname, locale);

  if (typeof href === "object" && href.query) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(href.query)) {
      if (Array.isArray(val)) {
        val.forEach((v) => params.append(key, v));
      } else {
        params.set(key, val);
      }
    }
    const qs = params.toString();
    return qs ? `${localized}?${qs}` : localized;
  }

  return localized;
}

// Custom useRouter with i18n support
export function useRouter() {
  const router = useNextRouter();
  const currentLocale = useLocale();

  return {
    ...router,
    push: (
      href: HrefInput,
      options?: { locale?: Locale; scroll?: boolean }
    ) => {
      const locale = options?.locale ?? currentLocale;
      router.push(resolveHref(href, locale), { scroll: options?.scroll });
    },
    replace: (
      href: HrefInput,
      options?: { locale?: Locale; scroll?: boolean }
    ) => {
      const locale = options?.locale ?? currentLocale;
      router.replace(resolveHref(href, locale), { scroll: options?.scroll });
    },
  };
}

// Custom usePathname that returns pathname without locale prefix
export function usePathname(): string {
  const pathname = useNextPathname();

  // Ensure pathname is a string and remove locale prefix
  if (!pathname || typeof pathname !== "string") return "/";
  return pathname.replace(/^\/(en|vi)/, "") || "/";
}

// Redirect function for server components
export function redirect(pathname: string, locale: Locale) {
  const localizedPath = localizePathname(pathname, locale);
  // This would need to be imported from next/navigation in actual use
  // For now, just return the path
  return localizedPath;
}

// Get pathname with locale for canonical URLs, etc.
export function getPathname(pathname: string, locale: Locale): string {
  return localizePathname(pathname, locale);
}

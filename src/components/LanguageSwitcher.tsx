/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/i18n/client";
import { usePathname } from "@/i18n/navigation";
import { useParams, useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { Globe, Check, ChevronDown } from "lucide-react";

type QueryObject = Record<string, string | string[]>;
const SUPPORTED_LOCALES: Locale[] = ["vi", "en"];

export default function LanguageSwitcher({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const pathname = usePathname() || "/";
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHash(window.location.hash || "");
  }, [pathname]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preserve all search params when switching locale
  const queryObject = useMemo<QueryObject | undefined>(() => {
    if (!searchParams) return undefined;
    const entries = Array.from(searchParams.entries());
    if (entries.length === 0) return undefined;
    return entries.reduce<QueryObject>((acc, [key, value]) => {
      const existing = acc[key];
      if (!existing) {
        acc[key] = value;
      } else if (Array.isArray(existing)) {
        acc[key] = [...existing, value];
      } else {
        acc[key] = [existing, value];
      }
      return acc;
    }, {});
  }, [searchParams]);

  const routeParams = useMemo<
    Record<string, string | string[]> | undefined
  >(() => {
    const entries = Object.entries(params ?? {}).filter(
      ([key]) => key !== "locale",
    );
    if (entries.length === 0) return undefined;
    return entries.reduce<Record<string, string | string[]>>(
      (acc, [key, value]) => {
        acc[key] = value as string | string[];
        return acc;
      },
      {},
    );
  }, [params]);

  const getSlugOverride = (target: Locale) => {
    if (typeof window === "undefined") return undefined;
    const win = window as typeof window & {
      __BLOG_SLUGS__?: Record<string, string>;
    };
    return win.__BLOG_SLUGS__?.[target];
  };

  const goLocale = (target: Locale) => {
    if (target === locale) return;

    // Build the target URL using full page navigation for reliable proxy handling
    let targetPath = pathname || "/";

    // Handle dynamic route params (e.g., blog/[slug])
    if (routeParams) {
      const slugOverride = getSlugOverride(target);
      if (slugOverride && routeParams.slug) {
        targetPath = targetPath.replace(String(routeParams.slug), slugOverride);
      }
    }

    // Add locale prefix: English gets /en, Vietnamese gets clean URL
    const localizedPath = target === "en" ? `/en${targetPath}` : targetPath;

    // Build query string
    let queryString = "";
    if (queryObject) {
      const params = new URLSearchParams();
      for (const [key, val] of Object.entries(queryObject)) {
        if (Array.isArray(val)) {
          val.forEach((v) => params.append(key, v));
        } else {
          params.set(key, val);
        }
      }
      queryString = params.toString();
    }

    const finalUrl =
      localizedPath + (queryString ? `?${queryString}` : "") + (hash || "");

    // Use full navigation to reliably trigger the proxy rewrite
    window.location.assign(finalUrl);
  };

  const flagByLocale: Record<Locale, { label: string; flag: string }> = {
    vi: { label: "Tiếng Việt", flag: "/Flag/vn.png" },
    en: { label: "English", flag: "/Flag/usa.png" },
  };

  return (
    <div ref={dropdownRef} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-semibold uppercase shadow-sm transition ${
          variant === "light"
            ? "border-black/30 bg-white/85 text-black/80 hover:border-black/50 hover:bg-white"
            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
        }`}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="flex items-center gap-2">
          <img
            src={flagByLocale[locale]?.flag}
            alt={flagByLocale[locale]?.label}
            className="h-5 w-5 rounded-[3px] object-cover"
            loading="lazy"
          />
          {locale}
        </span>
        <ChevronDown className="h-4 w-4 opacity-75" />
      </button>

      {isOpen ? (
        <div
          className={`absolute top-full right-0 z-40 mt-2 w-48 overflow-hidden rounded-lg border text-sm shadow-2xl backdrop-blur ${
            variant === "light"
              ? "border-black/15 bg-white/95 text-black"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          {SUPPORTED_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => goLocale(code)}
              className={`flex w-full items-center cursor-pointer justify-between px-3 py-2 text-left transition hover:bg-gray-100 ${
                locale === code ? "bg-gray-100" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <img
                  src={flagByLocale[code]?.flag}
                  alt={flagByLocale[code]?.label}
                  className="h-5 w-5 rounded-[3px] object-cover"
                  loading="lazy"
                />
                <span className="text-xs font-semibold uppercase">{code}</span>
              </span>
              {locale === code ? <Check className="h-4 w-4" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

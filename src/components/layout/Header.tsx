"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { useTranslation, useLocale } from "@/i18n/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useContactPopup } from "@/components/shared/ContactPopup";
import type { Locale } from "@/types/content";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  locale: Locale;
}

/* ─── Habitat Layer Configuration ─── */
interface HabitatLayer {
  id: string;
  icon: string;
  nameVi: string;
  nameEn: string;
  items: { href: string; labelKey: string }[];
  colors: {
    bg: string;
    bgHover: string;
    accent: string;
    glow: string;
  };
}

const LAYERS: HabitatLayer[] = [
  {
    id: "explore",
    icon: "🏠",
    nameVi: "Khám Phá",
    nameEn: "Explore",
    items: [
      { href: "/", labelKey: "nav.home" },
      { href: "/about", labelKey: "nav.about" },
    ],
    colors: {
      bg: "rgba(14, 165, 233, 0.06)",
      bgHover: "rgba(14, 165, 233, 0.12)",
      accent: "#0284c7",
      glow: "0 0 20px rgba(14, 165, 233, 0.1)",
    },
  },
  {
    id: "solutions",
    icon: "🦁",
    nameVi: "Giải Pháp",
    nameEn: "Solutions",
    items: [{ href: "/services", labelKey: "nav.services" }],
    colors: {
      bg: "rgba(16, 185, 129, 0.06)",
      bgHover: "rgba(16, 185, 129, 0.12)",
      accent: "#059669",
      glow: "0 0 20px rgba(16, 185, 129, 0.1)",
    },
  },
  {
    id: "showcase",
    icon: "🌍",
    nameVi: "Dự Án",
    nameEn: "Showcase",
    items: [
      { href: "/projects", labelKey: "nav.projects" },
      { href: "/blog", labelKey: "nav.blog" },
    ],
    colors: {
      bg: "rgba(245, 158, 11, 0.06)",
      bgHover: "rgba(245, 158, 11, 0.12)",
      accent: "#d97706",
      glow: "0 0 20px rgba(245, 158, 11, 0.1)",
    },
  },
  {
    id: "connect",
    icon: "📞",
    nameVi: "Liên Hệ",
    nameEn: "Connect",
    items: [{ href: "/contact", labelKey: "nav.contact" }],
    colors: {
      bg: "rgba(107, 114, 128, 0.06)",
      bgHover: "rgba(107, 114, 128, 0.12)",
      accent: "#4b5563",
      glow: "0 0 20px rgba(107, 114, 128, 0.1)",
    },
  },
];

/* ─── Component ─── */
export function Header({ locale: _locale }: HeaderProps) {
  const { t } = useTranslation("common");
  const pathname = usePathname();
  const locale = useLocale();
  const { openPopup } = useContactPopup();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const displayScrolled = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname],
  );

  const activeLayerId = LAYERS.find((l) =>
    l.items.some((i) => isActive(i.href)),
  )?.id;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          displayScrolled
            ? "shadow-sm border-b border-gray-200"
            : ""
        }`}
      >
        {/* ── Glass backdrop ── */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            displayScrolled
              ? "bg-white/95 backdrop-blur-lg"
              : "bg-white/80 backdrop-blur-sm"
          }`}
        />

        {/* ── Top Bar: Logo + Compact Nav (scrolled) + Utilities ── */}
        <div className="relative z-20 container mx-auto px-6 lg:px-12">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              displayScrolled ? "h-14" : "h-16"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div
                className={`relative rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-all duration-300 ${
                  displayScrolled ? "w-9 h-9" : "w-11 h-11 lg:w-12 lg:h-12"
                }`}
              >
                <Image
                  src="/favicon.png"
                  alt="Hasake Zoo Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1
                  className={`text-gray-900 font-bold tracking-tight transition-all duration-300 ${
                    displayScrolled ? "text-base" : "text-lg lg:text-xl"
                  }`}
                >
                  Hasake Zoo
                </h1>
                {!displayScrolled && (
                  <p className="text-emerald-600 text-[11px] font-light tracking-wide">
                    Habitat solutions
                  </p>
                )}
              </div>
            </Link>

            {/* ── Scrolled: Compact layer icons + nav ── */}
            <AnimatePresence>
              {displayScrolled && (
                <motion.nav
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="hidden lg:flex items-center gap-0.5"
                >
                  {LAYERS.map((layer) => {
                    const isLayerActive = activeLayerId === layer.id;
                    return (
                      <div key={layer.id} className="relative group">
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-300"
                          style={{
                            backgroundColor: isLayerActive
                              ? layer.colors.bgHover
                              : "transparent",
                            boxShadow: isLayerActive
                              ? layer.colors.glow
                              : "none",
                          }}
                        >
                          <span className="text-sm">{layer.icon}</span>
                          {layer.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`text-[13px] font-medium transition-colors duration-200 ${
                                isActive(item.href)
                                  ? "text-gray-900"
                                  : "text-gray-500 hover:text-gray-900"
                              }`}
                              suppressHydrationWarning
                            >
                              {t(item.labelKey)}
                            </Link>
                          ))}
                        </div>
                        <span className="text-gray-300 text-[10px] absolute -right-0.5 top-1/2 -translate-y-1/2 group-last:hidden">
                          ·
                        </span>
                      </div>
                    );
                  })}
                </motion.nav>
              )}
            </AnimatePresence>

            {/* Right: Language + CTA + Mobile burger */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={openPopup}
                className={`hidden lg:flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 ${
                  displayScrolled ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
                }`}
              >
                <svg
                  className={displayScrolled ? "w-3.5 h-3.5" : "w-4 h-4"}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                {t("nav.getInTouch")}
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    className="block h-0.5 bg-gray-900 rounded-full origin-left"
                    animate={
                      mobileMenuOpen
                        ? { rotate: 45, width: "100%" }
                        : { rotate: 0, width: "100%" }
                    }
                    transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
                  />
                  <motion.span
                    className="block h-0.5 bg-gray-900 rounded-full"
                    animate={
                      mobileMenuOpen
                        ? { opacity: 0, x: -10 }
                        : { opacity: 1, x: 0 }
                    }
                    transition={{ duration: 0.2, type: "tween", ease: "easeInOut" }}
                  />
                  <motion.span
                    className="block h-0.5 bg-gray-900 rounded-full origin-left"
                    animate={
                      mobileMenuOpen
                        ? { rotate: -45, width: "100%" }
                        : { rotate: 0, width: "80%" }
                    }
                    transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ── Habitat Navigation Layers — Desktop, visible when NOT scrolled ── */}
        <AnimatePresence>
          {!displayScrolled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 hidden lg:block overflow-hidden"
            >
              <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col">
                  {LAYERS.map((layer) => {
                    const isHovered = hoveredLayer === layer.id;
                    const isLayerActive = activeLayerId === layer.id;

                    return (
                      <motion.div
                        key={layer.id}
                        className="relative cursor-pointer"
                        onMouseEnter={() => setHoveredLayer(layer.id)}
                        onMouseLeave={() => setHoveredLayer(null)}
                        animate={{
                          height: isHovered ? 52 : 36,
                          backgroundColor: isHovered
                            ? layer.colors.bgHover
                            : isLayerActive
                              ? layer.colors.bg
                              : "transparent",
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        {/* Active layer left accent bar */}
                        {isLayerActive && (
                          <motion.div
                            layoutId="activeLayerBar"
                            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                            style={{ backgroundColor: layer.colors.accent }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Top border line */}
                        <div
                          className="absolute top-0 left-4 right-4 h-px transition-opacity duration-300"
                          style={{
                            backgroundColor: layer.colors.accent,
                            opacity: isHovered ? 0.3 : 0.08,
                          }}
                        />

                        <div className="flex items-center h-full px-5 gap-4">
                          {/* Layer icon + zone name */}
                          <div className="flex items-center gap-2.5 min-w-[120px]">
                            <motion.span
                              className="text-base"
                              animate={{
                                scale: isHovered ? 1.2 : 1,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              {layer.icon}
                            </motion.span>
                            <span
                              className="text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity duration-300"
                              style={{
                                color: layer.colors.accent,
                                opacity: isHovered ? 1 : 0.8,
                              }}
                            >
                              {locale === "en" ? layer.nameEn : layer.nameVi}
                            </span>
                          </div>

                          {/* Nav items */}
                          <div className="flex items-center gap-1">
                            {layer.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3.5 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                                  isActive(item.href)
                                    ? "text-gray-900 bg-gray-100"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                                suppressHydrationWarning
                              >
                                {t(item.labelKey)}
                              </Link>
                            ))}
                          </div>

                          {/* Decorative horizon line */}
                          <div
                            className="flex-1 h-px transition-opacity duration-300"
                            style={{
                              backgroundColor: layer.colors.accent,
                              opacity: isHovered ? 0.2 : 0.06,
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom border */}
              <div className="h-px bg-gray-200" />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60]"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/98 backdrop-blur-2xl"
            />

            {/* Close button */}
            <div className="relative z-10 flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Close menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Habitat Layers - Mobile */}
            <div className="relative z-10 flex flex-col h-[calc(100%-80px)] px-6 pb-8 overflow-y-auto">
              {LAYERS.map((layer, i) => {
                const isLayerActive = activeLayerId === layer.id;

                return (
                  <motion.div
                    key={layer.id}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 60, opacity: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="flex-1 min-h-[100px] flex flex-col justify-center py-4"
                    style={{
                      borderLeft: `3px solid ${
                        isLayerActive
                          ? layer.colors.accent
                          : `${layer.colors.accent}33`
                      }`,
                      paddingLeft: "1.25rem",
                      backgroundColor: isLayerActive
                        ? layer.colors.bg
                        : "transparent",
                      borderRadius: "0 8px 8px 0",
                    }}
                  >
                    {/* Zone label */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-xl">{layer.icon}</span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: layer.colors.accent }}
                      >
                        {locale === "en" ? layer.nameEn : layer.nameVi}
                      </span>
                    </div>

                    {/* Nav items */}
                    {layer.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-xl font-semibold py-1.5 transition-colors duration-200 ${
                          isActive(item.href)
                            ? "text-gray-900"
                            : "text-gray-400 active:text-gray-900"
                        }`}
                        suppressHydrationWarning
                      >
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </motion.div>
                );
              })}

              {/* Bottom: Language switcher */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-6 border-t border-gray-200"
              >
                <LanguageSwitcher />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

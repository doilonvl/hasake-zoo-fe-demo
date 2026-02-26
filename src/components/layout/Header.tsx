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
      bgHover: "rgba(14, 165, 233, 0.18)",
      accent: "#38bdf8",
      glow: "0 0 20px rgba(56, 189, 248, 0.15)",
    },
  },
  {
    id: "solutions",
    icon: "🦁",
    nameVi: "Giải Pháp",
    nameEn: "Solutions",
    items: [
      { href: "/services", labelKey: "nav.services" },
    ],
    colors: {
      bg: "rgba(16, 185, 129, 0.06)",
      bgHover: "rgba(16, 185, 129, 0.18)",
      accent: "#34d399",
      glow: "0 0 20px rgba(52, 211, 153, 0.15)",
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
      bgHover: "rgba(245, 158, 11, 0.18)",
      accent: "#fbbf24",
      glow: "0 0 20px rgba(251, 191, 36, 0.15)",
    },
  },
  {
    id: "connect",
    icon: "📞",
    nameVi: "Liên Hệ",
    nameEn: "Connect",
    items: [{ href: "/contact", labelKey: "nav.contact" }],
    colors: {
      bg: "rgba(168, 162, 158, 0.06)",
      bgHover: "rgba(168, 162, 158, 0.18)",
      accent: "#a8a29e",
      glow: "0 0 20px rgba(168, 162, 158, 0.15)",
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

  // On non-home pages, always show compact header (no expanded layers)
  const isHome = pathname === "/";
  const displayScrolled = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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
    [pathname]
  );

  // Which layer owns the current page?
  const activeLayerId = LAYERS.find((l) =>
    l.items.some((i) => isActive(i.href))
  )?.id;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          displayScrolled
            ? "shadow-lg shadow-black/5 border-b border-white/10"
            : ""
        }`}
      >
        {/* ── Glass backdrop ── */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            displayScrolled
              ? "bg-slate-950/92 backdrop-blur-xl"
              : "bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-transparent backdrop-blur-sm"
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
                className={`relative rounded-xl overflow-hidden shadow-xl group-hover:scale-110 transition-all duration-300 ${
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
                  className={`text-white font-bold tracking-tight transition-all duration-300 ${
                    displayScrolled ? "text-base" : "text-lg lg:text-xl"
                  }`}
                >
                  Hasake Zoo
                </h1>
                {!displayScrolled && (
                  <p className="text-emerald-400 text-[11px] font-light tracking-wide">
                    Habitat Solutions
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
                                  ? "text-white"
                                  : "text-white/60 hover:text-white"
                              }`}
                              suppressHydrationWarning
                            >
                              {t(item.labelKey)}
                            </Link>
                          ))}
                        </div>
                        {/* Separator dot */}
                        <span className="text-white/30 text-[10px] absolute -right-0.5 top-1/2 -translate-y-1/2 group-last:hidden">
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
                className="lg:hidden relative w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between">
                  <motion.span
                    className="block h-0.5 bg-white rounded-full origin-left"
                    animate={
                      mobileMenuOpen
                        ? { rotate: 45, width: "100%" }
                        : { rotate: 0, width: "100%" }
                    }
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block h-0.5 bg-white rounded-full"
                    animate={
                      mobileMenuOpen
                        ? { opacity: 0, x: -10 }
                        : { opacity: 1, x: 0 }
                    }
                    transition={{ duration: 0.2 }}
                  />
                  <motion.span
                    className="block h-0.5 bg-white rounded-full origin-left"
                    animate={
                      mobileMenuOpen
                        ? { rotate: -45, width: "100%" }
                        : { rotate: 0, width: "80%" }
                    }
                    transition={{ duration: 0.3 }}
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
                <div
                  className="flex flex-col"
                  style={{ perspective: "600px" }}
                >
                  {LAYERS.map((layer, idx) => {
                    const isHovered = hoveredLayer === layer.id;
                    const isLayerActive = activeLayerId === layer.id;

                    return (
                      <motion.div
                        key={layer.id}
                        className="relative cursor-pointer"
                        style={{
                          transformStyle: "preserve-3d",
                        }}
                        onMouseEnter={() => setHoveredLayer(layer.id)}
                        onMouseLeave={() => setHoveredLayer(null)}
                        animate={{
                          height: isHovered ? 52 : 36,
                          backgroundColor: isHovered
                            ? layer.colors.bgHover
                            : isLayerActive
                              ? layer.colors.bg
                              : "transparent",
                          translateZ: isHovered ? 0 : -idx * 6,
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
                            opacity: isHovered ? 0.4 : 0.1,
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
                                opacity: isHovered ? 1 : 0.7,
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
                                    ? "text-white bg-white/10"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
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
                              opacity: isHovered ? 0.25 : 0.06,
                            }}
                          />

                          {/* Hover glow effect */}
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                boxShadow: layer.colors.glow,
                                borderRadius: "4px",
                              }}
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Organic grass/leaf bottom edge */}
              <svg
                className="w-full h-3 relative -mb-3"
                viewBox="0 0 1440 12"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M0 0C80 0 80 6 160 6C240 6 240 2 320 2C400 2 400 8 480 8C560 8 560 3 640 3C720 3 720 7 800 7C880 7 880 1 960 1C1040 1 1040 5 1120 5C1200 5 1200 2 1280 2C1360 2 1360 4 1440 4V0H0Z"
                  fill="rgba(15, 23, 42, 0.5)"
                />
                <path
                  d="M0 0C60 0 120 10 180 8C240 6 300 12 360 10C420 8 480 12 540 9C600 6 660 11 720 8C780 5 840 10 900 7C960 4 1020 9 1080 6C1140 3 1200 8 1260 5C1320 2 1380 6 1440 4V0H0Z"
                  fill="rgba(16, 185, 129, 0.08)"
                />
              </svg>
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
              className="absolute inset-0 bg-slate-950/98 backdrop-blur-2xl"
            />

            {/* Close button */}
            <div className="relative z-10 flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
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
                            ? "text-white"
                            : "text-white/50 active:text-white"
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
                className="mt-auto pt-6 border-t border-white/10"
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

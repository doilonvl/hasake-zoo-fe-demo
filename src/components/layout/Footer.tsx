"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n/client";
import type { Locale } from "@/types/content";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale === "en" ? "en" : ""}`, label: t("nav.home") },
    {
      href: `/${locale === "en" ? "en/" : ""}services`,
      label: t("nav.services"),
    },
    {
      href: `/${locale === "en" ? "en/" : ""}products`,
      label: t("nav.products"),
    },
    {
      href: `/${locale === "en" ? "en/" : ""}projects`,
      label: t("nav.projects"),
    },
    { href: `/${locale === "en" ? "en/" : ""}about`, label: t("nav.about") },
    {
      href: `/${locale === "en" ? "en/" : ""}contact`,
      label: t("nav.contact"),
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/hasakezoo",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/hasakezoo",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/hasakezoo",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative z-10 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-8 lg:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link
              href={`/${locale === "en" ? "en" : ""}`}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/favicon.png"
                  alt="Hasake Zoo Logo"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div>
                <h3 className="text-gray-900 text-xl font-bold">Hasake Zoo</h3>
                <p className="text-emerald-600 text-sm">Habitat Solutions</p>
              </div>
            </Link>
            <p
              className="text-gray-600 leading-relaxed"
              suppressHydrationWarning
            >
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white hover:bg-emerald-600 border border-gray-200 hover:border-emerald-600 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-gray-900 text-lg font-bold mb-6"
              suppressHydrationWarning
            >
              {t("footer.quickLinks")}
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-emerald-600 transition-colors duration-300 flex items-center gap-2 group"
                  suppressHydrationWarning
                >
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              className="text-gray-900 text-lg font-bold mb-6"
              suppressHydrationWarning
            >
              {t("footer.contact")}
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-gray-600">
                  50 Thuy Khue Street, Tay Ho
                  <br />
                  Hanoi, Vietnam
                </p>
              </div>
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@hasakezoo.com.vn"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  info@hasakezoo.com.vn
                </a>
              </div>
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+84985310238"
                  className="text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  +84 098 531 0238
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="text-gray-900 text-lg font-bold mb-6"
              suppressHydrationWarning
            >
              {t("footer.newsletter")}
            </h4>
            <p className="text-gray-600 mb-4" suppressHydrationWarning>
              {t("footer.newsletterDesc")}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none transition-colors"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                suppressHydrationWarning
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-gray-500 text-sm text-center md:text-left"
              suppressHydrationWarning
            >
              © {currentYear} Hasake Zoo & Habitat Solution.{" "}
              {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-emerald-600 text-sm transition-colors"
                suppressHydrationWarning
              >
                {t("footer.privacy")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

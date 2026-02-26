"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import type { Locale } from "@/types/content";
import type { Service, ServiceCategory } from "@/types/api";

interface ServicesClientProps {
  locale: Locale;
  initialServices: Service[];
  initialCategories: ServiceCategory[];
}

export function ServicesClient({ locale, initialServices, initialCategories }: ServicesClientProps) {
  const { t } = useTranslation("services");
  const [services] = useState<Service[]>(initialServices);
  const [categories] = useState<ServiceCategory[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.categoryId === selectedCategory)
    : services;

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section><section className="relative overflow-hidden pt-28 pb-0">
        {/* Background */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_0%_0%,rgba(16,185,129,0.14),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_100%_100%,rgba(20,184,166,0.10),transparent_60%)]" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(6,182,212,0.07),transparent)]" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:3rem_3rem]" />

        <div className="relative z-10 container mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center min-h-[58vh] pb-16">

            {/* Left column */}
            <div className="lg:col-span-3 pt-4">
              <ScrollReveal>
                <PageBreadcrumb
                  items={[
                    { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                    { label: locale === "vi" ? "Dịch Vụ" : "Services" },
                  ]}
                />
                <div className="inline-flex items-center gap-2 mb-7 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">
                    {t("hero.eyebrow")}
                  </p>
                </div>

                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
                  <span className="text-white">{t("hero.title").split(" ").slice(0, 2).join(" ")}</span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    {t("hero.title").split(" ").slice(2).join(" ")}
                  </span>
                </h1>

                <p className="text-white/55 text-lg lg:text-xl leading-relaxed max-w-xl mb-10">
                  {t("hero.description")}
                </p>

                {/* Mobile stats */}
                <div className="flex flex-wrap gap-8 lg:hidden">
                  <div>
                    <div className="text-emerald-400 text-3xl font-black mb-0.5">50+</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Projects</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <div className="text-teal-400 text-3xl font-black mb-0.5">15+</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Countries</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <div className="text-cyan-400 text-3xl font-black mb-0.5">20Y</div>
                    <div className="text-white/40 text-xs tracking-wider uppercase">Experience</div>
                  </div>
                </div>

                {/* Scroll indicator */}
                <div className="hidden lg:flex items-center gap-3 text-white/30 text-xs tracking-widest uppercase mt-2">
                  <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1">
                    <div className="w-1 h-2 rounded-full bg-emerald-400/70 animate-bounce" />
                  </div>
                  <span>{locale === "vi" ? "Cuộn để khám phá" : "Scroll to explore"}</span>
                </div>
              </ScrollReveal>
            </div>

            {/* Right column — floating stat cards (desktop only) */}
            <div className="lg:col-span-2 relative hidden lg:flex flex-col justify-center">
              {/* Decorative rings */}
              <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full border border-emerald-500/8 pointer-events-none" />
              <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full border border-teal-500/10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full border border-cyan-500/8 pointer-events-none" />

              <div className="space-y-4 py-8">
                <ScrollReveal delay={0.15}>
                  <div className="ml-6 rounded-2xl border border-emerald-500/25 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-emerald-500/50 hover:bg-white/[0.06] transition-all duration-500 group">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-emerald-400 text-5xl font-black leading-none group-hover:scale-105 transition-transform duration-300">50+</span>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center mb-1">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      </div>
                    </div>
                    <div className="text-white/45 text-sm tracking-wider uppercase font-medium">
                      {locale === "vi" ? "Dự Án Hoàn Thành" : "Projects Completed"}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.25}>
                  <div className="mr-6 rounded-2xl border border-teal-500/25 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-teal-500/50 hover:bg-white/[0.06] transition-all duration-500 group">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-teal-400 text-5xl font-black leading-none group-hover:scale-105 transition-transform duration-300">15+</span>
                      <div className="w-8 h-8 rounded-full bg-teal-500/15 flex items-center justify-center mb-1">
                        <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                      </div>
                    </div>
                    <div className="text-white/45 text-sm tracking-wider uppercase font-medium">
                      {locale === "vi" ? "Quốc Gia Phục Vụ" : "Countries Worldwide"}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.35}>
                  <div className="ml-6 rounded-2xl border border-cyan-500/25 bg-white/[0.03] backdrop-blur-sm p-6 hover:border-cyan-500/50 hover:bg-white/[0.06] transition-all duration-500 group">
                    <div className="flex items-end gap-3 mb-2">
                      <span className="text-cyan-400 text-5xl font-black leading-none group-hover:scale-105 transition-transform duration-300">20Y</span>
                      <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center mb-1">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                    </div>
                    <div className="text-white/45 text-sm tracking-wider uppercase font-medium">
                      {locale === "vi" ? "Năm Kinh Nghiệm" : "Years of Experience"}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </section></Section>

      {/* Category Filters - Glass morphism */}
      <section className="bg-slate-950/80 border-y border-white/10 backdrop-blur-2xl shadow-sm">
        <div className="container mx-auto px-8 lg:px-16 py-6">
          <ScrollReveal direction="fade">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`group relative px-8 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-500 ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/50 scale-105"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                }`}
              >
                <span className="relative z-10">{t("filters.all")}</span>
                {selectedCategory === null && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                )}
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`group relative px-8 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-500 ${
                    selectedCategory === category._id
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-600/50 scale-105"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="relative z-10">
                    {resolveLocalizedString(category.name_i18n, locale)}
                  </span>
                  {selectedCategory === category._id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-32 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          {filteredServices.length === 0 ? (
            <div className="text-center py-32">
              <div className="text-8xl mb-6">🌿</div>
              <p className="text-white/60 text-2xl font-light">{t("empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredServices.map((service, idx) => {
                return (
                  <ScrollReveal
                    key={service._id}
                    direction="up"
                    delay={idx * 0.05}
                  >
                    <Link
                      href={`/${locale === "en" ? "en/" : ""}services/${resolveLocalizedString(service.slug_i18n, locale)}`}
                      className="group block h-full"
                    >
                      <div className="relative min-h-[380px] rounded-2xl overflow-hidden border border-white/8 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-900/40 hover:-translate-y-1">
                        {/* Background: image or gradient fallback */}
                        {service.coverImage ? (
                          <div className="absolute inset-0">
                            <Image
                              src={service.coverImage.url}
                              alt={
                                resolveLocalizedString(service.coverImage.alt_i18n, locale)
                                || resolveLocalizedString(service.name_i18n, locale)
                              }
                              fill
                              className="object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/20" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12),transparent_60%)]" />
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
                          </div>
                        )}

                        {/* Featured badge */}
                        {service.isFeatured && (
                          <div className="absolute top-5 right-5 z-10">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">
                              {t("featured")}
                            </span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="relative h-full min-h-[380px] p-7 flex flex-col justify-end">
                          {/* Top accent line */}
                          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="space-y-3">
                            <h3 className="text-white text-2xl lg:text-3xl font-bold leading-snug group-hover:text-emerald-300 transition-colors duration-300">
                              {resolveLocalizedString(service.name_i18n, locale)}
                            </h3>

                            {service.excerpt_i18n && (
                              <p className="text-white/55 text-base leading-relaxed line-clamp-2 group-hover:text-white/75 transition-colors duration-300">
                                {resolveLocalizedString(service.excerpt_i18n, locale)}
                              </p>
                            )}

                            {/* Highlights */}
                            {service.highlights_i18n?.[locale] && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {service.highlights_i18n[locale].slice(0, 3).map((highlight, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400/90 text-xs font-medium rounded-full border border-emerald-500/15">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold pt-3 group-hover:gap-3 transition-all duration-300">
                              <span>{t("learnMore")}</span>
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - 3D Card Effect */}
      <section className="py-32 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-100/30 via-transparent to-transparent" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          <ScrollReveal>
            <div className="relative group">
              {/* 3D card */}
              <div className="relative rounded-[3rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-16 text-center overflow-hidden transition-transform duration-700 hover:scale-[1.02]">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                {/* Floating orbs */}
                <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-float [animation-delay:1.5s]" />

                <div className="relative z-10">
                  <h2 className="text-white text-6xl lg:text-7xl font-black mb-6">
                    {t("cta.title")}
                  </h2>
                  <p className="text-white/90 text-2xl mb-12 max-w-3xl mx-auto font-light">
                    {t("cta.description")}
                  </p>
                  <Link
                    href={`/${locale === "en" ? "en/" : ""}contact`}
                    className="group/btn inline-flex items-center gap-3 px-12 py-6 bg-white text-emerald-400 rounded-2xl text-xl font-black hover:bg-emerald-500/20 transition-all duration-300 shadow-2xl hover:shadow-white/50 hover:scale-105"
                  >
                    <span>{t("cta.button")}</span>
                    <svg
                      className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </PageTransition>
  );
}

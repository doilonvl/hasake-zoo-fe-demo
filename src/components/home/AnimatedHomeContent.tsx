"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/content";
import type { Service, Project } from "@/types/api";
import type { Blog } from "@/types/blog";
import { resolveLocalizedString } from "@/lib/i18n";
import { ContactInquiryForm } from "@/components/shared/contact-inquiry-form";

type Props = {
  locale: Locale;
  prefix: string;
  t: {
    servicesEyebrow: string;
    servicesTitle: string;
    servicesDesc: string;
    learnMore: string;
    viewAll: string;
    statsYears: string;
    statsProjects: string;
    statsCountries: string;
    statsSpecies: string;
    projectsEyebrow: string;
    projectsTitle: string;
    projectsDesc: string;
    viewProject: string;
    blogEyebrow: string;
    blogTitle: string;
    blogDesc: string;
    readMore: string;
    minRead: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaBtn: string;
    contactEyebrow: string;
    contactTitle: string;
    contactTitle2: string;
    contactDesc: string;
    sendMsg: string;
  };
  featuredServices: Service[];
  featuredProjects: Project[];
  latestBlogs: Blog[];
};

export function AnimatedHomeContent({
  locale,
  prefix,
  t,
  featuredServices,
  featuredProjects,
  latestBlogs,
}: Props) {
  const servicesRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const blogsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // IntersectionObserver triggers GSAP animations — avoids Lenis + ScrollTrigger conflicts
    const allEls: HTMLElement[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseFloat(el.dataset.delay ?? "0");
            gsap.to(el, {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              duration: 0.9,
              ease: "power3.out",
              delay,
            });
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );

    [servicesRef, statsRef, projectsRef, blogsRef, ctaRef, contactRef].forEach(
      (ref) => {
        if (!ref.current) return;
        ref.current.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
          const anim = el.dataset.anim ?? "fade-up";
          if (anim === "fade-up") gsap.set(el, { opacity: 0, y: 60 });
          else if (anim === "fade-left") gsap.set(el, { opacity: 0, x: -80 });
          else if (anim === "fade-right") gsap.set(el, { opacity: 0, x: 80 });
          else if (anim === "scale-up") gsap.set(el, { opacity: 0, scale: 0.82, y: 20 });
          allEls.push(el);
          observer.observe(el);
        });
      }
    );

    return () => {
      allEls.forEach((el) => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "all" });
      });
      observer.disconnect();
    };
  }, []);

  /* ─────────────────────────────────────────────────── */
  return (
    <>
      {/* ═══ Services — Magazine Asymmetric Grid ═══ */}
      <section
        ref={servicesRef}
        className="relative py-28 lg:py-36 bg-[#060f15] overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute -top-48 left-1/4 w-[480px] h-[480px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          {/* Header */}
          <div className="mb-14" data-anim="fade-up">
            <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
              {t.servicesEyebrow}
            </p>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-white text-5xl lg:text-7xl font-bold">
                {t.servicesTitle}
              </h2>
              <Link
                href={`${prefix}/services`}
                className="hidden lg:flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors text-sm font-medium shrink-0 mb-2"
              >
                {t.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <p className="text-white/45 text-lg mt-3 max-w-xl">{t.servicesDesc}</p>
          </div>

          {/* Asymmetric grid: featured left + stacked right */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5"
            style={{ minHeight: 560 }}
          >
            {/* Featured service */}
            {featuredServices[0] && (
              <Link
                href={`${prefix}/services/${resolveLocalizedString(
                  featuredServices[0].slug_i18n,
                  locale
                )}`}
                className="group relative overflow-hidden rounded-[44px] min-h-[520px] lg:min-h-0 border border-white/8 hover:border-emerald-500/40 bg-white/[0.03] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10"
                data-anim="fade-left"
                data-delay="0.12"
              >
                <span className="absolute bottom-4 right-6 text-[200px] font-black text-white/[0.035] leading-none select-none pointer-events-none">
                  01
                </span>
                {featuredServices[0].coverImage && (
                  <div className="absolute inset-0">
                    <Image
                      src={featuredServices[0].coverImage.url}
                      alt={resolveLocalizedString(featuredServices[0].name_i18n, locale)}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060f15] via-[#060f15]/65 to-[#060f15]/10" />
                <div className="relative h-full flex flex-col justify-end p-10 lg:p-14">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-[11px] font-bold tracking-[0.22em] uppercase">
                      FEATURED
                    </span>
                    <div className="flex-1 h-px bg-emerald-400/20" />
                  </div>
                  <h3 className="text-white text-4xl lg:text-5xl font-bold mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                    {resolveLocalizedString(featuredServices[0].name_i18n, locale)}
                  </h3>
                  <p className="text-white/50 text-lg line-clamp-2 mb-8">
                    {resolveLocalizedString(featuredServices[0].excerpt_i18n, locale)}
                  </p>
                  <div className="flex items-center gap-3 text-emerald-400 font-semibold group-hover:gap-5 transition-all duration-300">
                    <span>{t.learnMore}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}

            {/* Stacked smaller cards */}
            <div className="flex flex-col gap-5">
              {featuredServices.slice(1).map((service, idx) => (
                <Link
                  key={service._id}
                  href={`${prefix}/services/${resolveLocalizedString(
                    service.slug_i18n,
                    locale
                  )}`}
                  className="group relative overflow-hidden rounded-[28px] flex-1 min-h-[158px] border border-white/8 hover:border-emerald-500/40 bg-white/[0.03] transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/8"
                  data-anim="fade-right"
                  data-delay={String(0.2 + idx * 0.1)}
                >
                  <span className="absolute top-2 right-4 text-[72px] font-black text-white/[0.045] leading-none select-none pointer-events-none">
                    {String(idx + 2).padStart(2, "0")}
                  </span>
                  {service.coverImage && (
                    <div className="absolute inset-0">
                      <Image
                        src={service.coverImage.url}
                        alt={resolveLocalizedString(service.name_i18n, locale)}
                        fill
                        className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#060f15]/95 via-[#060f15]/75 to-transparent" />
                  <div className="relative h-full p-7 flex flex-col justify-between">
                    <h3 className="text-white text-xl font-bold group-hover:text-emerald-400 transition-colors duration-300 max-w-[220px] leading-snug">
                      {resolveLocalizedString(service.name_i18n, locale)}
                    </h3>
                    <div className="flex items-center gap-2 text-emerald-400/60 text-sm font-medium group-hover:text-emerald-400 group-hover:gap-3 transition-all duration-300">
                      <span>{t.learnMore}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile: view all */}
          <div className="text-center mt-8 lg:hidden">
            <Link
              href={`${prefix}/services`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/60 hover:border-emerald-400/50 hover:text-emerald-400 transition-all text-sm font-medium"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Stats Banner ═══ */}
      <section
        ref={statsRef}
        className="relative py-20 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 border-y border-emerald-600/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="container mx-auto px-8 lg:px-16 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "20+", label: t.statsYears },
              { value: "100+", label: t.statsProjects },
              { value: "6+", label: t.statsCountries },
              { value: "200+", label: t.statsSpecies },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center group"
                data-anim="scale-up"
                data-delay={String(idx * 0.1)}
              >
                <div className="text-emerald-400 text-5xl lg:text-6xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm lg:text-base font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Projects — Showcase Layout ═══ */}
      <section
        ref={projectsRef}
        className="relative py-28 lg:py-36 bg-[#070d12] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          {/* Header */}
          <div
            className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
            data-anim="fade-up"
          >
            <div>
              <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
                {t.projectsEyebrow}
              </p>
              <h2 className="text-white text-5xl lg:text-7xl font-bold">
                {t.projectsTitle}
              </h2>
              <p className="text-white/45 text-lg mt-3 max-w-xl">{t.projectsDesc}</p>
            </div>
            <Link
              href={`${prefix}/projects`}
              className="hidden lg:flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors text-sm font-medium shrink-0"
            >
              {t.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="space-y-5">
            {/* Featured project — horizontal split */}
            {featuredProjects[0] && (
              <Link
                href={`${prefix}/projects/${resolveLocalizedString(
                  featuredProjects[0].slug_i18n,
                  locale
                )}`}
                className="group flex flex-col lg:flex-row overflow-hidden rounded-[44px] border border-white/8 hover:border-emerald-500/30 bg-white/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/8"
                data-anim="fade-left"
                data-delay="0.1"
              >
                {/* Image side */}
                <div className="relative lg:w-[58%] h-72 lg:h-auto min-h-[360px] overflow-hidden">
                  {featuredProjects[0].coverImage ? (
                    <Image
                      src={featuredProjects[0].coverImage.url}
                      alt={resolveLocalizedString(featuredProjects[0].title_i18n, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#070d12]/80 lg:to-[#070d12]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070d12]/60 lg:from-transparent" />
                  <span className="absolute top-6 left-8 text-[110px] font-black text-white/[0.07] leading-none select-none pointer-events-none">
                    01
                  </span>
                  <div className="absolute top-5 right-5 lg:hidden">
                    <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                      {featuredProjects[0].category ?? "Transport"}
                    </span>
                  </div>
                </div>

                {/* Content side */}
                <div className="lg:w-[42%] bg-[#070d12] p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <span className="hidden lg:inline-flex px-3 py-1 bg-emerald-600/15 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold rounded-full uppercase tracking-[0.15em]">
                      {featuredProjects[0].category ?? "Transport"}
                    </span>
                    <h3 className="text-white text-3xl lg:text-4xl font-bold mt-5 group-hover:text-emerald-400 transition-colors duration-300 leading-tight">
                      {resolveLocalizedString(featuredProjects[0].title_i18n, locale)}
                    </h3>
                    <p className="text-white/50 text-base lg:text-lg line-clamp-3 mt-5 leading-relaxed">
                      {resolveLocalizedString(featuredProjects[0].excerpt_i18n, locale)}
                    </p>
                    {featuredProjects[0].location_i18n && (
                      <div className="flex items-center gap-2 text-white/35 text-sm mt-5">
                        <svg className="w-4 h-4 text-emerald-500/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {resolveLocalizedString(featuredProjects[0].location_i18n, locale)}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-emerald-400 font-semibold group-hover:gap-5 transition-all duration-300 mt-10">
                    <span>{t.viewProject}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            )}

            {/* 2 smaller projects */}
            {featuredProjects.length > 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {featuredProjects.slice(1).map((project, idx) => (
                  <Link
                    key={project._id}
                    href={`${prefix}/projects/${resolveLocalizedString(
                      project.slug_i18n,
                      locale
                    )}`}
                    className="group relative overflow-hidden rounded-[32px] border border-white/8 hover:border-emerald-500/30 bg-white/[0.02] transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/8"
                    data-anim="fade-up"
                    data-delay={String(0.2 + idx * 0.12)}
                  >
                    {/* Image top */}
                    <div className="relative h-56 overflow-hidden">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage.url}
                          alt={resolveLocalizedString(project.title_i18n, locale)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070d12] via-[#070d12]/20 to-transparent" />
                      <span className="absolute bottom-3 right-5 text-[80px] font-black text-white/[0.06] leading-none select-none pointer-events-none">
                        {String(idx + 2).padStart(2, "0")}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-7">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-emerald-600/15 border border-emerald-500/20 text-emerald-400/80 text-[11px] font-bold rounded-full uppercase tracking-wider">
                          {project.category ?? "Transport"}
                        </span>
                        {project.location_i18n && (
                          <span className="text-white/30 text-xs flex items-center gap-1">
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {resolveLocalizedString(project.location_i18n, locale)}
                          </span>
                        )}
                      </div>
                      <h3 className="text-white text-xl font-bold group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-snug">
                        {resolveLocalizedString(project.title_i18n, locale)}
                      </h3>
                      <div className="flex items-center gap-2 text-emerald-400/60 text-sm font-medium group-hover:text-emerald-400 group-hover:gap-3 transition-all duration-300 mt-5">
                        <span>{t.viewProject}</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ Blog — Editorial Layout ═══ */}
      <section
        ref={blogsRef}
        className="relative py-28 lg:py-36 bg-gradient-to-b from-slate-900 via-[#070d12] to-[#070d12] overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          {/* Header */}
          <div
            className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
            data-anim="fade-up"
          >
            <div>
              <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
                {t.blogEyebrow}
              </p>
              <h2 className="text-white text-5xl lg:text-7xl font-bold">
                {t.blogTitle}
              </h2>
              <p className="text-white/45 text-lg mt-3 max-w-xl">{t.blogDesc}</p>
            </div>
            <Link
              href={`${prefix}/blog`}
              className="hidden lg:flex items-center gap-2 text-white/40 hover:text-emerald-400 transition-colors text-sm font-medium shrink-0"
            >
              {t.viewAll}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-10 lg:gap-16">
            {/* Featured blog — large left */}
            {latestBlogs[0] && (
              <Link
                href={`${prefix}/blog/${
                  latestBlogs[0].slug ||
                  resolveLocalizedString(latestBlogs[0].slug_i18n, locale)
                }`}
                className="group flex flex-col"
                data-anim="fade-left"
                data-delay="0.1"
              >
                {latestBlogs[0].coverImage?.url && (
                  <div className="relative overflow-hidden rounded-[32px] h-80 mb-7 border border-white/8 group-hover:border-emerald-500/30 transition-colors duration-500">
                    <Image
                      src={latestBlogs[0].coverImage.url}
                      alt={resolveLocalizedString(latestBlogs[0].title_i18n, locale)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d12]/60 to-transparent" />
                    {(latestBlogs[0].tags ?? [])[0] && (
                      <div className="absolute top-5 left-5">
                        <span className="px-3 py-1.5 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                          {latestBlogs[0].tags![0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] text-white/40 mb-4">
                  <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase">
                    FEATURED
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  {latestBlogs[0].publishedAt && (
                    <span>
                      {new Date(latestBlogs[0].publishedAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {latestBlogs[0].readingTimeMinutes && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>
                        {latestBlogs[0].readingTimeMinutes} {t.minRead}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-white text-3xl lg:text-4xl font-bold group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-tight mb-4">
                  {resolveLocalizedString(latestBlogs[0].title_i18n, locale)}
                </h3>
                {resolveLocalizedString(latestBlogs[0].excerpt_i18n, locale) && (
                  <p className="text-white/50 text-base lg:text-lg line-clamp-3 leading-relaxed mb-7 flex-1">
                    {resolveLocalizedString(latestBlogs[0].excerpt_i18n, locale)}
                  </p>
                )}
                <div className="flex items-center gap-3 text-emerald-400 font-semibold group-hover:gap-5 transition-all duration-300">
                  <span>{t.readMore}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            )}

            {/* Blog list — editorial rows right */}
            {latestBlogs.length > 1 && (
              <div className="flex flex-col justify-center divide-y divide-white/[0.07]">
                {latestBlogs.slice(1).map((blog, idx) => {
                  const blogSlug =
                    blog.slug || resolveLocalizedString(blog.slug_i18n, locale);
                  const blogTitle = resolveLocalizedString(blog.title_i18n, locale);
                  const blogExcerpt = resolveLocalizedString(blog.excerpt_i18n, locale);
                  const blogImage = blog.coverImage?.url;
                  const blogTags = blog.tags ?? [];
                  return (
                    <Link
                      key={blog._id}
                      href={`${prefix}/blog/${blogSlug}`}
                      className="group flex gap-5 py-7 first:pt-0"
                      data-anim="fade-right"
                      data-delay={String(0.2 + idx * 0.15)}
                    >
                      {blogImage && (
                        <div className="relative w-[96px] h-[96px] flex-shrink-0 rounded-2xl overflow-hidden border border-white/8 group-hover:border-emerald-500/30 transition-colors duration-500">
                          <Image
                            src={blogImage}
                            alt={blogTitle}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          {blogTags[0] && (
                            <span className="text-emerald-400/60 text-[11px] font-bold tracking-[0.18em] uppercase">
                              {blogTags[0]}
                            </span>
                          )}
                          <h3 className="text-white text-base font-bold group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 mt-1 leading-snug">
                            {blogTitle}
                          </h3>
                          {blogExcerpt && (
                            <p className="text-white/35 text-sm line-clamp-2 mt-1.5 leading-relaxed">
                              {blogExcerpt}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {blog.publishedAt && (
                            <span className="text-white/25 text-xs">
                              {new Date(blog.publishedAt).toLocaleDateString(locale, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                            {t.readMore}
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* View all */}
                <div className="pt-7">
                  <Link
                    href={`${prefix}/blog`}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border border-white/10 text-white/45 hover:border-emerald-400/40 hover:text-emerald-400 transition-all duration-300 text-sm font-medium"
                  >
                    {t.viewAll}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section
        ref={ctaRef}
        className="relative py-28 bg-gradient-to-b from-emerald-500/10 via-teal-500/10 to-emerald-500/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-8 lg:px-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-white text-5xl lg:text-7xl font-bold mb-6"
              data-anim="fade-up"
              data-delay="0"
            >
              {t.ctaTitle}
            </h2>
            <p
              className="text-white/70 text-xl lg:text-2xl mb-12 max-w-2xl mx-auto"
              data-anim="fade-up"
              data-delay="0.1"
            >
              {t.ctaDesc}
            </p>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 hover:scale-105"
              data-anim="fade-up"
              data-delay="0.2"
            >
              {t.ctaBtn}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Contact Section ═══ */}
      <section
        ref={contactRef}
        className="relative py-28 lg:py-36 bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Column */}
            <div className="space-y-8" data-anim="fade-left" data-delay="0.1">
              <div>
                <p className="text-emerald-400 text-sm font-bold tracking-[0.2em] mb-4">
                  {t.contactEyebrow}
                </p>
                <h2 className="text-white text-5xl lg:text-6xl font-bold mb-6">
                  {t.contactTitle}
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {t.contactTitle2}
                  </span>
                </h2>
                <p className="text-white/70 text-xl leading-relaxed">{t.contactDesc}</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </>
                    ),
                    title: "Office Location",
                    value: "50 Thuy Khue Street, Tay Ho, Hanoi, Vietnam",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ),
                    title: "Email Us",
                    value: "info@hasakezoo.com.vn",
                  },
                  {
                    icon: (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    ),
                    title: "Call Us",
                    value: "+84 098 531 0238",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:bg-white/[0.07] transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-lg mb-1">{item.title}</h4>
                        <p className="text-white/70">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div
              className="bg-white/5 rounded-[48px] border-2 border-white/10 p-10 lg:p-12"
              data-anim="fade-right"
              data-delay="0.2"
            >
              <h3 className="text-white text-3xl font-bold mb-8">{t.sendMsg}</h3>
              <ContactInquiryForm inquiryType="general" locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

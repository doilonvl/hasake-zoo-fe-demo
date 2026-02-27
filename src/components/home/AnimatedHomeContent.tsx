"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/content";
import type { Service, Project } from "@/types/api";
import type { Blog } from "@/types/blog";
import { resolveLocalizedString } from "@/lib/i18n";
import { useTranslation } from "@/i18n/client";
import { ContactInquiryForm } from "@/components/shared/contact-inquiry-form";

gsap.registerPlugin(ScrollTrigger);

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
  const { t: tHome } = useTranslation("home");
  const servicesRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const projectsLineRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  /* ─── Projects: parallax zoom + row reveal + timeline line ─── */
  useEffect(() => {
    const section = projectsRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      section
        .querySelectorAll<HTMLElement>(".proj-img-inner")
        .forEach((inner) => {
          const row = inner.closest(".proj-row") as HTMLElement;
          if (!row) return;
          gsap.fromTo(
            inner,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

      if (projectsLineRef.current) {
        gsap.fromTo(
          projectsLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              end: "bottom 55%",
              scrub: 1,
            },
          },
        );
      }

      section.querySelectorAll<HTMLElement>(".proj-row").forEach((row, i) => {
        const textSide = row.querySelector<HTMLElement>(".proj-text");
        const imgSide = row.querySelector<HTMLElement>(".proj-img-wrap");
        const isLeft = i % 2 === 0;
        if (textSide) {
          gsap.fromTo(
            textSide,
            { opacity: 0, x: isLeft ? 70 : -70 },
            {
              opacity: 1,
              x: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 68%",
                toggleActions: "play none none none",
              },
            },
          );
        }
        if (imgSide) {
          gsap.fromTo(
            imgSide,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 72%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [featuredProjects.length]);

  /* ─── Other sections (IntersectionObserver) ─── */
  useEffect(() => {
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
      { threshold: 0.08 },
    );

    [servicesRef, statsRef, blogsRef, ctaRef, contactRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
        const anim = el.dataset.anim ?? "fade-up";
        if (anim === "fade-up") gsap.set(el, { opacity: 0, y: 60 });
        else if (anim === "fade-left") gsap.set(el, { opacity: 0, x: -80 });
        else if (anim === "fade-right") gsap.set(el, { opacity: 0, x: 80 });
        else if (anim === "scale-up")
          gsap.set(el, { opacity: 0, scale: 0.82, y: 20 });
        allEls.push(el);
        observer.observe(el);
      });
    });

    return () => {
      allEls.forEach((el) => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "all" });
      });
      observer.disconnect();
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <>
      {/* ═══ SERVICES — Alternating Editorial Split ═══ */}
      <section
        ref={servicesRef}
        className="relative bg-[#060d0a] overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-600/[0.06] rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-600/[0.05] rounded-full blur-[150px] pointer-events-none" />

        {/* Section header */}
        <div className="container mx-auto px-6 sm:px-8 lg:px-16 pt-20 sm:pt-28 lg:pt-36 pb-10 lg:pb-16">
          <div
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
            data-anim="fade-up"
          >
            <div>
              <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
                {t.servicesEyebrow}
              </p>
              <h2 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {t.servicesTitle}
              </h2>
              <p className="text-white/65 text-base sm:text-lg mt-3 max-w-xl">
                {t.servicesDesc}
              </p>
            </div>
            <Link
              href={`${prefix}/services`}
              className="hidden lg:flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors text-sm font-semibold shrink-0"
            >
              {t.viewAll}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Alternating service rows */}
        {featuredServices.map((service, idx) => {
          const isLeft = idx % 2 === 0;
          const name = resolveLocalizedString(service.name_i18n, locale);
          const excerpt = resolveLocalizedString(service.excerpt_i18n, locale);
          const slug = resolveLocalizedString(service.slug_i18n, locale);
          const imgUrl = service.coverImage?.url;
          const num = String(idx + 1).padStart(2, "0");
          const total = String(featuredServices.length).padStart(2, "0");

          return (
            <div
              key={service._id}
              className="relative flex flex-col lg:flex-row items-stretch border-t border-white/[0.06] min-h-[60vh] lg:min-h-[80vh]"
              data-anim={isLeft ? "fade-left" : "fade-right"}
              data-delay={String(idx * 0.12)}
            >
              {/* Image side */}
              <Link
                href={`${prefix}/services/${slug}`}
                className={`group relative ${isLeft ? "lg:order-1" : "lg:order-2"} w-full lg:w-[55%] h-[60vw] sm:h-[50vw] lg:h-auto overflow-hidden`}
              >
                <div className="absolute inset-0">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-[#060d0a]" />
                  )}
                  <div
                    className={`absolute inset-0 ${
                      isLeft
                        ? "bg-gradient-to-r from-transparent via-transparent to-[#060d0a]/50"
                        : "bg-gradient-to-l from-transparent via-transparent to-[#060d0a]/50"
                    }`}
                  />
                </div>

                {/* Diagonal cut edge (desktop) */}
                {isLeft ? (
                  <div
                    className="absolute inset-y-0 right-0 w-16 lg:w-24 bg-[#060d0a] hidden lg:block"
                    style={{
                      clipPath: "polygon(60% 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-y-0 left-0 w-16 lg:w-24 bg-[#060d0a] hidden lg:block"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 40% 100%, 0 100%)",
                    }}
                  />
                )}

                {/* Number on image */}
                <div className="absolute bottom-0 right-0 pointer-events-none select-none p-4 sm:p-6 lg:p-10">
                  <span
                    className="font-black leading-none text-white/[0.08]"
                    style={{ fontSize: "clamp(60px, 12vw, 160px)" }}
                  >
                    {num}
                  </span>
                </div>
              </Link>

              {/* Text side */}
              <div
                className={`${isLeft ? "lg:order-2" : "lg:order-1"} flex-1 flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-20 bg-[#060d0a] relative overflow-hidden`}
              >
                {/* Watermark number */}
                <span
                  className="absolute pointer-events-none select-none font-black text-white/[0.025] leading-none"
                  style={{
                    fontSize: "clamp(100px, 18vw, 240px)",
                    bottom: "-0.15em",
                    right: isLeft ? "-0.1em" : "auto",
                    left: isLeft ? "auto" : "-0.1em",
                  }}
                >
                  {num}
                </span>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-emerald-400/70 text-[10px] font-bold tracking-[0.3em] uppercase">
                      {t.servicesEyebrow}
                    </span>
                    <div className="w-6 h-px bg-emerald-400/30" />
                    <span className="text-white/25 text-[10px] font-mono">
                      {num}/{total}
                    </span>
                  </div>

                  <h3
                    className="text-white font-bold leading-[0.95] mb-5 sm:mb-6"
                    style={{ fontSize: "clamp(28px, 5vw, 68px)" }}
                  >
                    {name}
                  </h3>

                  {excerpt && (
                    <p className="text-white/55 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md line-clamp-3">
                      {excerpt}
                    </p>
                  )}

                  <Link
                    href={`${prefix}/services/${slug}`}
                    className="group/cta inline-flex items-center gap-4 w-fit"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-emerald-500/40 flex items-center justify-center group-hover/cta:bg-emerald-500/15 group-hover/cta:border-emerald-400/70 transition-all duration-300">
                      <svg
                        className="w-4 h-4 text-emerald-400 group-hover/cta:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                    <span className="text-white/50 group-hover/cta:text-emerald-400 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300">
                      {t.learnMore}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile: view all */}
        <div className="text-center py-10 lg:hidden">
          <Link
            href={`${prefix}/services`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/55 hover:border-emerald-400/50 hover:text-emerald-400 transition-all text-sm font-medium"
          >
            {t.viewAll}
          </Link>
        </div>
      </section>

      {/* ═══ Stats Banner ═══ */}
      <section
        ref={statsRef}
        className="relative py-20 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 border-y border-emerald-600/30 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="container mx-auto px-8 lg:px-16 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {[
              { value: "20+", label: t.statsYears },
              { value: "100+", label: t.statsProjects },
              { value: "6+", label: t.statsCountries },
              { value: "200+", label: t.statsSpecies },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`text-center group ${idx > 0 ? "lg:border-l lg:border-white/15" : ""}`}
                data-anim="scale-up"
                data-delay={String(idx * 0.1)}
              >
                <div className="text-5xl lg:text-7xl font-black mb-3 bg-gradient-to-b from-white to-emerald-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm lg:text-base font-semibold tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS — Option A: Cinematic Scroll Gallery ═══ */}
      <section
        ref={projectsRef}
        className="relative bg-[#070e12] overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[150px] pointer-events-none" />

        {/* Section header */}
        <div className="container mx-auto px-6 sm:px-8 lg:px-16 pt-20 sm:pt-28 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
                {t.projectsEyebrow}
              </p>
              <h2 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {t.projectsTitle}
              </h2>
              <p className="text-white/65 text-base sm:text-lg mt-3 max-w-xl">
                {t.projectsDesc}
              </p>
            </div>
            <Link
              href={`${prefix}/projects`}
              className="hidden lg:flex items-center gap-2 text-white/50 hover:text-emerald-400 transition-colors text-sm font-semibold shrink-0"
            >
              {t.viewAll}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Animated vertical timeline line */}
        <div className="absolute left-8 lg:left-[5.5rem] top-[32%] bottom-16 w-px overflow-hidden hidden lg:block pointer-events-none">
          <div
            ref={projectsLineRef}
            className="w-full h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(52,211,153,0.35) 15%, rgba(52,211,153,0.35) 85%, transparent 100%)",
            }}
          />
        </div>

        {/* Project rows */}
        {featuredProjects.map((project, idx) => {
          const isLeft = idx % 2 === 0;
          const num = String(idx + 1).padStart(2, "0");
          const title = resolveLocalizedString(project.title_i18n, locale);
          const excerpt = resolveLocalizedString(project.excerpt_i18n, locale);
          const location = project.location_i18n
            ? resolveLocalizedString(project.location_i18n, locale)
            : null;
          const slug = resolveLocalizedString(project.slug_i18n, locale);
          const imgUrl = project.coverImage?.url;
          const accentColor =
            idx === 0
              ? {
                  text: "text-emerald-400",
                  bg: "bg-emerald-600/70",
                  line: "bg-emerald-400",
                }
              : idx === 1
                ? {
                    text: "text-teal-400",
                    bg: "bg-teal-600/70",
                    line: "bg-teal-400",
                  }
                : {
                    text: "text-cyan-400",
                    bg: "bg-cyan-600/70",
                    line: "bg-cyan-400",
                  };

          return (
            <div
              key={project._id}
              className="proj-row relative flex flex-col lg:flex-row items-stretch border-t border-white/[0.06] min-h-[60vh] lg:min-h-[75vh]"
            >
              {/* Counter dot on timeline */}
              <div className="absolute left-[5.5rem] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full border-2 border-current bg-[#070e12] ${accentColor.text}`}
                />
              </div>

              {/* Large counter number in left gutter */}
              <div className="hidden lg:flex absolute left-0 w-24 top-0 bottom-0 items-center justify-center pointer-events-none select-none">
                <span
                  className="font-black text-white/[0.04] leading-none"
                  style={{ fontSize: "clamp(60px, 7vw, 100px)" }}
                >
                  {num}
                </span>
              </div>

              {/* Image side */}
              <div
                className={`proj-img-wrap relative ${isLeft ? "lg:order-1" : "lg:order-2"} w-full lg:w-[55%] h-[55vw] sm:h-[45vw] lg:h-auto overflow-hidden`}
              >
                <div className="proj-img-inner absolute inset-0 scale-[1.18]">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 55vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-teal-950" />
                  )}
                  <div
                    className={`absolute inset-0 ${
                      isLeft
                        ? "bg-gradient-to-r from-transparent via-transparent to-[#070e12]/60"
                        : "bg-gradient-to-l from-transparent via-transparent to-[#070e12]/60"
                    }`}
                  />
                </div>

                {/* Giant counter on image */}
                <div className="absolute bottom-0 right-4 pointer-events-none select-none z-10">
                  <span
                    className={`font-black leading-none ${accentColor.text} opacity-20`}
                    style={{ fontSize: "clamp(70px, 14vw, 180px)" }}
                  >
                    {num}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-10">
                  <span
                    className={`px-3 py-1.5 text-white text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md ${accentColor.bg}`}
                  >
                    {project.category ?? tHome("projectDefault")}
                  </span>
                </div>

                {/* Mobile counter */}
                <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-10 lg:hidden">
                  <span
                    className={`text-3xl sm:text-4xl font-black ${accentColor.text} opacity-50`}
                  >
                    {num}
                  </span>
                </div>
              </div>

              {/* Text side */}
              <div
                className={`proj-text ${isLeft ? "lg:order-2" : "lg:order-1"} flex-1 flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-16 xl:px-20`}
              >
                <div className="flex items-center gap-3 mb-4 lg:hidden">
                  <span
                    className={`text-sm font-black tracking-widest ${accentColor.text}`}
                  >
                    {num}
                  </span>
                  <div
                    className={`flex-1 h-px max-w-[40px] ${accentColor.line}`}
                  />
                </div>

                {location && (
                  <span className="text-white/40 text-xs flex items-center gap-1.5 mb-4">
                    <svg
                      className="w-3.5 h-3.5"
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
                    </svg>
                    {location}
                  </span>
                )}

                <h3
                  className="text-white font-bold leading-tight mb-5 sm:mb-6"
                  style={{ fontSize: "clamp(24px, 4vw, 60px)" }}
                >
                  {title}
                </h3>

                {excerpt && (
                  <p className="text-white/55 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-lg line-clamp-4">
                    {excerpt}
                  </p>
                )}

                <Link
                  href={`${prefix}/projects/${slug}`}
                  className={`group inline-flex items-center gap-4 w-fit text-xs font-bold tracking-[0.25em] uppercase transition-all duration-300 ${accentColor.text}`}
                >
                  <span>{t.viewProject}</span>
                  <div
                    className={`h-px w-10 group-hover:w-16 transition-all duration-300 ${accentColor.line}`}
                  />
                </Link>
              </div>
            </div>
          );
        })}

        {/* View all (mobile) */}
        <div className="pb-20 sm:pb-28 lg:pb-36 pt-12 sm:pt-16 text-center">
          <Link
            href={`${prefix}/projects`}
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/15 text-white/55 rounded-xl hover:border-emerald-400/50 hover:text-emerald-400 transition-all text-sm font-semibold lg:hidden"
          >
            {t.viewAll}
          </Link>
        </div>
      </section>

      {/* ═══ Blog — Editorial Layout ═══ */}
      <section
        ref={blogsRef}
        className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-slate-900 via-[#070d12] to-[#070d12] overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative">
          <div
            className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
            data-anim="fade-up"
          >
            <div>
              <p className="text-emerald-400 text-sm font-bold tracking-[0.22em] mb-3">
                {t.blogEyebrow}
              </p>
              <h2 className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold">
                {t.blogTitle}
              </h2>
              <p className="text-white/70 text-base sm:text-lg mt-3 max-w-xl">
                {t.blogDesc}
              </p>
            </div>
            <Link
              href={`${prefix}/blog`}
              className="hidden lg:flex items-center gap-2 text-white/60 hover:text-emerald-400 transition-colors text-sm font-semibold shrink-0"
            >
              {t.viewAll}
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-8 sm:gap-10 lg:gap-16">
            {latestBlogs[0] && (
              <Link
                href={`${prefix}/blog/${latestBlogs[0].slug || resolveLocalizedString(latestBlogs[0].slug_i18n, locale)}`}
                className="group flex flex-col"
                data-anim="fade-left"
                data-delay="0.1"
              >
                {latestBlogs[0].coverImage?.url && (
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] h-64 sm:h-80 lg:h-96 mb-5 sm:mb-7 border border-white/12 group-hover:border-emerald-400/50 transition-colors duration-500">
                    <Image
                      src={latestBlogs[0].coverImage.url}
                      alt={resolveLocalizedString(
                        latestBlogs[0].title_i18n,
                        locale,
                      )}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d12]/60 to-transparent" />
                    {(latestBlogs[0].tags ?? [])[0] && (
                      <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                        <span className="px-3 py-1.5 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-wider">
                          {latestBlogs[0].tags![0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] text-white/40 mb-3 sm:mb-4">
                  <span className="text-emerald-400 font-bold tracking-[0.2em] uppercase">
                    {tHome("featured")}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  {latestBlogs[0].publishedAt && (
                    <span>
                      {new Date(latestBlogs[0].publishedAt).toLocaleDateString(
                        locale,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
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
                <h3 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-tight mb-3 sm:mb-4">
                  {resolveLocalizedString(latestBlogs[0].title_i18n, locale)}
                </h3>
                {resolveLocalizedString(
                  latestBlogs[0].excerpt_i18n,
                  locale,
                ) && (
                  <p className="text-white/75 text-sm sm:text-base lg:text-lg line-clamp-3 leading-relaxed mb-5 sm:mb-7 flex-1">
                    {resolveLocalizedString(
                      latestBlogs[0].excerpt_i18n,
                      locale,
                    )}
                  </p>
                )}
                <div className="flex items-center gap-3 text-emerald-400 font-semibold group-hover:gap-5 transition-all duration-300">
                  <span>{t.readMore}</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </Link>
            )}

            {latestBlogs.length > 1 && (
              <div className="flex flex-col gap-4 sm:gap-5 justify-center">
                {latestBlogs.slice(1).map((blog, idx) => {
                  const blogSlug =
                    blog.slug || resolveLocalizedString(blog.slug_i18n, locale);
                  const blogTitle = resolveLocalizedString(
                    blog.title_i18n,
                    locale,
                  );
                  const blogExcerpt = resolveLocalizedString(
                    blog.excerpt_i18n,
                    locale,
                  );
                  const blogImage = blog.coverImage?.url;
                  const blogTags = blog.tags ?? [];
                  return (
                    <Link
                      key={blog._id}
                      href={`${prefix}/blog/${blogSlug}`}
                      className="group overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 hover:border-emerald-400/40 bg-white/[0.05] transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10"
                      data-anim="fade-right"
                      data-delay={String(0.2 + idx * 0.15)}
                    >
                      <div className="flex">
                        {blogImage && (
                          <div className="relative w-[100px] sm:w-[140px] flex-shrink-0 overflow-hidden">
                            <Image
                              src={blogImage}
                              alt={blogTitle}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100px, 140px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#070d12]/20" />
                          </div>
                        )}
                        <div className="flex flex-col justify-between flex-1 min-w-0 p-4 sm:p-5">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {blogTags[0] && (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase rounded">
                                  {blogTags[0]}
                                </span>
                              )}
                              {blog.publishedAt && (
                                <span className="text-white/50 text-xs">
                                  {new Date(
                                    blog.publishedAt,
                                  ).toLocaleDateString(locale, {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </div>
                            <h3 className="text-white text-sm sm:text-base font-bold group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2 leading-snug">
                              {blogTitle}
                            </h3>
                            {blogExcerpt && (
                              <p className="text-white/60 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
                                {blogExcerpt}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mt-2 sm:mt-3 group-hover:gap-2.5 transition-all duration-300">
                            <span>{t.readMore}</span>
                            <svg
                              className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                <Link
                  href={`${prefix}/blog`}
                  className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/12 text-white/60 hover:border-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all duration-300 text-sm font-semibold"
                >
                  {t.viewAll}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner ═══ */}
      <section
        ref={ctaRef}
        className="relative py-20 sm:py-28 bg-gradient-to-b from-emerald-500/10 via-teal-500/10 to-emerald-500/10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold mb-5 sm:mb-6"
              data-anim="fade-up"
              data-delay="0"
            >
              {t.ctaTitle}
            </h2>
            <p
              className="text-white/85 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto"
              data-anim="fade-up"
              data-delay="0.1"
            >
              {t.ctaDesc}
            </p>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-lg sm:text-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-500/40 hover:scale-105"
              data-anim="fade-up"
              data-delay="0.2"
            >
              {t.ctaBtn}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ Contact Section ═══ */}
      <section
        ref={contactRef}
        className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden"
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
            <div
              className="space-y-6 sm:space-y-8"
              data-anim="fade-left"
              data-delay="0.1"
            >
              <div>
                <p className="text-emerald-400 text-sm font-bold tracking-[0.2em] mb-4">
                  {t.contactEyebrow}
                </p>
                <h2 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6">
                  {t.contactTitle}
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {t.contactTitle2}
                  </span>
                </h2>
                <p className="text-white/80 text-lg sm:text-xl leading-relaxed">
                  {t.contactDesc}
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  {
                    icon: (
                      <>
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
                      </>
                    ),
                    title: tHome("officeTitle"),
                    value: tHome("officeAddress"),
                  },
                  {
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    ),
                    title: tHome("emailTitle"),
                    value: "info@hasakezoo.com.vn",
                  },
                  {
                    icon: (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    ),
                    title: tHome("phoneTitle"),
                    value: "+84 098 531 0238",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.06] rounded-xl sm:rounded-2xl border border-white/12 p-5 sm:p-6 hover:bg-white/[0.1] hover:border-emerald-500/30 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {item.icon}
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-base sm:text-lg mb-0.5 sm:mb-1">
                          {item.title}
                        </h4>
                        <p className="text-white/70 text-sm sm:text-base">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="bg-white/5 rounded-3xl sm:rounded-[48px] border-2 border-white/10 p-7 sm:p-10 lg:p-12"
              data-anim="fade-right"
              data-delay="0.2"
            >
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                {t.sendMsg}
              </h3>
              <ContactInquiryForm inquiryType="general" locale={locale} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

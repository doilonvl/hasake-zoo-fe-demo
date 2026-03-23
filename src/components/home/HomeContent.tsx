"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/content";
import type { Service, Project } from "@/types/api";
import type { Blog } from "@/types/blog";
import { resolveLocalizedString } from "@/lib/i18n";
import { useTranslation } from "@/i18n/client";
import { ContactInquiryForm } from "@/components/shared/contact-inquiry-form";
import { FadeIn } from "@/components/animate/FadeIn";

/* ── Reusable SVG decorative components ── */

function PawPrint({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">
      <ellipse cx="100" cy="130" rx="38" ry="50" />
      <ellipse cx="55" cy="60" rx="18" ry="24" transform="rotate(-15 55 60)" />
      <ellipse cx="145" cy="60" rx="18" ry="24" transform="rotate(15 145 60)" />
      <ellipse cx="40" cy="110" rx="14" ry="20" transform="rotate(-30 40 110)" />
      <ellipse cx="160" cy="110" rx="14" ry="20" transform="rotate(30 160 110)" />
    </svg>
  );
}

function LeafDecor({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 5 C20 20, 5 50, 50 95 C95 50, 80 20, 50 5Z" />
      <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function WaveDivider({ flip, color = "white" }: { flip?: boolean; color?: string }) {
  const fillColor = color === "white" ? "#ffffff" : color === "gray" ? "#f9fafb" : color === "emerald" ? "#059669" : color === "emerald-light" ? "#ecfdf5" : color;
  return (
    <div className={`absolute ${flip ? "top-0 rotate-180" : "bottom-0"} left-0 right-0 pointer-events-none`}>
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
        <path d="M0 40C240 70 480 80 720 60C960 40 1200 10 1440 30V80H0V40Z" fill={fillColor} />
      </svg>
    </div>
  );
}

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

export function HomeContent({
  locale,
  prefix,
  t,
  featuredServices,
  featuredProjects,
  latestBlogs,
}: Props) {
  const { t: tHome } = useTranslation("home");

  return (
    <>
      {/* ═══ SERVICES — Card Grid ═══ */}
      <section className="relative bg-white py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Decorative paw prints */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute -top-6 right-8 w-28 h-28 text-emerald-100/60 rotate-[30deg]" />
          <PawPrint className="absolute bottom-12 -left-6 w-20 h-20 text-emerald-100/40 -rotate-[15deg]" />
          <LeafDecor className="absolute top-1/3 -right-4 w-16 h-16 text-emerald-200/25 rotate-[60deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12 lg:mb-16">
              <div>
                <p className="text-emerald-600 text-sm font-bold tracking-[0.22em] mb-3">
                  {t.servicesEyebrow}
                </p>
                <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold">
                  {t.servicesTitle}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-xl">
                  {t.servicesDesc}
                </p>
              </div>
              <Link
                href={`${prefix}/services`}
                className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-semibold shrink-0"
              >
                {t.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredServices.map((service, idx) => {
              const name = resolveLocalizedString(service.name_i18n, locale);
              const excerpt = resolveLocalizedString(service.excerpt_i18n, locale);
              const slug = resolveLocalizedString(service.slug_i18n, locale);
              const imgUrl = service.coverImage?.url;

              return (
                <FadeIn key={service._id} delay={idx * 0.1}>
                  <Link
                    href={`${prefix}/services/${slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
                  >
                    {imgUrl && (
                      <div className="relative h-56 sm:h-64 overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={idx === 0}
                        />
                        {/* Gradient overlay for depth */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <h3 className="text-gray-900 text-xl sm:text-2xl font-bold mb-3 group-hover:text-emerald-600 transition-colors">
                        {name}
                      </h3>
                      {excerpt && (
                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                          {excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        {t.learnMore}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {/* Mobile: view all */}
          <div className="text-center pt-10 lg:hidden">
            <Link
              href={`${prefix}/services`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm font-medium"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>

        {/* Wave divider to stats */}
        <WaveDivider color="emerald" />
      </section>

      {/* ═══ Stats Banner ═══ */}
      <section className="relative py-20 sm:py-24 bg-emerald-600 overflow-hidden">
        {/* Decorative elements on stats */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute top-4 left-[10%] w-24 h-24 text-white/[0.07] rotate-[20deg]" />
          <PawPrint className="absolute bottom-4 right-[15%] w-20 h-20 text-white/[0.05] -rotate-[25deg]" />
          <PawPrint className="absolute top-1/2 left-[55%] w-16 h-16 text-white/[0.04] rotate-[45deg]" />
          {/* Trail dots */}
          <div className="absolute top-6 right-[30%] w-2 h-2 bg-white/10 rounded-full" />
          <div className="absolute top-10 right-[28%] w-1.5 h-1.5 bg-white/[0.07] rounded-full" />
          <div className="absolute bottom-8 left-[40%] w-2.5 h-2.5 bg-white/[0.08] rounded-full" />
        </div>

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
              {[
                { value: "20+", label: t.statsYears, icon: "🏆" },
                { value: "100+", label: t.statsProjects, icon: "🌿" },
                { value: "6+", label: t.statsCountries, icon: "🌍" },
                { value: "200+", label: t.statsSpecies, icon: "🦁" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`text-center ${idx > 0 ? "lg:border-l lg:border-white/20" : ""}`}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-5xl lg:text-7xl font-black mb-3 text-white">
                    {stat.value}
                  </div>
                  <div className="text-white/90 text-sm lg:text-base font-semibold tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </section>

      {/* ═══ PARTNERS MARQUEE ═══ */}
      <section className="relative bg-gray-50 py-8 sm:py-10 overflow-hidden">
        <style>{`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div className="container mx-auto px-6 sm:px-8 lg:px-16 mb-4">
          <p className="text-center text-gray-400 text-xs font-bold tracking-[0.25em] uppercase">
            {locale === "vi" ? "Đối Tác & Khách Hàng" : "Partners & Clients"}
          </p>
        </div>
        <div className="relative w-full overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          <div
            className="flex whitespace-nowrap"
            style={{ animation: "marquee-scroll 30s linear infinite" }}
          >
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} className="flex items-center shrink-0">
                {[
                  "WAZA", "SEAZA", "AZA", "EAZA", "IUCN", "WWF",
                  "Wildlife Conservation Society", "CITES",
                  "Zoo Negara Malaysia", "Singapore Zoo",
                  "Safari World Thailand", "Vinpearl Safari",
                ].map((partner, idx) => (
                  <span key={idx} className="flex items-center shrink-0">
                    <span className="text-gray-400 font-semibold text-sm sm:text-base tracking-wide px-4 sm:px-6 hover:text-emerald-600 transition-colors duration-300 cursor-default">
                      {partner}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECTS — Card Grid ═══ */}
      <section className="relative bg-gray-50 py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute top-20 -right-8 w-32 h-32 text-emerald-200/20 rotate-[15deg]" />
          <LeafDecor className="absolute bottom-16 left-8 w-20 h-20 text-emerald-300/15 -rotate-[30deg]" />
          {/* Trail of small paws going diagonally */}
          <PawPrint className="absolute top-[40%] left-[5%] w-8 h-8 text-emerald-300/15 rotate-[40deg]" />
          <PawPrint className="absolute top-[45%] left-[8%] w-7 h-7 text-emerald-300/12 rotate-[35deg]" />
          <PawPrint className="absolute top-[50%] left-[11%] w-6 h-6 text-emerald-300/10 rotate-[30deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
              <div>
                <p className="text-emerald-600 text-sm font-bold tracking-[0.22em] mb-3">
                  {t.projectsEyebrow}
                </p>
                <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold">
                  {t.projectsTitle}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-xl">
                  {t.projectsDesc}
                </p>
              </div>
              <Link
                href={`${prefix}/projects`}
                className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-semibold shrink-0"
              >
                {t.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => {
              const title = resolveLocalizedString(project.title_i18n, locale);
              const excerpt = resolveLocalizedString(project.excerpt_i18n, locale);
              const location = project.location_i18n
                ? resolveLocalizedString(project.location_i18n, locale)
                : null;
              const slug = resolveLocalizedString(project.slug_i18n, locale);
              const imgUrl = project.coverImage?.url;

              return (
                <FadeIn key={project._id} delay={idx * 0.1}>
                  <Link
                    href={`${prefix}/projects/${slug}`}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col"
                  >
                    {imgUrl && (
                      <div className="relative h-52 sm:h-56 overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {location && (
                          <div className="absolute top-4 left-4">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {location}
                            </span>
                          </div>
                        )}
                        {project.category && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-gray-900 text-lg sm:text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                        {title}
                      </h3>
                      {excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                          {excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-emerald-600 text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                        {t.viewProject}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {/* View all (mobile) */}
          <div className="text-center pt-10 lg:hidden">
            <Link
              href={`${prefix}/projects`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all text-sm font-medium"
            >
              {t.viewAll}
            </Link>
          </div>
        </div>

        {/* Wave divider to why choose us */}
        <WaveDivider color="white" />
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="relative bg-white py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute -top-4 left-16 w-24 h-24 text-emerald-100/40 rotate-[35deg]" />
          <LeafDecor className="absolute bottom-12 right-8 w-20 h-20 text-emerald-200/20 -rotate-[40deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-emerald-600 text-sm font-bold tracking-[0.22em] mb-3">
                {locale === "vi" ? "TẠI SAO CHỌN CHÚNG TÔI" : "WHY CHOOSE US"}
              </p>
              <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {locale === "vi" ? "Đối Tác Tin Cậy Của Bạn" : "Your Trusted Partner"}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                {locale === "vi"
                  ? "Chúng tôi mang đến giải pháp toàn diện cho ngành bảo tồn động vật hoang dã"
                  : "We deliver comprehensive solutions for the wildlife conservation industry"}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: locale === "vi" ? "Uy Tín & Chuyên Nghiệp" : "Trusted & Professional",
                desc: locale === "vi"
                  ? "Hơn 20 năm kinh nghiệm trong ngành bảo tồn động vật hoang dã"
                  : "Over 20 years of experience in wildlife conservation industry",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: locale === "vi" ? "Mạng Lưới Toàn Cầu" : "Global Network",
                desc: locale === "vi"
                  ? "Hợp tác với các tổ chức bảo tồn hàng đầu trên 6 quốc gia"
                  : "Partnering with leading conservation organizations across 6 countries",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: locale === "vi" ? "Giải Pháp Đổi Mới" : "Innovative Solutions",
                desc: locale === "vi"
                  ? "Ứng dụng công nghệ tiên tiến trong thiết kế môi trường sống"
                  : "Applying cutting-edge technology in habitat design",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: locale === "vi" ? "Phúc Lợi Động Vật" : "Animal Welfare",
                desc: locale === "vi"
                  ? "Cam kết tiêu chuẩn cao nhất về chăm sóc và phúc lợi động vật"
                  : "Committed to the highest standards of animal care and welfare",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: locale === "vi" ? "Chứng Nhận Quốc Tế" : "International Certifications",
                desc: locale === "vi"
                  ? "Đáp ứng tiêu chuẩn WAZA, SEAZA và các tổ chức quốc tế"
                  : "Meeting WAZA, SEAZA and international organization standards",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: locale === "vi" ? "Đội Ngũ Chuyên Gia" : "Expert Team",
                desc: locale === "vi"
                  ? "Đội ngũ bác sĩ thú y và chuyên gia bảo tồn giàu kinh nghiệm"
                  : "Experienced veterinarians and conservation specialists",
              },
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.08}>
                <div className="group bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:border-emerald-400 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-gray-900 text-lg sm:text-xl font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Wave divider to blog */}
        <WaveDivider color="white" />
      </section>

      {/* ═══ Blog — Editorial Layout ═══ */}
      <section className="relative bg-white py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <LeafDecor className="absolute -top-2 left-12 w-14 h-14 text-emerald-200/20 rotate-[120deg]" />
          <PawPrint className="absolute bottom-20 right-16 w-24 h-24 text-emerald-100/30 rotate-[10deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <p className="text-emerald-600 text-sm font-bold tracking-[0.22em] mb-3">
                  {t.blogEyebrow}
                </p>
                <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold">
                  {t.blogTitle}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mt-3 max-w-xl">
                  {t.blogDesc}
                </p>
              </div>
              <Link
                href={`${prefix}/blog`}
                className="hidden lg:flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm font-semibold shrink-0"
              >
                {t.viewAll}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-8 sm:gap-10 lg:gap-16">
            {latestBlogs[0] && (
              <FadeIn direction="left">
                <Link
                  href={`${prefix}/blog/${latestBlogs[0].slug || resolveLocalizedString(latestBlogs[0].slug_i18n, locale)}`}
                  className="group flex flex-col"
                >
                  {latestBlogs[0].coverImage?.url && (
                    <div className="relative overflow-hidden rounded-2xl h-64 sm:h-80 lg:h-96 mb-5 sm:mb-7 border border-gray-200 group-hover:border-emerald-400 transition-colors duration-500">
                      <Image
                        src={latestBlogs[0].coverImage.url}
                        alt={resolveLocalizedString(latestBlogs[0].title_i18n, locale)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                      {(latestBlogs[0].tags ?? [])[0] && (
                        <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                          <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            {latestBlogs[0].tags![0]}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3 sm:mb-4">
                    <span className="text-emerald-600 font-bold tracking-[0.2em] uppercase">
                      {tHome("featured")}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
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
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>
                          {latestBlogs[0].readingTimeMinutes} {t.minRead}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-gray-900 text-2xl sm:text-3xl lg:text-4xl font-bold group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 leading-tight mb-3 sm:mb-4">
                    {resolveLocalizedString(latestBlogs[0].title_i18n, locale)}
                  </h3>
                  {resolveLocalizedString(latestBlogs[0].excerpt_i18n, locale) && (
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg line-clamp-3 leading-relaxed mb-5 sm:mb-7 flex-1">
                      {resolveLocalizedString(latestBlogs[0].excerpt_i18n, locale)}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-emerald-600 font-semibold group-hover:gap-5 transition-all duration-300">
                    <span>{t.readMore}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </Link>
              </FadeIn>
            )}

            {latestBlogs.length > 1 && (
              <FadeIn direction="right" delay={0.15}>
                <div className="flex flex-col gap-4 sm:gap-5 justify-center">
                  {latestBlogs.slice(1).map((blog) => {
                    const blogSlug = blog.slug || resolveLocalizedString(blog.slug_i18n, locale);
                    const blogTitle = resolveLocalizedString(blog.title_i18n, locale);
                    const blogExcerpt = resolveLocalizedString(blog.excerpt_i18n, locale);
                    const blogImage = blog.coverImage?.url;
                    const blogTags = blog.tags ?? [];
                    return (
                      <Link
                        key={blog._id}
                        href={`${prefix}/blog/${blogSlug}`}
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-emerald-400 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex">
                          {blogImage && (
                            <div className="relative w-25 sm:w-35 shrink-0 overflow-hidden">
                              <Image
                                src={blogImage}
                                alt={blogTitle}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 640px) 100px, 140px"
                              />
                            </div>
                          )}
                          <div className="flex flex-col justify-between flex-1 min-w-0 p-4 sm:p-5">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                {blogTags[0] && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-wider uppercase rounded">
                                    {blogTags[0]}
                                  </span>
                                )}
                                {blog.publishedAt && (
                                  <span className="text-gray-400 text-xs">
                                    {new Date(blog.publishedAt).toLocaleDateString(locale, {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-gray-900 text-sm sm:text-base font-bold group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2 leading-snug">
                                {blogTitle}
                              </h3>
                              {blogExcerpt && (
                                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed hidden sm:block">
                                  {blogExcerpt}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-medium mt-2 sm:mt-3 group-hover:gap-2.5 transition-all duration-300">
                              <span>{t.readMore}</span>
                              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  <Link
                    href={`${prefix}/blog`}
                    className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 rounded-xl border border-gray-200 text-gray-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 text-sm font-semibold"
                  >
                    {t.viewAll}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="relative bg-gray-50 py-20 sm:py-28 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute top-12 left-[8%] w-20 h-20 text-emerald-200/15 rotate-[25deg]" />
          <PawPrint className="absolute bottom-16 right-[10%] w-16 h-16 text-emerald-200/10 -rotate-[20deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="text-center mb-12 lg:mb-16">
              <p className="text-emerald-600 text-sm font-bold tracking-[0.22em] mb-3">
                {locale === "vi" ? "ĐÁNH GIÁ TỪ KHÁCH HÀNG" : "CLIENT TESTIMONIALS"}
              </p>
              <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {locale === "vi" ? "Khách Hàng Nói Gì" : "What Our Clients Say"}
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                {locale === "vi"
                  ? "Sự tin tưởng từ các đối tác và khách hàng là động lực phát triển của chúng tôi"
                  : "The trust of our partners and clients drives our growth and commitment"}
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                quote: locale === "vi"
                  ? "Hasake đã giúp chúng tôi thiết kế khu chuồng trại đạt tiêu chuẩn quốc tế, mang lại môi trường sống tốt nhất cho các loài động vật."
                  : "Hasake helped us design enclosures that meet international standards, providing the best habitat for our animals.",
                name: "Dr. Nguyen Van Minh",
                org: "Vinpearl Safari",
              },
              {
                quote: locale === "vi"
                  ? "Dịch vụ vận chuyển động vật của Hasake rất chuyên nghiệp và an toàn. Chúng tôi hoàn toàn yên tâm khi hợp tác."
                  : "Hasake's animal transport service is very professional and safe. We have complete peace of mind when working together.",
                name: "Sarah Chen",
                org: "Singapore Zoo",
              },
              {
                quote: locale === "vi"
                  ? "Chuyên môn và sự tận tâm của đội ngũ Hasake đã giúp dự án của chúng tôi thành công vượt mong đợi."
                  : "The expertise and dedication of the Hasake team helped our project succeed beyond expectations.",
                name: "Michael Torres",
                org: "Wildlife Conservation Society",
              },
            ].map((testimonial, idx) => (
              <FadeIn key={idx} delay={idx * 0.12}>
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col h-full">
                  {/* Quote mark */}
                  <div className="text-emerald-500 text-5xl sm:text-6xl font-serif leading-none mb-3 select-none">&ldquo;</div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {/* Quote text */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed flex-1 mb-6">
                    {testimonial.quote}
                  </p>
                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-emerald-200 mb-4" />
                  {/* Author */}
                  <div>
                    <p className="text-gray-900 font-bold text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-emerald-600 text-xs sm:text-sm font-medium">{testimonial.org}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA Banner — with rich decorative elements ═══ */}
      <section className="relative py-24 sm:py-32 bg-emerald-50 overflow-hidden">
        {/* Rich decorative background */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* Large paw prints */}
          <PawPrint className="absolute -top-8 -left-10 w-48 h-48 text-emerald-200/30 rotate-[25deg]" />
          <PawPrint className="absolute -bottom-12 -right-8 w-56 h-56 text-emerald-200/25 -rotate-[20deg]" />
          {/* Smaller trailing paws */}
          <PawPrint className="absolute top-12 right-[20%] w-12 h-12 text-emerald-300/20 rotate-[35deg]" />
          <PawPrint className="absolute top-20 right-[17%] w-10 h-10 text-emerald-300/15 rotate-[30deg]" />
          <PawPrint className="absolute bottom-16 left-[25%] w-14 h-14 text-emerald-300/20 rotate-[45deg]" />
          <PawPrint className="absolute bottom-24 left-[22%] w-11 h-11 text-emerald-300/15 rotate-[40deg]" />
          {/* Leaf decorations */}
          <LeafDecor className="absolute top-8 right-[40%] w-16 h-16 text-emerald-300/20 rotate-[80deg]" />
          <LeafDecor className="absolute bottom-12 left-[45%] w-20 h-20 text-emerald-300/15 -rotate-[50deg]" />
          {/* Organic dots */}
          <div className="absolute top-1/4 left-[15%] w-4 h-4 bg-emerald-300/20 rounded-full" />
          <div className="absolute top-1/3 right-[12%] w-3 h-3 bg-emerald-300/15 rounded-full" />
          <div className="absolute bottom-1/3 left-[60%] w-2.5 h-2.5 bg-emerald-300/20 rounded-full" />
        </div>

        {/* Top wave */}
        <WaveDivider flip color="emerald-light" />

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
                <PawPrint className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6">
                {t.ctaTitle}
              </h2>
              <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto">
                {t.ctaDesc}
              </p>
              <Link
                href={`${prefix}/contact`}
                className="inline-flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-lg sm:text-xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 hover:scale-105"
              >
                {t.ctaBtn}
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Contact Section ═══ */}
      <section className="relative bg-gray-50 py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute top-16 right-12 w-20 h-20 text-emerald-200/15 rotate-[20deg]" />
          <LeafDecor className="absolute bottom-20 -left-4 w-24 h-24 text-emerald-200/10 rotate-[140deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20">
            <FadeIn direction="left">
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <p className="text-emerald-600 text-sm font-bold tracking-[0.2em] mb-4">
                    {t.contactEyebrow}
                  </p>
                  <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6">
                    {t.contactTitle}
                    <br />
                    <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {t.contactTitle2}
                    </span>
                  </h2>
                  <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
                    {t.contactDesc}
                  </p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      icon: (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </>
                      ),
                      title: tHome("officeTitle"),
                      value: tHome("officeAddress"),
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      ),
                      title: tHome("emailTitle"),
                      value: "info@hasakezoo.com.vn",
                    },
                    {
                      icon: (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      ),
                      title: tHome("phoneTitle"),
                      value: "+84 098 531 0238",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-emerald-400 hover:shadow-sm transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {item.icon}
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-semibold text-base sm:text-lg mb-0.5 sm:mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm sm:text-base">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-sm p-7 sm:p-10 lg:p-12">
                <h3 className="text-gray-900 text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
                  {t.sendMsg}
                </h3>
                <ContactInquiryForm inquiryType="general" locale={locale} />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER BANNER ═══ */}
      <section className="relative py-20 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)" }}>
        {/* Wave divider at top */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none rotate-180">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 40C240 70 480 80 720 60C960 40 1200 10 1440 30V80H0V40Z" fill="#f9fafb" />
          </svg>
        </div>

        {/* Decorative paw prints */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          <PawPrint className="absolute top-8 left-[8%] w-24 h-24 text-white/[0.07] rotate-[30deg]" />
          <PawPrint className="absolute bottom-6 right-[12%] w-20 h-20 text-white/[0.05] -rotate-[20deg]" />
          <PawPrint className="absolute top-1/2 right-[30%] w-14 h-14 text-white/[0.04] rotate-[50deg]" />
          <PawPrint className="absolute bottom-12 left-[25%] w-10 h-10 text-white/[0.06] rotate-[15deg]" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl mb-6">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {locale === "vi" ? "Đăng Ký Nhận Bản Tin" : "Subscribe to Our Newsletter"}
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto">
                {locale === "vi"
                  ? "Cập nhật xu hướng ngành và tin tức mới nhất về bảo tồn động vật hoang dã"
                  : "Stay updated with industry trends and latest wildlife conservation news"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={locale === "vi" ? "Nhập email của bạn..." : "Enter your email..."}
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder-white/50 text-sm sm:text-base focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all duration-300"
                  readOnly
                />
                <button
                  type="button"
                  className="px-7 py-3.5 bg-white text-emerald-700 rounded-xl text-sm sm:text-base font-bold hover:bg-emerald-50 transition-colors duration-300 shrink-0 shadow-lg shadow-black/10"
                >
                  {locale === "vi" ? "Đăng Ký" : "Subscribe"}
                </button>
              </div>
              <p className="text-white/50 text-xs mt-4">
                {locale === "vi"
                  ? "Chúng tôi tôn trọng quyền riêng tư của bạn. Hủy đăng ký bất cứ lúc nào."
                  : "We respect your privacy. Unsubscribe at any time."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

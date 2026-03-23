import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import Link from "next/link";
import Image from "next/image";
import { fetchPublicServices } from "@/lib/api/services.public";
import { fetchPublicProjects } from "@/lib/api/projects.public";
import { fetchPublicBlogs } from "@/lib/api/blogs.public";
import type { Service, Project } from "@/types/api";
import type { Blog } from "@/types/blog";
import { HomeContent } from "@/components/home/HomeContent";

export const revalidate = 300;

const BASE_URL = getSiteUrl();
const DEFAULT_OG_IMAGE = "https://www.hasakezoo.com.vn/Logo/Home1.jpg";

const HOME_META = {
  vi: {
    title:
      "Hasake Zoo & Habitat Solution - Giải pháp môi trường sống cho động vật hoang dã.",
    description:
      "Hasake Zoo & Habitat Solution tại 50 đường Thụy Khuê, Hà Nội nổi tiếng với các giải pháp môi trường sống cho động vật hoang dã. Ghé thăm, tìm hiểu hoặc đặt dịch vụ đúng giờ bạn cần.",
  },
  en: {
    title:
      "Hasake Zoo & Habitat Solution – Habitat solutions for wildlife in Hanoi.",
    description:
      "Hasake Zoo & Habitat Solution at 50 Thuy Khue Street, Hanoi, known for providing habitat solutions for wildlife. Visit, learn, or book services on time.",
  },
} as const;

function getLocalePrefix(locale: Locale) {
  return locale === "en" ? "/en" : "";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOME_META[locale === "en" ? "en" : "vi"];
  const prefix = getLocalePrefix(locale);
  const canonical = prefix ? `${BASE_URL}${prefix}` : `${BASE_URL}/`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/`,
        en: `${BASE_URL}/en`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/* ── i18n text map ── */
const TEXT = {
  vi: {
    hasake: "Hasake",
    habitatSolutions: "Giải Pháp Môi Trường Sống",
    heroHeading1: "Bảo Tồn Động Vật Hoang Dã",
    heroHeading2: "Bắt Đầu Tại Đây",
    heroDesc:
      "Khám phá các giải pháp môi trường sống đẳng cấp thế giới cho bảo tồn động vật hoang dã. Hãy cùng chúng tôi tạo ra môi trường bền vững cho các loài nguy cấp.",
    exploreBtn: "Khám Phá",
    watchBtn: "Xem Dự Án",
    servicesEyebrow: "DỊCH VỤ NỔI BẬT",
    servicesTitle: "Giải Pháp Chuyên Nghiệp",
    servicesDesc:
      "Hơn 20 năm kinh nghiệm cung cấp dịch vụ toàn diện cho bảo tồn động vật hoang dã và quản lý vườn thú.",
    learnMore: "Tìm Hiểu Thêm",
    viewAll: "Xem Tất Cả",
    statsYears: "Năm Kinh Nghiệm",
    statsProjects: "Dự Án Thành Công",
    statsCountries: "Quốc Gia Phục Vụ",
    statsSpecies: "Loài Được Bảo Tồn",
    projectsEyebrow: "DỰ ÁN GẦN ĐÂY",
    projectsTitle: "Câu Chuyện Thành Công",
    projectsDesc:
      "Khám phá các dự án vận chuyển và bảo tồn động vật đã và đang triển khai.",
    viewProject: "Xem Dự Án",
    blogEyebrow: "BLOG & TIN TỨC",
    blogTitle: "Bài Viết Mới Nhất",
    blogDesc:
      "Cập nhật xu hướng ngành, kiến thức bảo tồn và các câu chuyện truyền cảm hứng.",
    readMore: "Đọc Thêm",
    ctaTitle: "Sẵn Sàng Bắt Đầu?",
    ctaDesc:
      "Liên hệ đội ngũ chuyên gia của chúng tôi để được tư vấn miễn phí về giải pháp môi trường sống cho động vật hoang dã.",
    ctaBtn: "Liên Hệ Ngay",
    contactEyebrow: "LIÊN HỆ",
    contactTitle: "Sẵn Sàng Tạo Nên",
    contactTitle2: "Môi Trường Sống?",
    contactDesc:
      "Liên hệ đội ngũ chuyên gia để thiết kế môi trường sống bền vững, đẳng cấp thế giới cho dự án bảo tồn của bạn.",
    sendMsg: "Gửi Tin Nhắn",
    minRead: "phút đọc",
  },
  en: {
    hasake: "Hasake",
    habitatSolutions: "Habitat Solutions",
    heroHeading1: "Wildlife Conservation",
    heroHeading2: "Starts Here",
    heroDesc:
      "Discover world-class habitat solutions for wildlife conservation. Join us in creating sustainable environments for endangered species and promoting biodiversity.",
    exploreBtn: "Explore Habitats",
    watchBtn: "View Projects",
    servicesEyebrow: "FEATURED SERVICES",
    servicesTitle: "Professional Solutions",
    servicesDesc:
      "Over 20 years of experience providing comprehensive services for wildlife conservation and zoo management.",
    learnMore: "Learn More",
    viewAll: "View All",
    statsYears: "Years Experience",
    statsProjects: "Projects Completed",
    statsCountries: "Countries Served",
    statsSpecies: "Species Conserved",
    projectsEyebrow: "RECENT PROJECTS",
    projectsTitle: "Success Stories",
    projectsDesc:
      "Explore our completed and ongoing animal transport and conservation projects.",
    viewProject: "View Project",
    blogEyebrow: "BLOG & NEWS",
    blogTitle: "Latest Articles",
    blogDesc:
      "Stay updated with industry trends, conservation knowledge, and inspiring stories.",
    readMore: "Read More",
    ctaTitle: "Ready to Start?",
    ctaDesc:
      "Contact our expert team for a free consultation on wildlife habitat solutions.",
    ctaBtn: "Get in Touch",
    contactEyebrow: "CONTACT",
    contactTitle: "Ready to Create Your",
    contactTitle2: "Wildlife Habitat?",
    contactDesc:
      "Contact our expert team to design sustainable, world-class habitats for your conservation project.",
    sendMsg: "Send Us a Message",
    minRead: "min read",
  },
} as const;

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = TEXT[locale] || TEXT.vi;
  const prefix = locale === "en" ? "/en" : "";

  let featuredServices: Service[] = [];
  let featuredProjects: Project[] = [];
  let latestBlogs: Blog[] = [];

  try {
    const [servicesRes, projectsRes, blogsRes] = await Promise.all([
      fetchPublicServices({ locale, isFeatured: true, limit: 4 }).catch(
        () => null,
      ),
      fetchPublicProjects({ locale, isFeatured: true, limit: 3 }).catch(
        () => null,
      ),
      fetchPublicBlogs({ locale, limit: 3 }).catch(() => null),
    ]);
    featuredServices = servicesRes?.items ?? [];
    featuredProjects = projectsRes?.items ?? [];
    latestBlogs = blogsRes?.items ?? [];
  } catch {
    // API unavailable – sections will render empty
  }

  const baseUrl = BASE_URL;
  const pageUrl = prefix ? `${baseUrl}${prefix}` : `${baseUrl}/`;

  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${pageUrl}#org`,
        name: "Hasake Zoo & Habitat Solution",
        url: pageUrl,
        image: `${baseUrl}/Logo/Logo1.jpg`,
        address: { addressLocality: "Hanoi", addressCountry: "VN" },
      },
      {
        "@type": "WebSite",
        "@id": `${pageUrl}#website`,
        name: "Hasake Zoo & Habitat Solution",
        url: pageUrl,
        inLanguage: locale === "en" ? "en" : "vi-VN",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />

      {/* ── Hero Section — Immersive with decorative elements ── */}
      <section className="relative bg-gradient-to-b from-emerald-50 via-white to-white pt-40 pb-24 lg:pt-52 lg:pb-36 overflow-hidden">
        {/* Decorative background paw prints */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
          {/* Large faded paw - top right */}
          <svg className="absolute -top-10 -right-16 w-72 h-72 lg:w-[420px] lg:h-[420px] text-emerald-200/30 rotate-[25deg]" viewBox="0 0 200 200" fill="currentColor">
            <ellipse cx="100" cy="130" rx="38" ry="50" />
            <ellipse cx="55" cy="60" rx="18" ry="24" transform="rotate(-15 55 60)" />
            <ellipse cx="145" cy="60" rx="18" ry="24" transform="rotate(15 145 60)" />
            <ellipse cx="40" cy="110" rx="14" ry="20" transform="rotate(-30 40 110)" />
            <ellipse cx="160" cy="110" rx="14" ry="20" transform="rotate(30 160 110)" />
          </svg>
          {/* Small paw - left */}
          <svg className="absolute top-1/3 -left-8 w-40 h-40 lg:w-56 lg:h-56 text-emerald-300/20 -rotate-[20deg]" viewBox="0 0 200 200" fill="currentColor">
            <ellipse cx="100" cy="130" rx="38" ry="50" />
            <ellipse cx="55" cy="60" rx="18" ry="24" transform="rotate(-15 55 60)" />
            <ellipse cx="145" cy="60" rx="18" ry="24" transform="rotate(15 145 60)" />
            <ellipse cx="40" cy="110" rx="14" ry="20" transform="rotate(-30 40 110)" />
            <ellipse cx="160" cy="110" rx="14" ry="20" transform="rotate(30 160 110)" />
          </svg>
          {/* Leaf decorations - right side */}
          <svg className="absolute bottom-20 right-12 w-24 h-24 lg:w-36 lg:h-36 text-emerald-400/15 rotate-45" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 5 C20 20, 5 50, 50 95 C95 50, 80 20, 50 5Z" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
          </svg>
          {/* Scattered small dots - mimicking animal trail */}
          <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-emerald-300/25 rounded-full" />
          <div className="absolute top-[30%] right-[22%] w-2 h-2 bg-emerald-300/20 rounded-full" />
          <div className="absolute top-[35%] right-[20%] w-2.5 h-2.5 bg-emerald-300/15 rounded-full" />
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-teal-300/20 rounded-full" />
          <div className="absolute bottom-[28%] left-[27%] w-2 h-2 bg-teal-300/15 rounded-full" />
        </div>

        <div className="container mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <p className="text-emerald-600 text-sm font-bold tracking-[0.25em] mb-4 uppercase">
                {t.hasake} &middot; {t.habitatSolutions}
              </p>
              <h2 className="text-gray-900 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
                {t.heroHeading1}
                <br />
                <span className="text-emerald-600">
                  {t.heroHeading2}
                </span>
              </h2>
              <p className="text-gray-600 text-lg lg:text-xl font-light mt-4 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t.heroDesc}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 lg:mt-12">
                <Link
                  href={`${prefix}/services`}
                  className="px-8 lg:px-10 py-3 lg:py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold transition-colors duration-300 shadow-lg shadow-emerald-600/20"
                >
                  {t.exploreBtn}
                </Link>
                <Link
                  href={`${prefix}/projects`}
                  className="px-8 lg:px-10 py-3 lg:py-4 rounded-xl border border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 text-lg font-semibold transition-all duration-300"
                >
                  {t.watchBtn}
                </Link>
              </div>
            </div>

            {/* Right: Hero image with decorative frame */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                {/* Decorative blob behind image */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/40 to-teal-200/30 rounded-[2.5rem] rotate-3" />
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white">
                  <Image
                    src="/Banner/animal-banner.png"
                    alt="Wildlife habitat solutions"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Floating stat badge */}
                <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 px-5 py-3">
                  <div className="text-emerald-600 text-2xl font-black">20+</div>
                  <div className="text-gray-500 text-xs font-medium">{t.statsYears}</div>
                </div>
                {/* Small paw badge - top left */}
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg flex items-center justify-center rotate-12">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 200 200" fill="currentColor">
                    <ellipse cx="100" cy="130" rx="38" ry="50" />
                    <ellipse cx="55" cy="60" rx="18" ry="24" transform="rotate(-15 55 60)" />
                    <ellipse cx="145" cy="60" rx="18" ry="24" transform="rotate(15 145 60)" />
                    <ellipse cx="40" cy="110" rx="14" ry="20" transform="rotate(-30 40 110)" />
                    <ellipse cx="160" cy="110" rx="14" ry="20" transform="rotate(30 160 110)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" preserveAspectRatio="none">
            <path d="M0 40C240 70 480 80 720 60C960 40 1200 10 1440 30V80H0V40Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Content sections ── */}
      <HomeContent
        locale={locale}
        prefix={prefix}
        t={t}
        featuredServices={featuredServices}
        featuredProjects={featuredProjects}
        latestBlogs={latestBlogs}
      />
    </>
  );
}

import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import Link from "next/link";
import { HeroTunnel } from "@/components/animate/HeroTunnel";
import { fetchPublicServices } from "@/lib/api/services.public";
import { fetchPublicProjects } from "@/lib/api/projects.public";
import { fetchPublicBlogs } from "@/lib/api/blogs.public";
import type { Service, Project } from "@/types/api";
import type { Blog } from "@/types/blog";
import { AnimatedHomeContent } from "@/components/home/AnimatedHomeContent";

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

      {/* ── Hero Tunnel Component ── */}
      <HeroTunnel title={t.hasake} subtitle={t.habitatSolutions}>
        <div className="container mx-auto px-8 lg:px-16">
          <h2 className="text-white text-5xl lg:text-8xl font-bold leading-tight max-w-4xl drop-shadow-2xl">
            {t.heroHeading1}
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {t.heroHeading2}
            </span>
          </h2>
          <p className="text-white/90 text-lg lg:text-2xl font-light mt-6 lg:mt-8 max-w-3xl leading-relaxed drop-shadow-lg">
            {t.heroDesc}
          </p>
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 mt-8 lg:mt-12">
            <Link
              href={`${prefix}/services`}
              className="group px-8 lg:px-12 py-3 lg:py-4 rounded-2xl border-2 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span className="text-white text-lg lg:text-2xl font-medium group-hover:drop-shadow-lg">
                {t.exploreBtn}
              </span>
            </Link>
            <Link
              href={`${prefix}/projects`}
              className="group flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-full border-2 border-white/40 backdrop-blur-sm hover:border-white hover:bg-white/15 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 group-hover:bg-white/25 transition-colors duration-300 flex items-center justify-center">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-white/80 text-base lg:text-lg font-light group-hover:text-white transition-colors duration-300">
                {t.watchBtn}
              </span>
            </Link>
          </div>
        </div>
      </HeroTunnel>

      {/* ── Content layers (scrolls over fixed hero) ── */}
      <div className="relative bg-[rgb(5,20,10)]" style={{ zIndex: 40 }}>
        <AnimatedHomeContent
          locale={locale}
          prefix={prefix}
          t={t}
          featuredServices={featuredServices}
          featuredProjects={featuredProjects}
          latestBlogs={latestBlogs}
        />
      </div>
    </>
  );
}

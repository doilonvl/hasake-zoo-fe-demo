import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { AboutClient } from "./AboutClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const ABOUT_META = {
  vi: {
    title: "Về Chúng Tôi | Hasake Zoo & Habitat Solutions",
    description:
      "Hasake Zoo & Habitat Solutions - công ty uy tín quốc tế chuyên về tư vấn vườn thú, thiết kế môi trường sống hoang dã và hậu cần động vật với hơn 20 năm kinh nghiệm.",
  },
  en: {
    title: "About Us | Hasake Zoo & Habitat Solutions",
    description:
      "Hasake Zoo & Habitat Solutions - an internationally acclaimed company specializing in zoo consultancy, wildlife habitat design, and animal logistics with over 20 years of experience.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = ABOUT_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/about`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/about`,
        en: `${BASE_URL}/en/about`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  return <AboutClient locale={locale} />;
}

import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { PrivacyClient } from "./PrivacyClient";

export const revalidate = 3600;

const BASE_URL = getSiteUrl();

const PRIVACY_META = {
  vi: {
    title: "Chính Sách Bảo Mật | Hasake Zoo & Habitat Solution",
    description:
      "Tìm hiểu cách Hasake Zoo & Habitat Solution thu thập, sử dụng và bảo vệ dữ liệu của bạn khi bạn truy cập website hoặc liên hệ về dịch vụ bảo tồn, thiết kế môi trường sống và vận chuyển động vật.",
  },
  en: {
    title: "Privacy Policy | Hasake Zoo & Habitat Solution",
    description:
      "Learn how Hasake Zoo & Habitat Solution collects, uses, and protects your data when you visit our website or contact us about wildlife conservation, habitat design, or animal logistics.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = PRIVACY_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/privacy`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/privacy`,
        en: `${BASE_URL}/en/privacy`,
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

export default async function PrivacyPage() {
  const locale = (await getLocale()) as Locale;
  return <PrivacyClient locale={locale} />;
}

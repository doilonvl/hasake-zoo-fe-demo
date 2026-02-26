import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import type { Service, ServiceCategory } from "@/types/api";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicServices } from "@/lib/api/services.public";
import { fetchPublicServiceCategories } from "@/lib/api/service-categories.public";
import { ServicesClient } from "./ServicesClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const SERVICES_META = {
  vi: {
    title: "Dịch Vụ | Hasake Zoo & Habitat Solution",
    description:
      "Khám phá các giải pháp môi trường sống chuyên nghiệp cho động vật hoang dã. Thiết kế habitat, tư vấn bảo tồn, và dịch vụ chăm sóc động vật.",
  },
  en: {
    title: "Services | Hasake Zoo & Habitat Solution",
    description:
      "Explore professional wildlife habitat solutions. Habitat design, conservation consulting, and animal care services.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = SERVICES_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/services`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/services`,
        en: `${BASE_URL}/en/services`,
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

export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;

  let services: Service[] = [];
  let categories: ServiceCategory[] = [];
  try {
    const [servicesRes, categoriesRes] = await Promise.all([
      fetchPublicServices({ locale, limit: 50 }),
      fetchPublicServiceCategories({ locale, limit: 50 }),
    ]);
    services = servicesRes.items ?? [];
    categories = categoriesRes.items ?? [];
  } catch {
    // API unavailable – render empty list
  }

  return (
    <ServicesClient
      locale={locale}
      initialServices={services}
      initialCategories={categories}
    />
  );
}

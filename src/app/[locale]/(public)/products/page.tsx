import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { ProductsClient } from "./ProductsClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const PRODUCTS_META = {
  vi: {
    title: "Sản Phẩm | Hasake Zoo & Habitat Solution",
    description:
      "Khám phá các sản phẩm và thiết bị chuyên dụng cho môi trường sống động vật hoang dã, vườn thú và bảo tồn.",
  },
  en: {
    title: "Products | Hasake Zoo & Habitat Solution",
    description:
      "Explore specialized products and equipment for wildlife habitats, zoos, and conservation.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = PRODUCTS_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/products`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/products`,
        en: `${BASE_URL}/en/products`,
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

export default async function ProductsPage() {
  const locale = (await getLocale()) as Locale;

  return <ProductsClient locale={locale} />;
}

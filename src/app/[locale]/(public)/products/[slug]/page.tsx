import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicProductBySlug } from "@/lib/api/products.public";
import { resolveLocalizedString } from "@/lib/i18n";
import { ProductDetailClient } from "./ProductDetailClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

interface ProductDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getProduct(slug: string, locale: Locale) {
  try {
    return await fetchPublicProductBySlug(slug, locale);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const product = await getProduct(slug, currentLocale);

  if (!product) {
    return {
      title: { absolute: "Product Not Found | Hasake Zoo & Habitat Solution" },
    };
  }

  const title = resolveLocalizedString(product.name_i18n, currentLocale);
  const description =
    resolveLocalizedString(product.shortDescription_i18n, currentLocale) || "";

  const prefix = currentLocale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/products/${slug}`;

  return {
    title: { absolute: `${title} | Hasake Zoo & Habitat Solution` },
    description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/products/${resolveLocalizedString(product.slug_i18n, "vi")}`,
        en: `${BASE_URL}/en/products/${resolveLocalizedString(product.slug_i18n, "en")}`,
      },
    },
    openGraph: {
      title: `${title} | Hasake Zoo & Habitat Solution`,
      description,
      url: canonical,
      type: "website",
      images: product.images?.[0]
        ? [
            {
              url: product.images[0].url,
              width: 1200,
              height: 630,
              alt:
                resolveLocalizedString(
                  product.images[0].alt_i18n,
                  currentLocale
                ) || title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const product = await getProduct(slug, currentLocale);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} locale={currentLocale} />;
}

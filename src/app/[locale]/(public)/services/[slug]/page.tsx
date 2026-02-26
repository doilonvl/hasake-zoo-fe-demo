import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/content";
import type { Service } from "@/types/api";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicServiceBySlug } from "@/lib/api/services.public";
import { resolveLocalizedString } from "@/lib/i18n";
import { ServiceDetailClient } from "./ServiceDetailClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

interface ServiceDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getService(slug: string, locale: Locale): Promise<Service | null> {
  try {
    return await fetchPublicServiceBySlug(slug, locale);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const service = await getService(slug, currentLocale);

  if (!service) {
    return {
      title: { absolute: "Service Not Found | Hasake Zoo & Habitat Solution" },
    };
  }

  const title = resolveLocalizedString(service.name_i18n, currentLocale);
  const description =
    resolveLocalizedString(service.excerpt_i18n, currentLocale) ||
    resolveLocalizedString(service.seoDescription_i18n, currentLocale)?.slice(
      0,
      160
    ) ||
    "";

  const prefix = currentLocale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/services/${slug}`;

  return {
    title: { absolute: `${title} | Hasake Zoo & Habitat Solution` },
    description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/services/${resolveLocalizedString(service.slug_i18n, "vi")}`,
        en: `${BASE_URL}/en/services/${resolveLocalizedString(service.slug_i18n, "en")}`,
      },
    },
    openGraph: {
      title: `${title} | Hasake Zoo & Habitat Solution`,
      description,
      url: canonical,
      type: "website",
      images: service.coverImage
        ? [
            {
              url: service.coverImage.url,
              width: 1200,
              height: 630,
              alt:
                resolveLocalizedString(
                  service.coverImage.alt_i18n,
                  currentLocale
                ) || title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const service = await getService(slug, currentLocale);

  if (!service) {
    notFound();
  }

  return (
    <ServiceDetailClient service={service} locale={currentLocale} />
  );
}

import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { ContactClient } from "./ContactClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const CONTACT_META = {
  vi: {
    title: "Liên Hệ | Hasake Zoo & Habitat Solution",
    description:
      "Liên hệ với Hasake Zoo & Habitat Solution để tư vấn về giải pháp môi trường sống cho động vật hoang dã.",
  },
  en: {
    title: "Contact | Hasake Zoo & Habitat Solution",
    description:
      "Contact Hasake Zoo & Habitat Solution for wildlife habitat solutions consulting.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = CONTACT_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/contact`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/contact`,
        en: `${BASE_URL}/en/contact`,
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

export default async function ContactPage() {
  const locale = (await getLocale()) as Locale;

  return <ContactClient locale={locale} />;
}

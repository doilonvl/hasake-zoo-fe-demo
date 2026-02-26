import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import type { Project } from "@/types/api";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicProjects } from "@/lib/api/projects.public";
import { ProjectsClient } from "./ProjectsClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const PROJECTS_META = {
  vi: {
    title: "Dự Án | Hasake Zoo & Habitat Solution",
    description:
      "Khám phá các dự án môi trường sống động vật hoang dã đã thực hiện. Từ thiết kế vườn thú đến bảo tồn đa dạng sinh học.",
  },
  en: {
    title: "Projects | Hasake Zoo & Habitat Solution",
    description:
      "Explore our completed wildlife habitat projects. From zoo design to biodiversity conservation.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = PROJECTS_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/projects`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/projects`,
        en: `${BASE_URL}/en/projects`,
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

export default async function ProjectsPage() {
  const locale = (await getLocale()) as Locale;

  let projects: Project[] = [];
  try {
    const res = await fetchPublicProjects({ locale, limit: 50 });
    projects = res.items ?? [];
  } catch {
    // API unavailable – render empty list
  }

  return <ProjectsClient locale={locale} initialProjects={projects} />;
}

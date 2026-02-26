import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicProjectBySlug } from "@/lib/api/projects.public";
import { resolveLocalizedString } from "@/lib/i18n";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

interface ProjectDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getProject(slug: string, locale: Locale) {
  try {
    return await fetchPublicProjectBySlug(slug, locale);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const project = await getProject(slug, currentLocale);

  if (!project) {
    return {
      title: { absolute: "Project Not Found | Hasake Zoo & Habitat Solution" },
    };
  }

  const title = resolveLocalizedString(project.title_i18n, currentLocale);
  const description =
    resolveLocalizedString(project.excerpt_i18n, currentLocale) || "";

  const prefix = currentLocale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/projects/${slug}`;

  return {
    title: { absolute: `${title} | Hasake Zoo & Habitat Solution` },
    description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/projects/${resolveLocalizedString(project.slug_i18n, "vi")}`,
        en: `${BASE_URL}/en/projects/${resolveLocalizedString(project.slug_i18n, "en")}`,
      },
    },
    openGraph: {
      title: `${title} | Hasake Zoo & Habitat Solution`,
      description,
      url: canonical,
      type: "website",
      images: project.coverImage
        ? [
            {
              url: project.coverImage.url,
              width: 1200,
              height: 630,
              alt:
                resolveLocalizedString(
                  project.coverImage.alt_i18n,
                  currentLocale
                ) || title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const currentLocale = (locale as Locale) || "vi";

  const project = await getProject(slug, currentLocale);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} locale={currentLocale} />;
}

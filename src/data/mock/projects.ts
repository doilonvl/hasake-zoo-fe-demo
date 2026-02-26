/**
 * Mock Projects Data for Development
 * Uses i18n-compatible Project type directly from JSON
 */

import type { Project } from "@/types/api";
import projectsRaw from "./projects.json";

interface RawProject {
  slug: string;
  title_i18n: { vi: string; en: string };
  description_i18n: { vi: string; en: string };
  content_i18n: { vi: string; en: string };
  status_i18n: { vi: string; en: string };
  location_i18n: { vi: string; en: string };
  client_i18n: { vi: string; en: string };
  coverImage: string;
  gallery: string[];
  isFeatured: boolean;
  category: string;
  startDate: string;
  completionDate: string | null;
}

// Convert to Project type with i18n fields
export const mockProjects: Project[] = (projectsRaw as RawProject[]).map(
  (project, index) => ({
    _id: `proj-${index + 1}`,
    slug: project.slug,
    slug_i18n: {
      vi: project.slug,
      en: project.slug,
    },
    title_i18n: project.title_i18n,
    excerpt_i18n: project.description_i18n,
    content_i18n: project.content_i18n,
    coverImage: project.coverImage
      ? {
          url: project.coverImage,
          alt_i18n: project.title_i18n,
        }
      : undefined,
    gallery: project.gallery?.map((url, i) => ({
      url,
      alt_i18n: {
        vi: `${project.title_i18n.vi} - Hình ${i + 1}`,
        en: `${project.title_i18n.en} - Image ${i + 1}`,
      },
      sortOrder: i + 1,
    })),
    client: project.client_i18n
      ? {
          name: project.client_i18n.vi || project.client_i18n.en,
        }
      : undefined,
    location_i18n: project.location_i18n,
    completionDate: project.completionDate || undefined,
    category: project.category,
    isFeatured: project.isFeatured,
    sortOrder: index + 1,
    status: "published",
    createdAt: project.startDate || new Date().toISOString(),
    updatedAt: project.startDate || new Date().toISOString(),
  })
);

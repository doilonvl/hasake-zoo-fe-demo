import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { fetchPublicBlogs } from "@/lib/api/blogs.public";
import { BlogListClient } from "./BlogListClient";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

const BLOG_META = {
  vi: {
    title: "Blog | Hasake Zoo & Habitat Solution",
    description:
      "Khám phá các bài viết về bảo tồn động vật hoang dã, thiết kế habitat, và tin tức mới nhất từ Hasake Zoo.",
  },
  en: {
    title: "Blog | Hasake Zoo & Habitat Solution",
    description:
      "Explore articles about wildlife conservation, habitat design, and latest news from Hasake Zoo.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const meta = BLOG_META[locale === "en" ? "en" : "vi"];
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/blog`;

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/blog`,
        en: `${BASE_URL}/en/blog`,
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

export default async function BlogPage() {
  const locale = (await getLocale()) as Locale;

  let blogs: import("@/types/blog").Blog[] = [];
  try {
    const data = await fetchPublicBlogs({
      locale,
      limit: 50,
      sort: "-publishedAt",
    });
    blogs = data.items || [];
  } catch (error) {
    console.error("[BlogPage] Failed to fetch blogs:", error);
  }

  return <BlogListClient locale={locale} blogs={blogs} />;
}

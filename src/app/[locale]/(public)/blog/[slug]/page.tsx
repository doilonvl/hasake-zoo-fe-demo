import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import type { Locale } from "@/types/content";
import { getSiteUrl } from "@/lib/env";
import { BlogDetailClient } from "./BlogDetailClient";
import { fetchPublicBlogBySlug, fetchPublicBlogs } from "@/lib/api/blogs.public";
import { notFound } from "next/navigation";
import { resolveLocalizedString } from "@/lib/i18n";

export const revalidate = 300;

const BASE_URL = getSiteUrl();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;
  const prefix = locale === "en" ? "/en" : "";
  const canonical = `${BASE_URL}${prefix}/blog/${slug}`;

  // Fetch blog for metadata
  const blog = await fetchPublicBlogBySlug(slug, locale);

  if (!blog) {
    return {
      title: { absolute: "Blog Not Found | Hasake Zoo & Habitat Solution" },
    };
  }

  const title = resolveLocalizedString(blog.title_i18n, locale);
  const description = blog.excerpt_i18n
    ? resolveLocalizedString(blog.excerpt_i18n, locale)
    : "";
  const image = blog.coverImage?.url || `${BASE_URL}/Logo/Home1.jpg`;

  // Resolve locale-specific slugs for hreflang alternates
  const viSlug =
    typeof blog.slug_i18n === "string"
      ? blog.slug_i18n
      : blog.slug_i18n?.vi || slug;
  const enSlug =
    typeof blog.slug_i18n === "string"
      ? blog.slug_i18n
      : blog.slug_i18n?.en || slug;

  return {
    title: { absolute: `${title} | Hasake Zoo & Habitat Solution` },
    description,
    alternates: {
      canonical,
      languages: {
        "vi-VN": `${BASE_URL}/blog/${viSlug}`,
        en: `${BASE_URL}/en/blog/${enSlug}`,
      },
    },
    openGraph: {
      url: canonical,
      type: "article",
      title,
      description,
      images: [image],
      publishedTime: blog.publishedAt || undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = (await getLocale()) as Locale;
  const { slug } = await params;

  // Fetch blog data
  const blog = await fetchPublicBlogBySlug(slug, locale);

  if (!blog) {
    notFound();
  }

  // Fetch related blogs (same tags or latest)
  const [relatedBlogs, latestBlogs] = await Promise.all([
    fetchPublicBlogs({
      locale,
      limit: 3,
      tag: blog.tags?.[0],
    }).catch(() => ({ items: [], total: 0, page: 1, limit: 3 })),
    fetchPublicBlogs({
      locale,
      limit: 6,
      sort: "-publishedAt",
    }).catch(() => ({ items: [], total: 0, page: 1, limit: 6 })),
  ]);

  // Filter out current blog from related
  const filteredRelated = relatedBlogs.items.filter((b) => b._id !== blog._id);
  const latestArticles = latestBlogs.items.filter((b) => b._id !== blog._id).slice(0, 5);

  return (
    <BlogDetailClient
      locale={locale}
      slug={slug}
      blog={blog}
      relatedBlogs={filteredRelated}
      latestArticles={latestArticles}
    />
  );
}

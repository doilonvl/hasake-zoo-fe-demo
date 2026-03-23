"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Locale } from "@/types/content";
import type { Blog, BlogTag } from "@/types/blog";
import { resolveI18nValue, formatDate } from "@/lib/blogs";
import BlogListMotion from "@/components/blog/BlogListMotion";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";

interface BlogListClientProps {
  locale: Locale;
  blogs: Blog[];
}

export function BlogListClient({ locale, blogs }: BlogListClientProps) {
  const [selectedTag, setSelectedTag] = useState<BlogTag | "all">("all");

  const allTags = useMemo(() => {
    const tagSet = new Set<BlogTag>();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [blogs]);

  const filteredBlogs = useMemo(
    () =>
      selectedTag === "all"
        ? blogs
        : blogs.filter((b) => b.tags?.includes(selectedTag)),
    [blogs, selectedTag]
  );

  const isFiltered = selectedTag !== "all";
  const featuredBlog = !isFiltered ? filteredBlogs[0] : null;
  const gridBlogs = isFiltered ? filteredBlogs : filteredBlogs.slice(1);

  const latestBlogs = useMemo(
    () =>
      [...blogs]
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.createdAt || "").getTime() -
            new Date(a.publishedAt || a.createdAt || "").getTime()
        )
        .slice(0, 5),
    [blogs]
  );

  const resolveTitle = (blog: Blog) =>
    resolveI18nValue(blog.title_i18n, locale, "Untitled");
  const resolveExcerpt = (blog: Blog) =>
    resolveI18nValue(blog.excerpt_i18n, locale, "");
  const resolveSlugValue = (blog: Blog) => {
    const slugI18n = blog.slug_i18n;
    if (!slugI18n) return blog.slug || blog._id;
    if (typeof slugI18n === "string") return slugI18n;
    return (locale === "en" ? slugI18n.en : slugI18n.vi) || blog.slug || blog._id;
  };
  const resolveCover = (blog: Blog) => blog.coverImage?.url || "";
  const resolveDate_ = (blog: Blog) =>
    formatDate(blog.publishedAt || blog.createdAt, locale);
  const resolveReadTime = (blog: Blog) => blog.readingTimeMinutes || 0;

  if (blogs.length === 0) {
    return (
      <BlogListMotion>
        <div className="min-h-screen bg-white">
          <section className="relative pt-28 pb-12 overflow-hidden">
            <div className="container mx-auto px-8 lg:px-16 relative z-10">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                {locale === "vi" ? "Blog & Tin tức" : "Blog & News"}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {locale === "vi"
                  ? "Chưa có bài viết nào. Hãy quay lại sau!"
                  : "No articles yet. Please check back later!"}
              </p>
            </div>
          </section>
        </div>
      </BlogListMotion>
    );
  }

  return (
    <BlogListMotion>
      <div className="min-h-screen bg-white">
        {/* Hero + Featured Article */}
        <section className="relative pt-28 pb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-8 lg:px-16 relative z-10">
            <div className="mb-8" data-hero>
              <PageBreadcrumb
                items={[
                  { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                  { label: locale === "vi" ? "Blog" : "Blog" },
                ]}
              />
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                {locale === "vi" ? "Blog & Tin tức" : "Blog & News"}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {locale === "vi"
                  ? "Khám phá những bài viết mới nhất về bảo tồn động vật hoang dã, thiết kế habitat, và xu hướng ngành."
                  : "Explore the latest articles on wildlife conservation, habitat design, and industry trends."}
              </p>
            </div>

            {!isFiltered && featuredBlog && (
              <Link
                href={`/blog/${resolveSlugValue(featuredBlog)}` as never}
                className="group block"
                data-hero
              >
                <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-600/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-56 lg:h-[360px] overflow-hidden">
                      {resolveCover(featuredBlog) ? (
                        <Image
                          src={resolveCover(featuredBlog)}
                          alt={resolveTitle(featuredBlog)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/60" />
                    </div>

                    <div className="p-8 lg:p-12 flex flex-col justify-center bg-gray-50">
                      {featuredBlog.tags?.[0] && (
                        <span className="inline-block w-fit px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-full mb-4">
                          {featuredBlog.tags[0]}
                        </span>
                      )}
                      <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                        {resolveTitle(featuredBlog)}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed line-clamp-3 mb-6">
                        {resolveExcerpt(featuredBlog)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {featuredBlog.authorName && (
                          <>
                            <span>{featuredBlog.authorName}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                          </>
                        )}
                        <span>{resolveDate_(featuredBlog)}</span>
                        {resolveReadTime(featuredBlog) > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>
                              {resolveReadTime(featuredBlog)}{" "}
                              {locale === "vi" ? "phút" : "min"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <section className="py-6">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedTag("all")}
                    className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                      selectedTag === "all"
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {locale === "vi" ? "Tất cả" : "All"}
                    <span className="ml-1.5 text-xs opacity-60">
                      ({blogs.length})
                    </span>
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                        selectedTag === tag
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {tag}
                      <span className="ml-1.5 text-xs opacity-60">
                        ({blogs.filter((b) => b.tags?.includes(tag)).length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main: Cards Grid + Latest Sidebar */}
        <section className="py-16">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
              {/* Article cards */}
              <div>
                {isFiltered && (
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-gray-400 text-sm">
                      {locale === "vi" ? "Chủ đề:" : "Topic:"}
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 border border-emerald-500/30 text-emerald-600 text-sm font-medium rounded-lg">
                      {selectedTag}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({filteredBlogs.length}{" "}
                      {locale === "vi" ? "bài viết" : "articles"})
                    </span>
                  </div>
                )}
                {gridBlogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gridBlogs.map((blog) => (
                      <Link
                        key={blog._id}
                        href={`/blog/${resolveSlugValue(blog)}` as never}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-600/10"
                        data-card
                      >
                        <div className="relative h-52 overflow-hidden">
                          {resolveCover(blog) ? (
                            <Image
                              src={resolveCover(blog)}
                              alt={resolveTitle(blog)}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          {blog.tags?.[0] && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                                {blog.tags[0]}
                              </span>
                            </div>
                          )}
                          {resolveReadTime(blog) > 0 && (
                            <div className="absolute bottom-4 right-4">
                              <span className="px-2.5 py-1 bg-black/30 backdrop-blur-sm text-white/80 text-xs rounded-lg">
                                {resolveReadTime(blog)}{" "}
                                {locale === "vi" ? "phút" : "min"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            {blog.authorName && (
                              <>
                                <span>{blog.authorName}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                              </>
                            )}
                            <span>{resolveDate_(blog)}</span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {resolveTitle(blog)}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {resolveExcerpt(blog)}
                          </p>
                          <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm pt-1 group-hover:gap-3 transition-all">
                            <span>
                              {locale === "vi" ? "Đọc thêm" : "Read more"}
                            </span>
                            <svg
                              className="w-4 h-4 group-hover:translate-x-1.5 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : !isFiltered && filteredBlogs.length <= 1 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-xl text-gray-600">
                      {locale === "vi"
                        ? "Không có thêm bài viết nào trong danh mục này."
                        : "No more articles found in this category."}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-6">
                  {/* Latest */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-5">
                      {locale === "vi" ? "Mới nhất" : "Latest"}
                    </h3>
                    <div className="space-y-4">
                      {latestBlogs.map((blog) => (
                        <Link
                          key={blog._id}
                          href={`/blog/${resolveSlugValue(blog)}` as never}
                          className="flex gap-3 group"
                          data-latest-item
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                            {resolveCover(blog) ? (
                              <Image
                                src={resolveCover(blog)}
                                alt={resolveTitle(blog)}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 rounded-xl" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 text-sm font-medium line-clamp-2 group-hover:text-emerald-600 transition-colors">
                              {resolveTitle(blog)}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {resolveDate_(blog)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {allTags.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-4">
                        {locale === "vi" ? "Chủ đề" : "Topics"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                              selectedTag === tag
                                ? "bg-emerald-50 text-emerald-600 border-emerald-500/30"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Mobile Latest (horizontal scroll) */}
        <section className="py-12 lg:hidden border-t border-gray-200">
          <div className="container mx-auto px-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              {locale === "vi" ? "Mới nhất" : "Latest"}
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {latestBlogs.map((blog) => (
                <Link
                  key={blog._id}
                  href={`/blog/${resolveSlugValue(blog)}` as never}
                  className="snap-start flex-shrink-0 w-[260px] group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="relative h-32">
                      {resolveCover(blog) ? (
                        <Image
                          src={resolveCover(blog)}
                          alt={resolveTitle(blog)}
                          fill
                          className="object-cover"
                          sizes="260px"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-200" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="text-gray-700 text-sm font-medium line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {resolveTitle(blog)}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {resolveDate_(blog)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* No results at all */}
        {filteredBlogs.length === 0 && (
          <section className="py-20">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 mb-6">
                  <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-xl text-gray-600">
                  {locale === "vi"
                    ? "Không tìm thấy bài viết nào trong danh mục này."
                    : "No articles found in this category."}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </BlogListMotion>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Locale } from "@/types/content";
import type { Blog } from "@/types/blog";
import BlogTocPanel from "@/components/blog/BlogTocPanel";
import BlogDetailMotion from "@/components/blog/BlogDetailMotion";
import LexicalContentRenderer, {
  extractHeadingsFromLexical,
} from "@/components/blog/LexicalContentRenderer";
import BlogLocaleBridge from "@/components/blog/BlogLocaleBridge";
import { BlogContentZoom } from "@/components/blog/BlogContentZoom";
import { resolveLocalizedString } from "@/lib/i18n";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
 
interface BlogDetailClientProps {
  locale: Locale;
  slug: string;
  blog: Blog;
  relatedBlogs: Blog[];
  latestArticles: Blog[];
}

/* ─── Audio Player ─── */
function AudioPlayer({ locale }: { locale: Locale }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioUrl = "/audio/blog-narration.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
    setIsPlaying(!isPlaying);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm font-medium truncate">
              {locale === "vi" ? "Nghe bài viết" : "Listen to article"}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={cycleSpeed}
                className="text-emerald-400 text-xs font-bold px-2 py-0.5 rounded bg-emerald-400/10 hover:bg-emerald-400/20 transition-colors"
              >
                {playbackRate}x
              </button>
              <span className="text-white/50 text-xs">
                {fmt(currentTime)} / {duration ? fmt(duration) : "--:--"}
              </span>
            </div>
          </div>
          <div
            onClick={seek}
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Blog Detail ─── */
export function BlogDetailClient({
  locale,
  blog,
  relatedBlogs,
  latestArticles,
}: BlogDetailClientProps) {
  // Extract blog data
  const title = resolveLocalizedString(blog.title_i18n, locale);
  const excerpt = blog.excerpt_i18n
    ? resolveLocalizedString(blog.excerpt_i18n, locale)
    : "";
  const coverImage = blog.coverImage?.url;
  const tags = blog.tags || [];
  const publishedAt = blog.publishedAt
    ? new Date(blog.publishedAt)
    : new Date();
  const readingTime = blog.readingTimeMinutes || 5;
  const authorName = blog.authorName || "Hasake Zoo Team";

  // Get Lexical content for current locale
  const lexicalContent = blog.content_i18n?.[locale];

  // Extract TOC from Lexical content
  const tocItems = lexicalContent
    ? extractHeadingsFromLexical(lexicalContent)
    : [];


  return (
    <BlogDetailMotion>
      <BlogLocaleBridge slug={blog.slug} slugI18n={blog.slug_i18n} />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* ── Hero ── */}
        <section className="relative pb-0 overflow-hidden">
          <div className="relative h-[60vh] min-h-[500px]">
            {coverImage && (
              <>
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </>
            )}

            <div className="absolute bottom-0 left-0 right-0 pb-16">
              <div className="container mx-auto px-8 lg:px-16">
                <div className="max-w-4xl">
                  {tags[0] && (
                    <span
                      className="inline-block px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold rounded-full mb-6"
                      data-hero
                    >
                      {tags[0]}
                    </span>
                  )}
                  <h1
                    className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                    data-hero
                  >
                    {title}
                  </h1>
                  <div
                    className="flex flex-wrap items-center gap-4 lg:gap-6 text-white/70"
                    data-hero
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
                      <div>
                        <p className="text-white font-semibold">
                          {authorName}
                        </p>
                        <p className="text-sm">
                          {locale === "vi"
                            ? "Chuyên gia Bảo tồn"
                            : "Conservation Expert"}
                        </p>
                      </div>
                    </div>
                    <span className="hidden lg:inline">|</span>
                    <span>
                      {publishedAt.toLocaleDateString(locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="hidden lg:inline">|</span>
                    <span>
                      {readingTime}{" "}
                      {locale === "vi" ? "phút đọc" : "min read"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Audio Player ── (hidden until audio assets are available) */}

        {/* ── Content + Sidebar ── */}
        <section className="py-16">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 max-w-7xl mx-auto">
              {/* Article */}
              <article className="max-w-none" data-article>
                {/* Breadcrumb */}
                <PageBreadcrumb
                  items={[
                    { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                    { label: locale === "vi" ? "Blog" : "Blog", href: "/blog" },
                    { label: title.length > 50 ? title.slice(0, 50) + "…" : title },
                  ]}
                  className="mb-8"
                />

                {/* Inline TOC */}
                {tocItems.length > 0 && (
                  <BlogTocPanel
                    items={tocItems}
                    title={locale === "vi" ? "Mục lục" : "Table of Contents"}
                  />
                )}

                {/* Excerpt */}
                {excerpt && (
                  <div className="text-white/80 text-xl leading-relaxed mb-8 italic">
                    {excerpt}
                  </div>
                )}

                {/* Lexical Content */}
                <BlogContentZoom>
                  <div className="text-white/90 prose prose-invert prose-lg max-w-none">
                    {lexicalContent ? (
                      <LexicalContentRenderer
                        doc={lexicalContent}
                        toc={tocItems}
                        locale={locale}
                      />
                    ) : (
                      <p className="text-white/60">
                        {locale === "vi"
                          ? "Nội dung không khả dụng"
                          : "Content not available"}
                      </p>
                    )}
                  </div>
                </BlogContentZoom>

                {/* Back to Blog */}
                <div className="mt-16 pt-8 border-t border-white/10">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-3 text-emerald-400 hover:text-emerald-300 font-semibold text-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                      />
                    </svg>
                    {locale === "vi"
                      ? "Quay lại danh sách Blog"
                      : "Back to Blog"}
                  </Link>
                </div>
              </article>

              {/* Sidebar — Latest Articles */}
              <aside className="hidden lg:block" data-aside>
                <div className="sticky top-28 space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400 mb-5">
                      {locale === "vi" ? "Mới nhất" : "Latest"}
                    </h3>
                    <div className="space-y-4">
                      {latestArticles.map((article) => {
                        const articleSlug =
                          article.slug ||
                          resolveLocalizedString(article.slug_i18n, locale);
                        const articleTitle = resolveLocalizedString(
                          article.title_i18n,
                          locale
                        );
                        const articleImage = article.coverImage?.url;
                        const articleDate = article.publishedAt
                          ? new Date(article.publishedAt)
                          : new Date();

                        return (
                          <Link
                            key={article._id}
                            href={`/blog/${articleSlug}`}
                            className="flex gap-3 group"
                            data-latest-item
                          >
                            {articleImage && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                                <Image
                                  src={articleImage}
                                  alt={articleTitle}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white/90 text-sm font-medium line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                {articleTitle}
                              </p>
                              <p className="text-white/40 text-xs mt-1">
                                {articleDate.toLocaleDateString(locale, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Related Articles ── */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 border-t border-white/5">
            <div className="container mx-auto px-8 lg:px-16">
              <h2
                className="text-2xl lg:text-3xl font-bold text-white mb-8"
                data-article
              >
                {locale === "vi" ? "Bài viết liên quan" : "Related Articles"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.slice(0, 3).map((article) => {
                  const articleSlug =
                    article.slug ||
                    resolveLocalizedString(article.slug_i18n, locale);
                  const articleTitle = resolveLocalizedString(
                    article.title_i18n,
                    locale
                  );
                  const articleExcerpt = article.excerpt_i18n
                    ? resolveLocalizedString(article.excerpt_i18n, locale)
                    : "";
                  const articleImage = article.coverImage?.url;
                  const articleTags = article.tags || [];

                  return (
                    <Link
                      key={article._id}
                      href={`/blog/${articleSlug}`}
                      className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-600/10"
                      data-latest-card
                    >
                      {articleImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={articleImage}
                            alt={articleTitle}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                          {articleTags[0] && (
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                {articleTags[0]}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-5 space-y-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {articleTitle}
                        </h3>
                        {articleExcerpt && (
                          <p className="text-white/55 text-sm line-clamp-2">
                            {articleExcerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm pt-1">
                          <span>
                            {locale === "vi" ? "Đọc thêm" : "Read more"}
                          </span>
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </BlogDetailMotion>
  );
}

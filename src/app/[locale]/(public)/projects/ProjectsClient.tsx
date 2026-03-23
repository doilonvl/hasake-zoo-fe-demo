"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, Search, Star, X, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import type { Locale } from "@/types/content";
import type { Project } from "@/types/api";

interface ProjectsClientProps {
  locale: Locale;
  initialProjects: Project[];
}

export function ProjectsClient({ locale, initialProjects }: ProjectsClientProps) {
  const { t } = useTranslation("projects");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 9;

  const prefix = locale === "en" ? "/en" : "";
  const isEn = locale === "en";

  /* ── Unique categories ── */
  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [initialProjects]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    return initialProjects.filter((p) => {
      if (search) {
        const title = resolveLocalizedString(p.title_i18n, locale).toLowerCase();
        const loc = p.location_i18n
          ? resolveLocalizedString(p.location_i18n, locale).toLowerCase()
          : "";
        const searchLower = search.toLowerCase();
        if (!title.includes(searchLower) && !loc.includes(searchLower)) return false;
      }
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (featuredOnly && !p.isFeatured) return false;
      return true;
    });
  }, [initialProjects, search, activeCategory, featuredOnly, locale]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilter =
    search !== "" || activeCategory !== "all" || featuredOnly;

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("all");
    setFeaturedOnly(false);
    setPage(1);
  };

  // Reset page when filters change
  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (cat: string) => { setActiveCategory(cat); setPage(1); };
  const handleFeatured = () => { setFeaturedOnly((f) => !f); setPage(1); };

  return (
    <PageTransition>
      {/* ── Hero ── */}
      <Section>
        <section className="relative min-h-[52vh] bg-gray-50 overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0">
            <Image
              src="/test-img/plant 1.png"
              alt="Projects Background"
              fill
              className="object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />
          </div>
          <div className="relative z-10 container mx-auto px-8 lg:px-16">
            <ScrollReveal>
              <div className="max-w-4xl">
                <PageBreadcrumb
                  items={[
                    { label: isEn ? "Home" : "Trang Chủ", href: "/" },
                    { label: isEn ? "Projects" : "Dự Án" },
                  ]}
                />
                <p className="text-emerald-600 text-lg font-semibold mb-4 tracking-wide">
                  {t("hero.eyebrow")}
                </p>
                <h1 className="text-gray-900 text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-gray-700 text-xl lg:text-2xl leading-relaxed">
                  {t("hero.description")}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </Section>

      {/* ── Toolbar (sticky) ── */}
      <div className="bg-white border-b border-gray-200 backdrop-blur-xl">
        <div className="container mx-auto px-8 lg:px-16 py-3.5">
          {/* Row 1: search + controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={isEn ? "Search projects…" : "Tìm kiếm dự án…"}
                className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              {search && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1" />

            {/* Result count */}
            <span className="text-gray-400 text-xs hidden md:block shrink-0">
              {filtered.length > 0 && (
                <>
                  {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)}{" "}
                  {isEn ? "of" : "/"} {filtered.length}
                </>
              )}
              {hasActiveFilter && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-emerald-600/70 hover:text-emerald-600 transition-colors underline"
                >
                  {isEn ? "clear" : "xóa"}
                </button>
              )}
            </span>

            {/* Featured toggle */}
            <button
              onClick={handleFeatured}
              title={isEn ? "Featured only" : "Nổi bật"}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 shrink-0 ${
                featuredOnly
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-600"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">
                {isEn ? "Featured" : "Nổi bật"}
              </span>
            </button>

            {/* View mode toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("card")}
                title={isEn ? "Card view" : "Dạng card"}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === "card"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                title={isEn ? "Table view" : "Dạng bảng"}
                className={`p-2 transition-colors duration-200 ${
                  viewMode === "table"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              <button
                onClick={() => handleCategory("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                  activeCategory === "all"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {isEn ? "All" : "Tất cả"}{" "}
                <span className="opacity-60">({initialProjects.length})</span>
              </button>
              {categories.map((cat) => {
                const count = initialProjects.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      handleCategory(activeCategory === cat ? "all" : cat)
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                      activeCategory === cat
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {cat}{" "}
                    <span className="opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-12 lg:py-16 bg-gray-50 min-h-[50vh]">
        <div className="container mx-auto px-8 lg:px-16">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5 shadow-sm">
                <Search className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">
                {isEn ? "No projects found" : "Không tìm thấy dự án nào"}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {isEn ? "Try adjusting your filters" : "Thử thay đổi bộ lọc"}
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-500/30 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                {isEn ? "Clear all filters" : "Xóa tất cả bộ lọc"}
              </button>
            </div>
          ) : viewMode === "card" ? (
            <CardView
              projects={paginated}
              locale={locale}
              prefix={prefix}
              t={t}
              isEn={isEn}
            />
          ) : (
            <TableView
              projects={paginated}
              locale={locale}
              prefix={prefix}
              t={t}
              isEn={isEn}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              isEn={isEn}
            />
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="container mx-auto px-8 lg:px-16 text-center">
          <ScrollReveal>
            <h2 className="text-white text-5xl font-bold mb-6">{t("cta.title")}</h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <Link
              href={`${prefix}/contact`}
              className="inline-block px-12 py-4 bg-white text-emerald-600 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              {t("cta.button")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}

/* ════════════════════════════════════════════
   Card View
════════════════════════════════════════════ */
function CardView({
  projects,
  locale,
  prefix,
  t,
  isEn,
}: {
  projects: Project[];
  locale: Locale;
  prefix: string;
  t: (key: string) => string;
  isEn: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, idx) => {
        const title = resolveLocalizedString(project.title_i18n, locale);
        const excerpt = project.excerpt_i18n
          ? resolveLocalizedString(project.excerpt_i18n, locale)
          : "";
        const location = project.location_i18n
          ? resolveLocalizedString(project.location_i18n, locale)
          : null;
        const href = `${prefix}/projects/${resolveLocalizedString(
          project.slug_i18n,
          locale
        )}`;
        const isCompleted = project.status === "published" && !!project.completionDate;

        return (
          <ScrollReveal key={project._id} direction="up" delay={Math.min(idx * 0.06, 0.3)}>
            <Link href={href} className="group block h-full">
              <div className="relative flex flex-col h-full rounded-[28px] border border-gray-200 bg-white hover:border-emerald-500/40 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/8 shadow-sm">
                {/* Image */}
                <div className="relative h-52 overflow-hidden shrink-0">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage.url}
                      alt={
                        resolveLocalizedString(
                          project.coverImage.alt_i18n,
                          locale
                        ) || title
                      }
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-full backdrop-blur-sm border ${
                        isCompleted
                          ? "bg-emerald-600/80 border-emerald-500/50 text-white"
                          : "bg-amber-600/80 border-amber-500/50 text-white"
                      }`}
                    >
                      {isCompleted ? t("status.completed") : t("status.ongoing")}
                    </span>
                  </div>
                  {project.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/90 backdrop-blur-sm text-white text-[11px] font-bold rounded-full border border-amber-400/50">
                        <Star className="w-3 h-3" />
                        {t("featured")}
                      </span>
                    </div>
                  )}

                  {/* Category on image bottom */}
                  {project.category && (
                    <div className="absolute bottom-4 left-4">
                      <span className="px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white/80 text-[11px] font-semibold rounded-lg border border-white/10">
                        {project.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 gap-3">
                  <h3 className="text-gray-900 text-lg font-bold group-hover:text-emerald-600 transition-colors duration-300 leading-snug line-clamp-2">
                    {title}
                  </h3>

                  {excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-2 flex-1 leading-relaxed">
                      {excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400 mt-auto pt-1">
                    {location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                        {location}
                      </span>
                    )}
                    {project.completionDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500/60 shrink-0" />
                        {new Date(project.completionDate).toLocaleDateString(
                          isEn ? "en-US" : "vi-VN",
                          { year: "numeric", month: "short" }
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold group-hover:gap-3 transition-all duration-300 border-t border-gray-200 pt-4">
                    <span>{t("viewProject")}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   Table View
════════════════════════════════════════════ */
function TableView({
  projects,
  locale,
  prefix,
  t,
  isEn,
}: {
  projects: Project[];
  locale: Locale;
  prefix: string;
  t: (key: string) => string;
  isEn: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Table header */}
      <div className="grid grid-cols-[2rem_1fr_160px_180px_130px_110px_48px] gap-0 px-5 py-3.5 bg-gray-50 border-b border-gray-200 text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase">
        <div>#</div>
        <div className="pl-4">{isEn ? "Project" : "Dự Án"}</div>
        <div>{isEn ? "Category" : "Danh Mục"}</div>
        <div>{isEn ? "Location" : "Địa Điểm"}</div>
        <div>{isEn ? "Date" : "Ngày HT"}</div>
        <div>{isEn ? "Status" : "Trạng Thái"}</div>
        <div />
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-100">
        {projects.map((project, idx) => {
          const title = resolveLocalizedString(project.title_i18n, locale);
          const location = project.location_i18n
            ? resolveLocalizedString(project.location_i18n, locale)
            : null;
          const isCompleted = project.status === "published" && !!project.completionDate;
          const href = `${prefix}/projects/${resolveLocalizedString(
            project.slug_i18n,
            locale
          )}`;

          return (
            <Link
              key={project._id}
              href={href}
              className="group grid grid-cols-[2rem_1fr_160px_180px_130px_110px_48px] gap-0 px-5 py-4 items-center hover:bg-emerald-50 transition-colors duration-200"
            >
              {/* Index */}
              <div className="text-gray-400 text-xs font-mono tabular-nums">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Title + featured */}
              <div className="pl-4 flex items-center gap-3 min-w-0">
                {project.coverImage && (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={project.coverImage.url}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-gray-900 text-sm font-semibold group-hover:text-emerald-600 transition-colors duration-200 truncate leading-snug">
                    {title}
                  </p>
                  {project.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium mt-0.5">
                      <Star className="w-2.5 h-2.5" />
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                {project.category ? (
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-500/20 text-emerald-600 text-[11px] font-semibold">
                    {project.category}
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </div>

              {/* Location */}
              <div className="text-gray-400 text-sm truncate pr-4">
                {location ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500/40 shrink-0" />
                    <span className="truncate">{location}</span>
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>

              {/* Date */}
              <div className="text-gray-400 text-sm">
                {project.completionDate ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500/40 shrink-0" />
                    {new Date(project.completionDate).toLocaleDateString(
                      isEn ? "en-US" : "vi-VN",
                      { year: "numeric", month: "short" }
                    )}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>

              {/* Status */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                    isCompleted
                      ? "bg-emerald-50 border-emerald-500/25 text-emerald-600"
                      : "bg-amber-50 border-amber-500/25 text-amber-600"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      isCompleted ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isCompleted ? t("status.completed") : t("status.ongoing")}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-200" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   Pagination
════════════════════════════════════════════ */
function Pagination({
  page,
  totalPages,
  onChange,
  isEn,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  isEn: boolean;
}) {
  // Build page number array with ellipsis
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  const go = (p: number) => {
    onChange(p);
    scrollToTop();
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Prev */}
      <button
        onClick={() => go(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium hover:border-emerald-500/40 hover:text-emerald-600 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
      >
        <ChevronLeft className="w-4 h-4" />
        {isEn ? "Prev" : "Trước"}
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm select-none">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                page === p
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/25"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:border-emerald-500/40 hover:text-emerald-600"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => go(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-400 text-sm font-medium hover:border-emerald-500/40 hover:text-emerald-600 transition-all duration-200 disabled:opacity-25 disabled:pointer-events-none"
      >
        {isEn ? "Next" : "Tiếp"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

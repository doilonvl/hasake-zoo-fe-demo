"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import type { Locale } from "@/types/content";
import type { Project } from "@/types/api";

interface ProjectDetailClientProps {
  project: Project;
  locale: Locale;
}

export function ProjectDetailClient({
  project,
  locale,
}: ProjectDetailClientProps) {
  const { t } = useTranslation("projects");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const title = resolveLocalizedString(project.title_i18n, locale);
  const excerpt = resolveLocalizedString(project.excerpt_i18n, locale);
  const content = resolveLocalizedString(project.content_i18n, locale);
  const location = resolveLocalizedString(project.location_i18n, locale);

  const allImages = [
    project.coverImage,
    ...(project.gallery || []),
  ].filter(Boolean);

  return (
    <>
      {/* Hero Section - keep dark overlay on image for readability */}
      <section className="relative min-h-[70vh] bg-gray-50 overflow-hidden pt-32 pb-20">
        {project.coverImage && (
          <>
            <div className="absolute inset-0">
              <Image
                src={project.coverImage.url}
                alt={
                  resolveLocalizedString(project.coverImage.alt_i18n, locale) ||
                  title
                }
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />
            </div>
          </>
        )}

        <div className="relative z-10 container mx-auto px-8 lg:px-16">
          <ScrollReveal>
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-gray-600 mb-6 text-sm">
                <Link
                  href={`/${locale === "en" ? "en/" : ""}projects`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {t("hero.eyebrow")}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{title}</span>
              </nav>

              {project.isFeatured && (
                <span className="inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-full mb-6">
                  {t("featured")}
                </span>
              )}

              <h1 className="text-gray-900 text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {title}
              </h1>

              {excerpt && (
                <p className="text-gray-700 text-xl lg:text-2xl leading-relaxed mb-8">
                  {excerpt}
                </p>
              )}

              {/* Project Meta */}
              <div className="flex flex-wrap gap-6 text-gray-600">
                {location && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{location}</span>
                  </div>
                )}
                {project.client && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span>{project.client.name}</span>
                  </div>
                )}
                {project.category && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span>{project.category}</span>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Gallery Section */}
      {allImages.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-8 lg:px-16">
            <ScrollReveal>
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Main Image */}
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-50 border-2 border-gray-200 shadow-sm">
                  {allImages[selectedImageIndex] && (
                    <Image
                      src={allImages[selectedImageIndex]!.url}
                      alt={
                        resolveLocalizedString(
                          allImages[selectedImageIndex]!.alt_i18n,
                          locale
                        ) || title
                      }
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Thumbnail Grid */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {allImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-video rounded-xl overflow-hidden bg-gray-50 border-2 transition-all duration-300 ${
                          selectedImageIndex === idx
                            ? "border-emerald-400 scale-105"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image!.url}
                          alt={
                            resolveLocalizedString(image!.alt_i18n, locale) ||
                            `${title} - ${idx + 1}`
                          }
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Content Section */}
      {content && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-gray-900 prose-headings:font-bold
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:text-gray-700 prose-li:marker:text-emerald-600
                    prose-ol:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="container mx-auto px-8 lg:px-16 text-center">
          <ScrollReveal>
            <h2 className="text-white text-5xl font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
              {t("cta.description")}
            </p>
            <Link
              href={`/${locale === "en" ? "en/" : ""}contact`}
              className="inline-block px-12 py-4 bg-white text-emerald-600 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:scale-105"
            >
              {t("cta.button")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { fetchPublicServices } from "@/lib/api/services.public";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import LexicalContentRenderer from "@/components/blog/LexicalContentRenderer";
import { BlogContentZoom } from "@/components/blog/BlogContentZoom";
import type { Locale } from "@/types/content";
import type { Service } from "@/types/api";

interface ServiceDetailClientProps {
  service: Service;
  locale: Locale;
}

export function ServiceDetailClient({
  service,
  locale,
}: ServiceDetailClientProps) {
  const { t } = useTranslation("services");
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const response = await fetchPublicServices({
          locale,
          categoryId: service.categoryId,
          limit: 10,
        });
        const items: Service[] =
          (response as unknown as { items?: Service[] })?.items ?? [];
        const filtered = items.filter((s) => s._id !== service._id).slice(0, 3);
        setRelatedServices(filtered);
      } catch {
        // silently ignore — related services are supplementary
      }
    }

    if (service.categoryId) {
      fetchRelated();
    }
  }, [service._id, service.categoryId]);

  const name = resolveLocalizedString(service.name_i18n, locale);
  const lexicalContent =
    (service.content_i18n as Record<string, unknown> | null)?.[locale] ?? null;
  const highlights = service.highlights_i18n?.[locale] || [];
  const faqs =
    (
      service as unknown as {
        faqs_i18n?: Record<string, { question: string; answer: string }[]>;
      }
    ).faqs_i18n?.[locale] || [];

  return (
    <div className="bg-white">
      {/* Hero Section - keep dark overlay on image for text readability */}
      <section className="relative min-h-[70vh] bg-gray-50 overflow-hidden pt-32 pb-20">
        {service.coverImage && (
          <>
            <div className="absolute inset-0">
              <Image
                src={service.coverImage.url}
                alt={
                  resolveLocalizedString(service.coverImage.alt_i18n, locale) ||
                  name
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
              <nav className={`mb-6 text-sm ${service.coverImage ? "text-white/70" : "text-gray-600"}`}>
                <Link
                  href={`/${locale === "en" ? "en/" : ""}services`}
                  className={`transition-colors ${service.coverImage ? "hover:text-emerald-300" : "hover:text-emerald-600"}`}
                >
                  {t("hero.eyebrow")}
                </Link>
                <span className="mx-2">/</span>
                <span className={service.coverImage ? "text-white" : "text-gray-900"}>{name}</span>
              </nav>

              {service.isFeatured && (
                <span className="inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-full mb-6">
                  {t("featured")}
                </span>
              )}

              <h1 className={`text-6xl lg:text-7xl font-bold mb-6 leading-tight ${service.coverImage ? "text-white" : "text-gray-900"}`}>
                {name}
              </h1>

              {service.excerpt_i18n && (
                <p className={`text-xl lg:text-2xl leading-relaxed ${service.coverImage ? "text-white/90" : "text-gray-700"}`}>
                  {resolveLocalizedString(service.excerpt_i18n, locale)}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      {lexicalContent && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <BlogContentZoom>
                  <div className="text-gray-700 prose prose-lg max-w-none">
                    <LexicalContentRenderer
                      doc={
                        lexicalContent as Parameters<
                          typeof LexicalContentRenderer
                        >[0]["doc"]
                      }
                      locale={locale}
                    />
                  </div>
                </BlogContentZoom>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* Highlights Section */}
      {highlights.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-8 lg:px-16">
            <ScrollReveal>
              <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-12 text-center">
                Key Features
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {highlights.map((highlight, idx) => (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                  <div className="bg-white shadow-sm border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <span className="text-emerald-600 text-2xl font-bold">
                          ✓
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">
                        {highlight}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-8 lg:px-16">
            <ScrollReveal>
              <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-12 text-center">
                Frequently Asked Questions
              </h2>
            </ScrollReveal>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map(
                (faq: { question: string; answer: string }, idx: number) => (
                  <ScrollReveal key={idx} direction="up" delay={idx * 0.05}>
                    <div className="bg-white shadow-sm border-2 border-gray-200 rounded-2xl p-8 hover:border-emerald-400/50 transition-all duration-300">
                      <h3 className="text-gray-900 text-xl font-bold mb-4">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </ScrollReveal>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-8 lg:px-16">
            <ScrollReveal>
              <h2 className="text-gray-900 text-4xl lg:text-5xl font-bold mb-12 text-center">
                Related Services
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedServices.map((relatedService, idx) => (
                <ScrollReveal
                  key={relatedService._id}
                  direction="up"
                  delay={idx * 0.1}
                >
                  <Link
                    href={`/${locale === "en" ? "en/" : ""}services/${resolveLocalizedString(relatedService.slug_i18n, locale)}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-400/50 shadow-sm overflow-hidden transition-all duration-500 hover:transform hover:scale-105">
                      {relatedService.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={relatedService.coverImage.url}
                            alt={
                              resolveLocalizedString(
                                relatedService.coverImage.alt_i18n,
                                locale,
                              ) ||
                              resolveLocalizedString(
                                relatedService.name_i18n,
                                locale,
                              )
                            }
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-gray-900 text-xl font-bold group-hover:text-emerald-600 transition-colors">
                          {resolveLocalizedString(
                            relatedService.name_i18n,
                            locale,
                          )}
                        </h3>

                        {relatedService.excerpt_i18n && (
                          <p className="text-gray-600 mt-3 line-clamp-2">
                            {resolveLocalizedString(
                              relatedService.excerpt_i18n,
                              locale,
                            )}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-4">
                          <span className="text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                            {t("learnMore")} →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
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
              className="inline-block px-12 py-4 bg-white text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105"
            >
              {t("cta.button")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

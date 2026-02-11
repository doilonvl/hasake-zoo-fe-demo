"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import type { Locale } from "@/types/content";
import type { Product } from "@/types/api";
import { mockProducts } from "@/data/mock/products";

interface ProductsClientProps {
  locale: Locale;
}

export function ProductsClient({ locale }: ProductsClientProps) {
  const { t } = useTranslation("products");
  const [products] = useState<Product[]>(mockProducts);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filteredProducts =
    filter === "featured"
      ? products.filter((p) => p.isFeatured)
      : products;

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section><section className="relative min-h-[60vh] bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/test-img/plant 1.png"
            alt="Products Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        <div className="relative z-10 container mx-auto px-8 lg:px-16">
          <ScrollReveal>
            <div className="max-w-4xl">
              <p className="text-emerald-400 text-lg font-semibold mb-4 tracking-wide">
                {t("hero.eyebrow")}
              </p>
              <h1 className="text-white text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {t("hero.title")}
              </h1>
              <p className="text-white/80 text-xl lg:text-2xl leading-relaxed">
                {t("hero.description")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section></Section>

      {/* Filter Tabs */}
      <section className="bg-slate-900/95 border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-8 lg:px-16 py-6">
          <ScrollReveal direction="fade">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === "all"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
                }`}
              >
                {t("filters.all")}
              </button>
              <button
                onClick={() => setFilter("featured")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === "featured"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-white/5 text-white/80 hover:bg-white/10 border border-white/10"
                }`}
              >
                {t("filters.featured")}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-8 lg:px-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-xl">{t("empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, idx) => {
                const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

                return (
                  <ScrollReveal
                    key={product._id}
                    direction="up"
                    delay={idx * 0.1}
                  >
                    <Link
                      href={`/${locale === "en" ? "en/" : ""}products/${resolveLocalizedString(product.slug_i18n, locale)}`}
                      className="group block h-full"
                    >
                      <div className="bg-white/5 rounded-3xl border-2 border-white/10 hover:border-emerald-400/40 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-600/20 h-full flex flex-col">
                        {/* Image */}
                        {primaryImage && (
                          <div className="relative h-56 overflow-hidden bg-white/5">
                            <Image
                              src={primaryImage.url}
                              alt={
                                resolveLocalizedString(
                                  primaryImage.alt_i18n,
                                  locale
                                ) || resolveLocalizedString(product.name_i18n, locale)
                              }
                              fill
                              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                            />

                            {product.isFeatured && (
                              <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                                {t("featured")}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6 space-y-4 flex-1 flex flex-col">
                          <h3 className="text-white text-xl font-bold group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {resolveLocalizedString(product.name_i18n, locale)}
                          </h3>

                          {product.shortDescription_i18n && (
                            <p className="text-white/70 text-sm line-clamp-3 flex-1">
                              {resolveLocalizedString(product.shortDescription_i18n, locale)}
                            </p>
                          )}

                          {/* Specifications Preview */}
                          {product.specifications && product.specifications.length > 0 && (
                            <div className="space-y-1 text-xs text-white/60">
                              {product.specifications.slice(0, 2).map((spec, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span className="truncate">
                                    {resolveLocalizedString(spec.key_i18n, locale)}:{" "}
                                    {resolveLocalizedString(spec.value_i18n, locale)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center justify-between pt-4 mt-auto">
                            <span className="text-emerald-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                              {t("viewDetails")} →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

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
              className="inline-block px-12 py-4 bg-white text-emerald-600 rounded-2xl text-xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105"
            >
              {t("cta.button")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </PageTransition>
  );
}

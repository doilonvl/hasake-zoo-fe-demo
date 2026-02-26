"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import type { Locale } from "@/types/content";
import type { Product } from "@/types/api";

interface ProductDetailClientProps {
  product: Product;
  locale: Locale;
}

export function ProductDetailClient({
  product,
  locale,
}: ProductDetailClientProps) {
  const { t } = useTranslation("products");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const name = resolveLocalizedString(product.name_i18n, locale);
  const description = resolveLocalizedString(
    product.seoDescription_i18n,
    locale
  );
  const shortDescription = resolveLocalizedString(
    product.shortDescription_i18n,
    locale
  );

  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const allImages = product.images || [];

  return (
    <>
      {/* Hero Section - keep dark overlay for image readability */}
      <section className="relative min-h-[50vh] bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 overflow-hidden pt-32 pb-20">
        <div className="relative z-10 container mx-auto px-8 lg:px-16">
          <ScrollReveal>
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="text-white/60 mb-6 text-sm">
                <Link
                  href={`/${locale === "en" ? "en/" : ""}products`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t("hero.eyebrow")}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{name}</span>
              </nav>

              {product.isFeatured && (
                <span className="inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-full mb-6">
                  {t("featured")}
                </span>
              )}

              <h1 className="text-white text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {name}
              </h1>

              {shortDescription && (
                <p className="text-white/90 text-xl lg:text-2xl leading-relaxed">
                  {shortDescription}
                </p>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20 bg-white/5">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <ScrollReveal direction="left">
              <div className="space-y-6">
                {/* Main Image */}
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border-2 border-white/10">
                  {allImages[selectedImageIndex] && (
                    <Image
                      src={allImages[selectedImageIndex].url}
                      alt={
                        resolveLocalizedString(
                          allImages[selectedImageIndex].alt_i18n,
                          locale
                        ) || name
                      }
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  )}
                </div>

                {/* Thumbnail Grid */}
                {allImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {allImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden bg-white/5 border-2 transition-all duration-300 ${
                          selectedImageIndex === idx
                            ? "border-emerald-400 scale-105"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Image
                          src={image.url}
                          alt={
                            resolveLocalizedString(image.alt_i18n, locale) ||
                            `${name} - ${idx + 1}`
                          }
                          fill
                          className="object-contain p-2"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Product Info */}
            <ScrollReveal direction="right">
              <div className="space-y-8">
                {/* Specifications */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="bg-white/5 backdrop-blur-xl border-2 border-white/10 rounded-3xl p-8">
                    <h2 className="text-white text-2xl font-bold mb-6">
                      {locale === "vi" ? "Thong so ky thuat" : "Specifications"}
                    </h2>
                    <div className="space-y-4">
                      {product.specifications.map((spec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                        >
                          <span className="text-white/70">
                            {resolveLocalizedString(spec.key_i18n, locale)}
                          </span>
                          <span className="text-white font-semibold">
                            {resolveLocalizedString(spec.value_i18n, locale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/${locale === "en" ? "en/" : ""}contact`}
                    className="flex-1 text-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-600/30"
                  >
                    {locale === "vi" ? "Yeu cau bao gia" : "Request Quote"}
                  </Link>
                  <Link
                    href={`/${locale === "en" ? "en/" : ""}contact`}
                    className="flex-1 text-center px-8 py-4 bg-white/5 text-white border-2 border-white/10 rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    {locale === "vi" ? "Lien he tu van" : "Contact Us"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="container mx-auto px-8 lg:px-16">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <h2 className="text-white text-4xl font-bold mb-8">
                  {locale === "vi" ? "Mo ta san pham" : "Product Description"}
                </h2>
                <div
                  className="prose prose-lg max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-p:text-white/80 prose-p:leading-relaxed
                    prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-ul:text-white/80 prose-li:marker:text-emerald-400"
                  dangerouslySetInnerHTML={{ __html: description }}
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
              className="inline-block px-12 py-4 bg-white text-emerald-400 rounded-2xl text-xl font-bold hover:bg-emerald-500/20 transition-all duration-300 shadow-2xl hover:shadow-white/30 hover:scale-105"
            >
              {t("cta.button")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

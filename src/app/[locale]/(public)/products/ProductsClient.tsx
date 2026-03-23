"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useTranslation } from "@/i18n/client";
import { resolveLocalizedString } from "@/lib/i18n";
import { ScrollReveal } from "@/components/animate/ScrollReveal";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import type { Locale } from "@/types/content";
import type { Product } from "@/types/api";

interface ProductsClientProps {
  locale: Locale;
  initialProducts: Product[];
}

export function ProductsClient({ locale, initialProducts }: ProductsClientProps) {
  const { t } = useTranslation("products");
  const [products] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const filteredProducts =
    filter === "featured"
      ? products.filter((p) => p.isFeatured)
      : products;

  return (
    <PageTransition>
      {/* Hero Section */}
      <Section><section className="relative min-h-[60vh] bg-gray-50 overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0">
          <Image
            src="/test-img/plant 1.png"
            alt="Products Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 container mx-auto px-8 lg:px-16">
          <ScrollReveal>
            <div className="max-w-4xl">
              <PageBreadcrumb
                items={[
                  { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                  { label: locale === "vi" ? "Sản Phẩm" : "Products" },
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
      </section></Section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-gray-200 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-8 lg:px-16 py-6">
          <ScrollReveal direction="fade">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === "all"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t("filters.all")}
              </button>
              <button
                onClick={() => setFilter("featured")}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  filter === "featured"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {t("filters.featured")}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8 lg:px-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">{t("empty")}</p>
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
                      <div className="bg-white rounded-3xl border-2 border-gray-200 hover:border-emerald-400/50 overflow-hidden transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-600/20 h-full flex flex-col shadow-sm">
                        {/* Image */}
                        {primaryImage && (
                          <div className="relative h-56 overflow-hidden bg-gray-50">
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
                          <h3 className="text-gray-900 text-xl font-bold group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {resolveLocalizedString(product.name_i18n, locale)}
                          </h3>

                          {product.shortDescription_i18n && (
                            <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                              {resolveLocalizedString(product.shortDescription_i18n, locale)}
                            </p>
                          )}

                          {/* Specifications Preview */}
                          {product.specifications && product.specifications.length > 0 && (
                            <div className="space-y-1 text-xs text-gray-600">
                              {product.specifications.slice(0, 2).map((spec, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
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
                            <span className="text-emerald-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
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

      {/* Features Section */}
      <Section><section className="py-20 bg-white">
        <div className="container mx-auto px-8 lg:px-16">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-emerald-600 text-lg font-semibold mb-4 tracking-wide">
                {locale === "vi" ? "TẠI SAO CHỌN CHÚNG TÔI" : "WHY CHOOSE US"}
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                {locale === "vi" ? "Cam Kết Chất Lượng" : "Quality Commitment"}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: locale === "vi" ? "Chất Lượng Đảm Bảo" : "Quality Assured",
                desc: locale === "vi"
                  ? "Tất cả sản phẩm đều đạt tiêu chuẩn quốc tế về an toàn và chất lượng"
                  : "All products meet international safety and quality standards",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                ),
                title: locale === "vi" ? "Vận Chuyển Toàn Quốc" : "Nationwide Delivery",
                desc: locale === "vi"
                  ? "Giao hàng nhanh chóng và an toàn đến mọi tỉnh thành trên cả nước"
                  : "Fast and safe delivery to all provinces nationwide",
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: locale === "vi" ? "Hỗ Trợ 24/7" : "24/7 Support",
                desc: locale === "vi"
                  ? "Đội ngũ tư vấn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi"
                  : "Our consulting team is ready to support you anytime, anywhere",
              },
            ].map((feature, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.15}>
                <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-500 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-gray-900 text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section></Section>

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
    </PageTransition>
  );
}

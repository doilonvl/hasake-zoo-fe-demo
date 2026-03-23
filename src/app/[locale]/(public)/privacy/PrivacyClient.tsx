"use client";

import {
  ShieldCheck,
  FileSearch,
  UserCheck,
  LockKeyhole,
  Globe2,
  Sparkles,
  Bell,
  Cookie,
  Shield,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/i18n/client";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import type { Locale } from "@/types/content";

interface PrivacyClientProps {
  locale: Locale;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  FileSearch,
  UserCheck,
  LockKeyhole,
  Globe2,
  Sparkles,
  Bell,
  Cookie,
  Shield,
  CheckCircle2,
};

interface QuickPoint {
  title: string;
  description: string;
  icon: string;
}

interface PolicySection {
  id: string;
  title: string;
  summary?: string;
  items: string[];
  icon: string;
}

interface ContactInfo {
  eyebrow: string;
  title: string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

export function PrivacyClient({ locale }: PrivacyClientProps) {
  const { t } = useTranslation("privacy");

  const heroHighlights = t("heroHighlights", {
    returnObjects: true,
  }) as string[];
  const quickPoints = t("quickPoints", { returnObjects: true }) as QuickPoint[];
  const sections = t("sections", { returnObjects: true }) as PolicySection[];
  const rightsBullets = t("rightsBullets", {
    returnObjects: true,
  }) as string[];
  const contact = t("contact", { returnObjects: true }) as ContactInfo;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        {/* ── Hero ── */}
        <Section>
          <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
            <div className="absolute inset-0">
              <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
            </div>
            <div className="container mx-auto px-8 lg:px-16 relative z-10">
              <div className="max-w-4xl">
                <PageBreadcrumb
                  items={[
                    {
                      label: locale === "vi" ? "Trang Chủ" : "Home",
                      href: "/",
                    },
                    {
                      label:
                        locale === "vi" ? "Chính Sách Bảo Mật" : "Privacy Policy",
                    },
                  ]}
                />
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                  {t("title")}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-6 max-w-3xl">
                  {t("tagline")}
                </p>
                <p className="text-sm text-gray-400 mb-8">{t("updated")}</p>

                {/* Highlight chips */}
                {Array.isArray(heroHighlights) && (
                  <div className="flex flex-wrap gap-3">
                    {heroHighlights.map((label, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-400/30 bg-emerald-50 text-emerald-600"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </Section>

        {/* ── Quick Points ── */}
        <Section>
          <section className="py-16 border-y border-gray-200">
            <div className="container mx-auto px-8 lg:px-16">
              <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase text-center mb-10">
                {t("sectionEyebrow")}
              </p>
              {Array.isArray(quickPoints) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickPoints.map((point, i) => {
                    const Icon = ICON_MAP[point.icon] ?? Shield;
                    return (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-emerald-400/30 transition-all duration-500"
                      >
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-gray-900 font-semibold mb-2">
                          {point.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </Section>

        {/* ── Policy Sections ── */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.isArray(sections) &&
                  sections.map((sec) => {
                    const Icon = ICON_MAP[sec.icon] ?? Shield;
                    return (
                      <div
                        key={sec.id}
                        className="bg-gray-50 rounded-2xl border border-gray-200 p-8 hover:border-emerald-400/20 transition-all duration-500"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {sec.title}
                          </h2>
                        </div>
                        {sec.summary && (
                          <p className="text-gray-600 text-sm mb-4 pl-14 leading-relaxed">
                            {sec.summary}
                          </p>
                        )}
                        <ul className="space-y-3 pl-14">
                          {sec.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                              <span className="text-gray-600 text-sm leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        </Section>

        {/* ── Rights Section ── */}
        <Section>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                  <UserCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t("rightsTitle")}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 pl-9">
                  {t("rightsCopy")}
                </p>
                {Array.isArray(rightsBullets) && (
                  <ul className="space-y-3 pl-9">
                    {rightsBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                        <span className="text-gray-600 text-sm leading-relaxed">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        </Section>

        {/* ── Contact Section ── */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-3xl mx-auto text-center">
                <p className="text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-4">
                  {contact?.eyebrow}
                </p>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {contact?.title}
                </h2>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  {contact?.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-emerald-400/30 transition-all duration-500">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {contact?.address}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-emerald-400/30 transition-all duration-500">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <a
                      href={`tel:${contact?.phone?.replace(/\s/g, "")}`}
                      className="text-gray-600 text-sm hover:text-emerald-600 transition-colors"
                    >
                      {contact?.phone}
                    </a>
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:border-emerald-400/30 transition-all duration-500">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-5 h-5 text-emerald-600" />
                    </div>
                    <a
                      href={`mailto:${contact?.email}`}
                      className="text-gray-600 text-sm hover:text-emerald-600 transition-colors break-all"
                    >
                      {contact?.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Section>
      </div>
    </PageTransition>
  );
}

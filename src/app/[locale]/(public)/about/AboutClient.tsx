"use client";

import { Link } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/client";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import type { Locale } from "@/types/content";

interface AboutClientProps {
  locale: Locale;
}

export function AboutClient({ locale }: AboutClientProps) {
  const { t } = useTranslation("about");

  const STATS = [
    { value: t("stats.yearsValue"), label: t("stats.yearsLabel") },
    { value: t("stats.projectsValue"), label: t("stats.projectsLabel") },
    { value: t("stats.countriesValue"), label: t("stats.countriesLabel") },
    { value: t("stats.certificationsValue"), label: t("stats.certificationsLabel") },
  ];

  const EXPERTISE = [
    { icon: "🏗️", title: t("expertise.zooDesignTitle"), desc: t("expertise.zooDesignDesc") },
    { icon: "✈️", title: t("expertise.transportTitle"), desc: t("expertise.transportDesc") },
    { icon: "🐾", title: t("expertise.welfareTitle"), desc: t("expertise.welfareDesc") },
    { icon: "🧬", title: t("expertise.breedingTitle"), desc: t("expertise.breedingDesc") },
    { icon: "🌍", title: t("expertise.exchangeTitle"), desc: t("expertise.exchangeDesc") },
    { icon: "📚", title: t("expertise.educationTitle"), desc: t("expertise.educationDesc") },
  ];

  const APPROACH = [
    { icon: "🔬", title: t("approach.scienceTitle"), desc: t("approach.scienceDesc") },
    { icon: "🌿", title: t("approach.sustainTitle"), desc: t("approach.sustainDesc") },
    { icon: "🎭", title: t("approach.culturalTitle"), desc: t("approach.culturalDesc") },
    { icon: "🤝", title: t("approach.collabTitle"), desc: t("approach.collabDesc") },
  ];

  const VALUES = [
    { icon: "💡", title: t("values.innovationTitle"), desc: t("values.innovationDesc") },
    { icon: "⚖️", title: t("values.integrityTitle"), desc: t("values.integrityDesc") },
    { icon: "🤝", title: t("values.collaborationTitle"), desc: t("values.collaborationDesc") },
    { icon: "💚", title: t("values.compassionTitle"), desc: t("values.compassionDesc") },
    { icon: "⭐", title: t("values.excellenceTitle"), desc: t("values.excellenceDesc") },
  ];

  const COMMITMENTS = [
    { title: t("commitment.welfareTitle"), desc: t("commitment.welfareDesc") },
    { title: t("commitment.conservationTitle"), desc: t("commitment.conservationDesc") },
    { title: t("commitment.excellenceTitle"), desc: t("commitment.excellenceDesc") },
    { title: t("commitment.clientsTitle"), desc: t("commitment.clientsDesc") },
  ];

  const WHY_ITEMS = [
    t("whyChooseUs.item1"),
    t("whyChooseUs.item2"),
    t("whyChooseUs.item3"),
    t("whyChooseUs.item4"),
    t("whyChooseUs.item5"),
    t("whyChooseUs.item6"),
    t("whyChooseUs.item7"),
  ];

  const CERT_ITEMS = [
    t("certifications.item1"),
    t("certifications.item2"),
    t("certifications.item3"),
    t("certifications.item4"),
  ];

  const OFFICES = [
    t("globalReach.office1"),
    t("globalReach.office2"),
    t("globalReach.office3"),
    t("globalReach.office4"),
  ];

  const PROJECT_COUNTRIES = [
    t("globalReach.thailand"),
    t("globalReach.vietnam"),
    t("globalReach.india"),
    t("globalReach.indonesia"),
    t("globalReach.myanmar"),
    t("globalReach.malaysia"),
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
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
                    { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                    { label: locale === "vi" ? "Về Chúng Tôi" : "About Us" },
                  ]}
                />
                <p className="text-emerald-400 text-lg font-semibold mb-4 tracking-wide">
                  {t("hero.eyebrow")}
                </p>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-xl text-white/70 leading-relaxed">
                  {t("hero.description")}
                </p>
              </div>
            </div>
          </section>
        </Section>

        {/* Stats Section */}
        <Section>
          <section className="py-16 border-y border-white/10">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {STATS.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </p>
                    <p className="text-white/70 text-lg">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Section>

        {/* Who We Are Section */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  {t("whoWeAre.title")}
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  {t("whoWeAre.description1")}
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  {t("whoWeAre.description2")}
                </p>
              </div>
            </div>
          </section>
        </Section>

        {/* History Section */}
        <Section>
          <section className="py-24 bg-slate-800/30">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t("history.title")}
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  {t("history.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Goatrade */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-emerald-400/30 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🐘</span>
                    <span className="text-emerald-400 font-semibold text-sm tracking-wide">
                      {t("history.goatradeYear")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t("history.goatradeTitle")}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {t("history.goatradeDesc")}
                  </p>
                </div>
                {/* HKS */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-emerald-400/30 transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏗️</span>
                    <span className="text-emerald-400 font-semibold text-sm tracking-wide">
                      {t("history.hksYear")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {t("history.hksTitle")}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {t("history.hksDesc")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Section>

        {/* Expertise Section */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t("expertise.title")}
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  {t("expertise.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {EXPERTISE.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-emerald-400/30 transition-all duration-500 group"
                  >
                    <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-white/60 leading-relaxed text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Section>

        {/* Approach Section */}
        <Section>
          <section className="py-24 bg-slate-800/30">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t("approach.title")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {APPROACH.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-6 bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-emerald-400/30 transition-all duration-500"
                  >
                    <span className="text-4xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-white/60 leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Section>

        {/* Global Reach Section */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t("globalReach.title")}
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto">
                  {t("globalReach.subtitle")}
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Headquarters */}
                <div className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl border border-emerald-400/30 p-8">
                  <p className="text-emerald-400 font-semibold text-sm tracking-wide mb-2">
                    {t("globalReach.headquartersLabel")}
                  </p>
                  <p className="text-white text-xl font-bold">
                    {t("globalReach.headquarters")}
                  </p>
                </div>
                {/* Regional Offices */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                  <p className="text-emerald-400 font-semibold text-sm tracking-wide mb-4">
                    {t("globalReach.officesLabel")}
                  </p>
                  <ul className="space-y-2">
                    {OFFICES.map((office, idx) => (
                      <li key={idx} className="text-white/70 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                        {office}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Projects */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                  <p className="text-emerald-400 font-semibold text-sm tracking-wide mb-4">
                    {t("globalReach.projectsLabel")}
                  </p>
                  <ul className="space-y-2">
                    {PROJECT_COUNTRIES.map((country, idx) => (
                      <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-teal-400 rounded-full flex-shrink-0 mt-1.5" />
                        {country}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </Section>

        {/* Commitment Section */}
        <Section>
          <section className="py-24 bg-slate-800/30">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {t("commitment.title")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {COMMITMENTS.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 rounded-2xl border border-white/10 p-8 hover:border-emerald-400/30 transition-all duration-500"
                  >
                    <h3 className="text-xl font-bold text-emerald-400 mb-3">{item.title}</h3>
                    <p className="text-white/70 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Section>

        {/* Why Choose Us + Values + Certifications */}
        <Section>
          <section className="py-24">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Why Choose Us */}
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                    {t("whyChooseUs.title")}
                  </h2>
                  <ul className="space-y-4">
                    {WHY_ITEMS.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-white/70">
                        <svg
                          className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Certifications */}
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {t("certifications.title")}
                    </h3>
                    <div className="space-y-3">
                      {CERT_ITEMS.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <span className="text-emerald-400">🏅</span>
                          <span className="text-white/70 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                    {t("values.title")}
                  </h2>
                  <div className="space-y-6">
                    {VALUES.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-emerald-400/30 transition-all duration-500"
                      >
                        <span className="text-3xl flex-shrink-0">{val.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{val.title}</h3>
                          <p className="text-white/60 text-sm leading-relaxed">{val.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Section>

        {/* Vision Section */}
        <Section>
          <section className="py-24 bg-gradient-to-r from-emerald-900/30 to-teal-900/30">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  {t("vision.title")}
                </h2>
                <p className="text-xl text-white/70 leading-relaxed">
                  {t("vision.description")}
                </p>
              </div>
            </div>
          </section>
        </Section>

        {/* Contact Info + CTA Section */}
        <Section>
          <section className="py-24 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border-y border-white/10">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Contact Info */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    {t("contactInfo.title")}
                  </h3>
                  <div className="space-y-4 text-white/70">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{t("contactInfo.address")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm">Tel: {t("contactInfo.tel")} | Fax: {t("contactInfo.fax")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{t("contactInfo.email1")} | {t("contactInfo.email2")}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span className="text-sm">{t("contactInfo.website")}</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center lg:text-left">
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    {t("cta.title")}
                  </h2>
                  <p className="text-xl text-white/70 mb-10">
                    {t("cta.description")}
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg shadow-emerald-600/30"
                  >
                    {t("cta.button")}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Section>
      </div>
    </PageTransition>
  );
}

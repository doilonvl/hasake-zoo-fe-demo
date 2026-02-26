"use client";

import type { Locale } from "@/types/content";
import { ContactInquiryForm } from "@/components/shared/contact-inquiry-form";
import { PageTransition, Section } from "@/components/animate/PageTransition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";

interface ContactClientProps {
  locale: Locale;
}

const CONTACT_INFO = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: { vi: "Địa chỉ Văn phòng", en: "Office Location" },
    content: "50 Thuy Khue Street, Tay Ho\nHanoi, Vietnam",
    link: "https://maps.google.com/?q=50+Thuy+Khue+Tay+Ho+Hanoi",
    linkText: { vi: "Xem trên bản đồ", en: "View on map" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: { vi: "Email", en: "Email" },
    content: "info@hasakezoo.com.vn",
    link: "mailto:info@hasakezoo.com.vn",
    linkText: { vi: "Gửi email", en: "Send email" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
    title: { vi: "Điện thoại", en: "Phone" },
    content: "+84 098 531 0238",
    link: "tel:+84985310238",
    linkText: { vi: "Gọi ngay", en: "Call now" },
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: { vi: "Giờ Làm việc", en: "Working Hours" },
    content: {
      vi: "Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00",
      en: "Mon - Fri: 8:00 AM - 5:30 PM\nSat: 8:00 AM - 12:00 PM",
    },
    link: null,
    linkText: null,
  },
];

export function ContactClient({ locale }: ContactClientProps) {
  return (
    <PageTransition>
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <Section><section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10" />
        <div className="absolute inset-0">
          <div className="absolute top-32 left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-8 lg:px-16 relative z-10">
          <div className="max-w-3xl">
            <PageBreadcrumb
              items={[
                { label: locale === "vi" ? "Trang Chủ" : "Home", href: "/" },
                { label: locale === "vi" ? "Liên Hệ" : "Contact" },
              ]}
            />
            <p className="text-emerald-400 text-lg font-semibold mb-4 tracking-wide">
              {locale === "vi" ? "LIÊN HỆ" : "CONTACT US"}
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6">
              {locale === "vi"
                ? "Hãy Kết nối với Chúng tôi"
                : "Let's Connect"}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              {locale === "vi"
                ? "Bạn có câu hỏi hoặc muốn tư vấn về dự án? Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn."
                : "Have questions or want to discuss a project? Our expert team is ready to help you."}
            </p>
          </div>
        </div>
      </section></Section>

      {/* Contact Info Cards */}
      <Section><section className="py-12">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((info, idx) => (
              <div
                key={idx}
                className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-emerald-400/30 hover:bg-white/[0.08] transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  {info.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {info.title[locale]}
                </h3>
                <p className="text-white/70 text-sm whitespace-pre-line mb-4">
                  {typeof info.content === "string"
                    ? info.content
                    : info.content[locale]}
                </p>
                {info.link && info.linkText && (
                  <a
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors inline-flex items-center gap-1"
                  >
                    {info.linkText[locale]}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section></Section>

      {/* Map + Form Section */}
      <Section><section className="py-16">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Embedded Map */}
              <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.6573569529244!2d105.82!3d21.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAzJzAwLjAiTiAxMDXCsDQ5JzEyLjAiRQ!5e0!3m2!1svi!2s!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hasake Zoo Location"
                  className="grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Social Links */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-8">
                <h3 className="text-white text-xl font-bold mb-6">
                  {locale === "vi" ? "Kết nối với chúng tôi" : "Follow Us"}
                </h3>
                <div className="flex gap-4">
                  {[
                    {
                      name: "Facebook",
                      href: "https://www.facebook.com/hasakezoo",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      href: "https://www.instagram.com/hasakezoo",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      ),
                    },
                    {
                      name: "LinkedIn",
                      href: "https://www.linkedin.com/company/hasakezoo",
                      icon: (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-xl bg-white/5 hover:bg-emerald-600 border border-white/10 hover:border-emerald-600 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl p-10">
              <h3 className="text-white text-2xl font-bold mb-2">
                {locale === "vi" ? "Gửi Yêu cầu Tư vấn" : "Send an Inquiry"}
              </h3>
              <p className="text-white/60 mb-8">
                {locale === "vi"
                  ? "Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong vòng 24 giờ."
                  : "Fill in the form below and we'll get back to you within 24 hours."}
              </p>
              <ContactInquiryForm inquiryType="general" locale={locale} />
            </div>
          </div>
        </div>
      </section></Section>
    </div>
    </PageTransition>
  );
}

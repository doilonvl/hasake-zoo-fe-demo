import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { I18nProvider } from "@/components/I18nProvider";
import AdminShell from "@/components/admin/AdminShell";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = locale as Locale;

  return (
    <I18nProvider locale={resolvedLocale}>
      <AdminShell>{children}</AdminShell>
    </I18nProvider>
  );
}

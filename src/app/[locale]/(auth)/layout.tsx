import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { I18nProvider } from "@/components/I18nProvider";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type AuthLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = locale as Locale;

  return (
    <I18nProvider locale={resolvedLocale}>
      {children}
    </I18nProvider>
  );
}

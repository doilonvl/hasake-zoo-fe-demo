import type { Locale } from "@/i18n/config";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider } from "@/components/I18nProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactPopupProvider } from "@/components/shared/ContactPopup";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = locale as Locale;

  return (
    <I18nProvider locale={resolvedLocale}>
      <ContactPopupProvider>
        <Header locale={resolvedLocale} />
        <main className="min-h-screen">{children}</main>
        <Footer locale={resolvedLocale} />
        <Toaster />
      </ContactPopupProvider>
    </I18nProvider>
  );
}

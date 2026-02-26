import Providers from "@/provider";
import "./globals.css";
import type { Metadata } from "next";
import { getLocale } from "@/i18n/server";
import { Playfair_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
// import TawkTo from "@/components/TawkTo";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

const BASE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Hasake Zoo & Habitat Solution",
    template: "%s | Hasake Zoo & Habitat Solution",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: "Hasake Zoo & Habitat Solution",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className={playfair.variable}>
      <body>
        <Providers>{children}</Providers>
        {/* <TawkTo /> */}
      </body>
    </html>
  );
}

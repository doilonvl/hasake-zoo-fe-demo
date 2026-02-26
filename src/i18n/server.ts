import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { cookies, headers } from "next/headers";
import { defaultLocale, isLocale, type Locale, type Namespace } from "./config";

// Initialize i18next instance for server-side
async function initI18next(locale: Locale, namespace: Namespace) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, ns: string) =>
          import(`./locales/${language}/${ns}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: defaultLocale,
      supportedLngs: ["vi", "en"],
      defaultNS: namespace,
      fallbackNS: "common",
      ns: namespace,
      interpolation: {
        escapeValue: false,
      },
    });

  return i18nInstance;
}

// Get translation function for server components
export async function getTranslation(
  locale: Locale,
  namespace: Namespace = "common"
) {
  const i18nextInstance = await initI18next(locale, namespace);
  return {
    t: i18nextInstance.getFixedT(locale, namespace),
    i18n: i18nextInstance,
  };
}

// Get current locale from cookies or headers
export async function getLocale(): Promise<Locale> {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale");
  if (localeCookie && isLocale(localeCookie.value)) {
    return localeCookie.value;
  }

  // Fallback to header
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Check if URL starts with /en
  if (pathname.startsWith("/en")) {
    return "en";
  }

  // Default to vi
  return defaultLocale;
}

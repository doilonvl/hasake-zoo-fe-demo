import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "./i18n/config";

// Detect locale from request
function getLocaleFromRequest(request: NextRequest): Locale {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with a locale
  const pathnameLocale = locales.find(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameLocale) {
    return pathnameLocale;
  }

  // Check cookie
  const localeCookie = request.cookies.get("locale");
  if (localeCookie && isLocale(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check NEXT_LOCALE cookie (for backward compatibility)
  const nextLocaleCookie = request.cookies.get("NEXT_LOCALE");
  if (nextLocaleCookie && isLocale(nextLocaleCookie.value)) {
    return nextLocaleCookie.value;
  }

  // Check Accept-Language header (disabled by default, set localeDetection to false)
  // Uncomment if you want auto locale detection
  // const acceptLanguage = request.headers.get("accept-language");
  // if (acceptLanguage) {
  //   const preferredLocale = acceptLanguage.split(",")[0]?.split("-")[0];
  //   if (preferredLocale && isLocale(preferredLocale)) {
  //     return preferredLocale;
  //   }
  // }

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, api routes, and _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const locale = getLocaleFromRequest(request);

  // Admin route protection
  const match = pathname.match(/^\/(?:(vi|en)\/)?admin(\/|$)/);
  if (match) {
    const routeLocale = (match[1] as Locale) ?? defaultLocale;
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const url = request.nextUrl.clone();
      const loginPath =
        routeLocale === defaultLocale ? "/login" : `/${routeLocale}/login`;
      url.pathname = loginPath;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect explicit /vi URLs to clean URLs (without /vi prefix)
  // e.g., /vi/about → /about, /vi → /
  if (pathname === "/vi" || pathname.startsWith("/vi/")) {
    const cleanPath = pathname.replace(/^\/vi/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = cleanPath;
    const response = NextResponse.redirect(url);
    response.cookies.set("locale", defaultLocale, { path: "/", sameSite: "lax" });
    response.cookies.set("NEXT_LOCALE", defaultLocale, { path: "/", sameSite: "lax" });
    return response;
  }

  // If pathname doesn't have locale prefix → always Vietnamese
  // The URL is the source of truth: no prefix = Vietnamese, /en = English
  // Do NOT use cookies to redirect here, as it would prevent switching back to Vietnamese
  if (!pathnameHasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/vi${pathname}`;
    const response = NextResponse.rewrite(url);
    response.cookies.set("locale", defaultLocale, { path: "/", sameSite: "lax" });
    response.cookies.set("NEXT_LOCALE", defaultLocale, { path: "/", sameSite: "lax" });
    response.headers.set("x-pathname", pathname);
    return response;
  }

  // Continue with locale set
  const response = NextResponse.next();
  response.cookies.set("locale", locale, { path: "/", sameSite: "lax" });
  response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};

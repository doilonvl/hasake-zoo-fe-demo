/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/env";

const API_BASE = getApiBaseUrl();

// --- In-memory rate limiting ---
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60_000; // 10 minutes
const LOCKOUT_MS = 30 * 60_000; // 30 minutes

interface IpRecord {
  count: number;
  windowStart: number;
  lockedUntil: number;
}

const ipStore = new Map<string, IpRecord>();
let requestCount = 0;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function pruneExpiredEntries() {
  const now = Date.now();
  for (const [ip, record] of ipStore) {
    if (record.lockedUntil < now && record.windowStart + WINDOW_MS < now) {
      ipStore.delete(ip);
    }
  }
}

export async function POST(req: Request) {
  // Prune old entries every 1000 requests to prevent memory leak
  if (++requestCount % 1000 === 0) pruneExpiredEntries();

  const ip = getClientIp(req);
  const now = Date.now();

  // Check lockout
  const record = ipStore.get(ip);
  if (record && record.lockedUntil > now) {
    const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
    return NextResponse.json(
      {
        message: `Tài khoản bị khóa tạm thời do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ${Math.ceil(retryAfterSec / 60)} phút.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  const body = await req.json();
  const api = API_BASE.replace(/\/$/, "");

  let upstream: Response;
  try {
    upstream = await fetch(`${api}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Upstream unavailable" },
      { status: 502 }
    );
  }

  const data = await upstream.json().catch(() => null);

  if (!upstream.ok) {
    // Record failed attempt
    const existing = ipStore.get(ip);
    const windowStart =
      existing && now - existing.windowStart < WINDOW_MS
        ? existing.windowStart
        : now;
    const count = existing && now - existing.windowStart < WINDOW_MS
      ? existing.count + 1
      : 1;

    const lockedUntil = count >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0;
    ipStore.set(ip, { count, windowStart, lockedUntil });

    const remaining = MAX_ATTEMPTS - count;
    const message = (data as any)?.message ?? "Login failed";

    if (lockedUntil > 0) {
      return NextResponse.json(
        {
          message: `Đăng nhập sai quá ${MAX_ATTEMPTS} lần. Tài khoản bị khóa 30 phút.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(LOCKOUT_MS / 1000)) },
        }
      );
    }

    return NextResponse.json(
      {
        message,
        ...(remaining <= 2 && remaining > 0
          ? { warning: `Còn ${remaining} lần thử trước khi bị khóa.` }
          : {}),
      },
      { status: upstream.status || 500 }
    );
  }

  // Successful login — reset counter
  ipStore.delete(ip);

  const res = NextResponse.json(data ?? { ok: true }, {
    status: upstream.status,
  });

  // Lấy token từ payload để tự set cookie với domain hợp lệ (tránh domain sai từ upstream)
  const isProd = process.env.NODE_ENV === "production";
  let access =
    (data as any)?.access_token ??
    (data as any)?.accessToken ??
    (data as any)?.token;
  let refresh =
    (data as any)?.refresh_token ??
    (data as any)?.refreshToken ??
    (data as any)?.refresh;

  // Fallback: nếu BE chỉ set cookie (không trả token trong body), lấy từ header Set-Cookie
  if (!access || !refresh) {
    const setCookies =
      (upstream.headers as any).getSetCookie?.() ??
      upstream.headers.get("set-cookie")?.split(/,(?=[^;]+=[^;]+;)/g) ??
      [];
    for (const cookie of setCookies) {
      const match = cookie.match(/^(\w+)=([^;]+)/);
      if (!match) continue;
      const [, name, value] = match;
      if (
        !access &&
        (name === "access_token" || name === "accessToken" || name === "token")
      ) {
        access = value;
      }
      if (
        !refresh &&
        (name === "refresh_token" ||
          name === "refreshToken" ||
          name === "refresh")
      ) {
        refresh = value;
      }
    }
  }

  if (access) {
    res.cookies.set("access_token", access, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
    res.cookies.set("access_token_public", access, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });
  }

  if (refresh) {
    res.cookies.set("refresh_token", refresh, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    res.cookies.set("refresh_token_public", refresh, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return res;
}

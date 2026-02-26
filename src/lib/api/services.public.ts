import { getApiBaseUrl } from "@/lib/env";
import type { Locale } from "@/types/content";
import type { Service } from "@/types/api";

const API_BASE_URL = getApiBaseUrl();
const PUBLIC_REVALIDATE_SECONDS = 60;

type ApiError = Error & { status?: number; payload?: unknown };

async function readErrorPayload(res: Response) {
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

function normalizeList<T>(raw: unknown): { items: T[]; total: number; page: number; limit: number } {
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    const inner = (r.data && typeof r.data === "object" && !Array.isArray(r.data))
      ? r.data as Record<string, unknown>
      : r;
    if (Array.isArray(inner.items)) return { items: inner.items as T[], total: Number(inner.total ?? 0), page: Number(inner.page ?? 1), limit: Number(inner.limit ?? 10) };
    if (Array.isArray(inner.data)) return { items: inner.data as T[], total: Number(inner.total ?? 0), page: Number(inner.page ?? 1), limit: Number(inner.limit ?? 10) };
  }
  return { items: [], total: 0, page: 1, limit: 10 };
}

export interface PublicServiceListResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchPublicServices(params: {
  locale: Locale;
  page?: number;
  limit?: number;
  categoryId?: string;
  isFeatured?: boolean;
  signal?: AbortSignal;
}): Promise<PublicServiceListResponse> {
  const url = new URL(`${API_BASE_URL}/public/services`);
  url.searchParams.set("locale", params.locale);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.categoryId) url.searchParams.set("categoryId", params.categoryId);
  if (params.isFeatured !== undefined)
    url.searchParams.set("isFeatured", String(params.isFeatured));

  const res = await fetch(url.toString(), {
    signal: params.signal,
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    const error = new Error(
      `Public services request failed: ${res.status}`
    ) as ApiError;
    error.status = res.status;
    error.payload = await readErrorPayload(res);
    throw error;
  }

  return normalizeList<Service>(await res.json());
}

export async function fetchPublicServiceBySlug(
  slug: string,
  locale: Locale
): Promise<Service | null> {
  const url = new URL(`${API_BASE_URL}/public/services/${slug}`);
  url.searchParams.set("locale", locale);

  const res = await fetch(url.toString(), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const error = new Error(
      `Public service request failed: ${res.status}`
    ) as ApiError;
    error.status = res.status;
    error.payload = await readErrorPayload(res);
    throw error;
  }

  const raw = await res.json();
  if (raw && typeof raw === "object" && "data" in raw) return (raw as { data: Service }).data;
  return raw as Service;
}

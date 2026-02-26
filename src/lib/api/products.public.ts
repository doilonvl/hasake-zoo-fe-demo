import { getApiBaseUrl } from "@/lib/env";
import type { Locale } from "@/types/content";
import type { Product } from "@/types/api";

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

export interface PublicProductListResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchPublicProducts(params: {
  locale: Locale;
  page?: number;
  limit?: number;
  category?: string;
  isFeatured?: boolean;
  signal?: AbortSignal;
}) {
  const url = new URL(`${API_BASE_URL}/public/products`);
  url.searchParams.set("locale", params.locale);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.category) url.searchParams.set("category", params.category);
  if (params.isFeatured !== undefined)
    url.searchParams.set("isFeatured", String(params.isFeatured));

  const res = await fetch(url.toString(), {
    signal: params.signal,
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    const error = new Error(
      `Public products request failed: ${res.status}`
    ) as ApiError;
    error.status = res.status;
    error.payload = await readErrorPayload(res);
    throw error;
  }

  return (await res.json()) as PublicProductListResponse;
}

export async function fetchPublicProductBySlug(
  slug: string,
  locale: Locale
): Promise<Product | null> {
  const url = new URL(`${API_BASE_URL}/public/products/${slug}`);
  url.searchParams.set("locale", locale);

  const res = await fetch(url.toString(), {
    next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const error = new Error(
      `Public product request failed: ${res.status}`
    ) as ApiError;
    error.status = res.status;
    error.payload = await readErrorPayload(res);
    throw error;
  }

  return (await res.json()) as Product;
}

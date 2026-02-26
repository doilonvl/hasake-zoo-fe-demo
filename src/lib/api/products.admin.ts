import { fetchAdminJson } from "./adminFetch";
import type { Product } from "@/types/api";

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchAdminProducts(params: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
  category?: string;
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  const path = query.toString() ? `/products?${query}` : "/products";
  return fetchAdminJson<ProductListResponse>(path, { signal: params.signal });
}

export async function fetchAdminProductById(id: string) {
  const res = await fetchAdminJson<unknown>(`/products/${id}`);
  return unwrapData<Product>(res);
}

export async function createAdminProduct(payload: Record<string, unknown>) {
  const res = await fetchAdminJson<unknown>("/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData<Product>(res);
}

export async function updateAdminProduct(id: string, patch: Record<string, unknown>) {
  const res = await fetchAdminJson<unknown>(`/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return unwrapData<Product>(res);
}

export async function deleteAdminProduct(id: string) {
  return fetchAdminJson<{ success?: boolean }>(`/products/${id}`, { method: "DELETE" });
}

export async function publishAdminProduct(id: string) {
  const res = await fetchAdminJson<unknown>(`/products/${id}/publish`, { method: "PATCH" });
  return unwrapData<Product>(res);
}

export async function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetchAdminJson<{ url: string; publicId?: string }>("/upload/single?folder=products", {
    method: "POST",
    body: formData,
  });
}

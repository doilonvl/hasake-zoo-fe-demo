import { fetchAdminJson } from "./adminFetch";
import type { Service, ServiceCategory } from "@/types/api";

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
}

interface ApiResponse<T> {
  data: T;
}

export interface ServiceListResponse {
  items: Service[];
  total: number;
  page: number;
  limit: number;
}

export interface ServiceCategoryListResponse {
  items: ServiceCategory[];
  total: number;
  page: number;
  limit: number;
}

// ============ Services ============

export async function fetchAdminServices(params: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
  categoryId?: string;
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  const path = query.toString() ? `/services?${query}` : "/services";
  return fetchAdminJson<ServiceListResponse>(path, { signal: params.signal });
}

export async function fetchAdminServiceById(id: string) {
  const res = await fetchAdminJson<unknown>(`/services/${id}`);
  return unwrapData<Service>(res);
}

export async function createAdminService(payload: Record<string, unknown>) {
  const res = await fetchAdminJson<unknown>("/services", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData<Service>(res);
}

export async function updateAdminService(
  id: string,
  patch: Record<string, unknown>,
) {
  const res = await fetchAdminJson<unknown>(`/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return unwrapData<Service>(res);
}

export async function deleteAdminService(id: string) {
  return fetchAdminJson<{ success?: boolean }>(`/services/${id}`, {
    method: "DELETE",
  });
}

export async function publishAdminService(id: string) {
  const res = await fetchAdminJson<unknown>(`/services/${id}/publish`, {
    method: "PATCH",
  });
  return unwrapData<Service>(res);
}

export async function unpublishAdminService(id: string) {
  const res = await fetchAdminJson<unknown>(`/services/${id}/unpublish`, {
    method: "PATCH",
  });
  return unwrapData<Service>(res);
}

// ============ Service Categories ============

export async function fetchAdminServiceCategories(params: {
  page?: number;
  limit?: number;
  status?: string;
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all")
    query.set("status", params.status);
  const path = query.toString()
    ? `/service-categories?${query}`
    : "/service-categories";
  return fetchAdminJson<ServiceCategoryListResponse>(path, {
    signal: params.signal,
  });
}

export async function fetchAdminServiceCategoryById(id: string) {
  const res = await fetchAdminJson<unknown>(`/service-categories/${id}`);
  return unwrapData<ServiceCategory>(res);
}

export async function createAdminServiceCategory(
  payload: Record<string, unknown>,
) {
  return fetchAdminJson<ApiResponse<ServiceCategory>>("/service-categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateAdminServiceCategory(
  id: string,
  patch: Record<string, unknown>,
) {
  return fetchAdminJson<ApiResponse<ServiceCategory>>(
    `/service-categories/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    },
  );
}

export async function publishAdminServiceCategory(id: string) {
  const res = await fetchAdminJson<unknown>(
    `/service-categories/${id}/publish`,
    { method: "PATCH" },
  );
  return unwrapData<ServiceCategory>(res);
}

export async function deleteAdminServiceCategory(id: string) {
  return fetchAdminJson<{ success?: boolean }>(`/service-categories/${id}`, {
    method: "DELETE",
  });
}

// ============ Image Upload ============

export async function uploadServiceImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetchAdminJson<{ url: string; publicId?: string }>(
    "/upload/single?folder=services",
    {
      method: "POST",
      body: formData,
    },
  );
}

import { fetchAdminJson } from "./adminFetch";
import type { Project } from "@/types/api";

function unwrapData<T>(res: unknown): T {
  if (res && typeof res === "object" && "data" in (res as object)) {
    return (res as { data: T }).data;
  }
  return res as T;
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchAdminProjects(params: {
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
  const path = query.toString() ? `/projects?${query}` : "/projects";
  return fetchAdminJson<ProjectListResponse>(path, { signal: params.signal });
}

export async function fetchAdminProjectById(id: string) {
  const res = await fetchAdminJson<unknown>(`/projects/${id}`);
  return unwrapData<Project>(res);
}

export async function createAdminProject(payload: Record<string, unknown>) {
  const res = await fetchAdminJson<unknown>("/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return unwrapData<Project>(res);
}

export async function updateAdminProject(id: string, patch: Record<string, unknown>) {
  const res = await fetchAdminJson<unknown>(`/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return unwrapData<Project>(res);
}

export async function deleteAdminProject(id: string) {
  return fetchAdminJson<{ success?: boolean }>(`/projects/${id}`, { method: "DELETE" });
}

export async function publishAdminProject(id: string) {
  const res = await fetchAdminJson<unknown>(`/projects/${id}/publish`, { method: "PATCH" });
  return unwrapData<Project>(res);
}

export async function uploadProjectImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetchAdminJson<{ url: string; publicId?: string }>("/upload/single?folder=projects", {
    method: "POST",
    body: formData,
  });
}

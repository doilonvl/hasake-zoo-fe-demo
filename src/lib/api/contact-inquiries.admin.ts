import { fetchAdminJson } from "./adminFetch";
import type { ContactInquiry, PaginatedResponse, ApiResponse } from "@/types/api";

export async function fetchAdminContactInquiries(params: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
  signal?: AbortSignal;
}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  const path = query.toString() ? `/contact-inquiries?${query}` : "/contact-inquiries";
  return fetchAdminJson<PaginatedResponse<ContactInquiry>>(path, { signal: params.signal });
}

export async function fetchAdminContactInquiryById(id: string) {
  return fetchAdminJson<ApiResponse<ContactInquiry>>(`/contact-inquiries/${id}`);
}

export async function updateContactInquiryStatus(id: string, status: string) {
  return fetchAdminJson<ApiResponse<ContactInquiry>>(`/contact-inquiries/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export async function addContactInquiryNote(id: string, content: string) {
  return fetchAdminJson<ApiResponse<ContactInquiry>>(`/contact-inquiries/${id}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function deleteAdminContactInquiry(id: string) {
  return fetchAdminJson<{ success?: boolean }>(`/contact-inquiries/${id}`, { method: "DELETE" });
}

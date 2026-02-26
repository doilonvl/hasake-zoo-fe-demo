import { fetchAdminJson } from "./adminFetch";
import type { PaginatedResponse } from "@/types/api";
import type { ReservationRequest } from "@/types/admin";

export async function fetchAdminReservationRequests(params: {
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
  const path = query.toString() ? `/reservation-requests?${query}` : "/reservation-requests";
  return fetchAdminJson<PaginatedResponse<ReservationRequest>>(path, { signal: params.signal });
}

export async function updateReservationRequestStatus(id: string, status: string) {
  return fetchAdminJson<{ success: boolean; data: ReservationRequest }>(
    `/reservation-requests/${id}/status`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }
  );
}

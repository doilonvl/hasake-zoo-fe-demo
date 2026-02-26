"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { RefreshCcw, Search } from "lucide-react";
import type { AdminApiError } from "@/lib/api/adminFetch";
import type { ReservationRequest } from "@/types/admin";
import {
  fetchAdminReservationRequests,
  updateReservationRequestStatus,
} from "@/lib/api/reservation-requests.admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LIMIT = 15;

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
};

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "Request failed";
  const err = error as AdminApiError;
  if (err.payload && typeof err.payload === "string") return err.payload;
  if (err.payload && typeof err.payload === "object") {
    const p = err.payload as Record<string, unknown>;
    if (typeof p.message === "string") return p.message;
    if (typeof p.error === "string") return p.error;
  }
  return err.message || "Request failed";
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB");
}

export default function AdminReservationRequestsPage() {
  const params = useParams();
  void params;

  const [items, setItems] = useState<ReservationRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchAdminReservationRequests({
      page,
      limit: LIMIT,
      q: query || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      signal: controller.signal,
    })
      .then((data) => {
        setItems(data.data || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, query, statusFilter, refreshSeed]);

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateReservationRequestStatus(id, newStatus);
      toast.success(`Status changed to ${newStatus}`);
      setRefreshSeed((v) => v + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Reservation Requests</h1>
          <p className="text-sm text-muted-foreground">Manage incoming booking requests.</p>
        </div>
        <Button variant="outline" onClick={() => setRefreshSeed((v) => v + 1)} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input
              value={pendingQuery}
              onChange={(e) => setPendingQuery(e.target.value)}
              placeholder="Search name, email, phone..."
              className="min-w-[220px] flex-1"
            />
            <Button variant="outline" onClick={() => { setPage(1); setQuery(pendingQuery.trim()); }}>
              <Search className="mr-2 h-4 w-4" />Search
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => { setPage(1); setStatusFilter(e.target.value); }}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Date / Time</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id} className="align-top">
                <TableCell>
                  <p className="font-medium">{item.fullName}</p>
                  {item.note ? <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{item.note}</p> : null}
                </TableCell>
                <TableCell>
                  <a className="block text-sm hover:underline" href={`tel:${item.phoneNumber}`}>{item.phoneNumber}</a>
                  <a className="block text-xs text-muted-foreground hover:underline" href={`mailto:${item.email}`}>{item.email}</a>
                  {item.source ? <p className="mt-0.5 text-xs text-muted-foreground">Source: {item.source}</p> : null}
                </TableCell>
                <TableCell>
                  <p className="font-medium">{formatDate(item.reservationDate)}</p>
                  <p className="text-xs text-muted-foreground">{item.reservationTime}</p>
                  <p className="text-xs text-muted-foreground">Created: {formatDate(item.createdAt)}</p>
                </TableCell>
                <TableCell className="text-center">{item.guestCount}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[item.status] || "bg-muted"}`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {loading ? <div className="border-t px-4 py-3 text-sm text-muted-foreground">Loading...</div> : null}
        {error ? <div className="border-t px-4 py-3 text-sm text-destructive">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="border-t px-4 py-6 text-sm text-muted-foreground">No reservation requests found.</div> : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <span className="text-muted-foreground">Page {page} / {pageCount}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page <= 1 || loading}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((v) => Math.min(pageCount, v + 1))} disabled={page >= pageCount || loading}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

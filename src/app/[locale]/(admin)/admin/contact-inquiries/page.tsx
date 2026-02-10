"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { RefreshCcw, Search, ChevronDown, ChevronUp, Send } from "lucide-react";
import type { Locale } from "@/types/content";
import type { ContactInquiry, InquiryStatus, InquiryType } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import {
  fetchAdminContactInquiries,
  updateContactInquiryStatus,
  addContactInquiryNote,
  deleteAdminContactInquiry,
} from "@/lib/api/contact-inquiries.admin";
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

const STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  read: "bg-slate-100 text-slate-700 border-slate-200",
  replied: "bg-emerald-100 text-emerald-800 border-emerald-200",
  archived: "bg-neutral-100 text-neutral-600 border-neutral-200",
};

const TYPE_LABELS: Record<InquiryType, string> = {
  general: "General",
  service: "Service",
  product: "Product",
  project: "Project",
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

function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB") + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Expandable Detail Row ─── */

function InquiryDetail({
  inquiry,
  onStatusChange,
  onDelete,
}: {
  inquiry: ContactInquiry;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [noteText, setNoteText] = useState("");
  const [sending, setSending] = useState(false);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setSending(true);
    try {
      await addContactInquiryNote(inquiry._id, noteText.trim());
      toast.success("Note added");
      setNoteText("");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="text-sm font-medium">{inquiry.name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Email</p>
          <a href={`mailto:${inquiry.email}`} className="text-sm text-blue-600 hover:underline">{inquiry.email}</a>
        </div>
        {inquiry.phone ? (
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <a href={`tel:${inquiry.phone}`} className="text-sm">{inquiry.phone}</a>
          </div>
        ) : null}
        {inquiry.company ? (
          <div>
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="text-sm">{inquiry.company}</p>
          </div>
        ) : null}
        <div>
          <p className="text-xs text-muted-foreground">Country</p>
          <p className="text-sm">{inquiry.country}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="text-sm">{TYPE_LABELS[inquiry.inquiryType] || inquiry.inquiryType}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">Subject</p>
        <p className="text-sm font-medium">{inquiry.subject}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Message</p>
        <p className="whitespace-pre-wrap text-sm">{inquiry.message}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Change status:</span>
        {(["new", "read", "replied", "archived"] as InquiryStatus[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={inquiry.status === s ? "default" : "outline"}
            onClick={() => onStatusChange(inquiry._id, s)}
          >
            {s}
          </Button>
        ))}
        <div className="flex-1" />
        <Button size="sm" variant="destructive" onClick={() => onDelete(inquiry._id)}>
          Delete
        </Button>
      </div>

      {inquiry.notes && inquiry.notes.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">Notes</p>
          {inquiry.notes.map((note, idx) => (
            <div key={idx} className="rounded border bg-white px-3 py-2 text-sm">
              <p>{note.content}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {note.createdBy} &middot; {formatDate(note.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Input
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note..."
          className="flex-1"
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddNote(); } }}
        />
        <Button size="sm" onClick={handleAddNote} disabled={sending || !noteText.trim()}>
          <Send className="mr-1 h-3 w-3" />{sending ? "..." : "Add"}
        </Button>
      </div>
    </div>
  );
}

/* ─── List Page ─── */

export default function AdminContactInquiriesPage() {
  const params = useParams();
  const locale = (params?.locale === "en" ? "en" : "vi") as Locale;
  void locale;

  const [items, setItems] = useState<ContactInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchAdminContactInquiries({
      page, limit: LIMIT,
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

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await updateContactInquiryStatus(id, newStatus);
      toast.success(`Status changed to ${newStatus}`);
      setRefreshSeed((v) => v + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await deleteAdminContactInquiry(id);
      toast.success("Inquiry deleted");
      setRefreshSeed((v) => v + 1);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Contact Inquiries</h1>
          <p className="text-sm text-muted-foreground">Review and respond to customer messages.</p>
        </div>
        <Button variant="outline" onClick={() => setRefreshSeed((v) => v + 1)} disabled={loading}>
          <RefreshCcw className="mr-2 h-4 w-4" />Refresh
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <Input value={pendingQuery} onChange={(e) => setPendingQuery(e.target.value)} placeholder="Search name, email, subject..." className="min-w-[220px] flex-1" />
            <Button variant="outline" onClick={() => { setPage(1); setQuery(pendingQuery.trim()); }}>
              <Search className="mr-2 h-4 w-4" />Search
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status</span>
            <select value={statusFilter} onChange={(e) => { setPage(1); setStatusFilter(e.target.value as "all" | InquiryStatus); }} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <>
                <TableRow
                  key={item._id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpandedId(expandedId === item._id ? null : item._id)}
                >
                  <TableCell>
                    {expandedId === item._id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.email}</div>
                  </TableCell>
                  <TableCell className="max-w-[240px] truncate text-sm">{item.subject}</TableCell>
                  <TableCell className="text-xs">{TYPE_LABELS[item.inquiryType] || item.inquiryType}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[item.status]}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</TableCell>
                </TableRow>
                {expandedId === item._id ? (
                  <TableRow key={`${item._id}-detail`}>
                    <TableCell colSpan={6} className="p-3">
                      <InquiryDetail
                        inquiry={item}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ) : null}
              </>
            ))}
          </TableBody>
        </Table>

        {loading ? <div className="border-t px-4 py-3 text-sm text-muted-foreground">Loading...</div> : null}
        {error ? <div className="border-t px-4 py-3 text-sm text-destructive">{error}</div> : null}
        {!loading && !error && items.length === 0 ? <div className="border-t px-4 py-6 text-sm text-muted-foreground">No inquiries found.</div> : null}

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

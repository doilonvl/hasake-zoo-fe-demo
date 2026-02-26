"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, RefreshCcw, Search } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Locale } from "@/types/content";
import type { Product, PublishStatus } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import { fetchAdminProducts } from "@/lib/api/products.admin";
import { resolveLocalizedString } from "@/lib/i18n";
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
import ProductEditor from "./ProductEditor";

const LIMIT = 10;

const STATUS_LABELS: Record<PublishStatus, string> = {
  draft: "Draft",
  published: "Published",
};
const STATUS_STYLES: Record<PublishStatus, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  published: "bg-emerald-100 text-emerald-800 border-emerald-200",
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

function formatDate(value: string | null | undefined, locale: Locale) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
    }).format(d);
  } catch { return ""; }
}

export default function AdminProductsPage() {
  const params = useParams();
  const locale = (params?.locale === "en" ? "en" : "vi") as Locale;

  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [status, setStatus] = useState<"all" | PublishStatus>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [activeProductId, setActiveProductId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchAdminProducts({
      page, limit: LIMIT,
      q: query || undefined,
      status: status === "all" ? undefined : status,
      signal: controller.signal,
    })
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, query, status, refreshSeed]);

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  const rows = useMemo(
    () =>
      items.map((item) => ({
        item,
        name: resolveLocalizedString(item.name_i18n, locale, "Untitled"),
        sku: item.sku || "-",
        category: item.category || "-",
        statusKey: (item.status || "draft") as PublishStatus,
        updatedAt: formatDate(item.updatedAt || item.createdAt, locale),
      })),
    [items, locale]
  );

  return (
    <Dialog.Root
      open={editorOpen}
      onOpenChange={(open) => {
        setEditorOpen(open);
        if (!open) { setActiveProductId(undefined); setRefreshSeed((v) => v + 1); }
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage product catalog.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setRefreshSeed((v) => v + 1)} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />Refresh
            </Button>
            <Button onClick={() => { setEditorMode("create"); setActiveProductId(undefined); setEditorOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />New product
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <Input value={pendingQuery} onChange={(e) => setPendingQuery(e.target.value)} placeholder="Search name, SKU..." className="min-w-[220px] flex-1" />
              <Button variant="outline" onClick={() => { setPage(1); setQuery(pendingQuery.trim()); }}>
                <Search className="mr-2 h-4 w-4" />Search
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status</span>
              <select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as "all" | PublishStatus); }} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option value="all">All</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, name, sku, category, statusKey, updatedAt }) => (
                <TableRow key={item._id}>
                  <TableCell className="max-w-[280px] truncate font-medium">{name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{sku}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{category}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[statusKey]}`}>
                      {STATUS_LABELS[statusKey]}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{updatedAt || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => { setEditorMode("edit"); setActiveProductId(item._id); setEditorOpen(true); }}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading ? <div className="border-t px-4 py-3 text-sm text-muted-foreground">Loading...</div> : null}
          {error ? <div className="border-t px-4 py-3 text-sm text-destructive">{error}</div> : null}
          {!loading && !error && items.length === 0 ? <div className="border-t px-4 py-6 text-sm text-muted-foreground">No products found.</div> : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">Page {page} / {pageCount}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((v) => Math.max(1, v - 1))} disabled={page <= 1 || loading}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setPage((v) => Math.min(pageCount, v + 1))} disabled={page >= pageCount || loading}>Next</Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(96vw,1200px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white px-5 py-3">
            <Dialog.Title className="text-lg font-semibold text-neutral-900">
              {editorMode === "create" ? "New product" : "Edit product"}
            </Dialog.Title>
            <Dialog.Close asChild><Button variant="outline" size="sm">Close</Button></Dialog.Close>
          </div>
          <div className="px-5 py-4">
            <ProductEditor mode={editorMode} productId={activeProductId} embedded onCreated={() => setRefreshSeed((v) => v + 1)} onCancel={() => setEditorOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

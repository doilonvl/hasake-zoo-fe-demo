"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, RefreshCcw, Search } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import type { Locale } from "@/types/content";
import type { ServiceCategory, PublishStatus } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import {
  fetchAdminServiceCategories,
  fetchAdminServiceCategoryById,
  createAdminServiceCategory,
  updateAdminServiceCategory,
  publishAdminServiceCategory,
  deleteAdminServiceCategory,
} from "@/lib/api/services.admin";
import { resolveLocalizedString } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LIMIT = 20;

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

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0110\u0111]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ─── Category Editor (inline) ─── */

function CategoryEditor({
  mode,
  categoryId,
  onDone,
  onCancel,
}: {
  mode: "create" | "edit";
  categoryId?: string;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [key, setKey] = useState("");
  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugVi, setSlugVi] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugViSynced, setSlugViSynced] = useState(true);
  const [slugEnSynced, setSlugEnSynced] = useState(true);
  const [descVi, setDescVi] = useState("");
  const [descEn, setDescEn] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<PublishStatus>("draft");

  const hydrate = useCallback((c: ServiceCategory) => {
    setKey(c.key || "");
    setNameVi(c.name_i18n?.vi || "");
    setNameEn(c.name_i18n?.en || "");
    setSlugVi(c.slug_i18n?.vi || "");
    setSlugEn(c.slug_i18n?.en || "");
    setSlugViSynced(true);
    setSlugEnSynced(true);
    setDescVi(c.description_i18n?.vi || "");
    setDescEn(c.description_i18n?.en || "");
    setIcon(c.icon || "");
    setSortOrder(c.sortOrder ?? 0);
    setIsFeatured(!!c.isFeatured);
    setStatus(c.status || "draft");
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !categoryId) return;
    let active = true;
    setLoading(true);
    fetchAdminServiceCategoryById(categoryId)
      .then((res) => active && hydrate(res))
      .catch((err) => active && toast.error(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [mode, categoryId, hydrate]);

  useEffect(() => {
    if (!slugViSynced || !nameVi) return;
    setSlugVi(slugify(nameVi));
  }, [nameVi, slugViSynced]);

  useEffect(() => {
    if (!slugEnSynced || !nameEn) return;
    setSlugEn(slugify(nameEn));
  }, [nameEn, slugEnSynced]);

  const handleSave = async () => {
    if (!nameVi.trim() && !nameEn.trim()) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        key: key.trim() || slugify(nameVi || nameEn),
        name_i18n: { vi: nameVi.trim(), en: nameEn.trim() },
        slug_i18n: { vi: slugVi.trim(), en: slugEn.trim() },
        sortOrder,
        isFeatured,
      };
      if (descVi.trim() || descEn.trim()) {
        payload.description_i18n = { vi: descVi.trim(), en: descEn.trim() };
      }
      if (icon.trim()) payload.icon = icon.trim();

      if (mode === "create") {
        await createAdminServiceCategory(payload);
        toast.success("Category created");
      } else if (categoryId) {
        await updateAdminServiceCategory(categoryId, payload);
        toast.success("Category updated");
      }
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!categoryId) return;
    try {
      const res = await publishAdminServiceCategory(categoryId);
      hydrate(res);
      toast.success("Category published");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!categoryId) return;
    if (!confirm("Delete this category?")) return;
    try {
      await deleteAdminServiceCategory(categoryId);
      toast.success("Category deleted");
      onDone();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-white/95 py-2 backdrop-blur">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status === "published" ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
          {status}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          {mode === "edit" && categoryId ? (
            <>
              {status !== "published" && (
                <Button variant="outline" onClick={handlePublish}>Publish</Button>
              )}
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </>
          ) : null}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Key</Label>
          <Input value={key} onChange={(e) => setKey(e.target.value)} placeholder="habitat-design" />
        </div>
        <div className="grid gap-1.5">
          <Label>Icon (CSS class or emoji)</Label>
          <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🏗️" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Name (VI)</Label>
          <Input value={nameVi} onChange={(e) => setNameVi(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Name (EN)</Label>
          <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Slug (VI)</Label>
          <Input value={slugVi} onChange={(e) => { setSlugVi(e.target.value); setSlugViSynced(false); }} />
        </div>
        <div className="grid gap-1.5">
          <Label>Slug (EN)</Label>
          <Input value={slugEn} onChange={(e) => { setSlugEn(e.target.value); setSlugEnSynced(false); }} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label>Description (VI)</Label>
          <textarea value={descVi} onChange={(e) => setDescVi(e.target.value)} className="min-h-16 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
        <div className="grid gap-1.5">
          <Label>Description (EN)</Label>
          <textarea value={descEn} onChange={(e) => setDescEn(e.target.value)} className="min-h-16 w-full rounded-md border px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          <span className="text-sm">Featured</span>
        </div>
        <div className="grid gap-1.5">
          <Label>Sort order</Label>
          <Input type="number" className="w-24" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value || 0))} />
        </div>
      </div>
    </div>
  );
}

/* ─── List Page ─── */

export default function AdminCategoriesPage() {
  const params = useParams();
  const locale = (params?.locale === "en" ? "en" : "vi") as Locale;

  const [items, setItems] = useState<ServiceCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshSeed, setRefreshSeed] = useState(0);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [activeCatId, setActiveCatId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetchAdminServiceCategories({ page, limit: LIMIT, signal: controller.signal })
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
      })
      .catch((err) => {
        if ((err as Error).name === "AbortError") return;
        setError(getErrorMessage(err));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [page, refreshSeed]);

  const pageCount = Math.max(1, Math.ceil(total / LIMIT));

  const rows = useMemo(
    () =>
      items.map((item) => ({
        item,
        name: resolveLocalizedString(item.name_i18n, locale, "Untitled"),
        statusKey: item.status || ("draft" as PublishStatus),
      })),
    [items, locale]
  );

  return (
    <Dialog.Root
      open={editorOpen}
      onOpenChange={(open) => {
        setEditorOpen(open);
        if (!open) {
          setActiveCatId(undefined);
          setRefreshSeed((v) => v + 1);
        }
      }}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Service Categories</h1>
            <p className="text-sm text-muted-foreground">Organize services into categories.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setRefreshSeed((v) => v + 1)} disabled={loading}>
              <RefreshCcw className="mr-2 h-4 w-4" />Refresh
            </Button>
            <Button onClick={() => { setEditorMode("create"); setActiveCatId(undefined); setEditorOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />New category
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, name, statusKey }) => (
                <TableRow key={item._id}>
                  <TableCell className="font-medium">{name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.key}</TableCell>
                  <TableCell>{item.icon || "-"}</TableCell>
                  <TableCell className="text-xs">{item.sortOrder}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[statusKey]}`}>
                      {statusKey}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => { setEditorMode("edit"); setActiveCatId(item._id); setEditorOpen(true); }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading ? <div className="border-t px-4 py-3 text-sm text-muted-foreground">Loading...</div> : null}
          {error ? <div className="border-t px-4 py-3 text-sm text-destructive">{error}</div> : null}
          {!loading && !error && items.length === 0 ? <div className="border-t px-4 py-6 text-sm text-muted-foreground">No categories found.</div> : null}

          <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(96vw,700px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white px-5 py-3">
            <Dialog.Title className="text-lg font-semibold text-neutral-900">
              {editorMode === "create" ? "New category" : "Edit category"}
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">Close</Button>
            </Dialog.Close>
          </div>
          <div className="px-5 py-4">
            <CategoryEditor
              mode={editorMode}
              categoryId={activeCatId}
              onDone={() => { setEditorOpen(false); setRefreshSeed((v) => v + 1); }}
              onCancel={() => setEditorOpen(false)}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

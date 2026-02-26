"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { Locale } from "@/types/content";
import type { Service, ServiceCategory, PublishStatus } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import {
  fetchAdminServiceById,
  createAdminService,
  updateAdminService,
  deleteAdminService,
  publishAdminService,
  unpublishAdminService,
  fetchAdminServiceCategories,
  uploadServiceImage,
} from "@/lib/api/services.admin";
import LexicalEditor from "../blogs/LexicalEditor";
import LexicalContentRenderer, {
  type LexicalDoc,
} from "@/components/blog/LexicalContentRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

const EMPTY_LEXICAL_DOC: LexicalDoc = {
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: null,
    children: [
      {
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: null,
        children: [],
      },
    ],
  },
};

type ServiceEditorProps = {
  mode: "create" | "edit";
  serviceId?: string;
  embedded?: boolean;
  onCreated?: () => void;
  onCancel?: () => void;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u0110\u0111]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

export default function ServiceEditor({
  mode,
  serviceId,
  embedded = false,
  onCreated,
  onCancel,
}: ServiceEditorProps) {
  const params = useParams();
  void params;

  const isHydratingRef = useRef(false);

  const [activeMode, setActiveMode] = useState(mode);
  const [activeId, setActiveId] = useState(serviceId || "");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugVi, setSlugVi] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugViSynced, setSlugViSynced] = useState(true);
  const [slugEnSynced, setSlugEnSynced] = useState(true);
  const [excerptVi, setExcerptVi] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<ServiceCategory[]>([]);

  const [contentViDoc, setContentViDoc] = useState<LexicalDoc | null>(null);
  const [contentEnDoc, setContentEnDoc] = useState<LexicalDoc | null>(null);
  const [editorVersion, setEditorVersion] = useState(0);

  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [coverAltVi, setCoverAltVi] = useState("");
  const [coverAltEn, setCoverAltEn] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<PublishStatus>("draft");

  const [seoTitleVi, setSeoTitleVi] = useState("");
  const [seoTitleEn, setSeoTitleEn] = useState("");
  const [seoDescVi, setSeoDescVi] = useState("");
  const [seoDescEn, setSeoDescEn] = useState("");

  useEffect(() => {
    fetchAdminServiceCategories({ page: 1, limit: 100 })
      .then((res) => setCategories(res.items || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isHydratingRef.current || !slugViSynced || !nameVi) return;
    setSlugVi(slugify(nameVi));
  }, [nameVi, slugViSynced]);

  useEffect(() => {
    if (isHydratingRef.current || !slugEnSynced || !nameEn) return;
    setSlugEn(slugify(nameEn));
  }, [nameEn, slugEnSynced]);

  const hydrate = useCallback((s: Service) => {
    isHydratingRef.current = true;
    setSlugViSynced(true);
    setSlugEnSynced(true);
    setNameVi(s.name_i18n?.vi || "");
    setNameEn(s.name_i18n?.en || "");
    setSlugVi(s.slug_i18n?.vi || s.slug || "");
    setSlugEn(s.slug_i18n?.en || s.slug || "");
    setExcerptVi(s.excerpt_i18n?.vi || "");
    setExcerptEn(s.excerpt_i18n?.en || "");
    setCategoryId(s.categoryId || "");
    setCoverUrl(s.coverImage?.url || "");
    setCoverPublicId(s.coverImage?.publicId || "");
    setCoverAltVi(s.coverImage?.alt_i18n?.vi || "");
    setCoverAltEn(s.coverImage?.alt_i18n?.en || "");
    setIsFeatured(!!s.isFeatured);
    setSortOrder(s.sortOrder ?? 0);
    setStatus(s.status || "draft");
    setSeoTitleVi(s.seoTitle_i18n?.vi || "");
    setSeoTitleEn(s.seoTitle_i18n?.en || "");
    setSeoDescVi(s.seoDescription_i18n?.vi || "");
    setSeoDescEn(s.seoDescription_i18n?.en || "");
    // Load Lexical content
    setContentViDoc((s.content_i18n as Record<string, LexicalDoc | null>)?.vi ?? null);
    setContentEnDoc((s.content_i18n as Record<string, LexicalDoc | null>)?.en ?? null);
    setEditorVersion((v) => v + 1);
    setTimeout(() => { isHydratingRef.current = false; }, 0);
  }, []);

  useEffect(() => {
    if (activeMode !== "edit" || !activeId) return;
    let active = true;
    setLoading(true);
    fetchAdminServiceById(activeId)
      .then((service) => {
        if (!active) return;
        hydrate(service);
      })
      .catch((err) => {
        if (!active) return;
        toast.error(getErrorMessage(err));
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [activeId, activeMode, hydrate]);

  const buildPayload = useCallback(() => {
    const payload: Record<string, unknown> = {
      name_i18n: { vi: nameVi.trim(), en: nameEn.trim() },
      slug_i18n: { vi: slugVi.trim(), en: slugEn.trim() },
      slug: slugVi.trim() || slugEn.trim(),
      isFeatured,
      sortOrder,
      content_i18n: {
        vi: contentViDoc || EMPTY_LEXICAL_DOC,
        en: contentEnDoc || EMPTY_LEXICAL_DOC,
      },
    };
    if (categoryId) payload.categoryId = categoryId;
    if (excerptVi.trim() || excerptEn.trim()) {
      payload.excerpt_i18n = { vi: excerptVi.trim(), en: excerptEn.trim() };
    }
    if (coverUrl.trim()) {
      payload.coverImage = {
        url: coverUrl.trim(),
        publicId: coverPublicId.trim() || undefined,
        ...(coverAltVi.trim() || coverAltEn.trim()
          ? { alt_i18n: { vi: coverAltVi.trim(), en: coverAltEn.trim() } }
          : {}),
      };
    }
    if (seoTitleVi.trim() || seoTitleEn.trim()) {
      payload.seoTitle_i18n = { vi: seoTitleVi.trim(), en: seoTitleEn.trim() };
    }
    if (seoDescVi.trim() || seoDescEn.trim()) {
      payload.seoDescription_i18n = { vi: seoDescVi.trim(), en: seoDescEn.trim() };
    }
    return payload;
  }, [
    nameVi, nameEn, slugVi, slugEn, isFeatured, sortOrder,
    contentViDoc, contentEnDoc, categoryId, excerptVi, excerptEn,
    coverUrl, coverPublicId, coverAltVi, coverAltEn, seoTitleVi, seoTitleEn, seoDescVi, seoDescEn,
  ]);

  const handleSave = async () => {
    if (!nameVi.trim() && !nameEn.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (coverUploading) {
      toast.error("Please wait for image upload.");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (activeMode === "create" && !activeId) {
        const service = await createAdminService(payload);
        toast.success("Service created");
        setActiveId(service._id);
        setActiveMode("edit");
        hydrate(service);
        onCreated?.();
      } else if (activeId) {
        const service = await updateAdminService(activeId, payload);
        hydrate(service);
        toast.success("Service updated");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!activeId) return;
    try {
      const service = await publishAdminService(activeId);
      hydrate(service);
      toast.success("Service published");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnpublish = async () => {
    if (!activeId) return;
    try {
      const service = await unpublishAdminService(activeId);
      hydrate(service);
      toast.success("Service unpublished");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!activeId) return;
    if (!confirm("Delete this service?")) return;
    try {
      await deleteAdminService(activeId);
      toast.success("Service deleted");
      onCancel?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    setCoverUploading(true);
    try {
      const res = await uploadServiceImage(file);
      setCoverUrl(res.url);
      setCoverPublicId(res.publicId || "");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCoverUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previewViLocale = "vi" as Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previewEnLocale = "en" as Locale;

  if (loading) {
    return <Card className="p-6">Loading...</Card>;
  }

  const actionButtons = (
    <>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      {activeMode === "edit" && activeId ? (
        <>
          {status === "published"
            ? <Button variant="outline" onClick={handleUnpublish}>Unpublish</Button>
            : <Button variant="outline" onClick={handlePublish}>Publish</Button>
          }
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </>
      ) : null}
      <Button onClick={handleSave} disabled={saving || coverUploading}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </>
  );

  return (
    <div>
      {embedded ? (
        <div className="sticky top-0 z-10 flex items-center justify-end gap-2 border-b border-slate-200 bg-white/95 py-2 backdrop-blur">
          {actionButtons}
        </div>
      ) : null}

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* ── Left column: Name, Content, Preview ── */}
        <div className="grid gap-6 lg:col-span-2">
          {/* Name & Excerpt */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Name & Excerpt</Label>
            <Tabs defaultValue="vi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="vi" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Name (VI)</Label>
                  <Input value={nameVi} onChange={(e) => setNameVi(e.target.value)} placeholder="Tên dịch vụ" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Excerpt (VI)</Label>
                  <textarea value={excerptVi} onChange={(e) => setExcerptVi(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" placeholder="Mô tả ngắn..." />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Name (EN)</Label>
                  <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Service name" />
                </div>
                <div className="grid gap-1.5">
                  <Label>Excerpt (EN)</Label>
                  <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" placeholder="Short description..." />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Content (Lexical) */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Content</Label>
            <Tabs defaultValue="vi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="vi" className="mt-3">
                <LexicalEditor
                  editorKey={`service-vi-${activeId || "new"}-${editorVersion}`}
                  value={contentViDoc}
                  onChange={setContentViDoc}
                  placeholder="Write Vietnamese content..."
                />
              </TabsContent>
              <TabsContent value="en" className="mt-3">
                <LexicalEditor
                  editorKey={`service-en-${activeId || "new"}-${editorVersion}`}
                  value={contentEnDoc}
                  onChange={setContentEnDoc}
                  placeholder="Write English content..."
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Preview</Label>
            <Tabs defaultValue="vi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="vi" className="mt-3">
                <div className="rounded-lg bg-slate-900 p-4 text-white/90">
                  <LexicalContentRenderer doc={contentViDoc} locale={previewViLocale} />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3">
                <div className="rounded-lg bg-slate-900 p-4 text-white/90">
                  <LexicalContentRenderer doc={contentEnDoc} locale={previewEnLocale} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* ── Right column: Meta ── */}
        <div className="grid gap-4 self-start">
          <div className="grid gap-2">
            <Label>Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">— None —</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name_i18n?.vi || cat.name_i18n?.en || cat.key}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label>Slug (VI)</Label>
            <Input value={slugVi} onChange={(e) => { const val = e.target.value; setSlugVi(val); setSlugViSynced(!val); }} />
          </div>
          <div className="grid gap-2">
            <Label>Slug (EN)</Label>
            <Input value={slugEn} onChange={(e) => { const val = e.target.value; setSlugEn(val); setSlugEnSynced(!val); }} />
          </div>

          <div className="grid gap-2">
            <Label>Cover image</Label>
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="h-24 w-32 rounded-md border object-cover" />
            ) : null}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverUpload(e.target.files?.[0] || null)}
            />
            {coverUploading ? <p className="text-xs text-muted-foreground">Uploading...</p> : null}
            {coverUrl ? (
              <>
                <Input placeholder="Alt text (VI)" value={coverAltVi} onChange={(e) => setCoverAltVi(e.target.value)} />
                <Input placeholder="Alt text (EN)" value={coverAltEn} onChange={(e) => setCoverAltEn(e.target.value)} />
                <Button variant="outline" size="sm" onClick={() => { setCoverUrl(""); setCoverPublicId(""); setCoverAltVi(""); setCoverAltEn(""); }}>
                  Remove image
                </Button>
              </>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label>Featured</Label>
            <div className="flex items-center gap-2">
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              <span className="text-sm">Highlight on site</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Sort order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value || 0))} />
          </div>

          {activeMode === "edit" ? (
            <>
              <Separator />
              <div className="grid gap-2">
                <Label>Status</Label>
                <span className="text-sm text-muted-foreground">{status}</span>
              </div>
            </>
          ) : null}

          <Separator />

          <div className="grid gap-2">
            <Label>SEO title (VI)</Label>
            <Input value={seoTitleVi} onChange={(e) => setSeoTitleVi(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>SEO title (EN)</Label>
            <Input value={seoTitleEn} onChange={(e) => setSeoTitleEn(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>SEO desc (VI)</Label>
            <textarea value={seoDescVi} onChange={(e) => setSeoDescVi(e.target.value)} className="min-h-16 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div className="grid gap-2">
            <Label>SEO desc (EN)</Label>
            <textarea value={seoDescEn} onChange={(e) => setSeoDescEn(e.target.value)} className="min-h-16 w-full rounded-md border px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      {!embedded ? (
        <div className="mt-6 flex items-center justify-end gap-2">
          {actionButtons}
        </div>
      ) : null}
    </div>
  );
}

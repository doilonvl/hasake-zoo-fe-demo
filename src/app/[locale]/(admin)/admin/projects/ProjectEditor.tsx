"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { Project, PublishStatus, GalleryImage } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import {
  fetchAdminProjectById,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  publishAdminProject,
  uploadProjectImage,
} from "@/lib/api/projects.admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

type ProjectEditorProps = {
  mode: "create" | "edit";
  projectId?: string;
  embedded?: boolean;
  onCreated?: () => void;
  onCancel?: () => void;
};

function slugify(v: string) {
  return v.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u0110\u0111]/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
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

export default function ProjectEditor({
  mode,
  projectId,
  embedded = false,
  onCreated,
  onCancel,
}: ProjectEditorProps) {
  const params = useParams();
  void params;

  const isHydratingRef = useRef(false);

  const [activeMode, setActiveMode] = useState(mode);
  const [activeId, setActiveId] = useState(projectId || "");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [titleVi, setTitleVi] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [slugVi, setSlugVi] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugViSynced, setSlugViSynced] = useState(true);
  const [slugEnSynced, setSlugEnSynced] = useState(true);
  const [excerptVi, setExcerptVi] = useState("");
  const [excerptEn, setExcerptEn] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientLogo, setClientLogo] = useState("");
  const [locationVi, setLocationVi] = useState("");
  const [locationEn, setLocationEn] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [category, setCategory] = useState("");

  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<PublishStatus>("draft");

  const [seoTitleVi, setSeoTitleVi] = useState("");
  const [seoTitleEn, setSeoTitleEn] = useState("");
  const [seoDescVi, setSeoDescVi] = useState("");
  const [seoDescEn, setSeoDescEn] = useState("");

  useEffect(() => { if (isHydratingRef.current || !slugViSynced || !titleVi) return; setSlugVi(slugify(titleVi)); }, [titleVi, slugViSynced]);
  useEffect(() => { if (isHydratingRef.current || !slugEnSynced || !titleEn) return; setSlugEn(slugify(titleEn)); }, [titleEn, slugEnSynced]);

  const hydrate = useCallback((p: Project) => {
    setTitleVi(p.title_i18n?.vi || "");
    setTitleEn(p.title_i18n?.en || "");
    setSlugVi(p.slug_i18n?.vi || p.slug || "");
    setSlugEn(p.slug_i18n?.en || p.slug || "");
    setExcerptVi(p.excerpt_i18n?.vi || "");
    setExcerptEn(p.excerpt_i18n?.en || "");
    setClientName(p.client?.name || "");
    setClientLogo(p.client?.logo || "");
    setLocationVi(p.location_i18n?.vi || "");
    setLocationEn(p.location_i18n?.en || "");
    // Normalize to YYYY-MM-DD so <input type="date"> displays correctly
    setCompletionDate(
      p.completionDate ? p.completionDate.substring(0, 10) : ""
    );
    setCategory(p.category || "");
    setCoverUrl(p.coverImage?.url || "");
    setCoverPublicId(p.coverImage?.publicId || "");
    setGallery(
      (p.gallery || []).map((g, i) => ({
        url: g.url,
        publicId: g.publicId,
        caption_i18n: g.caption_i18n,
        sortOrder: g.sortOrder ?? i,
      }))
    );
    setIsFeatured(!!p.isFeatured);
    setSortOrder(p.sortOrder ?? 0);
    setStatus(p.status || "draft");
    setSeoTitleVi(p.seoTitle_i18n?.vi || "");
    setSeoTitleEn(p.seoTitle_i18n?.en || "");
    setSeoDescVi(p.seoDescription_i18n?.vi || "");
    setSeoDescEn(p.seoDescription_i18n?.en || "");
  }, []);

  useEffect(() => {
    if (activeMode !== "edit" || !activeId) return;
    let active = true;
    setLoading(true);
    fetchAdminProjectById(activeId)
      .then((project) => active && hydrate(project))
      .catch((err) => active && toast.error(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [activeId, activeMode, hydrate]);

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      title_i18n: { vi: titleVi.trim(), en: titleEn.trim() },
      slug_i18n: { vi: slugVi.trim(), en: slugEn.trim() },
      slug: slugVi.trim() || slugEn.trim(),
      isFeatured,
      sortOrder,
    };
    if (excerptVi.trim() || excerptEn.trim()) {
      payload.excerpt_i18n = { vi: excerptVi.trim(), en: excerptEn.trim() };
    }
    if (clientName.trim()) {
      payload.client = { name: clientName.trim(), logo: clientLogo.trim() || undefined };
    }
    if (locationVi.trim() || locationEn.trim()) {
      payload.location_i18n = { vi: locationVi.trim(), en: locationEn.trim() };
    }
    if (completionDate.trim()) payload.completionDate = completionDate.trim();
    if (category.trim()) payload.category = category.trim();
    if (coverUrl.trim()) {
      payload.coverImage = { url: coverUrl.trim(), publicId: coverPublicId.trim() || undefined };
    }
    payload.gallery = gallery.map((g, i) => ({
      url: g.url,
      publicId: g.publicId || undefined,
      caption_i18n: g.caption_i18n,
      sortOrder: g.sortOrder ?? i,
    }));
    if (seoTitleVi.trim() || seoTitleEn.trim()) {
      payload.seoTitle_i18n = { vi: seoTitleVi.trim(), en: seoTitleEn.trim() };
    }
    if (seoDescVi.trim() || seoDescEn.trim()) {
      payload.seoDescription_i18n = { vi: seoDescVi.trim(), en: seoDescEn.trim() };
    }
    return payload;
  };

  const handleSave = async () => {
    if (!titleVi.trim() && !titleEn.trim()) { toast.error("Title is required."); return; }
    if (coverUploading || galleryUploading) { toast.error("Wait for image upload."); return; }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (activeMode === "create" && !activeId) {
        const project = await createAdminProject(payload);
        toast.success("Project created");
        setActiveId(project._id);
        setActiveMode("edit");
        hydrate(project);
        onCreated?.();
      } else if (activeId) {
        const project = await updateAdminProject(activeId, payload);
        hydrate(project);
        toast.success("Project updated");
      }
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handlePublish = async () => {
    if (!activeId) return;
    try { const project = await publishAdminProject(activeId); hydrate(project); toast.success("Project published"); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async () => {
    if (!activeId || !confirm("Delete this project?")) return;
    try { await deleteAdminProject(activeId); toast.success("Project deleted"); onCancel?.(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) { toast.error("Select an image file."); return; }
    setCoverUploading(true);
    try { const res = await uploadProjectImage(file); setCoverUrl(res.url); setCoverPublicId(res.publicId || ""); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setCoverUploading(false); }
  };

  const handleGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setGalleryUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const res = await uploadProjectImage(file);
        setGallery((prev) => [
          ...prev,
          { url: res.url, publicId: res.publicId || "", sortOrder: prev.length },
        ]);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGalleryUploading(false);
    }
  };

  const removeGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGalleryCaption = (index: number, lang: "vi" | "en", value: string) => {
    setGallery((prev) =>
      prev.map((g, i) =>
        i === index
          ? { ...g, caption_i18n: { ...g.caption_i18n, [lang]: value } }
          : g
      )
    );
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    setGallery((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((g, i) => ({ ...g, sortOrder: i }));
    });
  };

  if (loading) return <Card className="p-6">Loading...</Card>;

  const actionButtons = (
    <>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      {activeMode === "edit" && activeId ? (
        <>
          <Button variant="outline" onClick={handlePublish}>Publish</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </>
      ) : null}
      <Button onClick={handleSave} disabled={saving || coverUploading || galleryUploading}>{saving ? "Saving..." : "Save"}</Button>
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
        <div className="grid gap-4 lg:col-span-2">
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Title & Excerpt</Label>
            <Tabs defaultValue="vi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="vi" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Title (VI)</Label>
                  <Input value={titleVi} onChange={(e) => setTitleVi(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Excerpt (VI)</Label>
                  <textarea value={excerptVi} onChange={(e) => setExcerptVi(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Title (EN)</Label>
                  <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Excerpt (EN)</Label>
                  <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator />

          <div className="grid gap-3">
            <Label className="text-base font-semibold">Client & Location</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Client name</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Client logo URL</Label>
                <Input value={clientLogo} onChange={(e) => setClientLogo(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Location (VI)</Label>
                <Input value={locationVi} onChange={(e) => setLocationVi(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Location (EN)</Label>
                <Input value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label>Completion date</Label>
                <Input type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="habitat, renovation..." />
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Gallery</Label>
              <span className="text-xs text-muted-foreground">{gallery.length} image(s)</span>
            </div>

            {gallery.length > 0 && (
              <div className="space-y-3">
                {gallery.map((item, idx) => (
                  <div key={`${item.url}-${idx}`} className="flex gap-3 rounded-lg border p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt="" className="h-20 w-20 shrink-0 rounded-md border object-cover" />
                    <div className="grid flex-1 gap-2">
                      <div className="grid gap-1">
                        <Label className="text-xs">Caption (VI)</Label>
                        <Input
                          value={item.caption_i18n?.vi || ""}
                          onChange={(e) => updateGalleryCaption(idx, "vi", e.target.value)}
                          placeholder="Caption Vietnamese"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs">Caption (EN)</Label>
                        <Input
                          value={item.caption_i18n?.en || ""}
                          onChange={(e) => updateGalleryCaption(idx, "en", e.target.value)}
                          placeholder="Caption English"
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => moveGalleryItem(idx, -1)} disabled={idx === 0} title="Move up">
                        &#x25B2;
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => moveGalleryItem(idx, 1)} disabled={idx === gallery.length - 1} title="Move down">
                        &#x25BC;
                      </Button>
                      <Button variant="destructive" size="sm" className="h-7 w-7 p-0" onClick={() => removeGalleryItem(idx)} title="Remove">
                        &times;
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid gap-2">
              <Label className="text-sm">Add images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleGalleryUpload(e.target.files)}
              />
              {galleryUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Slug (VI)</Label>
            <Input value={slugVi} onChange={(e) => setSlugVi(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Slug (EN)</Label>
            <Input value={slugEn} onChange={(e) => setSlugEn(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>Cover image</Label>
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="h-24 w-32 rounded-md border object-cover" />
            ) : null}
            <Input type="file" accept="image/*" onChange={(e) => handleCoverUpload(e.target.files?.[0] || null)} />
            {coverUploading ? <p className="text-xs text-muted-foreground">Uploading...</p> : null}
            {coverUrl ? (
              <Button variant="outline" size="sm" onClick={() => { setCoverUrl(""); setCoverPublicId(""); }}>Remove</Button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            <span className="text-sm">Featured</span>
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
        <div className="mt-6 flex items-center justify-end gap-2">{actionButtons}</div>
      ) : null}
    </div>
  );
}

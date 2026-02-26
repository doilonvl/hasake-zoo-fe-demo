"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import type { Product, PublishStatus } from "@/types/api";
import type { AdminApiError } from "@/lib/api/adminFetch";
import {
  fetchAdminProductById,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  publishAdminProduct,
  uploadProductImage,
} from "@/lib/api/products.admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

type ProductEditorProps = {
  mode: "create" | "edit";
  productId?: string;
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

export default function ProductEditor({
  mode,
  productId,
  embedded = false,
  onCreated,
  onCancel,
}: ProductEditorProps) {
  const params = useParams();
  void params;

  const isHydratingRef = useRef(false);

  const [activeMode, setActiveMode] = useState(mode);
  const [activeId, setActiveId] = useState(productId || "");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [nameVi, setNameVi] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slugVi, setSlugVi] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [slugViSynced, setSlugViSynced] = useState(true);
  const [slugEnSynced, setSlugEnSynced] = useState(true);
  const [sku, setSku] = useState("");
  const [shortDescVi, setShortDescVi] = useState("");
  const [shortDescEn, setShortDescEn] = useState("");
  const [category, setCategory] = useState("");

  const [priceOnRequest, setPriceOnRequest] = useState(true);
  const [displayPrice, setDisplayPrice] = useState("");

  const [coverUrl, setCoverUrl] = useState("");
  const [coverPublicId, setCoverPublicId] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);

  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<PublishStatus>("draft");

  const [seoTitleVi, setSeoTitleVi] = useState("");
  const [seoTitleEn, setSeoTitleEn] = useState("");
  const [seoDescVi, setSeoDescVi] = useState("");
  const [seoDescEn, setSeoDescEn] = useState("");

  useEffect(() => { if (isHydratingRef.current || !slugViSynced || !nameVi) return; setSlugVi(slugify(nameVi)); }, [nameVi, slugViSynced]);
  useEffect(() => { if (isHydratingRef.current || !slugEnSynced || !nameEn) return; setSlugEn(slugify(nameEn)); }, [nameEn, slugEnSynced]);

  const hydrate = useCallback((p: Product) => {
    isHydratingRef.current = true;
    setSlugViSynced(true);
    setSlugEnSynced(true);
    setNameVi(p.name_i18n?.vi || "");
    setNameEn(p.name_i18n?.en || "");
    setSlugVi(p.slug_i18n?.vi || p.slug || "");
    setSlugEn(p.slug_i18n?.en || p.slug || "");
    setSku(p.sku || "");
    setShortDescVi(p.shortDescription_i18n?.vi || "");
    setShortDescEn(p.shortDescription_i18n?.en || "");
    setCategory(p.category || "");
    setPriceOnRequest(p.priceOnRequest ?? true);
    setDisplayPrice(p.displayPrice || "");
    const primary = p.images?.find((i) => i.isPrimary) || p.images?.[0];
    setCoverUrl(primary?.url || "");
    setCoverPublicId(primary?.publicId || "");
    setIsFeatured(!!p.isFeatured);
    setSortOrder(p.sortOrder ?? 0);
    setStatus(p.status || "draft");
    setSeoTitleVi(p.seoTitle_i18n?.vi || "");
    setSeoTitleEn(p.seoTitle_i18n?.en || "");
    setSeoDescVi(p.seoDescription_i18n?.vi || "");
    setSeoDescEn(p.seoDescription_i18n?.en || "");
    setTimeout(() => { isHydratingRef.current = false; }, 0);
  }, []);

  useEffect(() => {
    if (activeMode !== "edit" || !activeId) return;
    let active = true;
    setLoading(true);
    fetchAdminProductById(activeId)
      .then((product) => active && hydrate(product))
      .catch((err) => active && toast.error(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [activeId, activeMode, hydrate]);

  const buildPayload = () => {
    const payload: Record<string, unknown> = {
      name_i18n: { vi: nameVi.trim(), en: nameEn.trim() },
      slug_i18n: { vi: slugVi.trim(), en: slugEn.trim() },
      slug: slugVi.trim() || slugEn.trim(),
      sku: sku.trim(),
      priceOnRequest,
      isFeatured,
      sortOrder,
    };
    if (category.trim()) payload.category = category.trim();
    if (displayPrice.trim()) payload.displayPrice = displayPrice.trim();
    if (shortDescVi.trim() || shortDescEn.trim()) {
      payload.shortDescription_i18n = { vi: shortDescVi.trim(), en: shortDescEn.trim() };
    }
    if (coverUrl.trim()) {
      payload.images = [{ url: coverUrl.trim(), publicId: coverPublicId.trim() || undefined, isPrimary: true }];
    }
    if (seoTitleVi.trim() || seoTitleEn.trim()) {
      payload.seoTitle_i18n = { vi: seoTitleVi.trim(), en: seoTitleEn.trim() };
    }
    if (seoDescVi.trim() || seoDescEn.trim()) {
      payload.seoDescription_i18n = { vi: seoDescVi.trim(), en: seoDescEn.trim() };
    }
    return payload;
  };

  const handleSave = async () => {
    if (!nameVi.trim() && !nameEn.trim()) { toast.error("Name is required."); return; }
    if (!sku.trim()) { toast.error("SKU is required."); return; }
    if (coverUploading) { toast.error("Wait for image upload."); return; }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (activeMode === "create" && !activeId) {
        const product = await createAdminProduct(payload);
        toast.success("Product created");
        setActiveId(product._id);
        setActiveMode("edit");
        hydrate(product);
        onCreated?.();
      } else if (activeId) {
        const product = await updateAdminProduct(activeId, payload);
        hydrate(product);
        toast.success("Product updated");
      }
    } catch (err) { toast.error(getErrorMessage(err)); }
    finally { setSaving(false); }
  };

  const handlePublish = async () => {
    if (!activeId) return;
    try { const product = await publishAdminProduct(activeId); hydrate(product); toast.success("Product published"); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleDelete = async () => {
    if (!activeId || !confirm("Delete this product?")) return;
    try { await deleteAdminProduct(activeId); toast.success("Product deleted"); onCancel?.(); }
    catch (err) { toast.error(getErrorMessage(err)); }
  };

  const handleCoverUpload = async (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) { toast.error("Select an image file."); return; }
    setCoverUploading(true);
    try { const res = await uploadProductImage(file); setCoverUrl(res.url); setCoverPublicId(res.publicId || ""); }
    catch (err) { toast.error(getErrorMessage(err)); }
    finally { setCoverUploading(false); }
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
      <Button onClick={handleSave} disabled={saving || coverUploading}>{saving ? "Saving..." : "Save"}</Button>
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
            <Label className="text-base font-semibold">Name & Description</Label>
            <Tabs defaultValue="vi">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Vietnamese</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="vi" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Name (VI)</Label>
                  <Input value={nameVi} onChange={(e) => setNameVi(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Short Description (VI)</Label>
                  <textarea value={shortDescVi} onChange={(e) => setShortDescVi(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-3 space-y-3">
                <div className="grid gap-1.5">
                  <Label>Name (EN)</Label>
                  <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Short Description (EN)</Label>
                  <textarea value={shortDescEn} onChange={(e) => setShortDescEn(e.target.value)} className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>SKU</Label>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="PROD-001" />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="equipment" />
          </div>
          <div className="grid gap-2">
            <Label>Slug (VI)</Label>
            <Input value={slugVi} onChange={(e) => { const val = e.target.value; setSlugVi(val); setSlugViSynced(!val); }} />
          </div>
          <div className="grid gap-2">
            <Label>Slug (EN)</Label>
            <Input value={slugEn} onChange={(e) => { const val = e.target.value; setSlugEn(val); setSlugEnSynced(!val); }} />
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label>Pricing</Label>
            <div className="flex items-center gap-2">
              <Switch checked={priceOnRequest} onCheckedChange={setPriceOnRequest} />
              <span className="text-sm">Price on request</span>
            </div>
            {!priceOnRequest ? (
              <Input value={displayPrice} onChange={(e) => setDisplayPrice(e.target.value)} placeholder="$1,200" />
            ) : null}
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label>Primary image</Label>
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

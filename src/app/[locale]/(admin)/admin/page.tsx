"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { fetchAdminJson } from "@/lib/api/adminFetch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Wrench,
  Package,
  Building2,
  MessageSquare,
  NotebookText,
  Plus,
  ArrowRight,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

type StatsKey = "blogs" | "services" | "products" | "projects" | "inquiries" | "reservations";

const STAT_CARDS: { key: StatsKey; label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; slug: string }[] = [
  { key: "blogs", label: "Blogs", icon: FileText, color: "text-blue-500", bg: "bg-blue-50", slug: "blogs" },
  { key: "services", label: "Services", icon: Wrench, color: "text-emerald-500", bg: "bg-emerald-50", slug: "services" },
  { key: "products", label: "Products", icon: Package, color: "text-purple-500", bg: "bg-purple-50", slug: "products" },
  { key: "projects", label: "Projects", icon: Building2, color: "text-amber-500", bg: "bg-amber-50", slug: "projects" },
  { key: "inquiries", label: "Inquiries", icon: MessageSquare, color: "text-rose-500", bg: "bg-rose-50", slug: "contact-inquiries" },
  { key: "reservations", label: "Reservations", icon: NotebookText, color: "text-teal-500", bg: "bg-teal-50", slug: "reservation-requests" },
];

export default function AdminDashboard() {
  const params = useParams();
  const locale = String(params?.locale || "vi");
  void locale;

  const [stats, setStats] = useState<Record<StatsKey, number>>({
    blogs: 0, services: 0, products: 0, projects: 0, inquiries: 0, reservations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoints: { key: StatsKey; path: string }[] = [
      { key: "blogs", path: "/blogs?limit=1" },
      { key: "services", path: "/services?limit=1" },
      { key: "products", path: "/products?limit=1" },
      { key: "projects", path: "/projects?limit=1" },
      { key: "inquiries", path: "/contact-inquiries?limit=1" },
      { key: "reservations", path: "/reservation-requests?limit=1" },
    ];

    Promise.allSettled(endpoints.map((ep) => fetchAdminJson<any>(ep.path)))
      .then((results) => {
        const s: Record<string, number> = {};
        results.forEach((r, i) => {
          if (r.status === "fulfilled") {
            const v = r.value;
            s[endpoints[i].key] = v?.pagination?.total ?? v?.total ?? 0;
          }
        });
        setStats((prev) => ({ ...prev, ...s }));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <Card className="border-amber-200/70 bg-gradient-to-r from-amber-50 via-white to-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-neutral-900">
          Welcome to Hasake Zoo Admin Panel
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage services, products, projects, blogs, and customer interactions.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm">
            <Link href={"/admin/blogs" as any}><Plus className="mr-2 h-4 w-4" />New Blog</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={"/admin/services" as any}><Plus className="mr-2 h-4 w-4" />New Service</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={"/admin/products" as any}><Plus className="mr-2 h-4 w-4" />New Product</Link>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.key} href={`/admin/${card.slug}` as any}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xl font-bold text-neutral-900">
                      {loading ? "—" : stats[card.key]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{card.label}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Manage Blogs", desc: "Write and publish blog posts", slug: "blogs", icon: FileText },
          { label: "Manage Services", desc: "Add and edit service offerings", slug: "services", icon: Wrench },
          { label: "Manage Products", desc: "Catalog habitat equipment", slug: "products", icon: Package },
          { label: "Manage Projects", desc: "Showcase completed projects", slug: "projects", icon: Building2 },
          { label: "View Inquiries", desc: "Respond to customer messages", slug: "contact-inquiries", icon: MessageSquare },
          { label: "View Reservations", desc: "Handle booking requests", slug: "reservation-requests", icon: NotebookText },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.slug} href={`/admin/${item.slug}` as any}>
              <Card className="p-5 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                    <div>
                      <p className="font-medium text-neutral-900">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

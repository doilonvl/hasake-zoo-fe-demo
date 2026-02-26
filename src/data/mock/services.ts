/**
 * Mock Services Data for Development
 * Uses i18n-compatible Service type directly from JSON
 */

import type { Service, ServiceCategory } from "@/types/api";
import servicesRaw from "./services.json";

interface RawService {
  slug: string;
  title_i18n: { vi: string; en: string };
  eyebrow_i18n: { vi: string; en: string };
  description_i18n: { vi: string; en: string };
  content_i18n: { vi: string; en: string };
  coverImage: string;
  isFeatured: boolean;
}

// Convert to Service type with i18n fields
export const mockServices: Service[] = (servicesRaw as RawService[]).map(
  (service, index) => ({
    _id: `svc-${index + 1}`,
    categoryId: "cat-1",
    slug: service.slug,
    slug_i18n: {
      vi: service.slug,
      en: service.slug,
    },
    name_i18n: service.title_i18n,
    excerpt_i18n: service.description_i18n,
    content_i18n: service.content_i18n,
    coverImage: service.coverImage
      ? {
          url: service.coverImage,
          alt_i18n: service.title_i18n,
        }
      : undefined,
    isFeatured: service.isFeatured,
    sortOrder: index + 1,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
);

// Mock service categories
export const mockServiceCategories: ServiceCategory[] = [
  {
    _id: "cat-1",
    key: "logistics",
    slug_i18n: {
      vi: "dich-vu-logistics",
      en: "logistics-services",
    },
    name_i18n: {
      vi: "Dịch Vụ Logistics",
      en: "Logistics Services",
    },
    description_i18n: {
      vi: "Vận chuyển và logistics động vật quốc tế",
      en: "International animal transport and logistics",
    },
    sortOrder: 1,
    isFeatured: true,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cat-2",
    key: "design",
    slug_i18n: {
      vi: "thiet-ke-che-tao",
      en: "design-manufacturing",
    },
    name_i18n: {
      vi: "Thiết Kế & Chế Tạo",
      en: "Design & Manufacturing",
    },
    description_i18n: {
      vi: "Thiết kế và chế tạo thùng vận chuyển IATA",
      en: "IATA crate design and manufacturing",
    },
    sortOrder: 2,
    isFeatured: true,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cat-3",
    key: "consultation",
    slug_i18n: {
      vi: "tu-van",
      en: "consultation",
    },
    name_i18n: {
      vi: "Tư Vấn",
      en: "Consultation",
    },
    description_i18n: {
      vi: "Tư vấn trao đổi động vật và bảo tồn",
      en: "Animal exchange and conservation consultation",
    },
    sortOrder: 3,
    isFeatured: false,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cat-4",
    key: "veterinary",
    slug_i18n: {
      vi: "thu-y",
      en: "veterinary",
    },
    name_i18n: {
      vi: "Thú Y",
      en: "Veterinary",
    },
    description_i18n: {
      vi: "Dịch vụ thú y và chăm sóc sức khỏe động vật",
      en: "Veterinary and animal health care services",
    },
    sortOrder: 4,
    isFeatured: false,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "cat-5",
    key: "zoo-design",
    slug_i18n: {
      vi: "thiet-ke-vuon-thu",
      en: "zoo-design",
    },
    name_i18n: {
      vi: "Thiết Kế Vườn Thú",
      en: "Zoo Design",
    },
    description_i18n: {
      vi: "Thiết kế và quy hoạch vườn thú, chuồng trại",
      en: "Zoo design, planning and habitat design",
    },
    sortOrder: 5,
    isFeatured: true,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * API Types for Backend Schemas
 * Synced with BE models
 */

import type { LocalizedString } from "./content";

// ============ Base Types ============

export type InquiryType = "general" | "service" | "product" | "project";
export type InquiryStatus = "new" | "read" | "replied" | "archived";
export type PublishStatus = "draft" | "published";

export interface ImageAsset {
  url: string;
  publicId?: string;
  alt_i18n?: LocalizedString;
}

export interface GalleryImage extends ImageAsset {
  caption_i18n?: LocalizedString;
  sortOrder: number;
}

export interface ProductImage extends ImageAsset {
  isPrimary: boolean;
}

// ============ ContactInquiry ============

export interface ContactInquiryNote {
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface ContactInquiry {
  _id: string;
  inquiryType: InquiryType;
  relatedId?: string;
  relatedModel?: "Service" | "Product" | "Project";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  subject: string;
  message: string;
  locale: string;
  status: InquiryStatus;
  assignedTo?: string;
  notes?: ContactInquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInquiryDTO {
  inquiryType: InquiryType;
  relatedId?: string;
  relatedModel?: "Service" | "Product" | "Project";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country: string;
  subject: string;
  message: string;
  locale: string;
}

// ============ ServiceCategory ============

export interface ServiceCategory {
  _id: string;
  key: string;
  slug_i18n: LocalizedString;
  name_i18n: LocalizedString;
  description_i18n?: LocalizedString;
  icon?: string;
  coverImage?: ImageAsset;
  sortOrder: number;
  isFeatured: boolean;
  status: PublishStatus;
  publishedAt?: string;
  seoTitle_i18n?: LocalizedString;
  seoDescription_i18n?: LocalizedString;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Service ============

export interface Service {
  _id: string;
  categoryId: string;
  slug: string;
  slug_i18n: LocalizedString;
  name_i18n: LocalizedString;
  excerpt_i18n?: LocalizedString;
  content_i18n: Record<string, any>; // LexicalJSON

  coverImage?: ImageAsset;
  gallery?: GalleryImage[];

  highlights_i18n?: Record<string, string[]>;
  capabilities_i18n?: Record<string, string[]>;

  isFeatured: boolean;
  sortOrder: number;
  relatedProjectIds?: string[];

  seoTitle_i18n?: LocalizedString;
  seoDescription_i18n?: LocalizedString;

  status: PublishStatus;
  publishedAt?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Product ============

export interface ProductSpecification {
  key_i18n: LocalizedString;
  value_i18n: LocalizedString;
  unit?: string;
}

export interface Product {
  _id: string;
  sku: string;
  slug: string;
  slug_i18n: LocalizedString;
  name_i18n: LocalizedString;
  shortDescription_i18n?: LocalizedString;
  content_i18n: Record<string, any>; // LexicalJSON

  images: ProductImage[];

  category: string;
  specifications?: ProductSpecification[];

  priceOnRequest: boolean;
  displayPrice?: string;

  isFeatured: boolean;
  sortOrder: number;

  seoTitle_i18n?: LocalizedString;
  seoDescription_i18n?: LocalizedString;

  status: PublishStatus;
  publishedAt?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Project ============

export interface ProjectClient {
  name: string;
  logo?: string;
  testimonial_i18n?: LocalizedString;
}

export interface Project {
  _id: string;
  slug: string;
  slug_i18n: LocalizedString;
  title_i18n: LocalizedString;
  excerpt_i18n?: LocalizedString;
  content_i18n: Record<string, any>; // LexicalJSON

  coverImage?: ImageAsset;
  gallery?: GalleryImage[];

  client?: ProjectClient;
  location_i18n?: LocalizedString;
  completionDate?: string;
  projectScope?: string[];
  category?: string;

  isFeatured: boolean;
  sortOrder: number;
  relatedServiceIds?: string[];

  seoTitle_i18n?: LocalizedString;
  seoDescription_i18n?: LocalizedString;

  status: PublishStatus;
  publishedAt?: string;

  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ API Response Types ============

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

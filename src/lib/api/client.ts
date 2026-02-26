/**
 * API Client for Public Endpoints
 */

import { getApiBaseUrl } from "@/lib/env";
import type {
  ApiResponse,
  PaginatedResponse,
  ContactInquiry,
  CreateContactInquiryDTO,
  Service,
  ServiceCategory,
  Product,
  Project,
} from "@/types/api";

const API_BASE_URL = getApiBaseUrl();

// ============ Helper Functions ============

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Contact Inquiries ============

export const contactInquiriesApi = {
  /**
   * Create a new contact inquiry
   */
  create: async (
    data: CreateContactInquiryDTO
  ): Promise<ApiResponse<ContactInquiry>> => {
    return apiFetch("/contact-inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all contact inquiries (admin)
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<ContactInquiry>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    const endpoint = query ? `/contact-inquiries?${query}` : "/contact-inquiries";

    return apiFetch(endpoint);
  },

  /**
   * Get contact inquiry by ID
   */
  getById: async (id: string): Promise<ApiResponse<ContactInquiry>> => {
    return apiFetch(`/contact-inquiries/${id}`);
  },

  /**
   * Update contact inquiry status
   */
  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<ContactInquiry>> => {
    return apiFetch(`/contact-inquiries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// ============ Service Categories ============

export const serviceCategoriesApi = {
  /**
   * Get all service categories
   */
  getAll: async (params?: {
    status?: string;
    isFeatured?: boolean;
  }): Promise<ApiResponse<ServiceCategory[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.isFeatured !== undefined)
      searchParams.set("isFeatured", params.isFeatured.toString());

    const query = searchParams.toString();
    const endpoint = query
      ? `/service-categories?${query}`
      : "/service-categories";

    return apiFetch(endpoint);
  },

  /**
   * Get service category by ID
   */
  getById: async (id: string): Promise<ApiResponse<ServiceCategory>> => {
    return apiFetch(`/service-categories/${id}`);
  },
};

// ============ Services ============

export const servicesApi = {
  /**
   * Get all services
   */
  getAll: async (params?: {
    categoryId?: string;
    status?: string;
    isFeatured?: boolean;
  }): Promise<ApiResponse<Service[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.isFeatured !== undefined)
      searchParams.set("isFeatured", params.isFeatured.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/services?${query}` : "/services";

    return apiFetch(endpoint);
  },

  /**
   * Get service by ID
   */
  getById: async (id: string): Promise<ApiResponse<Service>> => {
    return apiFetch(`/services/${id}`);
  },

  /**
   * Get service by slug
   */
  getBySlug: async (
    slug: string,
    locale?: string
  ): Promise<ApiResponse<Service>> => {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.set("locale", locale);

    const query = searchParams.toString();
    const endpoint = query
      ? `/services/slug/${slug}?${query}`
      : `/services/slug/${slug}`;

    return apiFetch(endpoint);
  },
};

// ============ Products ============

export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (params?: {
    category?: string;
    status?: string;
    isFeatured?: boolean;
  }): Promise<ApiResponse<Product[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.isFeatured !== undefined)
      searchParams.set("isFeatured", params.isFeatured.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/products?${query}` : "/products";

    return apiFetch(endpoint);
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiFetch(`/products/${id}`);
  },

  /**
   * Get product by slug
   */
  getBySlug: async (
    slug: string,
    locale?: string
  ): Promise<ApiResponse<Product>> => {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.set("locale", locale);

    const query = searchParams.toString();
    const endpoint = query
      ? `/products/slug/${slug}?${query}`
      : `/products/slug/${slug}`;

    return apiFetch(endpoint);
  },
};

// ============ Projects ============

export const projectsApi = {
  /**
   * Get all projects
   */
  getAll: async (params?: {
    category?: string;
    status?: string;
    isFeatured?: boolean;
  }): Promise<ApiResponse<Project[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.isFeatured !== undefined)
      searchParams.set("isFeatured", params.isFeatured.toString());

    const query = searchParams.toString();
    const endpoint = query ? `/projects?${query}` : "/projects";

    return apiFetch(endpoint);
  },

  /**
   * Get project by ID
   */
  getById: async (id: string): Promise<ApiResponse<Project>> => {
    return apiFetch(`/projects/${id}`);
  },

  /**
   * Get project by slug
   */
  getBySlug: async (
    slug: string,
    locale?: string
  ): Promise<ApiResponse<Project>> => {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.set("locale", locale);

    const query = searchParams.toString();
    const endpoint = query
      ? `/projects/slug/${slug}?${query}`
      : `/projects/slug/${slug}`;

    return apiFetch(endpoint);
  },
};

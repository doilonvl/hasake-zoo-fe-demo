/**
 * Mock Products Data for Development
 */

import type { Product } from "@/types/api";

export const mockProducts: Product[] = [
  {
    _id: "prd-1",
    sku: "ENR-AUTO-001",
    slug: "automated-enrichment-system",
    name_i18n: {
      vi: "Hệ Thống Làm Giàu Môi Trường Tự Động",
      en: "Automated Enrichment System",
    },
    slug_i18n: {
      vi: "he-thong-lam-giau-moi-truong-tu-dong",
      en: "automated-enrichment-system",
    },
    shortDescription_i18n: {
      vi: "Thiết bị tự động phân phối thức ăn và kích thích hành vi tự nhiên của động vật, có thể lập trình theo lịch trình.",
      en: "Automated device for food dispensing and natural behavior stimulation, programmable with custom schedules.",
    },
    content_i18n: {},
    images: [
      {
        url: "/test-img/plant 1.png",
        alt_i18n: {
          vi: "Hệ thống làm giàu môi trường",
          en: "Enrichment system",
        },
        isPrimary: true,
      },
    ],
    category: "Habitat Equipment",
    specifications: [
      {
        key_i18n: { vi: "Kích thước", en: "Dimensions" },
        value_i18n: { vi: "45 x 30 x 25 cm", en: "45 x 30 x 25 cm" },
      },
      {
        key_i18n: { vi: "Trọng lượng", en: "Weight" },
        value_i18n: { vi: "3.5 kg", en: "3.5 kg" },
      },
      {
        key_i18n: { vi: "Vật liệu", en: "Material" },
        value_i18n: {
          vi: "Nhựa ABS chống va đập",
          en: "Impact-resistant ABS plastic",
        },
      },
      {
        key_i18n: { vi: "Dung tích", en: "Capacity" },
        value_i18n: { vi: "5 lít", en: "5 liters" },
      },
      {
        key_i18n: { vi: "Nguồn điện", en: "Power Source" },
        value_i18n: {
          vi: "Pin Li-ion 12V 5000mAh",
          en: "Li-ion Battery 12V 5000mAh",
        },
      },
    ],
    priceOnRequest: true,
    status: "published",
    isFeatured: true,
    sortOrder: 1,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
  },
  {
    _id: "prd-2",
    sku: "CAM-4K-001",
    slug: "4k-wildlife-monitoring-camera",
    name_i18n: {
      vi: "Camera Quan Sát Động Vật 4K",
      en: "4K Wildlife Monitoring Camera",
    },
    slug_i18n: {
      vi: "camera-quan-sat-dong-vat-4k",
      en: "4k-wildlife-monitoring-camera",
    },
    shortDescription_i18n: {
      vi: "Camera quan sát chuyên dụng với độ phân giải 4K, hồng ngoại ban đêm và AI nhận diện hành vi động vật.",
      en: "Professional monitoring camera with 4K resolution, night vision infrared and AI behavior recognition.",
    },
    content_i18n: {},
    images: [
      {
        url: "/test-img/plant 1.png",
        alt_i18n: {
          vi: "Camera quan sát 4K",
          en: "4K monitoring camera",
        },
        isPrimary: true,
      },
    ],
    category: "Monitoring Equipment",
    specifications: [
      {
        key_i18n: { vi: "Độ phân giải", en: "Resolution" },
        value_i18n: { vi: "4K UHD (3840x2160)", en: "4K UHD (3840x2160)" },
      },
      {
        key_i18n: { vi: "Tầm nhìn ban đêm", en: "Night Vision" },
        value_i18n: { vi: "50 mét", en: "50 meters" },
      },
      {
        key_i18n: { vi: "Góc quay", en: "Field of View" },
        value_i18n: { vi: "110 độ", en: "110 degrees" },
      },
      {
        key_i18n: { vi: "Lưu trữ", en: "Storage" },
        value_i18n: {
          vi: "Hỗ trợ thẻ SD đến 256GB",
          en: "Supports SD card up to 256GB",
        },
      },
      {
        key_i18n: { vi: "Kết nối", en: "Connectivity" },
        value_i18n: {
          vi: "Wi-Fi, Ethernet, 4G LTE",
          en: "Wi-Fi, Ethernet, 4G LTE",
        },
      },
    ],
    priceOnRequest: true,
    status: "published",
    isFeatured: true,
    sortOrder: 2,
    createdAt: "2023-11-20",
    updatedAt: "2024-01-10",
  },
  {
    _id: "prd-3",
    sku: "FILT-ECO-001",
    slug: "ecological-pond-filtration-system",
    name_i18n: {
      vi: "Hệ Thống Lọc Nước Hồ Sinh Thái",
      en: "Ecological Pond Filtration System",
    },
    slug_i18n: {
      vi: "he-thong-loc-nuoc-ho-sinh-thai",
      en: "ecological-pond-filtration-system",
    },
    shortDescription_i18n: {
      vi: "Hệ thống lọc nước thông minh cho hồ sinh thái, duy trì chất lượng nước tối ưu cho động vật thủy sinh.",
      en: "Smart water filtration for ecological ponds, maintaining optimal water quality for aquatic animals.",
    },
    content_i18n: {},
    images: [
      {
        url: "/test-img/plant 1.png",
        alt_i18n: {
          vi: "Hệ thống lọc nước",
          en: "Water filtration system",
        },
        isPrimary: true,
      },
    ],
    category: "Water Systems",
    specifications: [
      {
        key_i18n: { vi: "Công suất", en: "Capacity" },
        value_i18n: { vi: "10,000 lít/giờ", en: "10,000 liters/hour" },
      },
      {
        key_i18n: { vi: "Diện tích hồ", en: "Pond Area" },
        value_i18n: { vi: "Đến 500 m²", en: "Up to 500 m²" },
      },
      {
        key_i18n: { vi: "Công suất tiêu thụ", en: "Power Consumption" },
        value_i18n: { vi: "350W", en: "350W" },
      },
      {
        key_i18n: { vi: "Đèn UV", en: "UV Light" },
        value_i18n: { vi: "55W", en: "55W" },
      },
      {
        key_i18n: { vi: "Bảo hành", en: "Warranty" },
        value_i18n: { vi: "3 năm", en: "3 years" },
      },
    ],
    priceOnRequest: true,
    status: "published",
    isFeatured: false,
    sortOrder: 3,
    createdAt: "2023-10-10",
    updatedAt: "2023-12-20",
  },
  {
    _id: "prd-4",
    sku: "MIST-COOL-001",
    slug: "natural-cooling-mist-system",
    name_i18n: {
      vi: "Máy Phát Sương Làm Mát Tự Nhiên",
      en: "Natural Cooling Mist System",
    },
    slug_i18n: {
      vi: "may-phat-suong-lam-mat-tu-nhien",
      en: "natural-cooling-mist-system",
    },
    shortDescription_i18n: {
      vi: "Hệ thống phun sương tự động điều chỉnh nhiệt độ và độ ẩm, tạo môi trường mát mẻ cho động vật nhiệt đới.",
      en: "Automated misting system controlling temperature and humidity, creating cool environment for tropical animals.",
    },
    content_i18n: {},
    images: [
      {
        url: "/test-img/plant 1.png",
        alt_i18n: {
          vi: "Hệ thống phun sương",
          en: "Misting system",
        },
        isPrimary: true,
      },
    ],
    category: "Climate Control",
    specifications: [
      {
        key_i18n: { vi: "Áp suất", en: "Pressure" },
        value_i18n: { vi: "70-100 bar", en: "70-100 bar" },
      },
      {
        key_i18n: { vi: "Độ phủ", en: "Coverage" },
        value_i18n: { vi: "300 m²", en: "300 m²" },
      },
      {
        key_i18n: { vi: "Tiêu thụ nước", en: "Water Consumption" },
        value_i18n: { vi: "5 lít/giờ", en: "5 liters/hour" },
      },
      {
        key_i18n: { vi: "Vòi phun", en: "Nozzles" },
        value_i18n: {
          vi: "Thép không gỉ 316",
          en: "Stainless steel 316",
        },
      },
      {
        key_i18n: { vi: "Điều khiển", en: "Control" },
        value_i18n: {
          vi: "Tự động qua cảm biến nhiệt độ/ẩm",
          en: "Auto via temp/humidity sensor",
        },
      },
    ],
    priceOnRequest: true,
    status: "published",
    isFeatured: false,
    sortOrder: 4,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-18",
  },
];

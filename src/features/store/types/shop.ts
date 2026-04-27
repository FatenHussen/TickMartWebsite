// Shop Details API Response Types

export interface LocalizedText {
 ar?: string | null;
 en?: string | null;
}

export interface VendorServiceTypeItem {
 id: number;
 name: LocalizedText;
 services: VendorServiceItem[];
}

export interface VendorServiceItem {
 id: number;
 name: LocalizedText;
 description?: LocalizedText | null;
}

export interface VendorServicesResponse {
 status: boolean;
 message: string;
 data: VendorServiceTypeItem[];
}

export interface ShopServiceType {
 id: number;
 name: LocalizedText;
}

export interface ShopVendorService {
 id: number;
 service: {
 id: number;
 name: LocalizedText;
 description?: LocalizedText | null;
 type?: ShopServiceType;
 };
 price: string;
 price_unit?: string | null;
 duration_minutes?: number | null;
 extra_details?: Record<string, unknown> | null;
 schedule?: Record<
 string,
 {
 open?: string;
 close?: string;
 closed?: boolean;
 }
 > | null;
 is_open_now?: boolean;
}

export interface ShopServicesResponse {
 status: boolean;
 message: string;
 data: ShopVendorService[];
}

export interface CreateServiceOrderPayload {
 shop_id: number;
 vendor_service_id: number;
 date: string;
 time: string;
 notes?: string;
}

export interface ServiceOrderResource {
 id: number;
 status: "pending" | "canceled" | "rejected" | "completed";
 price: string;
 price_unit?: string | null;
 notes?: string | null;
 date: string;
 time: string;
 created_at: string;
 shop: { id: number; name: string | LocalizedText; lat?: number | null; lng?: number | null };
 vendor_service: { id: number; name: string | LocalizedText; description?: string | LocalizedText | null };
 shop_vendor_service?: {
 id: number;
 extra_details?: Record<string, unknown> | null;
 duration_minutes?: number | null;
 schedule?: Record<string, { open?: string; close?: string; closed?: boolean }> | null;
 };
 user: { id: number; name: string; phone: string };
}

export interface CreateServiceOrderResponse {
 status: boolean;
 message: string;
 data: ServiceOrderResource;
}

export interface ShopWorkingHours {
 [key: string]: {
 open?: string;
 close?: string;
 closed?: boolean;
 };
}

export interface ShopDetailsData {
 id: number;
 name: string;
 description: string;
 address: string;
 phone: string;
 mobile: string;
 email: string;
 working_hours: ShopWorkingHours;
 logo_url: string | null;
  cover_image?: string | null;
 cover_images_urls: string[];
 is_active: boolean;
 average_rating: number;
 ratings_count: number;
 is_open_now: boolean;
 is_service_provider?: boolean;
  is_restaurant?: boolean;
  payment_methods?: string[];
  pricing_tier?: string | null;
  is_recommended?: boolean;
  is_favorite?: boolean;
 top_badges?: ShopBadge[];
 bottom_badges?: ShopBadge[];
 area: string;
  categories?: Array<{ id: number; name?: string | LocalizedText }>;
  services: Array<{
    id: number;
    name?: string | LocalizedText;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
  }>;
 created_at: string;
 updated_at: string;
}

export interface ShopDetailsResponse {
 status: boolean;
 message: string;
 data: ShopDetailsData;
}

// Shop List API Response Types
export interface ShopListItem {
 id: number;
 name: string;
 description: string | null;
 logo_url: string | null;
 is_active: boolean;
 average_rating: number;
 ratings_count: number;
 is_open_now: boolean;
 is_service_provider?: boolean;
 cover_image?: string | null;
 address?: string | null;
 top_badges?: ShopBadge[];
 bottom_badges?: ShopBadge[];
 created_at: string;
 vendor: {
 id: number;
 name: string;
 owner_name: string;
 logo_url: string | null;
 is_active: boolean;
 average_rating: number;
 ratings_count: number;
 created_at: string;
 top_badges?: ShopBadge[];
 bottom_badges?: ShopBadge[];
 };
 is_favorite?: boolean;
}

export interface ShopBadge {
 id?: number;
 name: string | { ar?: string | null; en?: string | null } | null;
 color?: string | null;
 type?: string | null;
 image?: string | null;
 position?: string | null;
 postion?: string | null;
}

export interface ShopsListResponse {
 status: boolean;
 message: string;
 data: {
 items: ShopListItem[];
 pagination: {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
 };
 };
}

export interface ShopListFilters {
 page?: number;
 area_id?: number;
 city_id?: number;
 governorate_id?: number;
 category_id?: number;
 brand_id?: number;
 search?: string;
 type?: "nearby" | "offers" | "top_rated" | "active";
 lat?: number;
 lng?: number;
 max_distance?: number;
 is_service_provider?: 0 | 1;
}

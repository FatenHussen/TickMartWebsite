// Shop Details API Response Types

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
  cover_images_urls: string[];
  is_active: boolean;
  average_rating: number;
  ratings_count: number;
  is_open_now: boolean;
  area: string;
  services: unknown[];
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
  };
  is_favorite?: boolean;
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

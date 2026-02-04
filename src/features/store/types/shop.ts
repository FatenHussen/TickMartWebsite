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

// Ratings API response types (user/ratings)

export interface RatingUser {
  id: number;
  name: string;
  image: string | null;
}

export interface RatingItem {
  id: number;
  rating: number;
  comment: string;
  image: string | null;
  type: string;
  is_verified: number;
  created_at: string;
  user: RatingUser;
}

export interface RatingsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface RatingsResponse {
  status: boolean;
  message: string;
  data: {
    items: RatingItem[];
    pagination: RatingsPagination;
  };
}

// Can-rate check (product)
export interface CanRateResponse {
  can_rate: boolean;
  product_id?: number;
  reason?: string;
  reason_ar?: string;
}

// My ratings list item (with target entity)
export interface MyRatingTarget {
  id: number;
  name: string | null;
  image: string | null;
}

export interface MyRatingItem {
  id: number;
  rating: number;
  comment: string | null;
  type: string | null;
  created_at: string;
  target: MyRatingTarget;
  image?: string | null;
}

// Create rating payload (multipart: type, rateable_id, rating, comment?, order_id?, image?)
export interface CreateRatingPayload {
  type: string;
  rateable_id: number;
  rating: number;
  comment?: string;
  order_id?: number;
  image?: File | null;
}

// Update rating payload (rating?, comment?, image?)
export interface UpdateRatingPayload {
  rating?: number;
  comment?: string;
  image?: File | null;
}

export type RateableType =
  | "product"
  | "shop"
  | "delivery"
  | "basket"
  | "schedule_basket"
  | "recipe"
  | "brand"
  | "order";

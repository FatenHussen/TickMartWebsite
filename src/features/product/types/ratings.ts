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

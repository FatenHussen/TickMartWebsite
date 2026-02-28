export interface AccountMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  isDanger?: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  isOnline?: boolean;
}

// Basket types
export type BasketStatus = "active" | "paused" | "expired";

export type BasketCategory = "scheduled" | "occasion" | "suggested";

export type BasketScheduleType = "recurring" | "one_time";

export type BasketItem = {
  id: string | number;
  name: string;
  image?: string;
  quantity: number;
  price: string;
};

export type Basket = {
  id: string | number;
  name: string;
  status: BasketStatus;
  category: BasketCategory;
  discount?: string;
  itemsCount: number;
  description: string;
  scheduleType: BasketScheduleType;
  scheduleInfo: string;
  nextDelivery?: string;
  scheduledFor?: string;
  pausedSince?: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  createdOn: string;
  items?: BasketItem[];
};

export type BasketFilter =
  | "all"
  | "active"
  | "paused"
  | "expired"
  | "suggested"
  | "scheduled"
  | "occasion";

// Subscription Package types (UI)
export type PackageFeature = {
  id: string;
  text: string;
};

export type SubscriptionPackage = {
  id: string;
  name: string;
  duration: string;
  price: string;
  currency: string;
  features: PackageFeature[];
  isCurrentPlan?: boolean;
  isFeatured?: boolean;
  gradient?: string;
};

// Packages API types
export interface PackageApi {
  id: number;
  name: string;
  price: string;
  duration_days: number;
  monthly_orders_limit: number;
  free_delivery_count: number;
  discount_percentage: string;
  points_bonus: number;
  is_active: number;
}

export interface MySubscriptionData {
  id: number;
  package: PackageApi;
  status: string;
  start_date: string;
  end_date: string;
  remaining_orders: number;
  remaining_free_deliveries: number;
}

export interface MySubscriptionResponse {
  status: boolean;
  message: string;
  data: MySubscriptionData;
}

export interface PackagesListResponse {
  data: PackageApi[];
}

// Favorites API types
export type FavoriteType = "product" | "recipe" | "basket" | "brand" | "shop";

export interface FavoriteBadge {
  id: number;
  name: string;
  color: string;
  postion: string | null;
}

export interface FavoriteItem {
  id: number;
  name: string;
  description?: string;
  image: string;
  rating?: number;
  price?: number;
  price_after_discount?: number;
  discount?: string;
  orders_count?: number;
  created_at?: string;
  budges?: FavoriteBadge[];
}

export interface FavoritesResponse {
  status: boolean;
  message: string;
  data: FavoriteItem[];
}

export interface ToggleFavoritePayload {
  type: FavoriteType;
  id: number;
}

// Wishlist types
export type WishlistItem = {
  id: string | number;
  name: string;
  image: string;
  category: string;
  store: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  rating: number;
  soldCount: number;
  isNew?: boolean;
  hasFreeDelivery?: boolean;
};

// Points & Rewards types (UI / mock)
export type PointsHistoryType = "earned" | "redeemed" | "expired";

export type PointsHistoryItem = {
  id: string | number;
  date: string;
  description: string;
  type: PointsHistoryType;
  points: number;
  balance: number;
};

// Points API types
export interface PointsSummaryData {
  balance: number;
  pending_points: number;
  expired_points: number;
  redeemed_points: number;
  expire_at: string;
  last_earned_at: string;
}

export interface PointsSummaryResponse {
  status: boolean;
  message: string;
  data: PointsSummaryData;
}

export interface PointsTransactionRule {
  title: string;
  code: string;
}

export interface PointsTransactionItem {
  id: number;
  points: number;
  source: string;
  status: "earned" | "redeemed" | "expired";
  type: string;
  reason: string | null;
  rule?: PointsTransactionRule | null;
  expires_at: string;
  created_at: string;
}

export interface PointsTransactionsResponse {
  status: boolean;
  message: string;
  data: {
    items: PointsTransactionItem[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface PointsExchangeGift {
  id: number;
  name: string;
  description: string;
  image: string;
  points_required: number;
  stock_quantity: number;
  category: string | null;
}

export interface PointsExchangeOptionsData {
  available: boolean;
  current_balance: number;
  options: {
    coupon: {
      enabled: boolean;
      min_points: number;
      max_points: number;
      discount_rate: number;
      description: string;
    };
    free_delivery: {
      enabled: boolean;
      points_cost: number;
      description: string;
    };
    gifts: {
      enabled: boolean;
      available_gifts: PointsExchangeGift[];
    };
  };
}

export interface PointsExchangeOptionsResponse {
  success: boolean;
  data: PointsExchangeOptionsData;
}

// Reviews types
export type ReviewType =
  | "product"
  | "store"
  | "delivery"
  | "scheduled_basket"
  | "recipe";

export type Review = {
  id: string | number;
  type: ReviewType;
  rating: number;
  date: string;
  createdAt: string;
};

export type ProductReview = Review & {
  type: "product";
  productName: string;
  productImage: string;
  seller: string;
  reviewText: string;
  images?: string[];
  orderId: string;
};

export type StoreReview = Review & {
  type: "store";
  storeName: string;
  storeIcon?: string;
};

export type DeliveryReview = Review & {
  type: "delivery";
  orderId: string;
  deliveryDate: string;
};

export type ScheduledBasketReview = Review & {
  type: "scheduled_basket";
  basketName: string;
  orderId?: string;
};

export type RecipeReview = Review & {
  type: "recipe";
  recipeName: string;
  triedDate: string;
};

export type ReviewUnion =
  | ProductReview
  | StoreReview
  | DeliveryReview
  | ScheduledBasketReview
  | RecipeReview;

export type UnreviewedItem = {
  id: string | number;
  productName: string;
  productImage: string;
  deliveryDate: string;
  orderId?: string;
};

// Address types
export type AddressLabel = "Home" | "Work" | "Other";

export interface NewAddressFormData {
  label: AddressLabel;
  governorate: string;
  city: string;
  area: string;
  streetName: string;
  nearestLandmark: string;
  buildingNumber?: string;
  floorApartment?: string;
  contactPhone: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface CreateAddressPayload {
  label: AddressLabel;
  area_id: number;
  street_name: string;
  nearest_landmark: string;
  building_number?: string;
  floor_apartment?: string;
  contact_phone: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

export interface UpdateAddressPayload {
  label: AddressLabel;
  governorate_id: number;
  city_id: number;
  area_id: number;
  street_name: string;
  nearest_landmark: string;
  building_number?: string;
  floor_apartment?: string;
  contact_phone: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

// Address API Response Types
export interface AddressGovernorate {
  id: number;
  name: string;
  created_at: string;
}

export interface AddressCity {
  id: number;
  name: string;
  governorate: AddressGovernorate;
  created_at: string;
}

export interface AddressArea {
  id: number;
  name: string;
  city: AddressCity;
  created_at: string;
}

export interface Address {
  id: number;
  label: AddressLabel;
  street_name: string;
  nearest_landmark: string;
  building_number?: string;
  floor_apartment?: string;
  contact_phone: string;
  lat: number;
  lng: number;
  is_default: boolean;
  area: AddressArea;
  created_at: string;
  updated_at: string;
}

export interface AddressesResponse {
  status: boolean;
  message: string;
  data: {
    items: Address[];
    pagination: null | {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
}

// ==================== Profile API Types ====================
export interface ProfileData {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  image: string;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data: ProfileData;
}

export interface UpdateProfilePayload {
  name: string;
  image?: File | string;
  city_id: number;
}

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface UpdateEmailPayload {
  email: string;
}

export interface UpdatePhonePayload {
  phone: string;
}

export interface VerifyProfilePayload {
  code: string;
  email?: string;
  phone?: string;
}

export interface GenericApiResponse {
  status: boolean;
  message: string;
  data?: any;
}

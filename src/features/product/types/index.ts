export type Brand = {
  id: number | string;
  name: string;
  logo: string;
  rating: number;
  storeCount: number;
  productCount: number;
  description?: string;
};

export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
  badge?: { label: string; className?: string } | { label: string; className?: string }[];
  category?: string;
  isFavorite?: boolean;
  sold?: number;
  savings?: string;
  deliveryInfo?: string;
};

export type ProductFilters = {
  location?: string;
  category?: string;
  store?: string;
  freeDeliveryOnly?: boolean;
  inStockOnly?: boolean;
  sortBy?: string;
};


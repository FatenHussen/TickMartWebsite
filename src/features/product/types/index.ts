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
  badge?:
    | { label: string; className?: string }
    | { label: string; className?: string }[];
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

// Component Types
export interface AttributeOption {
  attribute: string;
  type: "color" | "square";
  values: string[];
  availableValues?: string[];
  disabledValues?: string[];
}

export type DeliveryOption = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type ColorOption = {
  id: string;
  name: string;
  value: string;
  isImage?: boolean;
};

export type SizeOption = {
  id: string;
  label: string;
  available?: boolean;
};

// Export brand types
export * from "./brand";

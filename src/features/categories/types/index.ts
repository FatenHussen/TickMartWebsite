// ============ API Response Types ============

// Category child (subcategory)
export interface CategoryChild {
  id: number;
  name: string;
}

// Category from API
export interface ApiCategory {
  id: number;
  name: string;
  icon: string | null;
  children: CategoryChild[];
}

// Categories API Response
export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: {
    items: ApiCategory[];
    pagination: Pagination;
  };
}

// Product badge
export interface ProductBadge {
  id: number;
  name: string;
  color: "success" | "warning" | "danger" | string;
  postion: "top" | "bottom" | string;
}

// Product from API
export interface ApiProduct {
  id: number;
  category: string;
  name: string;
  description: string;
  country: string;
  price: number;
  price_after_discount: number;
  amount_saved: number;
  quantity: number;
  image: string;
  discount: string;
  budges: ProductBadge[];
  created_at: string;
}

// Products API Response
export interface ProductsResponse {
  status: boolean;
  message: string;
  data: {
    items: ApiProduct[];
    pagination: Pagination;
  };
}

// Pagination
export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ============ Legacy Types (for backward compatibility) ============

export type Category = {
  id: number;
  name: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  description: string;
};

export type Subcategory = {
  id: number;
  name: string;
  description: string;
  tags: string[];
};

export type Product = {
  id: number;
  name: string;
  store: string;
  price: string;
  rating: number;
  image: string;
  originalPrice?: string;
  badge?: { label: string; className?: string };
  category?: string;
};

export type NestedSubcategory = {
  id: number;
  name: string;
  children?: NestedSubcategory[];
};

export type Store = {
  id: number;
  name: string;
  type: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  status?: "open" | "closed";
  badges?: string[];
  deliveryTime?: string;
  tags?: string[];
};

// ==================== Hero Slider Types ====================
export type SlideData = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

// ==================== Section Item Types ====================
export interface SectionItemBadge {
  id: number;
  name: string;
  color?: string;
}

export interface SectionItemBase {
  id: number;
  title: string | null;
  desc: string | null;
  image: string | null;
  price: number | null;
  price_after_discount?: number | null;
  discount: string | null;
  top_badges: SectionItemBadge[];
  bottom_badges: SectionItemBadge[];
}

// For API type sections (products, brands, recipes)
export interface SectionItemApi extends SectionItemBase {}

// For Manual type sections (banners, selected products)
export interface SectionItemManual {
  id: number;
  link: string;
  order: number;
  item: SectionItemBase;
}

export type SectionItem = SectionItemApi | SectionItemManual;

// ==================== Section Types ====================
export interface SectionSeeMore {
  page_slug: string;
  params: Record<string, unknown> | unknown[];
}

export interface SectionAction {
  page_slug: string | null;
}

export interface Section {
  id: number;
  name: string;
  type: "api" | "manual";
  position: "before" | "after";
  order: number;
  display_type_id: number;
  background_color: string | null;
  background_crad_color: string | null;
  see_more: SectionSeeMore | null;
  action: SectionAction;
  items: SectionItem[];
}

// ==================== API Response Types ====================
export interface SectionsResponse {
  status: boolean;
  message: string;
  data: Section[];
}

// ==================== Display Type Mapping ====================
export const DISPLAY_TYPE = {
  BANNER: 1,
  PRODUCT: 2,
  BRAND: 6,
  RECIPE: 7,
} as const;

export type DisplayTypeId = (typeof DISPLAY_TYPE)[keyof typeof DISPLAY_TYPE];

// ==================== Category Types ====================
export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface CategoriesPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CategoriesResponse {
  status: boolean;
  message: string;
  data: {
    items: Category[];
    pagination: CategoriesPagination;
  };
}

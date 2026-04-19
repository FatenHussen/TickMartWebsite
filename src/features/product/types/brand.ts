import type { SectionItemBadge } from"@/features/home/types";
import type { PaginationData } from"@/shared/types/pagination";

// ==================== Brand Types ====================

// API Response for All Brands
export interface BrandListItem {
 id: number;
 name: string;
 image: string;
 rating: number;
 /** Total completed orders for this brand (brands list API). */
 orders_count?: number;
}

export interface BrandListResponse {
 status: boolean;
 message: string;
 data: {
 items: BrandListItem[];
 pagination: PaginationData;
 };
}

// API Response for Brand Details
export interface BrandDetails {
 id: number;
 name: string;
 image: string;
 products_count: number;
 shops_count: number;
 rating: number;
 description?: string;
}

export interface BrandDetailsResponse {
 status: boolean;
 message: string;
 data: BrandDetails;
}

// API Response for Brand Products
export interface BrandProduct {
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
 budges: SectionItemBadge[]; // Typo from API
 created_at: string;
 sold_number?: number;
 rating?: number;
 is_favorite?: boolean;
}

export interface BrandProductsResponse {
 status: boolean;
 message: string;
 data: {
 items: BrandProduct[];
 pagination: PaginationData;
 };
}

// Component Props Types
export interface BrandCardProps {
 brand: BrandListItem;
 onClick?: (id: number) => void;
}

export interface BrandHeaderProps {
 brand: BrandDetails;
 onViewDetails?: () => void;
}

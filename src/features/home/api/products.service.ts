import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { ProductsListResponse } from "../types";

export type ProductListType =
    | "new"
    | "trend"
    | "top_rated"
    | "offers"
    | "recommended"
    | "for_you"
    | "search_based"
    | "most_popular";

export type ProductSortBy =
    | "price_desc"
    | "price_asc"
    | "newest"
    | "oldest"
    | "rating";

export interface ProductsFilters {
    category_id?: number;
    brand_id?: number;
    shop_id?: number;
    country?: string;
    price_min?: number;
    price_max?: number;
    is_free_delivery?: boolean | 0 | 1;
    /** Instant delivery filter; 0/1 or booleans are normalized in apiRoutes */
    is_instant_delivery?: boolean | 0 | 1;
    on_sale?: boolean | 0 | 1;
    in_stock_only?: boolean | 0 | 1;
    attribute_values?: number[];
    type?: ProductListType;
    search?: string;
    sort_by?: ProductSortBy;
    page?: number;
    per_page?: number;
}

export const _ProductsApi = {
    getProducts: async (filters?: ProductsFilters): Promise<ProductsListResponse> => {
        const response = await _axios.get<ProductsListResponse>(
            apiRoutes.product.list(filters)
        );
        return response.data;
    },
};

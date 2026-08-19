import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { UserProductListFilters } from"@/utils/apiRoutes";
import type {
 CategoriesResponse,
 CategoryPageResponse,
 ProductsResponse,
} from"../types";

export interface CategoryFilters {
 name?: string;
 parent_id?: number;
 search?: string;
 shop_id?: number;
 type?:"new"|"most_popular"|"top_rated";
 page?: number;
 per_page?: number;
}

/** Same product filters the listing sends — the page's API sections honor them too. */
export type CategoryPageFilters = Omit<
 UserProductListFilters,
"category_id"|"page"|"per_page"
>;

export interface ProductListFilters {
 category_id?: number;
 brand_id?: number;
 shop_id?: number;
 country_id?: number;
 price_min?: number;
 price_max?: number;
 is_free_delivery?: boolean | 0 | 1;
 on_sale?: boolean | 0 | 1;
 in_stock_only?: boolean | 0 | 1;
 attribute_values?: number[];
 type?:"new"|"top_rated"|"most_popular";
 search?: string;
 sortField?: string;
 sortOrder?:"asc"|"desc";
 page?: number;
 per_page?: number;
}

export const _CategoriesApi = {
 getCategories: async (
 filters?: CategoryFilters
 ): Promise<CategoriesResponse> => {
 const response = await _axios.get<CategoriesResponse>(
 apiRoutes.categories.list(filters)
 );
 return response.data;
 },

 getCategoryPage: async (
 categoryId: number,
 filters?: CategoryPageFilters
 ): Promise<CategoryPageResponse> => {
 const response = await _axios.get<CategoryPageResponse>(
 apiRoutes.categories.page(categoryId, filters)
 );
 return response.data;
 },

 getProductsByCategory: async (
 categoryId: number,
 page?: number,
 filters?: Omit<ProductListFilters,"category_id"|"page">
 ): Promise<ProductsResponse> => {
 const response = await _axios.get<ProductsResponse>(
 apiRoutes.product.list({ ...filters, category_id: categoryId, page })
 );
 return response.data;
 },

 getProducts: async (
 filters?: ProductListFilters
 ): Promise<ProductsResponse> => {
 const response = await _axios.get<ProductsResponse>(
 apiRoutes.product.list(filters)
 );
 return response.data;
 },
};

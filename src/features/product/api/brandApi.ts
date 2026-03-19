import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 BrandListResponse,
 BrandDetailsResponse,
 BrandProductsResponse,
} from"../types/brand";

export const _BrandApi = {
 /**
 * Get all brands with optional filters (search, type, pagination)
 */
 getBrands: async (filters?: {
 search?: string;
 type?:"new"|"top_rated"|"most_popular";
 page?: number;
 per_page?: number;
 }): Promise<BrandListResponse> => {
 const response = await _axios.get<BrandListResponse>(
 apiRoutes.brands.list(filters)
 );
 return response.data;
 },

 /**
 * Get brand details by ID
 * @param brandId - Brand ID
 */
 getBrandDetails: async (
 brandId: number | string
 ): Promise<BrandDetailsResponse> => {
 const response = await _axios.get<BrandDetailsResponse>(
 apiRoutes.brands.details(brandId)
 );
 return response.data;
 },

 /**
 * Get products for a specific brand with full product filter support.
 */
 getBrandProducts: async (
 brandId: number,
 filters?: {
 is_free_delivery?: 0 | 1;
 on_sale?: 0 | 1;
 in_stock_only?: 0 | 1;
 sortField?: string;
 sortOrder?:"asc"|"desc";
 page?: number;
 per_page?: number;
 }
 ): Promise<BrandProductsResponse> => {
 const response = await _axios.get<BrandProductsResponse>(
 apiRoutes.product.list({ brand_id: brandId, ...filters })
 );
 return response.data;
 },
};

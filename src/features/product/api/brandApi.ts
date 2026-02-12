import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  BrandListResponse,
  BrandDetailsResponse,
  BrandProductsResponse,
} from "../types/brand";

export const _BrandApi = {
  /**
   * Get all brands with pagination
   * @param page - Page number (optional)
   */
  getBrands: async (page?: number): Promise<BrandListResponse> => {
    const response = await _axios.get<BrandListResponse>(
      apiRoutes.brands.list(page)
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
   * Get products for a specific brand
   * @param brandId - Brand ID
   * @param page - Page number (optional)
   */
  getBrandProducts: async (
    brandId: number,
    page?: number
  ): Promise<BrandProductsResponse> => {
    const response = await _axios.get<BrandProductsResponse>(
      apiRoutes.brands.products(brandId, page)
    );
    return response.data;
  },
};

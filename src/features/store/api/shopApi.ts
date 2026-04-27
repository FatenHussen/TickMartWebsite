import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { ProductsResponse } from"@/features/categories/types";
import type {
 ShopListFilters,
 ShopDetailsResponse,
 ShopServicesResponse,
 ShopsListResponse,
 VendorServicesResponse,
 CreateServiceOrderPayload,
 CreateServiceOrderResponse,
} from"../types/shop";

export const _ShopApi = {
 getShops: async (filters?: ShopListFilters): Promise<ShopsListResponse> => {
 const response = await _axios.get<ShopsListResponse>(
 apiRoutes.shop.list(filters)
 );
 return response.data;
 },

 getVendorServices: async (): Promise<VendorServicesResponse["data"]> => {
 const response = await _axios.get<VendorServicesResponse>(
 apiRoutes.vendorServices.list
 );
 return response.data.data;
 },

 getShopDetails: async (
 shopId: number
 ): Promise<ShopDetailsResponse["data"]> => {
 const response = await _axios.get<ShopDetailsResponse>(
 apiRoutes.shop.details(shopId)
 );
 return response.data.data;
 },

getShopProducts: async (params: {
shopId: number;
page?: number;
categoryId?: number;
}): Promise<ProductsResponse["data"]> => {
const response = await _axios.get<ProductsResponse>(
apiRoutes.product.listByShop(
params.shopId,
params.page,
params.categoryId
)
);
return response.data.data;
},

 getShopServices: async (
 shopId: number
 ): Promise<ShopServicesResponse["data"]> => {
 const response = await _axios.get<ShopServicesResponse>(
 apiRoutes.shop.services(shopId)
 );
 return response.data.data;
 },

 createServiceOrder: async (
 payload: CreateServiceOrderPayload
 ): Promise<CreateServiceOrderResponse["data"]> => {
 const response = await _axios.post<CreateServiceOrderResponse>(
 apiRoutes.serviceOrders.create,
 payload
 );
 return response.data.data;
 },
};

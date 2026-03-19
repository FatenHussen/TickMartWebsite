import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type {
 PackageApi,
 PackagesListResponse,
 MySubscriptionResponse,
} from"../types";

export const packagesApi = {
 getPackages: async (): Promise<PackageApi[]> => {
 const res = await _axios.get<PackagesListResponse>(apiRoutes.packages.list);
 return Array.isArray(res.data.data) ? res.data.data : [];
 },

 getMySubscription: async (): Promise<MySubscriptionResponse["data"] | null> => {
 try {
 const res = await _axios.get<MySubscriptionResponse>(
 apiRoutes.packages.mySubscription,
 );
 return res.data.data ?? null;
 } catch {
 return null;
 }
 },

 subscribe: async (packageId: number): Promise<{ status: boolean; message: string }> => {
 const res = await _axios.post<{ status: boolean; message: string }>(
 apiRoutes.packages.subscribe,
 { package_id: packageId },
 );
 return res.data;
 },

 renew: async (packageId: number): Promise<{ success: boolean; message: string }> => {
 const res = await _axios.post<{ success: boolean; message: string }>(
 apiRoutes.packages.renew,
 { package_id: packageId },
 );
 return res.data;
 },

 getSubscriptionBenefits: async (): Promise<{
 has_subscription: boolean;
 remaining_discounts: number;
 remaining_free_deliveries: number;
 }> => {
 const res = await _axios.get<{
 success: boolean;
 data: {
 has_subscription: boolean;
 remaining_discounts: number;
 remaining_free_deliveries: number;
 };
 }>(apiRoutes.packages.benefits);
 const d = res.data?.data;
 return {
 has_subscription: d?.has_subscription ?? false,
 remaining_discounts: d?.remaining_discounts ?? 0,
 remaining_free_deliveries: d?.remaining_free_deliveries ?? 0,
 };
 },
};

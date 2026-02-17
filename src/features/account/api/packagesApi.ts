import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type {
  PackageApi,
  PackagesListResponse,
  MySubscriptionResponse,
} from "../types";

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
};

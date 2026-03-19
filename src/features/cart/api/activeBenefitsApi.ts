import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";

export interface BenefitItem {
 key:"point_coupon_exchange_id"|"point_free_delivery_exchange_id"|"use_subscription_discount"|"use_subscription_free_delivery";
 value: number | boolean;
 title: string;
 discount_amount?: number;
 discount_percentage?: number;
 remaining_count?: number;
 expired_at?: string;
}

export interface ActiveBenefitsResponse {
 coupons: BenefitItem[];
 free_deliveries: BenefitItem[];
 has_benefits: boolean;
}

export const _ActiveBenefitsApi = {
 get: async (): Promise<ActiveBenefitsResponse> => {
 const res = await _axios.get<{ data: ActiveBenefitsResponse } | ActiveBenefitsResponse>(
 apiRoutes.activeBenefits.get
 );
 const raw = res.data as { data?: ActiveBenefitsResponse } & ActiveBenefitsResponse;
 return (raw?.data ?? raw) as ActiveBenefitsResponse;
 },
};

import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { UserPromotion, UserPromotionsApiEnvelope } from "../types";

export const _PromotionsApi = {
    /**
     * Active promotions. Omit `pageSlug` for all active promos; pass a CMS
     * `pages.slug` to receive global + page-linked promos only.
     */
    list: async (pageSlug?: string): Promise<UserPromotion[]> => {
        const response = await _axios.get<unknown>(
            apiRoutes.promotions.list(pageSlug)
        );
        const body = response.data;
        if (Array.isArray(body)) return body as UserPromotion[];
        if (
            body &&
            typeof body === "object" &&
            "data" in body &&
            Array.isArray((body as UserPromotionsApiEnvelope).data)
        ) {
            return (body as UserPromotionsApiEnvelope).data;
        }
        return [];
    },
};

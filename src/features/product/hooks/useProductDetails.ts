import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/context/LanguageContext";
import { queryKeys } from "@/utils/queryKeys";
import { isNotFoundResult, valueOrNotFound } from "@/shared/lib/apiNotFound";
import { _ProductApi, type GetProductDetailsParams } from "../api/productApi";
import { readProductRating } from "../lib/productRating";

export function useProductDetails(params: GetProductDetailsParams) {
    const { language } = useLanguage();
    const acceptLanguage = language === "ar" ? "ar" : "en";

    return useQuery({
        // Language is part of the key so Arabic and English estimates are not shared.
        queryKey: [...queryKeys.product.details(params.productId), acceptLanguage],
        queryFn: () =>
            valueOrNotFound(() =>
                _ProductApi.getProductDetails(params, acceptLanguage),
            ),
        select: (response) => {
            if (isNotFoundResult(response)) return null;
            const data = response.data;
            if (!data) return data;
            return {
                ...data,
                rating: readProductRating(data.rating),
            };
        },
        enabled: !!params.productId,
        // Latest GET on each visit. Icon image URLs include `?v=` and must not
        // stay on a previously cached product payload.
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
    });
}

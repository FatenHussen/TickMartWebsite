import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { faqsApi } from "../api/faqsApi";

/** Map API type (e.g. "stores&drivers") to locale key */
export const FAQ_TYPE_TO_LOCALE: Record<string, string> = {
  orders: "helpCenter.categories.orders",
  delivery: "helpCenter.categories.delivery",
  payments: "helpCenter.categories.payments",
  account: "helpCenter.categories.account",
  "stores&drivers": "helpCenter.categories.storesDrivers",
  other: "helpCenter.categories.other",
};

export function useFaqs(type: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.faqs.list(type),
    enabled: enabled && !!type,
    queryFn: () => faqsApi.getFaqs(type),
    staleTime: 1000 * 60 * 5,
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { _CurrencyApi } from "../api/currency.service";
import { queryKeys } from "@/utils/queryKeys";
import type { UpdateCurrencyPayload } from "../types";
import type { CurrencyItem } from "../types";

/**
 * Hook to fetch list of available currencies
 */
export function useCurrencies() {
  return useQuery({
    queryKey: queryKeys.currencies.list(),
    queryFn: () => _CurrencyApi.getCurrencies(),
    select: (response) => response.data.items as CurrencyItem[],
    staleTime: 1000 * 60 * 10, // 10 minutes - currencies change rarely
  });
}

/**
 * Hook to fetch user's selected currency
 */
export function useMyCurrency() {
  return useQuery({
    queryKey: queryKeys.currencies.myCurrency(),
    queryFn: () => _CurrencyApi.getMyCurrency(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update user's currency
 */
export function useUpdateCurrency() {
  const qc = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (payload: UpdateCurrencyPayload) =>
      _CurrencyApi.updateCurrency(payload),
    onSuccess: () => {
      toast.success(
        t("account.settings.currency.updateSuccess", "تم تحديث العملة بنجاح")
      );
      qc.invalidateQueries({ queryKey: queryKeys.currencies.all() });
    },
    onError: (err: unknown) => {
      console.error("[update-currency] error:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } }; message?: string })
          ?.response?.data?.message ||
        (err as { message?: string })?.message ||
        t("account.settings.currency.updateError", "فشل تحديث العملة");
      toast.error(errorMessage);
    },
  });
}

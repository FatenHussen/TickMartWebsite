import { useMutation, useQuery, useQueryClient } from"@tanstack/react-query";
import { toast } from"sonner";
import { useTranslation } from"react-i18next";
import { _CurrencyApi } from"../api/currency.service";
import { queryKeys } from"@/utils/queryKeys";
import type { UpdateCurrencyPayload } from"../types";
import type { CurrencyItem } from"../types";
import { getApiErrorMessage } from"@/shared/lib/apiMessage";
import { useAuthStore } from"@/store/auth";

/**
 * Hook to fetch list of available currencies
 */
export function useCurrencies() {
 return useQuery({
 queryKey: queryKeys.currencies.list(),
 queryFn: async () => {
 const response = await _CurrencyApi.getCurrencies();
 const items = [...response.data.items] as CurrencyItem[];
 const currentPage = Number(response.data.pagination?.current_page ?? 1);
 const lastPage = Number(response.data.pagination?.last_page ?? currentPage);
 for (let page = currentPage + 1; page <= lastPage; page += 1) {
 const next = await _CurrencyApi.getCurrencies(page);
 items.push(...next.data.items);
 }
 return items;
 },
 staleTime: 1000 * 60 * 10, // 10 minutes - currencies change rarely
 });
}

/**
 * Hook to fetch user's selected currency
 */
export function useMyCurrency() {
 const token = useAuthStore((s) => s.token);
 const userId = useAuthStore((s) => s.user?.id);
 return useQuery({
 queryKey: [...queryKeys.currencies.myCurrency(), userId, Boolean(token)],
 queryFn: () => _CurrencyApi.getMyCurrency(),
 select: (response) => response.data,
 enabled: Boolean(token),
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
 t("account.settings.currency.updateSuccess","تم تحديث العملة بنجاح")
 );
 qc.invalidateQueries({ queryKey: queryKeys.currencies.all() });
 },
 onError: (err: unknown) => {
 console.error("[update-currency] error:", err);
 const errorMessage = getApiErrorMessage(err, t("account.settings.currency.updateError","فشل تحديث العملة"));
 toast.error(errorMessage);
 },
 });
}

import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { _PaymentMethodsApi } from"../api/paymentMethodsApi";

export function usePaymentMethods() {
 const query = useQuery({
 queryKey: queryKeys.paymentMethods.list(),
 queryFn: () => _PaymentMethodsApi.list(),
 staleTime: 1000 * 60 * 10,
 });

 const methods = query.data ?? [];

 return { ...query, methods };
}

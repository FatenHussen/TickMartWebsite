import _axios from"@/app/middleware/interceptor";
import { apiRoutes } from"@/utils/apiRoutes";
import type { PaymentMethodOption } from"../types";

export interface ApiPaymentMethod {
 id: number | string;
 name: string;
 icon?: string;
 description?: string;
}

function mapToPaymentOption(m: ApiPaymentMethod): PaymentMethodOption {
 return {
 id: String(m.id),
 name: m.name,
 description: m.description ??"",
 icon: m.icon,
 };
}

export const _PaymentMethodsApi = {
 list: async (): Promise<PaymentMethodOption[]> => {
 const res = await _axios.get<
 | { data: ApiPaymentMethod[] | { items: ApiPaymentMethod[] } }
 | ApiPaymentMethod[]
 >(apiRoutes.paymentMethods.list);

 const raw = res.data as {
 data?: ApiPaymentMethod[] | { items?: ApiPaymentMethod[] };
 } & { items?: ApiPaymentMethod[] };

 const inner = raw?.data ?? raw;
 const arr: ApiPaymentMethod[] = Array.isArray(inner)
 ? inner
 : Array.isArray((inner as { items?: ApiPaymentMethod[] })?.items)
 ? ((inner as { items: ApiPaymentMethod[] }).items)
 : [];

 return arr.map(mapToPaymentOption);
 },
};

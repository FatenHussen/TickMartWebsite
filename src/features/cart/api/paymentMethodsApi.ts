import _axios from "@/app/middleware/interceptor";
import { apiRoutes } from "@/utils/apiRoutes";
import type { PaymentMethodOption } from "../types";
import {
    inferPaymentMethodType,
    readExplicitPaymentEnabled,
    resolvePaymentMethodEnabled,
} from "../utils/paymentMethods";

export interface ApiPaymentMethod {
    id: number | string;
    name: string;
    icon?: string;
    description?: string;
    type?: string;
    code?: string;
    slug?: string;
    key?: string;
    is_active?: boolean | number;
    is_enabled?: boolean | number;
    enabled?: boolean | number;
    is_available?: boolean | number;
    available?: boolean | number;
    status?: string;
}

function mapToPaymentOption(m: ApiPaymentMethod): PaymentMethodOption {
    const type = inferPaymentMethodType(m);
    const explicitEnabled = readExplicitPaymentEnabled(
        m as unknown as Record<string, unknown>,
    );

    return {
        id: String(m.id),
        name: m.name,
        description: m.description ?? "",
        icon: m.icon,
        type,
        enabled: resolvePaymentMethodEnabled(type, explicitEnabled),
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
              ? (inner as { items: ApiPaymentMethod[] }).items
              : [];

        return arr.map(mapToPaymentOption);
    },
};

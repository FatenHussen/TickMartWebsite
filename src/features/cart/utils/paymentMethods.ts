import type { PaymentMethodOption } from "../types";

export type PaymentMethodType = NonNullable<PaymentMethodOption["type"]>;

function coerceFlag(value: unknown): boolean | undefined {
    if (value === true || value === 1 || value === "1" || value === "true") {
        return true;
    }
    if (value === false || value === 0 || value === "0" || value === "false") {
        return false;
    }
    return undefined;
}

export function inferPaymentMethodType(raw: {
    type?: string;
    code?: string;
    slug?: string;
    key?: string;
    name?: string;
}): PaymentMethodOption["type"] {
    const hay = [raw.type, raw.code, raw.slug, raw.key, raw.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    if (/syriatel|سيريتل/.test(hay)) return "syriatel_cash";
    if (/\bmtn\b|ام تي ان|إم تي إن|ام.?تي.?ان/.test(hay)) return "mtn_cash";
    if (/paypal/.test(hay)) return "paypal";
    if (/(credit|visa|mastercard|\bcard\b)/.test(hay) && !/cash/.test(hay)) {
        return "credit_card";
    }
    if (
        /cash\s*on\s*delivery|عند\s*الاستلام|عند\s*التوصيل|نقد/.test(hay)
    ) {
        return "cash_on_delivery";
    }
    if (/cash|كاش/.test(hay) && !/syriatel|mtn/.test(hay)) {
        return "cash_on_delivery";
    }
    return undefined;
}

export function readExplicitPaymentEnabled(
    raw: Record<string, unknown>,
): boolean | undefined {
    const flags = [
        raw.is_active,
        raw.is_enabled,
        raw.enabled,
        raw.is_available,
        raw.available,
    ].map(coerceFlag);

    if (flags.some((flag) => flag === false)) return false;
    if (flags.some((flag) => flag === true)) return true;

    const status = String(raw.status ?? "").toLowerCase();
    if (["inactive", "disabled", "unavailable", "off"].includes(status)) {
        return false;
    }
    if (["active", "enabled", "available", "on"].includes(status)) {
        return true;
    }
    return undefined;
}

/** Wallet methods stay off unless the API explicitly enables them. */
export function resolvePaymentMethodEnabled(
    type: PaymentMethodOption["type"],
    explicitEnabled?: boolean,
): boolean {
    if (explicitEnabled === false) return false;
    if (explicitEnabled === true) return true;
    return type !== "syriatel_cash" && type !== "mtn_cash";
}

export function isPaymentMethodEnabled(method: PaymentMethodOption): boolean {
    return method.enabled !== false;
}

export function getEnabledPaymentMethods(
    methods: PaymentMethodOption[],
): PaymentMethodOption[] {
    return methods.filter(isPaymentMethodEnabled);
}

export function resolveSelectablePaymentMethodId(
    methods: PaymentMethodOption[],
    preferredId?: string | null,
): string {
    const enabled = getEnabledPaymentMethods(methods);
    if (preferredId && enabled.some((method) => method.id === preferredId)) {
        return preferredId;
    }
    return enabled[0]?.id ?? "";
}

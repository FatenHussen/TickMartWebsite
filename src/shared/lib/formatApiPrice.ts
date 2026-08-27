/**
 * Prefer API-formatted prices — never invent FX locally.
 *
 * Spec: display `*_formatted` or `*_currencies` from the API.
 */

export type ApiCurrencyFormatted = {
    formatted?: string | null;
    amount?: number | null;
    symbol?: string | null;
};

export type ApiDualCurrencies = {
    USD?: ApiCurrencyFormatted | null;
    SYP?: ApiCurrencyFormatted | null;
    [code: string]: ApiCurrencyFormatted | null | undefined;
};

/** Join USD / SYP (and any other) formatted lines with ` / `. */
export function formatDualCurrencies(
    currencies: ApiDualCurrencies | null | undefined,
): string {
    if (!currencies) return "";
    const preferred = [currencies.USD?.formatted, currencies.SYP?.formatted];
    const rest = Object.entries(currencies)
        .filter(([code]) => code !== "USD" && code !== "SYP")
        .map(([, v]) => v?.formatted);
    return [...preferred, ...rest].filter(Boolean).join(" / ");
}

type FormattedPriceSource = {
    price_formatted?: string | null;
    price_after_discount_formatted?: string | null;
    price_currencies?: ApiDualCurrencies | null;
    price_after_discount_currencies?: ApiDualCurrencies | null;
    amount_saved_formatted?: string | null;
    currency_symbol?: string | null;
    price?: number | null;
    price_after_discount?: number | null;
};

/**
 * Display price after discount (primary). Falls back to list price / dual currencies.
 * Numeric + symbol is last resort when the API omitted formatted fields.
 */
export function resolveDisplaySalePrice(
    source: FormattedPriceSource | null | undefined,
): string {
    if (!source) return "";
    const after =
        source.price_after_discount_formatted?.trim() ||
        formatDualCurrencies(source.price_after_discount_currencies);
    if (after) return after;

    const list =
        source.price_formatted?.trim() ||
        formatDualCurrencies(source.price_currencies);
    if (list) return list;

    const amount = source.price_after_discount ?? source.price;
    if (amount == null || !Number.isFinite(amount)) return "";
    return `${source.currency_symbol ?? ""}${amount}`;
}

/** Struck-through original when there is a discount. */
export function resolveDisplayListPrice(
    source: FormattedPriceSource | null | undefined,
): string | undefined {
    if (!source) return undefined;
    const afterNum = source.price_after_discount;
    const listNum = source.price;
    const hasDiscount =
        afterNum != null &&
        listNum != null &&
        Number.isFinite(afterNum) &&
        Number.isFinite(listNum) &&
        afterNum < listNum;

    const afterFmt = source.price_after_discount_formatted?.trim();
    const listFmt =
        source.price_formatted?.trim() ||
        formatDualCurrencies(source.price_currencies);

    if (hasDiscount || (afterFmt && listFmt && afterFmt !== listFmt)) {
        if (listFmt) return listFmt;
        if (listNum != null) return `${source.currency_symbol ?? ""}${listNum}`;
    }
    return undefined;
}

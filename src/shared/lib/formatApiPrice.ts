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

const LATIN_CURRENCY = "\\$|€|£|¥|₹|USD|EUR|GBP";
const ARABIC_CURRENCY = "ل\\.س|ر\\.س|د\\.إ|ج\\.م|SYP|SAR|AED";
const ANY_CURRENCY = `${LATIN_CURRENCY}|${ARABIC_CURRENCY}`;
const AMOUNT = "[\\d][\\d,]*(?:\\.\\d+)?";

export type ParsedPriceParts =
    | { kind: "parts"; amount: string; symbol: string; symbolFirst: boolean }
    | { kind: "raw"; value: string };

/**
 * Split a formatted price so the UI can lock LTR order (e.g. `$8.82` not `8.82 $` in RTL).
 * Latin symbols sit before the amount; Arabic units (ل.س …) stay after it.
 */
export function parsePriceParts(value: string): ParsedPriceParts {
    const s = value.trim();
    if (!s || s.includes(" / ")) return { kind: "raw", value: s };

    const prefix = s.match(new RegExp(`^(${ANY_CURRENCY})\\s*(${AMOUNT})$`, "i"));
    if (prefix) {
        const symbol = prefix[1];
        return {
            kind: "parts",
            symbol,
            amount: prefix[2],
            symbolFirst: !new RegExp(`^(?:${ARABIC_CURRENCY})$`, "i").test(symbol),
        };
    }

    const suffix = s.match(new RegExp(`^(${AMOUNT})\\s*(${ANY_CURRENCY})$`, "i"));
    if (suffix) {
        const symbol = suffix[2];
        return {
            kind: "parts",
            amount: suffix[1],
            symbol,
            symbolFirst: !new RegExp(`^(?:${ARABIC_CURRENCY})$`, "i").test(symbol),
        };
    }

    return { kind: "raw", value: s };
}

/** `"وفرت 0.18 $"` / `"You saved $0.18"` → label + money token. */
export function splitSavingsLabel(raw: string): { label: string; amount: string } {
    const s = raw.trim();
    const end = s.match(
        new RegExp(
            `^(.*?)\\s*((?:${ANY_CURRENCY})\\s*${AMOUNT}|${AMOUNT}\\s*(?:${ANY_CURRENCY}))$`,
            "i",
        ),
    );
    if (end && end[1].trim()) {
        return { label: end[1].trim(), amount: end[2].trim() };
    }
    return { label: "", amount: s };
}

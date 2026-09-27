/**
 * Prefer API-formatted prices — never invent FX locally.
 *
 * Spec: display `*_formatted` or `*_currencies` from the API.
 */

import { formatStorefrontDiscountBadge } from "@/shared/lib/productDiscountDisplay";

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

const CURRENCY_CHUNK_MARKERS: Record<string, RegExp> = {
    USD: /\$|USD/i,
    SYP: /ل\.س|SYP/i,
    EUR: /€|EUR/i,
    GBP: /£|GBP/i,
    AED: /د\.إ|AED/i,
    SAR: /ر\.س|SAR/i,
    EGP: /ج\.م|EGP/i,
};

/** Split API dual strings (`$ 8.82 / ل.س 114,660`). */
export function splitDualCurrencies(value: string): string[] {
    if (!value.includes(" / ")) return [value.trim()].filter(Boolean);
    return value
        .split(/\s*\/\s*/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
}

function chunkMatchesCurrency(chunk: string, code: string): boolean {
    const marker = CURRENCY_CHUNK_MARKERS[code];
    if (marker) return marker.test(chunk);
    return chunk.toUpperCase().includes(code);
}

/**
 * Keep the formatted price for the user's selected currency.
 * Falls back to the first available chunk — never converts FX locally.
 */
export function selectFormattedForCurrency(
    value: string,
    currencyCode?: string | null,
): string {
    const chunks = splitDualCurrencies(value);
    if (chunks.length <= 1) return value.trim();
    const code = (currencyCode ?? "").trim().toUpperCase();
    if (!code) return chunks[0];
    return chunks.find((chunk) => chunkMatchesCurrency(chunk, code)) ?? chunks[0];
}

/** Pick one API `*_currencies` line for the selected code. */
export function pickCurrencyFormatted(
    currencies: ApiDualCurrencies | null | undefined,
    currencyCode?: string | null,
): string {
    if (!currencies) return "";
    const code = (currencyCode ?? "").trim().toUpperCase();
    if (code) {
        const direct = currencies[code]?.formatted?.trim();
        if (direct) return direct;
        const matched = Object.entries(currencies).find(
            ([key, value]) =>
                key.toUpperCase() === code && Boolean(value?.formatted?.trim()),
        );
        if (matched?.[1]?.formatted) return matched[1].formatted.trim();
    }
    const preferred = currencies.USD?.formatted ?? currencies.SYP?.formatted;
    if (preferred?.trim()) return preferred.trim();
    const first = Object.values(currencies).find((v) => v?.formatted?.trim());
    return first?.formatted?.trim() ?? "";
}

/** Numeric `amount` from `*_currencies` for the selected code — never convert FX. */
export function pickCurrencyAmount(
    currencies: ApiDualCurrencies | null | undefined,
    currencyCode?: string | null,
): number | null {
    if (!currencies) return null;
    const read = (entry?: ApiCurrencyFormatted | null): number | null => {
        if (entry?.amount == null) return null;
        const n = Number(entry.amount);
        return Number.isFinite(n) ? n : null;
    };
    const code = (currencyCode ?? "").trim().toUpperCase();
    if (code) {
        const direct = read(currencies[code]);
        if (direct != null) return direct;
        const matched = Object.entries(currencies).find(
            ([key]) => key.toUpperCase() === code,
        );
        const fromMatch = read(matched?.[1]);
        if (fromMatch != null) return fromMatch;
    }
    return (
        read(currencies.USD) ??
        read(currencies.SYP) ??
        Object.values(currencies).reduce<number | null>((found, entry) => {
            if (found != null) return found;
            return read(entry);
        }, null)
    );
}

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

export type FormattedPriceSource = {
    price_formatted?: string | null;
    price_after_discount_formatted?: string | null;
    price_currencies?: ApiDualCurrencies | null;
    price_after_discount_currencies?: ApiDualCurrencies | null;
    amount_saved_formatted?: string | null;
    amount_saved_currencies?: ApiDualCurrencies | null;
    discount_currencies?: ApiDualCurrencies | null;
    currency_symbol?: string | null;
    price?: number | null;
    price_after_discount?: number | null;
    discount_type?: string | null;
    discount_value?: number | string | null;
    amount_saved?: number | null;
    discount?: string | number | null;
};

function pickCurrenciesThenFormatted(
    currencies: ApiDualCurrencies | null | undefined,
    formatted: string | null | undefined,
    currencyCode?: string | null,
): string {
    const fromMap = pickCurrencyFormatted(currencies, currencyCode);
    if (fromMap) return fromMap;
    const fromFormatted = selectFormattedForCurrency(
        formatted?.trim() ?? "",
        currencyCode,
    );
    return fromFormatted || "";
}

function numericDiscount(source: FormattedPriceSource): boolean {
    const afterNum = source.price_after_discount;
    const listNum = source.price;
    return (
        afterNum != null &&
        listNum != null &&
        Number.isFinite(afterNum) &&
        Number.isFinite(listNum) &&
        afterNum < listNum
    );
}

/**
 * True when the API reports a real discount (`percentage`/`fixed` with a value,
 * or sale price below list). `discount_type` of `null` / `"none"` is no discount.
 */
export function hasEffectiveDiscount(
    source: FormattedPriceSource | null | undefined,
): boolean {
    if (!source) return false;
    const dtype = source.discount_type;
    const dval = Number(source.discount_value ?? 0);
    if ((dtype === "percentage" || dtype === "fixed") && dval > 0) return true;
    if (numericDiscount(source)) return true;
    if (source.amount_saved != null && Number(source.amount_saved) > 0) return true;
    const disc = source.discount;
    if (typeof disc === "number" && disc > 0) return true;
    if (typeof disc === "string" && parseFloat(disc) > 0) return true;
    return false;
}

function resolveDiscountLabel(
    source: FormattedPriceSource | null | undefined,
): string | undefined {
    if (!source) return undefined;

    const typed = formatStorefrontDiscountBadge(source);
    if (typed) return typed;

    // Legacy listing: `discount` used to be a percent string when type was absent.
    // Numeric `discount` is now the computed savings amount — not a badge value.
    const dtype = source.discount_type;
    if (dtype === "percentage" || dtype === "fixed" || dtype === "none") {
        return undefined;
    }
    const disc = source.discount;
    if (typeof disc === "string" && disc.trim()) {
        const n = Number(disc);
        if (Number.isFinite(n) && n > 0) return `-${n}%`;
    }
    return undefined;
}

/**
 * Display price after discount (primary). Prefer `*_currencies` for the
 * selected currency over a joined dual `*_formatted` line.
 */
export function resolveDisplaySalePrice(
    source: FormattedPriceSource | null | undefined,
    currencyCode?: string | null,
): string {
    if (!source) return "";
    const after = pickCurrenciesThenFormatted(
        source.price_after_discount_currencies,
        source.price_after_discount_formatted,
        currencyCode,
    );
    if (after) return after;

    const list = pickCurrenciesThenFormatted(
        source.price_currencies,
        source.price_formatted,
        currencyCode,
    );
    if (list) return list;

    const amount = source.price_after_discount ?? source.price;
    if (amount == null || !Number.isFinite(amount)) return "";
    return `${source.currency_symbol ?? ""}${amount}`;
}

/** Struck-through original when there is a discount. */
export function resolveDisplayListPrice(
    source: FormattedPriceSource | null | undefined,
    currencyCode?: string | null,
): string | undefined {
    if (!source) return undefined;
    const afterFmt = pickCurrenciesThenFormatted(
        source.price_after_discount_currencies,
        source.price_after_discount_formatted,
        currencyCode,
    );
    const listFmt = pickCurrenciesThenFormatted(
        source.price_currencies,
        source.price_formatted,
        currencyCode,
    );
    const listNum = source.price;

    if (
        hasEffectiveDiscount(source) ||
        (afterFmt && listFmt && afterFmt !== listFmt)
    ) {
        if (listFmt) return listFmt;
        if (listNum != null) return `${source.currency_symbol ?? ""}${listNum}`;
    }
    return undefined;
}

export type ListingCardPrices = {
    price: string;
    originalPrice: string | undefined;
    savings: string | undefined;
    discountLabel: string | undefined;
    hasDiscount: boolean;
};

function resolveSavingsAmount(
    source: FormattedPriceSource,
    currencyCode?: string | null,
): string | undefined {
    const fromMap =
        pickCurrencyFormatted(source.amount_saved_currencies, currencyCode) ||
        pickCurrencyFormatted(source.discount_currencies, currencyCode);
    if (fromMap) return fromMap;
    const formatted = source.amount_saved_formatted?.trim();
    if (!formatted) return undefined;
    return selectFormattedForCurrency(formatted, currencyCode) || formatted;
}

/**
 * Listing cards read **product-level** `price_currencies` / after-discount.
 * SKU and barcode stay off the card (details page only).
 * Prices follow the user's selected currency when the API sent that code.
 */
export function resolveListingCardPrices(
    source: FormattedPriceSource | null | undefined,
    youSavedLabel?: string,
    currencyCode?: string | null,
): ListingCardPrices {
    const hasDiscount = hasEffectiveDiscount(source);
    const saved = source ? resolveSavingsAmount(source, currencyCode) : undefined;
    return {
        price: resolveDisplaySalePrice(source, currencyCode),
        originalPrice: hasDiscount
            ? resolveDisplayListPrice(source, currencyCode)
            : undefined,
        savings:
            hasDiscount && saved
                ? youSavedLabel
                    ? `${youSavedLabel} ${saved}`
                    : saved
                : undefined,
        discountLabel: resolveDiscountLabel(source),
        hasDiscount,
    };
}

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const EXTENDED_ARABIC_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Arabic locales (`ar-SY`) format money as `٥٬٨٥٠` / `٠٫٥٨٥`.
 * Next to `ل.س` in an RTL page those digits and separators swap,
 * so `5,850` is shown as `0.585`. Keep display digits Latin.
 */
const BIDI_MARKS = /[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;

export function activeUiLanguage(language?: string | null): string {
    if (language?.trim()) return language;
    if (typeof document !== "undefined" && document.documentElement.lang) {
        return document.documentElement.lang;
    }
    return "en";
}

export function isArabicLanguage(language?: string | null): boolean {
    return activeUiLanguage(language).toLowerCase().startsWith("ar");
}

/** Keep a money or number token in logical left-to-right order inside Arabic text. */
export function isolateLtr(value: string): string {
    const clean = value.replace(BIDI_MARKS, "");
    if (!clean) return clean;
    return `\u2066${clean}\u2069`;
}

export function toLatinNumberText(value: string): string {
    return value.replace(BIDI_MARKS, "").replace(/[٠-٩۰-۹٫٬]/g, (ch) => {
        const arabic = ARABIC_INDIC_DIGITS.indexOf(ch);
        if (arabic >= 0) return String(arabic);
        const extended = EXTENDED_ARABIC_DIGITS.indexOf(ch);
        if (extended >= 0) return String(extended);
        if (ch === "٫") return ".";
        if (ch === "٬") return ",";
        return ch;
    });
}

const LATIN_MONEY = new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    maximumFractionDigits: 2,
});

/** International digits (`1,234.56`) for both English and Arabic. */
export function formatMoneyAmount(amount: number): string {
    if (!Number.isFinite(amount)) return "0";
    return LATIN_MONEY.format(amount);
}

/**
 * International amount, with the currency on the side the language reads from.
 * English (LTR): `$1,234.56` / `ل.س 1,234.56`
 * Arabic (RTL): `1,234.56 ل.س` / `1,234.56 $`
 * Digits stay in an LTR isolate so they never reverse.
 */
export function presentMoney(value: string, language?: string | null): string {
    const clean = toLatinNumberText(value).trim();
    if (!clean) return clean;
    if (clean.includes(" / ")) {
        return clean
            .split(/\s*\/\s*/)
            .map((part) => presentMoney(part, language))
            .join(" / ");
    }
    const parts = parsePriceParts(clean);
    if (parts.kind === "raw") return isolateLtr(parts.value);
    if (isArabicLanguage(language)) {
        return `${isolateLtr(parts.amount)} ${parts.symbol}`;
    }
    return isolateLtr(`${parts.symbol}${parts.amount}`);
}

const LATIN_CURRENCY = "\\$|€|£|¥|₹|USD|EUR|GBP";
const ARABIC_CURRENCY = "ل\\.س|ر\\.س|د\\.إ|ج\\.م|SYP|SAR|AED|EGP";
const ANY_CURRENCY = `${LATIN_CURRENCY}|${ARABIC_CURRENCY}`;

const ARABIC_UNIT_TO_CODE: Array<[RegExp, string]> = [
    [/ل\.س/g, "SYP"],
    [/ر\.س/g, "SAR"],
    [/د\.إ/g, "AED"],
    [/ج\.م/g, "EGP"],
];

const CODE_TO_ARABIC_UNIT: Array<[RegExp, string]> = [
    [/\bSYP\b/gi, "ل.س"],
    [/\bSAR\b/gi, "ر.س"],
    [/\bAED\b/gi, "د.إ"],
    [/\bEGP\b/gi, "ج.م"],
];

/**
 * API price strings keep the Arabic unit (`ل.س`) even when the UI is English.
 * Swap the unit to the Latin code for English, and back for Arabic.
 */
export function localizeCurrencyText(
    value: string,
    language?: string | null,
): string {
    if (!value) return value;
    const arabic = (language ?? "").toLowerCase().startsWith("ar");
    const pairs = arabic ? CODE_TO_ARABIC_UNIT : ARABIC_UNIT_TO_CODE;
    return pairs.reduce((text, [pattern, next]) => text.replace(pattern, next), value);
}
const AMOUNT = "[\\d][\\d,]*(?:\\.\\d+)?";

export type ParsedPriceParts =
    | { kind: "parts"; amount: string; symbol: string; symbolFirst: boolean }
    | { kind: "raw"; value: string };

/**
 * Split a formatted price so the symbol stays on the left of the amount
 * (`ل.س 58,500`, `SYP 58,500`, `$8.82`) inside an LTR isolate.
 */
export function parsePriceParts(value: string): ParsedPriceParts {
    const s = toLatinNumberText(value).trim();
    if (!s || s.includes(" / ")) return { kind: "raw", value: s };

    const prefix = s.match(new RegExp(`^(${ANY_CURRENCY})\\s*(${AMOUNT})$`, "i"));
    if (prefix) {
        return {
            kind: "parts",
            symbol: prefix[1],
            amount: prefix[2],
            symbolFirst: true,
        };
    }

    const suffix = s.match(new RegExp(`^(${AMOUNT})\\s*(${ANY_CURRENCY})$`, "i"));
    if (suffix) {
        return {
            kind: "parts",
            amount: suffix[1],
            symbol: suffix[2],
            symbolFirst: false,
        };
    }

    return { kind: "raw", value: s };
}

/** `"وفرت 0.18 $"` / `"You saved $0.18"` → label + money token. */
export function splitSavingsLabel(raw: string): { label: string; amount: string } {
    const s = toLatinNumberText(raw).trim();
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

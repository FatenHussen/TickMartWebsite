/**
 * Prefer API-formatted prices — never invent FX locally.
 *
 * Spec: display `*_formatted` or `*_currencies` from the API.
 * Only SYP sale / list prices use whole-number rounding (first-decimal rule).
 * Other currencies keep their decimals. Sub-unit amounts keep up to 2 decimals.
 * Savings ("you saved") stay exact — do not force them to whole numbers.
 */

import i18next from "i18next";
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
    JPY: /¥|JPY/i,
    INR: /₹|INR/i,
    TRY: /₺|TRY/i,
    AED: /د\.إ|AED/i,
    SAR: /ر\.س|SAR/i,
    EGP: /ج\.م|EGP/i,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: "$",
    SYP: "ل.س",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    TRY: "₺",
    AED: "د.إ",
    SAR: "ر.س",
    EGP: "ج.م",
};

/** Split API dual strings (`$ 8.82 / ل.س 114,660`). */
export function splitDualCurrencies(value: string): string[] {
    if (!value.includes(" / ")) return [value.trim()].filter(Boolean);
    return value
        .split(/\s*\/\s*/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
}

/** Settings and storage may hold `SYP`, `SYR`, or the Arabic unit. Product maps use `SYP`. */
export function canonicalCurrencyCode(code?: string | null): string {
    const raw = (code ?? "").trim();
    if (!raw) return "";
    if (raw === "ل.س" || /ليرة/u.test(raw)) return "SYP";
    const upper = raw.toUpperCase();
    if (upper === "SYR" || upper === "SP") return "SYP";
    return upper;
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
    const code = canonicalCurrencyCode(currencyCode);
    if (code) {
        const matched = chunks.find((chunk) => chunkMatchesCurrency(chunk, code));
        if (matched) return matched;
    }
    return (
        chunks.find((chunk) => chunkMatchesCurrency(chunk, "SYP")) ?? chunks[0]
    );
}

function formatCurrencyEntry(
    entry?: ApiCurrencyFormatted | null,
    roundWhole = true,
    currencyCode?: string | null,
): string {
    const formatted = entry?.formatted?.trim();
    if (formatted) {
        return roundWhole ? roundFormattedMoneyText(formatted, currencyCode) : formatted;
    }
    if (entry?.amount == null) return "";
    const amount = Number(entry.amount);
    if (!Number.isFinite(amount)) return "";
    const code = canonicalCurrencyCode(currencyCode);
    const symbol = entry.symbol?.trim() || CURRENCY_SYMBOLS[code] || code;
    const amountText = roundWhole
        ? formatMoneyAmount(amount, code || symbol)
        : formatExactMoneyAmount(amount);
    return `${symbol}${symbol ? " " : ""}${amountText}`.trim();
}

/** Pick one API `*_currencies` line for the selected code. */
export function pickCurrencyFormatted(
    currencies: ApiDualCurrencies | null | undefined,
    currencyCode?: string | null,
    options?: { roundWhole?: boolean },
): string {
    if (!currencies) return "";
    const roundWhole = options?.roundWhole !== false;
    const code = canonicalCurrencyCode(currencyCode);
    if (code) {
        const direct = formatCurrencyEntry(currencies[code], roundWhole, code);
        if (direct) return direct;
        const matched = Object.entries(currencies).find(
            ([key, value]) =>
                canonicalCurrencyCode(key) === code &&
                Boolean(formatCurrencyEntry(value, roundWhole, key)),
        );
        if (matched) {
            const formatted = formatCurrencyEntry(matched[1], roundWhole, matched[0]);
            if (formatted) return formatted;
        }
    }
    for (const [key, entry] of [
        ["SYP", currencies.SYP],
        ["USD", currencies.USD],
        ...Object.entries(currencies),
    ] as Array<[string, ApiCurrencyFormatted | null | undefined]>) {
        const formatted = formatCurrencyEntry(entry, roundWhole, key);
        if (formatted) return formatted;
    }
    return "";
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
    const code = canonicalCurrencyCode(currencyCode);
    if (code) {
        const direct = read(currencies[code]);
        if (direct != null) return direct;
        const matched = Object.entries(currencies).find(
            ([key]) => canonicalCurrencyCode(key) === code,
        );
        const fromMatch = read(matched?.[1]);
        if (fromMatch != null) return fromMatch;
    }
    return (
        read(currencies.SYP) ??
        read(currencies.USD) ??
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
    const preferred: Array<[string, ApiCurrencyFormatted | null | undefined]> = [
        ["USD", currencies.USD],
        ["SYP", currencies.SYP],
    ];
    const rest = Object.entries(currencies)
        .filter(([code]) => code !== "USD" && code !== "SYP");
    return [...preferred, ...rest]
        .map(([code, entry]) => formatCurrencyEntry(entry, true, code))
        .filter(Boolean)
        .join(" / ");
}

export type FormattedPriceSource = {
    price_formatted?: string | null;
    price_after_discount_formatted?: string | null;
    price_currencies?: ApiDualCurrencies | null;
    price_after_discount_currencies?: ApiDualCurrencies | null;
    amount_saved_formatted?: string | null;
    amount_saved_currencies?: ApiDualCurrencies | null;
    discount_currencies?: ApiDualCurrencies | null;
    currency?: string | null;
    currency_symbol?: string | null;
    price?: number | null;
    price_after_discount?: number | null;
    discount_type?: string | null;
    discount_value?: number | string | null;
    amount_saved?: number | null;
    discount?: string | number | null;
};

function formatSourceMoney(source: FormattedPriceSource, amount: number): string {
    const code = canonicalCurrencyCode(source.currency ?? source.currency_symbol);
    const symbol = CURRENCY_SYMBOLS[code] ?? source.currency_symbol ?? code;
    return `${symbol}${formatMoneyAmount(amount, code)}`;
}

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
    return fromFormatted ? roundFormattedMoneyText(fromFormatted, currencyCode) : "";
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
        if (Number.isFinite(n) && n > 0) {
            return i18next.t("baskets.discountPercentOff", {
                value: roundMoneyToWhole(n),
            });
        }
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
    return formatSourceMoney(source, amount);
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
        if (listNum != null)
            return formatSourceMoney(source, listNum);
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
    const exact = { roundWhole: false as const };
    const fromMap =
        pickCurrencyFormatted(
            source.amount_saved_currencies,
            currencyCode,
            exact,
        ) ||
        pickCurrencyFormatted(source.discount_currencies, currencyCode, exact);
    if (fromMap) return fromMap;
    const formatted = source.amount_saved_formatted?.trim();
    if (!formatted) {
        if (source.amount_saved != null && Number(source.amount_saved) > 0) {
            const symbol = source.currency_symbol?.trim() ?? "";
            return `${symbol}${symbol ? " " : ""}${formatExactMoneyAmount(Number(source.amount_saved))}`.trim();
        }
        return undefined;
    }
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
    maximumFractionDigits: 0,
});

const LATIN_MONEY_EXACT = new Intl.NumberFormat("en-US", {
    numberingSystem: "latn",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

/**
 * SYP storefront whole-number rounding: look at the first digit after the decimal.
 * Below 5 → drop the fraction. 5 or above → round up, then drop the fraction.
 * Examples: 198.90 → 199, 35.10 → 35.
 * Amounts with absolute value under 1 are left unchanged (caller formats them
 * with decimals) so sub-unit prices never collapse to 0.
 * Use for sale / list prices only — not savings.
 */
export function roundMoneyToWhole(amount: number): number {
    if (!Number.isFinite(amount)) return 0;
    const sign = amount < 0 ? -1 : 1;
    const abs = Math.abs(amount);
    // Keep sub-unit prices — whole rounding would show 0.
    if (abs > 0 && abs < 1) return amount;
    const intPart = Math.trunc(abs);
    const firstDecimal = Math.floor((abs - intPart) * 10 + 1e-8);
    return sign * (firstDecimal >= 5 ? intPart + 1 : intPart);
}

function formatStorefrontMoneyAmount(amount: number): string {
    if (!Number.isFinite(amount)) return "0";
    const abs = Math.abs(amount);
    if (abs > 0 && abs < 1) return LATIN_MONEY_EXACT.format(amount);
    return LATIN_MONEY.format(roundMoneyToWhole(amount));
}

/**
 * Round SYP prices only. An explicit currency in each chunk takes precedence
 * over the supplied code, so USD fallback prices retain their decimals.
 */
export function roundFormattedMoneyText(
    value: string,
    currencyCode?: string | null,
): string {
    if (!value) return value;
    const clean = toLatinNumberText(value);
    const chunks = splitDualCurrencies(clean);
    if (chunks.length > 1) {
        return chunks.map((chunk) => roundFormattedMoneyText(chunk, currencyCode)).join(" / ");
    }
    const explicitCode = Object.keys(CURRENCY_CHUNK_MARKERS).find(
        (code) => chunkMatchesCurrency(clean, code),
    ) ?? clean.match(/\b[A-Z]{3}\b/i)?.[0]
        ?? (/\p{Sc}/u.test(clean) ? "OTHER" : undefined);
    if (canonicalCurrencyCode(explicitCode ?? currencyCode) !== "SYP") return clean;
    return clean.replace(/\d[\d,]*(?:\.\d+)/g, (token) => {
        const n = Number(token.replace(/,/g, ""));
        if (!Number.isFinite(n)) return token;
        return formatStorefrontMoneyAmount(n);
    });
}

/**
 * International digits for sale / list prices. Only known SYP amounts use
 * whole-number rounding; never infer a currency from a bare number.
 */
export function formatMoneyAmount(amount: number, currencyCode?: string | null): string {
    return canonicalCurrencyCode(currencyCode) === "SYP"
        ? formatStorefrontMoneyAmount(amount)
        : formatExactMoneyAmount(amount);
}

/** Exact savings amount — keep API decimals (up to 2). */
export function formatExactMoneyAmount(amount: number): string {
    if (!Number.isFinite(amount)) return "0";
    return LATIN_MONEY_EXACT.format(amount);
}

/**
 * International amount, with the currency on the side the language uses.
 * Arabic: unit on the left (`ل.س 1,234`, `$ 1,234`).
 * English: unit on the right (`1,234 SYP`, `1,234 $`).
 * The whole price is an LTR isolate so this order holds in either UI direction,
 * and the digits themselves never reverse.
 */
export function presentMoney(value: string, language?: string | null): string {
    const clean = roundFormattedMoneyText(toLatinNumberText(value)).trim();
    if (!clean) return clean;
    if (clean.includes(" / ")) {
        return clean
            .split(/\s*\/\s*/)
            .map((part) => presentMoney(part, language))
            .join(" / ");
    }
    const parts = parsePriceParts(clean);
    if (parts.kind === "raw") return isolateLtr(parts.value);
    const ordered = isArabicLanguage(language)
        ? `${parts.symbol} ${parts.amount}`
        : `${parts.amount} ${parts.symbol}`;
    return isolateLtr(ordered);
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
 * Split a formatted price that already has its unit on either side
 * (`ل.س 58,500`, `58,500 SYP`, `$8.82`, `8.82 $`).
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

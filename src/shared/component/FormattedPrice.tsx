import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { useCurrencyOptional } from "@/context/CurrencyContext";
import { cn } from "@/shared/lib/utils";
import {
    localizeCurrencyText,
    parsePriceParts,
    roundFormattedMoneyText,
    selectFormattedForCurrency,
    splitDualCurrencies,
    toLatinNumberText,
} from "@/shared/lib/formatApiPrice";

type FormattedPriceProps = {
    value: string;
    className?: string;
    /** Raised, slightly quieter currency glyph — use on the sale price. */
    prominent?: boolean;
    /** Amount only. Used on the struck list price and the savings line. */
    hideSymbol?: boolean;
    strikethrough?: boolean;
    /**
     * Keep API decimals as-is (savings). Default rounds only SYP sale/list
     * prices to whole numbers with the first-decimal storefront rule.
     */
    exact?: boolean;
    /**
     * Dual-currency layout. `stack` puts USD above SYP (cards).
     * `inline` keeps one nowrap line. Default: stack when prominent + dual.
     */
    layout?: "inline" | "stack";
    /**
     * Original / list price. When set, each currency is paired on one row:
     * `$8.82  $9` then `114,660 ل.س  117,000 ل.س`.
     */
    compareValue?: string;
    /** Extra classes for the struck original / list price. */
    compareClassName?: string;
};

function pairPriceChunks(
    sale: string,
    original?: string,
): Array<{ sale: string; original?: string }> {
    const saleChunks = splitDualCurrencies(sale);
    const originalChunks = original ? splitDualCurrencies(original) : [];
    return saleChunks.map((chunk, i) => ({
        sale: chunk,
        original: originalChunks[i],
    }));
}

function PriceGlyph({
    value,
    prominent,
    hideSymbol = false,
    isArabic = false,
}: {
    value: string;
    prominent: boolean;
    hideSymbol?: boolean;
    /** Arabic places the unit on the left of the amount; English on the right. */
    isArabic?: boolean;
}) {
    const parts = parsePriceParts(value);
    if (parts.kind === "raw") {
        return <span dir="ltr">{parts.value}</span>;
    }
    if (hideSymbol) {
        return (
            <span dir="ltr" className="leading-none">
                {parts.amount}
            </span>
        );
    }

    const symbol = (
        <span
            dir="ltr"
            className={cn(
                "font-bold",
                prominent
                    ? "text-[0.58em] font-extrabold leading-none opacity-80"
                    : "text-[0.85em] opacity-90",
            )}
        >
            {parts.symbol}
        </span>
    );
    const amount = (
        <span dir="ltr" className="leading-none">
            {parts.amount}
        </span>
    );

    return (
        <span
            dir={isArabic ? "rtl" : "ltr"}
            className="inline-flex items-baseline whitespace-nowrap"
        >
            {amount}
            <span aria-hidden="true" className="inline-block w-[0.28em]">
                {" "}
            </span>
            {symbol}
        </span>
    );
}

function GlyphLine({
    value,
    prominent,
    hideSymbol = false,
    isArabic = false,
}: {
    value: string;
    prominent: boolean;
    hideSymbol?: boolean;
    isArabic?: boolean;
}) {
    return (
        <span className="inline-flex items-baseline tabular-nums leading-none">
            <PriceGlyph
                value={value}
                prominent={prominent}
                hideSymbol={hideSymbol}
                isArabic={isArabic}
            />
        </span>
    );
}

/**
 * International digits (`1,234.56`) in both languages.
 * The currency follows the language: on the left of the amount in Arabic
 * (`ل.س 1,234`, `$ 1,234`) and on the right in English (`1,234 SYP`, `1,234 $`).
 * Digits stay in an LTR isolate so they never reverse.
 */
export default function FormattedPrice({
    value,
    className,
    prominent = false,
    hideSymbol = false,
    strikethrough = false,
    exact = false,
    layout,
    compareValue,
    compareClassName,
}: FormattedPriceProps) {
    const { i18n } = useTranslation();
    const currencyCode = useCurrencyOptional()?.currency;
    const isArabic = i18n.language.toLowerCase().startsWith("ar");
    const prepareMoney = (raw: string) => {
        const selected = selectFormattedForCurrency(raw, currencyCode);
        return toLatinNumberText(
            localizeCurrencyText(
                exact ? selected : roundFormattedMoneyText(selected, currencyCode),
                i18n.language,
            ),
        );
    };
    const displayValue = prepareMoney(value);
    const displayCompare = compareValue ? prepareMoney(compareValue) : undefined;
    const chunks = splitDualCurrencies(displayValue);
    const dual = chunks.length > 1;
    const stacked = layout === "stack" || (layout !== "inline" && prominent && dual);
    const pairs = displayCompare
        ? pairPriceChunks(displayValue, displayCompare)
        : null;

    const shell = (children: ReactNode, extra?: string) => (
        <span
            dir={isArabic ? "rtl" : "ltr"}
            className={cn(
                strikethrough && "line-through decoration-from-font",
                extra,
                !pairs && className,
            )}
        >
            {children}
        </span>
    );

    if (pairs) {
        return shell(
            pairs.map((pair, i) => {
                const primary = i === 0;
                return (
                    <span
                        key={`${pair.sale}-${i}`}
                        className="inline-flex min-w-0 items-baseline gap-2"
                    >
                        <span
                            className={cn(
                                "inline-flex items-baseline leading-none",
                                primary
                                    ? className
                                    : "text-[15px] font-semibold tracking-tight text-custom-secondary dark:text-zinc-300",
                            )}
                        >
                            <GlyphLine
                                value={pair.sale}
                                prominent={prominent && primary}
                                hideSymbol={hideSymbol}
                                isArabic={isArabic}
                            />
                        </span>
                        {pair.original ? (
                            <span
                                className={cn(
                                    "inline-flex items-baseline font-medium leading-none text-custom-tertiary line-through decoration-custom-tertiary/50 dark:text-zinc-500 dark:decoration-zinc-600",
                                    primary ? "text-[15px]" : "text-[13px]",
                                    compareClassName,
                                )}
                            >
                                <GlyphLine
                                    value={pair.original}
                                    prominent={false}
                                    hideSymbol={hideSymbol}
                                    isArabic={isArabic}
                                />
                            </span>
                        ) : null}
                    </span>
                );
            }),
            "inline-flex flex-col items-start gap-1.5",
        );
    }

    if (stacked && dual) {
        const [primary, ...rest] = chunks;
        return shell(
            <>
                <GlyphLine
                    value={primary}
                    prominent={prominent}
                    hideSymbol={hideSymbol}
                    isArabic={isArabic}
                />
                {rest.map((chunk) => (
                    <GlyphLine
                        key={chunk}
                        value={chunk}
                        prominent={false}
                        hideSymbol={hideSymbol}
                        isArabic={isArabic}
                    />
                ))}
            </>,
            cn(
                "inline-flex flex-col items-start gap-0.5",
                prominent
                    ? "[&>*:not(:first-child)]:text-[0.62em] [&>*:not(:first-child)]:font-semibold [&>*:not(:first-child)]:opacity-65"
                    : "gap-px [&>*:not(:first-child)]:text-[0.92em] [&>*:not(:first-child)]:opacity-75",
            ),
        );
    }

    return shell(
        chunks.map((chunk, i) => (
            <span key={`${chunk}-${i}`} className="inline-flex items-baseline">
                {i > 0 ? (
                    <span className="mx-1.5 font-medium leading-none opacity-35">
                        ·
                    </span>
                ) : null}
                <PriceGlyph
                    value={chunk}
                    prominent={prominent && i === 0}
                    hideSymbol={hideSymbol}
                    isArabic={isArabic}
                />
            </span>
        )),
        "inline-flex max-w-full items-baseline whitespace-nowrap tabular-nums",
    );
}

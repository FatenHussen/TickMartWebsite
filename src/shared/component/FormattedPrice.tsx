import type { ReactNode } from "react";

import { useCurrencyOptional } from "@/context/CurrencyContext";
import { cn } from "@/shared/lib/utils";
import {
    parsePriceParts,
    selectFormattedForCurrency,
    splitDualCurrencies,
} from "@/shared/lib/formatApiPrice";

type FormattedPriceProps = {
    value: string;
    className?: string;
    /** Raised, slightly quieter currency glyph — use on the sale price. */
    prominent?: boolean;
    strikethrough?: boolean;
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
}: {
    value: string;
    prominent: boolean;
}) {
    const parts = parsePriceParts(value);
    if (parts.kind === "raw") {
        return <span>{parts.value}</span>;
    }

    const symbol = (
        <span
            className={cn(
                "font-bold",
                prominent
                    ? "text-[0.58em] font-extrabold leading-none opacity-80"
                    : "text-[0.85em] opacity-90",
                parts.symbolFirst ? "me-[0.14em]" : "ms-[0.14em]",
            )}
        >
            {parts.symbol}
        </span>
    );
    const amount = <span className="leading-none">{parts.amount}</span>;

    return parts.symbolFirst ? (
        <>
            {symbol}
            {amount}
        </>
    ) : (
        <>
            {amount}
            {symbol}
        </>
    );
}

function GlyphLine({
    value,
    prominent,
}: {
    value: string;
    prominent: boolean;
}) {
    return (
        <span className="inline-flex items-baseline tabular-nums leading-none">
            <PriceGlyph value={value} prominent={prominent} />
        </span>
    );
}

/**
 * Renders a money string in a stable LTR isolate so `$8.82` never flips to `8.82 $` in RTL.
 * Dual-currency API strings (`$ 8.82 / ل.س 114,660`) stack on sale prices and stay
 * on one nowrap line when compact.
 */
export default function FormattedPrice({
    value,
    className,
    prominent = false,
    strikethrough = false,
    layout,
    compareValue,
}: FormattedPriceProps) {
    const currencyCode = useCurrencyOptional()?.currency;
    const displayValue = selectFormattedForCurrency(value, currencyCode);
    const displayCompare = compareValue
        ? selectFormattedForCurrency(compareValue, currencyCode)
        : undefined;
    const chunks = splitDualCurrencies(displayValue);
    const dual = chunks.length > 1;
    const stacked = layout === "stack" || (layout !== "inline" && prominent && dual);
    const pairs = displayCompare
        ? pairPriceChunks(displayValue, displayCompare)
        : null;

    const shell = (children: ReactNode, extra?: string) => (
        <span
            dir="ltr"
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
                                    : "text-[13px] font-semibold tracking-tight text-custom-secondary dark:text-zinc-300",
                            )}
                        >
                            <GlyphLine value={pair.sale} prominent={prominent && primary} />
                        </span>
                        {pair.original ? (
                            <span
                                className={cn(
                                    "inline-flex items-baseline font-medium leading-none text-custom-tertiary line-through decoration-custom-tertiary/50 dark:text-zinc-500 dark:decoration-zinc-600",
                                    primary ? "text-[13px]" : "text-[12px]",
                                )}
                            >
                                <GlyphLine value={pair.original} prominent={false} />
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
                <GlyphLine value={primary} prominent={prominent} />
                {rest.map((chunk) => (
                    <GlyphLine key={chunk} value={chunk} prominent={false} />
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
                <PriceGlyph value={chunk} prominent={prominent && i === 0} />
            </span>
        )),
        "inline-flex max-w-full items-baseline whitespace-nowrap tabular-nums",
    );
}

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { parsePriceParts } from "@/shared/lib/formatApiPrice";

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
};

function splitDualCurrencies(value: string): string[] {
    if (!value.includes(" / ")) return [value.trim()].filter(Boolean);
    return value
        .split(/\s*\/\s*/)
        .map((chunk) => chunk.trim())
        .filter(Boolean);
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
}: FormattedPriceProps) {
    const chunks = splitDualCurrencies(value);
    const dual = chunks.length > 1;
    const stacked = layout === "stack" || (layout !== "inline" && prominent && dual);

    const shell = (children: ReactNode, extra?: string) => (
        <span
            dir="ltr"
            className={cn(
                strikethrough && "line-through decoration-from-font",
                extra,
                className,
            )}
        >
            {children}
        </span>
    );

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

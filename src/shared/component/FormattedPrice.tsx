import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { parsePriceParts } from "@/shared/lib/formatApiPrice";

type FormattedPriceProps = {
    value: string;
    className?: string;
    /** Raised, slightly quieter currency glyph — use on the sale price. */
    prominent?: boolean;
    strikethrough?: boolean;
};

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

/**
 * Renders a money string in a stable LTR isolate so `$8.82` never flips to `8.82 $` in RTL.
 * Dual-currency API strings (`$ 25 / ل.س 325,000`) are split and rendered as two glyphs.
 */
export default function FormattedPrice({
    value,
    className,
    prominent = false,
    strikethrough = false,
}: FormattedPriceProps) {
    const chunks = value.includes(" / ")
        ? value
              .split(/\s*\/\s*/)
              .map((chunk) => chunk.trim())
              .filter(Boolean)
        : [value];

    const shell = (children: ReactNode) => (
        <span
            dir="ltr"
            className={cn(
                "inline-flex flex-wrap items-baseline tabular-nums",
                strikethrough && "line-through decoration-from-font",
                className,
            )}
        >
            {children}
        </span>
    );

    if (chunks.length > 1) {
        return shell(
            chunks.map((chunk, i) => (
                <span key={`${chunk}-${i}`} className="inline-flex items-baseline">
                    {i > 0 ? (
                        <span className="mx-1 font-medium opacity-40">/</span>
                    ) : null}
                    <PriceGlyph value={chunk} prominent={prominent} />
                </span>
            )),
        );
    }

    return shell(<PriceGlyph value={value} prominent={prominent} />);
}

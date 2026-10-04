import { cn } from "@/shared/lib/utils";

export type CardPriceSize = "sm" | "md" | "lg";

export type CardPriceProps = {
    price: string;
    originalPrice?: string;
    size?: CardPriceSize;
    className?: string;
    /** Stack original below sale price (default) or inline on one row. */
    layout?: "stack" | "inline";
};

const priceSizeClass: Record<CardPriceSize, string> = {
    sm: "text-[0.9375rem] font-bold leading-tight sm:text-base",
    md: "text-base font-extrabold leading-tight sm:text-lg",
    lg: "text-lg font-extrabold leading-none sm:text-xl",
};

const originalSizeClass: Record<CardPriceSize, string> = {
    sm: "text-[11px] sm:text-xs",
    md: "text-xs sm:text-sm",
    lg: "text-sm",
};

/**
 * Responsive price block for product / basket / flash-sale cards.
 * Uses solid brand color (no bg-clip-text) so prices stay legible on tinted surfaces.
 */
export default function CardPrice({
    price,
    originalPrice,
    size = "md",
    className,
    layout = "stack",
}: CardPriceProps) {
    return (
        <div
            className={cn(
                "min-w-0",
                layout === "inline"
                    ? "flex flex-wrap items-baseline gap-x-2 gap-y-0.5"
                    : "flex flex-col gap-0.5",
                className,
            )}
        >
            <span
                className={cn(
                    "block max-w-full truncate tabular-nums tracking-tight text-[var(--color-main)] dark:text-white",
                    priceSizeClass[size],
                )}
                title={price}
            >
                {price}
            </span>
            {originalPrice && (
                <span
                    className={cn(
                        "max-w-full truncate font-medium text-custom-tertiary/90 line-through decoration-custom-tertiary/50 dark:text-zinc-500 dark:decoration-zinc-600",
                        originalSizeClass[size],
                    )}
                    title={originalPrice}
                >
                    {originalPrice}
                </span>
            )}
        </div>
    );
}

import FormattedPrice from "@/shared/component/FormattedPrice";
import { splitSavingsLabel } from "@/shared/lib/formatApiPrice";
import { cn } from "@/shared/lib/utils";

export type PriceBlockSize = "xs" | "sm" | "md" | "lg" | "xl";

type PriceBlockProps = {
    /** Final price after discount. */
    price: string;
    /** List price, shown struck through on the second line. */
    originalPrice?: string | null;
    /** Savings copy, e.g. "وفرت $1.20" or "You saved $1.20". */
    savings?: string | null;
    size?: PriceBlockSize;
    align?: "start" | "center" | "end";
    className?: string;
};

const saleSize: Record<PriceBlockSize, string> = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-[1.35rem] tracking-tight sm:text-[1.45rem]",
    lg: "text-[1.85rem] leading-none sm:text-[2rem]",
    xl: "text-3xl leading-none sm:text-4xl",
};

const metaSize: Record<PriceBlockSize, string> = {
    xs: "text-[11px]",
    sm: "text-xs",
    md: "text-[13px]",
    lg: "text-sm",
    xl: "text-base sm:text-lg",
};

const alignClass = {
    start: "items-start text-start",
    center: "items-center text-center",
    end: "items-end text-end",
} as const;

/**
 * One price layout for every card and page:
 * line 1 — final price in black
 * line 2 — struck list price in gray, a slash, then savings in green
 */
export default function PriceBlock({
    price,
    originalPrice,
    savings,
    size = "md",
    align = "start",
    className,
}: PriceBlockProps) {
    const sale = price.trim();
    if (!sale) return null;

    const original = originalPrice?.trim() || undefined;
    const savedRaw = savings?.trim() || undefined;
    const saved = savedRaw ? splitSavingsLabel(savedRaw) : null;
    const showMeta = Boolean(original || saved);

    return (
        <div
            className={cn(
                "flex min-w-0 flex-col gap-1",
                alignClass[align],
                className,
            )}
        >
            <FormattedPrice
                value={sale}
                layout="inline"
                className={cn(
                    "font-bold text-black dark:text-white",
                    saleSize[size],
                )}
            />
            {showMeta ? (
                <div
                    className={cn(
                        "flex max-w-full flex-wrap items-baseline gap-x-1.5 gap-y-0.5",
                        align === "center" && "justify-center",
                        align === "end" && "justify-end",
                    )}
                >
                    {original ? (
                        <FormattedPrice
                            value={original}
                            strikethrough
                            className={cn(
                                "font-medium text-[#9CA3AF] decoration-[#9CA3AF] dark:text-zinc-400 dark:decoration-zinc-500",
                                metaSize[size],
                            )}
                        />
                    ) : null}
                    {original && saved ? (
                        <span
                            className={cn(
                                "font-medium text-[#9CA3AF] dark:text-zinc-400",
                                metaSize[size],
                            )}
                            aria-hidden
                        >
                            /
                        </span>
                    ) : null}
                    {saved ? (
                        <span
                            className={cn(
                                "inline-flex items-baseline gap-1 font-semibold text-[var(--color-success)]",
                                metaSize[size],
                            )}
                        >
                            {saved.label ? <span>{saved.label}</span> : null}
                            <FormattedPrice
                                value={saved.amount}
                                className="font-semibold text-[var(--color-success)]"
                            />
                        </span>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

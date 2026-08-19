import { Flame, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";
import Rating from "@/shared/component/Rating";
import FavoriteButton from "@/shared/component/FavoriteButton";
import LazyImage from "@/shared/component/LazyImage";

export type FlashSaleCardProps = {
    id: number;
    name: string;
    description?: string;
    image: string;
    /** Price after discount (formatted). */
    price: string;
    /** Original price before discount (formatted) — shown struck-through. */
    originalPrice?: string;
    /** Saved amount (formatted), e.g. "$0.60". */
    savings?: string;
    /** Discount badge text, e.g. "-15%". */
    discountLabel?: string;
    rating: number;
    sold?: number;
    isFavorite?: boolean;
    /** Campaign colors (section main/second) — drive the card's accent gradient. */
    mainColor?: string | null;
    secondColor?: string | null;
    t?: (key: string) => string;
    onClick?: (id: number) => void;
    onToggleFavorite?: (id: number) => void;
};

/**
 * Dedicated, campaign-styled card used only inside flash-sale rows. Intentionally
 * NOT the shared ProductCard: it leans into the urgency look (flame accents, the
 * discount + savings called out on the image, a gradient sale price and a "selling
 * fast" meter) so the offer reads as a limited deal at a glance.
 */
export default function FlashSaleCard({
    id,
    name,
    description,
    image,
    price,
    originalPrice,
    savings,
    discountLabel,
    rating,
    sold,
    isFavorite = false,
    mainColor,
    secondColor,
    t,
    onClick,
    onToggleFavorite,
}: FlashSaleCardProps) {
    const primary = mainColor?.trim() || "#ff4d6d";
    const secondary = secondColor?.trim() || "#ffb703";
    const saveLabel = t?.("flashSale.save") ?? "Save";
    const soldLabel = t?.("product.sold") ?? "Sold";
    const accentGradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]",
                "border border-stone-200/70 bg-white",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-16px_rgba(15,23,42,0.22)]",
                "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_26px_60px_-22px_rgba(15,23,42,0.32)]",
                "dark:border-white/[0.08] dark:bg-[var(--color-bg-card-elevated)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_18px_44px_-20px_rgba(0,0,0,0.6)]",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                onClick &&
                    "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[var(--color-bg-card-elevated)]",
            )}
            onClick={() => onClick?.(id)}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") onClick(id);
            }}
        >
            {/* Accent halo that fades in on hover (premium colored glow) */}
            <span
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-[1.75rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(120% 90% at 50% -10%, ${primary}22, transparent 60%)`,
                }}
            />

            {/* Image — inset frame for a calmer, gallery-like look */}
            <div className="relative z-[1] shrink-0 p-2.5 pb-0">
                <div className="relative h-44 overflow-hidden rounded-[1.25rem] bg-stone-100 ring-1 ring-inset ring-black/[0.04] sm:h-48 dark:bg-[#0B0B0C] dark:ring-white/[0.06]">
                    <LazyImage
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.07] motion-reduce:group-hover:scale-100"
                        wrapperClassName="h-full w-full"
                    />
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 via-black/[0.06] to-transparent"
                        aria-hidden
                    />

                    {/* Discount badge — flame chip, always red so the saving reads as a discount (top-start) */}
                    {discountLabel && (
                        <div className="absolute start-3 top-3 z-10 inline-flex items-center gap-1 rounded-xl bg-red-600 px-2.5 py-1 text-[11px] font-extrabold tracking-tight text-white shadow-lg shadow-black/10 ring-1 ring-white/25 backdrop-blur-[2px]">
                            <Flame className="h-3.5 w-3.5 drop-shadow-sm" />
                            {discountLabel}
                        </div>
                    )}

                    {/* Wishlist — frosted, perfectly round chip (top-end) */}
                    <div className="absolute end-3 top-3 z-20 rounded-full bg-white/85 p-[3px] shadow-md ring-1 ring-stone-900/[0.06] backdrop-blur-md transition-transform duration-300 group-hover:scale-105 dark:bg-[rgba(16,17,20,0.85)] dark:ring-white/10">
                        <FavoriteButton
                            isFavorite={isFavorite}
                            onToggle={(e) => {
                                e.stopPropagation();
                                onToggleFavorite?.(id);
                            }}
                            size="md"
                            ariaLabel="Toggle favorite"
                        />
                    </div>

                    {/* Savings (bottom-end on image) */}
                    {savings && (
                        <div className="absolute bottom-2.5 end-2.5 z-10 inline-flex items-center gap-1 rounded-lg bg-emerald-500/95 px-2 py-0.5 text-[11px] font-bold text-white shadow-md ring-1 ring-white/20 backdrop-blur-[2px]">
                            {saveLabel} {savings}
                        </div>
                    )}

                    {/* Rating (bottom-start) */}
                    <div className="absolute bottom-2.5 start-2.5 z-10 rounded-full bg-white/90 px-2.5 py-1 shadow-md ring-1 ring-stone-900/[0.06] backdrop-blur-md dark:bg-[rgba(16,17,20,0.9)] dark:ring-white/10">
                        <Rating
                            rating={rating}
                            size="sm"
                            className="px-0 py-0 [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary dark:[&_span:last-child]:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3.5">
                <h3 className="line-clamp-1 text-[0.95rem] font-bold leading-snug tracking-[-0.01em] text-custom-primary dark:text-white">
                    {name}
                </h3>
                {description && (
                    <p className="mt-1 line-clamp-1 text-[12.5px] leading-relaxed text-custom-secondary/80 dark:text-zinc-400">
                        {description}
                    </p>
                )}

                {/* Price — sale price emphasized in campaign gradient, original muted */}
                <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="text-[1.6rem] font-extrabold tabular-nums leading-none tracking-[-0.02em] text-custom-primary dark:text-white">
                        {price}
                    </span>
                    {originalPrice && (
                        <span className="text-[13px] font-medium text-custom-tertiary/80 line-through decoration-custom-tertiary/40 dark:text-zinc-500">
                            {originalPrice}
                        </span>
                    )}
                </div>

                {/* "Selling fast" urgency meter + sold count */}
                <div className="mt-auto pt-3.5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                        <span
                            className="inline-flex items-center gap-1"
                            style={{ color: primary }}
                        >
                            <TrendingUp className="h-3 w-3" />
                            {t?.("flashSale.flashSale") ?? "Flash Sale"}
                        </span>
                        {sold != null && (
                            <span className="text-custom-secondary/70 dark:text-zinc-500">
                                {sold.toLocaleString()} {soldLabel}
                            </span>
                        )}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200/70 dark:bg-white/[0.08]">
                        <div
                            className="h-full rounded-full transition-[width] duration-500"
                            style={{
                                width: `${Math.min(
                                    Math.max((sold ?? 0) % 100, 14),
                                    92,
                                )}%`,
                                backgroundImage: accentGradient,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

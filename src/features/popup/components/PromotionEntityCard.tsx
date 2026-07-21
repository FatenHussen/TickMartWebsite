import { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import LazyImage from "@/shared/component/LazyImage";
import Rating from "@/shared/component/Rating";
import { cn } from "@/shared/lib/utils";
import { useCountdown } from "../hooks/useCountdown";
import type { PromotionListItem } from "../types";

type Props = {
    item: PromotionListItem;
    onSelect: (item: PromotionListItem) => void;
    /** Called once the item's countdown reaches zero, so the parent can drop it. */
    onExpire?: (key: string) => void;
};

/**
 * Generic, campaign-styled card for a single flattened promotion entity. Shows
 * the inherited promotion title as an eyebrow, the entity name/subtitle/image,
 * and an optional rating. Self-reports expiry via the inherited countdown.
 */
export default function PromotionEntityCard({ item, onSelect, onExpire }: Props) {
    const { isEnded } = useCountdown(item.endTime);
    const primary = item.mainColor?.trim() || "#ff4d6d";
    const secondary = item.secondColor?.trim() || "#ffb703";
    const accentGradient = `linear-gradient(135deg, ${primary}, ${secondary})`;

    // Expired items are visually disabled; once ended we notify the parent (in an
    // effect, not during render) so it can drop the dead entity from the list.
    useEffect(() => {
        if (isEnded) onExpire?.(item.key);
    }, [isEnded, item.key, onExpire]);

    const handleSelect = () => {
        if (isEnded) return;
        onSelect(item);
    };

    return (
        <div
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-[1.5rem]",
                "border border-stone-200/70 bg-white text-start",
                "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-16px_rgba(15,23,42,0.22)]",
                "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "dark:border-white/[0.08] dark:bg-[var(--color-bg-card-elevated)]",
                isEnded
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_26px_60px_-22px_rgba(15,23,42,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            )}
            onClick={handleSelect}
            role="button"
            aria-disabled={isEnded}
            tabIndex={isEnded ? -1 : 0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelect();
            }}
        >
            {/* Accent halo on hover */}
            <span
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-[1.5rem] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(120% 90% at 50% -10%, ${primary}22, transparent 60%)`,
                }}
            />

            {/* Image */}
            <div className="relative z-[1] shrink-0 p-2.5 pb-0">
                <div className="relative h-32 overflow-hidden rounded-[1.1rem] bg-stone-100 ring-1 ring-inset ring-black/[0.04] sm:h-36 dark:bg-[#0B0B0C] dark:ring-white/[0.06]">
                    {item.image ? (
                        <LazyImage
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-[1.07] motion-reduce:group-hover:scale-100"
                            wrapperClassName="h-full w-full"
                        />
                    ) : (
                        <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ background: accentGradient }}
                            aria-hidden
                        >
                            <Sparkles className="h-8 w-8 text-white/80" />
                        </div>
                    )}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 via-black/[0.06] to-transparent"
                        aria-hidden
                    />

                    {/* Promotion eyebrow chip */}
                    {item.promotionTitle && (
                        <div
                            className="absolute start-2.5 top-2.5 z-10 inline-flex max-w-[88%] items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-extrabold uppercase tracking-tight text-white shadow-lg shadow-black/10 ring-1 ring-white/25 backdrop-blur-[2px]"
                            style={{ background: primary }}
                        >
                            <Sparkles className="h-3 w-3 shrink-0 drop-shadow-sm" />
                            <span className="truncate">{item.promotionTitle}</span>
                        </div>
                    )}

                    {item.rating != null && (
                        <div className="absolute bottom-2 start-2 z-10 rounded-full bg-white/90 px-2.5 py-1 shadow-md ring-1 ring-stone-900/[0.06] backdrop-blur-md dark:bg-[rgba(16,17,20,0.9)] dark:ring-white/10">
                            <Rating rating={item.rating} size="sm" className="px-0 py-0" />
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="relative z-[1] flex min-h-0 flex-1 flex-col px-3.5 pb-3.5 pt-3">
                <h3 className="line-clamp-1 text-[0.9rem] font-bold leading-snug tracking-[-0.01em] text-custom-primary dark:text-white">
                    {item.name}
                </h3>
                {item.subtitle && (
                    <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-custom-secondary/80 dark:text-zinc-400">
                        {item.subtitle}
                    </p>
                )}

                <div className="mt-auto pt-3">
                    <span
                        className="inline-flex items-center gap-1 text-[12px] font-bold"
                        style={{ color: primary }}
                    >
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </span>
                </div>
            </div>
        </div>
    );
}

import { useTranslation } from "react-i18next";
import { HiChevronRight } from "react-icons/hi2";
import Rating from "../Rating";
import Badge from "../Badge";
import LazyImage from "../LazyImage";
import AnimatedButton from "@/shared/ui/AnimatedButton";
import Button from "@/shared/ui/Button";
import type { SectionCardVariant } from "@/features/home/types";
import { cn } from "../../lib/utils";
import {
    type ProductCardBadge,
    resolveProductCardBadgeLabel,
} from "./ProductCard";

type BrandCardProps = {
    name: string;
    image: string;
    rating: number;
    ordersCount?: number;
    badge?: ProductCardBadge | ProductCardBadge[];
    bottomBadges?: ProductCardBadge[];
    onClick?: () => void;
    className?: string;
    layout?: SectionCardVariant;
    surfaceColor?: string | null;
};

export default function BrandCard({
    name,
    image,
    rating,
    ordersCount,
    badge,
    bottomBadges,
    onClick,
    className,
    layout,
    surfaceColor,
}: BrandCardProps) {
    const { t } = useTranslation();
    const allBadges = badge
        ? Array.isArray(badge)
            ? badge
            : [badge]
        : [];
    const leftBadges = allBadges.filter((b) => (b.align ?? "left") === "left");
    const rightBadges = allBadges.filter((b) => b.align === "right");

    const imageFrameClass =
        layout === "horizontal"
            ? "h-32 sm:h-36"
            : layout === "vertical"
              ? "h-48 sm:h-52"
              : "h-36 sm:h-40";

    const showOrders =
        typeof ordersCount === "number" && !Number.isNaN(ordersCount);

    const footerBadgeClass = bottomBadges?.[0]?.className;
    const hasBottomBadgeRow = Boolean(bottomBadges && bottomBadges.length > 0);
    const showOpenCategoryButton = Boolean(onClick) && !hasBottomBadgeRow;

    return (
        <div
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={
                onClick ? t("brands.cardActionAria", { name }) : undefined
            }
            onClick={onClick}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={cn(
                "group relative z-0 flex h-full flex-col overflow-hidden rounded-2xl bg-white",
                "translate-y-0 transform-gpu will-change-transform [backface-visibility:hidden]",
                "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.08),0_18px_40px_-12px_rgba(0,0,0,0.12)]",
                "dark:shadow-[0_2px_8px_rgba(0,0,0,0.35),0_16px_36px_-8px_rgba(0,0,0,0.45)]",
                "transition-[transform,box-shadow] duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                "hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),0_20px_40px_-8px_rgba(0,0,0,0.16),0_32px_64px_-16px_rgba(0,0,0,0.2)]",
                "dark:hover:shadow-[0_10px_28px_rgba(0,0,0,0.5),0_28px_56px_-8px_rgba(0,0,0,0.6)]",
                onClick && "cursor-pointer",
                className,
            )}
        >
            {leftBadges.length > 0 && (
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                    {leftBadges.map((b, idx) => (
                        <Badge
                            key={idx}
                            label={resolveProductCardBadgeLabel(b)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b)}
                            className={cn(b.className || "bg-blue-500 text-white")}
                        />
                    ))}
                </div>
            )}
            {rightBadges.length > 0 && (
                <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
                    {rightBadges.map((b, idx) => (
                        <Badge
                            key={idx}
                            label={resolveProductCardBadgeLabel(b)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b)}
                            className={cn(b.className || "bg-yellow-400 text-black")}
                        />
                    ))}
                </div>
            )}
            <div className="flex w-full shrink-0 flex-col items-center bg-white px-4 pb-3 pt-4 dark:bg-bg-primary">
                <div
                    className={cn(
                        "relative w-full max-w-[200px] shrink-0 overflow-hidden rounded-xl bg-custom-card sm:max-w-none",
                        "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_16px_-2px_rgba(0,0,0,0.08)]",
                        "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_-4px_rgba(0,0,0,0.35)]",
                        "transition-[box-shadow] duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_8px_22px_-2px_rgba(0,0,0,0.1)]",
                        "dark:group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_28px_-4px_rgba(0,0,0,0.45)]",
                        imageFrameClass,
                    )}
                >
                    <LazyImage
                        src={image}
                        alt={name}
                        effect=""
                        wrapperClassName="absolute inset-0 block h-full w-full overflow-hidden"
                        className="h-full w-full object-contain object-center p-3"
                    />
                </div>
            </div>

            <div
                className="flex min-h-0 w-full flex-1 flex-col items-center px-4 pb-4 pt-3 dark:bg-bg-tertiary"
                style={
                    surfaceColor
                        ? { backgroundColor: surfaceColor }
                        : {
                              background:
                                  "color-mix(in srgb, var(--color-primary) 9%, #fff8f0)",
                          }
                }
            >
                <h3 className="mb-2 w-full text-center text-base font-bold text-stone-900 dark:text-custom-primary">
                    {name}
                </h3>

                <div className="flex justify-center">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="gap-1 [&>span:first-child]:text-yellow-500 [&>span:last-child]:font-medium [&>span:last-child]:text-stone-900 dark:[&>span:last-child]:text-custom-primary"
                    />
                </div>

                {showOrders && (
                    <p className="mt-2 text-center text-xs text-stone-500 dark:text-custom-secondary">
                        {t("brands.ordersCount", {
                            count: ordersCount,
                        })}
                    </p>
                )}

                {hasBottomBadgeRow && (
                    <div className="mt-auto flex w-full flex-col gap-2 pt-3">
                        {bottomBadges!.slice(0, 1).map((b, idx) => {
                            const text = resolveProductCardBadgeLabel(b);
                            return (
                                <AnimatedButton
                                    key={idx}
                                    variant="primary"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className={cn(
                                        "w-full justify-center text-xs font-semibold",
                                        b.className,
                                    )}
                                    note={{ primary: text, secondary: text }}
                                />
                            );
                        })}
                    </div>
                )}

                {showOpenCategoryButton && (
                    <div className="mt-auto w-full shrink-0 pt-3">
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            fullWidth
                            aria-label={t("brands.openCategory")}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.();
                            }}
                            className={cn(
                                "rounded-xl border-2 border-white/25 bg-gradient-to-b from-primary to-primary/90 py-2.5 text-sm font-semibold shadow-md ring-1 ring-black/5 transition duration-300 ease-linear hover:brightness-105 dark:border-white/15 dark:ring-white/10",
                                footerBadgeClass,
                            )}
                        >
                            <span className="inline-flex w-full items-center justify-center gap-1.5">
                                {t("brands.openCategory")}
                                <HiChevronRight
                                    className="h-4 w-4 shrink-0 opacity-90"
                                    aria-hidden
                                />
                            </span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

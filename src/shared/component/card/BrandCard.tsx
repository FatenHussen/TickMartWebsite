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
                "group relative z-0 flex h-full flex-col overflow-hidden rounded-3xl",
                "border border-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-border-primary))]",
                "bg-[var(--color-bg-card)]",
                "dark:border-white/[0.12] dark:bg-[var(--color-bg-card-elevated)]",
                "translate-y-0 transform-gpu will-change-transform [backface-visibility:hidden]",
                "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_-4px_rgba(0,0,0,0.08),0_18px_40px_-12px_rgba(0,0,0,0.12)]",
                "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_28px_-10px_rgba(0,0,0,0.5)]",
                "transition-[transform,box-shadow] duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                "hover:-translate-y-1 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),0_20px_40px_-8px_rgba(0,0,0,0.16),0_32px_64px_-16px_rgba(0,0,0,0.2)]",
                "dark:hover:border-white/[0.18] dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.09),0_14px_44px_-14px_rgba(0,0,0,0.62)]",
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
            <div className="flex w-full shrink-0 flex-col items-stretch bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--color-bg-card))] px-0 pb-3 pt-4 dark:bg-[#0B0B0C]">
                <div
                    className={cn(
                        "relative w-full shrink-0 overflow-hidden rounded-xl bg-custom-card",
                        "dark:bg-[#121316] dark:ring-1 dark:ring-white/[0.06]",
                        "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-primary)_22%,white),0_4px_16px_-2px_rgba(0,0,0,0.08)]",
                        "dark:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_10%,transparent),0_6px_22px_-10px_rgba(0,0,0,0.55)]",
                        "transition-[box-shadow] duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-primary)_28%,white),0_8px_22px_-2px_rgba(0,0,0,0.1)]",
                        "dark:group-hover:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_14%,transparent),0_10px_28px_-10px_rgba(0,0,0,0.62)]",
                        imageFrameClass,
                    )}
                >
                    <LazyImage
                        src={image}
                        alt={name}
                        effect=""
                        wrapperClassName="absolute inset-0 block h-full w-full overflow-hidden"
                        className="h-full w-full object-contain object-center"
                    />
                </div>
            </div>

            <div
                className={cn(
                    "flex min-h-0 w-full flex-1 flex-col items-center px-4 pb-4 pt-3",
                    !surfaceColor &&
                        "bg-[color-mix(in_srgb,var(--color-primary)_9%,var(--color-bg-card))] dark:bg-[color-mix(in_srgb,var(--color-bg-card-elevated)_88%,var(--color-bg-tertiary)_12%)]",
                )}
                style={
                    surfaceColor ? { backgroundColor: surfaceColor } : undefined
                }
            >
                <h3 className="mb-2 w-full text-center text-base font-bold text-[var(--color-text-primary)] dark:text-white">
                    {name}
                </h3>

                <div className="flex justify-center">
                    <Rating
                        rating={rating}
                        size="sm"
                        className="gap-1 [&>span:first-child]:text-yellow-500 [&>span:last-child]:font-medium [&>span:last-child]:text-[var(--color-text-primary)] dark:[&>span:last-child]:text-white"
                    />
                </div>

                {showOrders && (
                    <p
                        className={cn(
                            "mt-2 text-center text-xs",
                            surfaceColor
                                ? "text-white"
                                : "text-[var(--color-text-muted)] dark:text-zinc-400",
                        )}
                    >
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
                                        "[&_.ab-track_.ab-row:first-child]:text-[var(--color-text-primary)] [&_.ab-track_.ab-row:last-child]:text-white",
                                        "dark:[&_.ab-track_.ab-row:first-child]:text-white dark:[&_.ab-track_.ab-row:last-child]:text-zinc-400",
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
                                "rounded-xl border border-white/10 bg-gradient-to-b from-[var(--color-main)] to-[color-mix(in_srgb,var(--color-main)_78%,var(--color-api-second))] py-2.5 text-sm font-semibold text-white shadow-md ring-1 ring-black/5 transition duration-300 ease-linear hover:brightness-105",
                                "dark:border-white/[0.12] dark:from-[var(--color-main)] dark:to-[var(--color-api-second)] dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_10px_28px_-8px_rgba(0,0,0,0.55)] dark:ring-1 dark:ring-white/[0.08] dark:hover:brightness-110",
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

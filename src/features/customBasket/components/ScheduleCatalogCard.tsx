import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiChevronRight } from "react-icons/hi2";
import Badge from "@/shared/component/Badge";
import { cn } from "@/shared/lib/utils";
import {
    mapApiBottomBadgesToProductCard,
    mapApiTopBadgesToProductCard,
} from "@/shared/lib/mapProductBadges";
import { resolveProductCardBadgeLabel } from "@/shared/component/card/ProductCard";
import { paths } from "@/app/routes/path/paths";
import type { ScheduleItem } from "@/features/cart/types";

function isSameCopy(a: string, b: string) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}

type ScheduleCatalogCardProps = {
    schedule: ScheduleItem;
    index?: number;
    /** Home/section rows: vertical card with a circular image. */
    appearance?: "catalog" | "section";
};

export default function ScheduleCatalogCard({
    schedule,
    index = 0,
    appearance = "catalog",
}: ScheduleCatalogCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const cover =
        schedule.image ||
        schedule.images?.find(Boolean) ||
        "";

    const topBadges = mapApiTopBadgesToProductCard(schedule.top_badges) ?? [];
    const bottomBadges =
        mapApiBottomBadgesToProductCard(schedule.bottom_badges) ?? [];

    const discountLabel =
        schedule.discount_type === "percentage" && schedule.discount_value > 0
            ? t("customBasket.percentageOff", { value: schedule.discount_value })
            : schedule.discount_type === "fixed" && schedule.discount_value > 0
              ? t("customBasket.fixedOff", { value: schedule.discount_value })
              : null;

    const intervalCopy =
        schedule.interval_days > 0
            ? t("customBasket.everyNDays", { days: schedule.interval_days })
            : "";
    const description = schedule.description?.trim() ?? "";
    const showDescription =
        description.length > 0 &&
        !isSameCopy(description, schedule.name) &&
        !isSameCopy(description, intervalCopy);

    const name = useMemo(() => {
        const value = schedule.name?.trim() ?? "";
        if (!value) return t("customBasket.title");
        return value.charAt(0).toUpperCase() + value.slice(1);
    }, [schedule.name, t]);

    const goToCustomize = () =>
        navigate(paths.client.scheduleCustomize(schedule.id));

    const badgeRow =
        topBadges.length > 0 || bottomBadges.length > 0 ? (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {[...topBadges, ...bottomBadges].slice(0, 2).map((b, idx) => (
                    <Badge
                        key={idx}
                        label={resolveProductCardBadgeLabel(b, t)}
                        type={b.type}
                        imageSrc={b.image}
                        imageAlt={resolveProductCardBadgeLabel(b, t)}
                        className={cn(b.className)}
                        style={b.style}
                    />
                ))}
            </div>
        ) : null;

    if (appearance === "section") {
        return (
            <button
                type="button"
                onClick={goToCustomize}
                style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                className={cn(
                    "animate-card-enter group flex h-full w-full flex-col items-center rounded-[1.75rem] px-3 py-5 text-center",
                    "border border-stone-200 bg-white",
                    "shadow-[0_8px_24px_-12px_rgba(28,25,23,0.16)]",
                    "transition-[transform,box-shadow,border-color] duration-300",
                    "hover:-translate-y-1 hover:border-stone-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AED1] focus-visible:ring-offset-2",
                    "dark:border-white/12 dark:bg-zinc-900 dark:shadow-none dark:hover:border-white/20",
                    "motion-reduce:hover:translate-y-0 motion-reduce:transition-none",
                )}
            >
                <div className="h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-full bg-stone-100 ring-2 ring-white dark:bg-zinc-800 dark:ring-white/10 sm:h-24 sm:w-24">
                    {cover ? (
                        <img
                            src={cover}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                            {schedule.interval_days || "—"}
                        </span>
                    )}
                </div>
                <h3 className="mt-4 line-clamp-2 text-[0.95rem] font-semibold tracking-[-0.03em] text-zinc-900 dark:text-white">
                    {name}
                </h3>
                {intervalCopy ? (
                    <p className="mt-1 text-[12px] text-stone-500 dark:text-zinc-400">
                        {intervalCopy}
                    </p>
                ) : null}
                {discountLabel ? (
                    <span className="mt-2 inline-flex rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400">
                        {discountLabel}
                    </span>
                ) : null}
                {badgeRow}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={goToCustomize}
            style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
            className={cn(
                "animate-card-enter group flex h-full flex-col rounded-[1.85rem] p-5 text-start sm:p-6",
                "border border-stone-200 bg-white",
                "shadow-[0_8px_24px_-12px_rgba(28,25,23,0.16),0_2px_8px_rgba(28,25,23,0.05)]",
                "transition-[transform,box-shadow,border-color] duration-300",
                "hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_16px_36px_-16px_rgba(28,25,23,0.22)]",
                "motion-reduce:hover:translate-y-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00AED1] focus-visible:ring-offset-2",
                "dark:border-white/12 dark:bg-zinc-900 dark:shadow-none dark:hover:border-white/20",
                "motion-reduce:transition-none",
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="leading-none">
                    <p className="animate-schedules-float text-[2.75rem] font-semibold tracking-[-0.06em] text-zinc-900 dark:text-white sm:text-[3.15rem]">
                        {schedule.interval_days || "—"}
                    </p>
                    {schedule.interval_days ? (
                        <p className="mt-1 text-[13px] font-medium text-[#0A8AA8] dark:text-[#7AD4EA]">
                            {t("customBasket.daysUnit")}
                        </p>
                    ) : null}
                </div>
                {cover ? (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-stone-100 ring-2 ring-white sm:h-16 sm:w-16">
                        <img
                            src={cover}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : null}
            </div>

            <h3 className="mt-5 line-clamp-2 text-[1.05rem] font-semibold tracking-[-0.03em] text-zinc-900 sm:text-[1.15rem] dark:text-white">
                {name}
            </h3>
            {intervalCopy ? (
                <p className="mt-1.5 text-[13px] text-stone-500 dark:text-zinc-400">
                    {intervalCopy}
                </p>
            ) : null}
            {showDescription ? (
                <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-stone-500 dark:text-zinc-400">
                    {description}
                </p>
            ) : null}

            {discountLabel ? (
                <span className="mt-3 inline-flex self-start rounded-full bg-red-50 px-2.5 py-1 text-[12px] font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400">
                    {discountLabel}
                </span>
            ) : null}

            {(topBadges.length > 0 || bottomBadges.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {[...topBadges, ...bottomBadges].slice(0, 2).map((b, idx) => (
                        <Badge
                            key={idx}
                            label={resolveProductCardBadgeLabel(b, t)}
                            type={b.type}
                            imageSrc={b.image}
                            imageAlt={resolveProductCardBadgeLabel(b, t)}
                            className={cn(b.className)}
                            style={b.style}
                        />
                    ))}
                </div>
            )}

            <span className="mt-auto flex pt-5">
                <span className="inline-flex h-10 w-full items-center justify-center gap-0.5 rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white transition-colors duration-200 group-hover:bg-primary dark:bg-white dark:text-zinc-900 dark:group-hover:bg-primary dark:group-hover:text-white">
                    {t("customBasket.startCustomizing")}
                    <HiChevronRight className="h-4 w-4 shrink-0 rtl:rotate-180" />
                </span>
            </span>
        </button>
    );
}

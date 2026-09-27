import type { TFunction } from "i18next";
import { normalizeDeliveryTime } from "@/features/cart/lib/scheduleDeliveryTime";
import type { MyBasketListItem } from "../../../types/myBasket";

function parseBasketDate(iso: string): Date | null {
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
    if (dateOnly) {
        const parsed = new Date(
            Number(dateOnly[1]),
            Number(dateOnly[2]) - 1,
            Number(dateOnly[3]),
        );
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsedDate = new Date(iso);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatBasketListDate(iso: string): string {
    const parsedDate = parseBasketDate(iso);
    if (!parsedDate) return iso;

    return parsedDate.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** `21 Oct 2026 · 16:30`, or the date alone when `delivery_time` is null. */
export function formatScheduledDeliveryStamp(
    iso: string,
    deliveryTime?: string | null,
): string {
    const dateLabel = formatBasketListDate(iso);
    const time = normalizeDeliveryTime(deliveryTime);
    if (!time) return dateLabel;
    return `${dateLabel} · ${time}`;
}

export function getBasketPriceDisplay(basket: MyBasketListItem) {
    const currencySymbol = basket.currency_symbol ?? "$";
    const originalPrice =
        basket.original_price_formatted ??
        `${currencySymbol}${Number(basket.original_price).toFixed(2)}`;
    const finalPrice =
        basket.final_price_formatted ??
        `${currencySymbol}${Number(basket.final_price).toFixed(2)}`;
    const discountAmount =
        basket.discount_amount_formatted ??
        `${currencySymbol}${Number(basket.discount_amount).toFixed(2)}`;

    return {
        original: originalPrice,
        final: finalPrice,
        save: discountAmount,
    };
}

export function getDiscountBadgeText(
    basket: MyBasketListItem,
    t: TFunction,
): string {
    if (basket.discount_type === "percentage") {
        const numericValue = Number.parseFloat(basket.discount_value);
        const roundedPercentage = Number.isFinite(numericValue)
            ? Math.round(numericValue)
            : basket.discount_value;
        return t("baskets.discountPercentOff", { value: roundedPercentage });
    }

    return t("baskets.discountAmountOff", { value: basket.discount_value });
}

export function getBasketCategoryName(basket: MyBasketListItem): string {
    if (!("category" in basket) || !basket.category) return "";

    const basketCategory = basket.category;
    if (typeof basketCategory === "string") return basketCategory;
    return basketCategory.name;
}

export function getBasketScheduleSubtitle(
    basket: MyBasketListItem,
    t: TFunction
): string {
    const schedule = basket.schedules?.[0];
    if (!schedule) return "";

    const frequencyLabel = `${t("baskets.every")} ${schedule.number_of_days} ${t("baskets.days")}`;
    if (schedule.title?.trim()) {
        return `${schedule.title.trim()} • ${frequencyLabel}`;
    }

    return frequencyLabel;
}

export function getBasketNextRunDate(basket: MyBasketListItem): string {
    if ("next_run_date" in basket && basket.next_run_date) {
        return basket.next_run_date;
    }

    return "";
}

export function getBasketDeliveryTime(basket: MyBasketListItem): string | null {
    if (basket.basket_type !== "user-schedule") return null;
    return normalizeDeliveryTime(basket.delivery_time);
}

export function getBasketCreatedRawDate(basket: MyBasketListItem): string {
    return ("start_date" in basket && basket.start_date) || basket.created_at || "";
}

export function getBasketTypeBadgeLabel(
    basketType: MyBasketListItem["basket_type"],
    t: TFunction
): string {
    if (basketType === "user-schedule") {
        return t("baskets.scheduled");
    }

    if (basketType === "subscription") {
        return t("baskets.subscription");
    }

    return t("baskets.filters.custom");
}


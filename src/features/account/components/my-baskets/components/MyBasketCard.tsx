import { useTranslation } from "react-i18next";
import { Trash2, Calendar, Pencil, Pause, Play, ShoppingBag } from "lucide-react";
import Button from "@/shared/ui/Button";
import type { MyBasketListItem } from "../../../types/myBasket";
import {
    CARD_BORDER_CLASS,
    PRIMARY_ACTION_BUTTON_CLASS,
    SECONDARY_BUTTON_CLASS,
} from "../constants";
import {
    formatBasketListDate,
    getBasketCategoryName,
    getBasketCreatedRawDate,
    getBasketNextRunDate,
    getBasketPriceDisplay,
    getBasketScheduleSubtitle,
    getBasketTypeBadgeLabel,
    getDiscountBadgeText,
} from "../utils/basketDisplay";

type MyBasketCardProps = {
    basket: MyBasketListItem;
    onViewDetails: (basket: MyBasketListItem) => void;
    onEditItems: (basket: MyBasketListItem) => void;
    onPauseResume: (basket: MyBasketListItem) => void;
    onDelete: (basket: MyBasketListItem) => void;
    isPauseResumePending: boolean;
};

export default function MyBasketCard({
    basket,
    onViewDetails,
    onEditItems,
    onPauseResume,
    onDelete,
    isPauseResumePending,
}: MyBasketCardProps) {
    const { t } = useTranslation();

    const isBasketPaused = basket.is_paused ?? !basket.is_active;
    const isScheduledBasket = basket.basket_type === "user-schedule";
    const isSubscriptionBasket = basket.basket_type === "subscription";
    const shouldShowPauseResumeButton = isScheduledBasket || isSubscriptionBasket;

    const categoryName = getBasketCategoryName(basket);
    const scheduleSubtitle = getBasketScheduleSubtitle(basket, t);
    const nextRunDate = getBasketNextRunDate(basket);
    const prices = getBasketPriceDisplay(basket);
    const hasDiscount = basket.discount_amount > 0;

    const createdRawDate = getBasketCreatedRawDate(basket);
    const createdDateLabel = createdRawDate ? formatBasketListDate(createdRawDate) : "";

    const basketTypeBadgeLabel = getBasketTypeBadgeLabel(basket.basket_type, t);

    const itemsCategoryLine = [`${basket.num_varieties} ${t("checkout.items")}`, categoryName]
        .filter(Boolean)
        .join(" • ");

    const nextDeliveryLine = (() => {
        if (isBasketPaused && (basket.paused_at || nextRunDate)) {
            const pausedReferenceDate = basket.paused_at ?? nextRunDate ?? "";
            return `${t("baskets.pausedSince")} ${
                pausedReferenceDate
                    ? formatBasketListDate(pausedReferenceDate)
                    : pausedReferenceDate
            }`;
        }

        if (!isBasketPaused && nextRunDate) {
            return `${t("baskets.nextDelivery")}: ${formatBasketListDate(nextRunDate)}`;
        }

        return "";
    })();

    const statusBadgeClassName = isBasketPaused
        ? "bg-[var(--color-ui-amber-100)] text-[var(--color-ui-amber-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-amber-900)_30%,transparent)] dark:text-[var(--color-ui-amber-400)]"
        : "bg-[var(--color-ui-green-100)] text-success dark:bg-[color-mix(in_srgb,var(--color-ui-green-900)_30%,transparent)] dark:text-[var(--color-ui-green-400)]";

    const pauseResumeIcon = isBasketPaused ? (
        <Play className="w-4 h-4 shrink-0" />
    ) : (
        <Pause className="w-4 h-4 shrink-0" />
    );
    const pauseResumeLabel = isBasketPaused
        ? t("baskets.resumeBasket")
        : t("baskets.pauseBasket");
    const scheduleButtonLabel = isBasketPaused
        ? t("baskets.reschedule")
        : t("baskets.editSchedule");

    return (
        <div
            className={`bg-[var(--color-bg-primary)] dark:bg-custom-card rounded-xl ${CARD_BORDER_CLASS} border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow`}
        >
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3 min-w-0 flex-wrap">
                    {basket.image ? (
                        <img
                            src={basket.image}
                            alt=""
                            className="w-11 h-11 rounded-xl object-cover shrink-0 border border-border-accent-light dark:border-custom-primary"
                        />
                    ) : (
                        <div
                            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center bg-[var(--color-ui-amber-50)] dark:bg-[color-mix(in_srgb,var(--color-ui-amber-900)_20%,transparent)] border border-border-accent-light dark:border-custom-primary"
                            aria-hidden
                        >
                            <ShoppingBag className="w-6 h-6 text-[var(--color-ui-amber-800)]/80 dark:text-[color-mix(in_srgb,var(--color-ui-amber-200)_90%,transparent)]" />
                        </div>
                    )}
                    <h3 className="font-semibold text-lg text-custom-primary shrink-0">
                        {basket.name}
                    </h3>
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClassName}`}
                    >
                        {isBasketPaused ? t("baskets.paused") : t("baskets.active")}
                    </span>
                    {hasDiscount ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-ui-sky-100)] text-[var(--color-ui-sky-800)] dark:bg-[color-mix(in_srgb,var(--color-ui-sky-900)_30%,transparent)] dark:text-[var(--color-ui-sky-300)]">
                            {getDiscountBadgeText(basket, t)}
                        </span>
                    ) : null}
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-gray-bold)] text-custom-primary dark:bg-[var(--color-bg-tertiary)] dark:text-custom-secondary shrink-0">
                    {basketTypeBadgeLabel}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-5">
                <div className="space-y-1.5 text-sm text-text-secondary dark:text-custom-secondary">
                    <p>{itemsCategoryLine}</p>
                    {scheduleSubtitle ? <p>{scheduleSubtitle}</p> : null}
                    {nextDeliveryLine ? <p>{nextDeliveryLine}</p> : null}
                </div>
                <div className="space-y-1.5 text-sm md:text-end text-text-secondary dark:text-custom-secondary">
                    <p>
                        {t("trackOrder.items")}: {basket.num_varieties}
                    </p>
                    {hasDiscount ? (
                        <>
                            <p>
                                <span className="line-through text-[var(--color-text-tertiary)] dark:text-[var(--color-text-tertiary)]">
                                    {prices.original}
                                </span>{" "}
                                <span className="font-semibold text-custom-primary">
                                    {prices.final}
                                </span>
                            </p>
                            <p className="text-success dark:text-[var(--color-ui-green-400)] font-medium">
                                {t("baskets.youSave")} {prices.save}
                            </p>
                        </>
                    ) : (
                        <p className="font-semibold text-custom-primary">{prices.final}</p>
                    )}
                    {createdDateLabel ? (
                        <p className="text-xs text-[var(--color-text-tertiary)] dark:text-[var(--color-text-tertiary)] pt-0.5">
                            {t("baskets.createdOn")}: {createdDateLabel}
                        </p>
                    ) : null}
                </div>
            </div>

            <div
                className={`flex flex-wrap items-center gap-3 pt-4 border-t ${CARD_BORDER_CLASS} dark:border-custom-primary`}
            >
                <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => onViewDetails(basket)}
                    className={PRIMARY_ACTION_BUTTON_CLASS}
                >
                    {t("baskets.viewBasketDetails")}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditItems(basket)}
                    className={SECONDARY_BUTTON_CLASS}
                >
                    <Pencil className="w-4 h-4 shrink-0" />
                    {t("baskets.editItems")}
                </Button>

                {isScheduledBasket ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(basket)}
                        className={SECONDARY_BUTTON_CLASS}
                    >
                        <Calendar className="w-4 h-4 shrink-0" />
                        {scheduleButtonLabel}
                    </Button>
                ) : null}

                {shouldShowPauseResumeButton ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isPauseResumePending}
                        onClick={() => onPauseResume(basket)}
                        className={SECONDARY_BUTTON_CLASS}
                    >
                        {pauseResumeIcon}
                        {pauseResumeLabel}
                    </Button>
                ) : null}

                {isScheduledBasket ? (
                    <button
                        type="button"
                        onClick={() => onDelete(basket)}
                        className="flex items-center gap-1.5 ms-auto text-sm text-[var(--color-ui-red-500)] hover:text-[var(--color-ui-red-600)] dark:text-[var(--color-ui-red-400)] dark:hover:text-[var(--color-ui-red-400)]"
                    >
                        <Trash2 className="w-4 h-4 shrink-0" />
                        {t("baskets.deleteBasket")}
                    </button>
                ) : null}
            </div>
        </div>
    );
}


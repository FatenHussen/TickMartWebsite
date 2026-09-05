import { useTranslation } from "react-i18next";
import { HiTrash } from "react-icons/hi2";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import FormattedPrice from "@/shared/component/FormattedPrice";
import { PremiumInlineLoader } from "@/shared/component/loading";
import QtyStepper from "./QtyStepper";
import type { CustomBasketState } from "../types";
import type { UseMutationResult } from "@tanstack/react-query";

type CustomBasketPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    basket: CustomBasketState;
    isLoading: boolean;
    onConfirm: () => void;
    updateItem: UseMutationResult<
        CustomBasketState,
        Error,
        { itemId: number; quantity: number },
        unknown
    >;
    deleteItem: UseMutationResult<CustomBasketState | void, Error, number, unknown>;
};

function formatDiscount(
    type: string | null | undefined,
    value: number | null | undefined,
    t: (key: string, opts?: Record<string, unknown>) => string,
) {
    if (value == null || value <= 0 || !type || type === "none") return null;
    if (type === "percentage") {
        return t("customBasket.percentageOff", { value });
    }
    return t("customBasket.fixedOff", { value });
}

export default function CustomBasketPanel({
    isOpen,
    onClose,
    basket,
    isLoading,
    onConfirm,
    updateItem,
    deleteItem,
}: CustomBasketPanelProps) {
    const { t } = useTranslation();
    const { items, summary } = basket;
    const discountLabel = formatDiscount(
        summary.discount_type,
        summary.discount_value,
        t,
    );

    return (
        <BasePopup
            isOpen={isOpen}
            onClose={onClose}
            title={t("customBasket.viewBasket")}
            maxWidth="2xl"
            contentClassName="!text-start max-h-[70vh] overflow-y-auto px-5 pb-2 pt-2"
            actions={
                <Button
                    type="button"
                    variant="primary"
                    fullWidth
                    disabled={items.length === 0}
                    className="h-12 rounded-2xl"
                    onClick={onConfirm}
                >
                    {t("customBasket.continueConfirm")}
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex min-h-40 items-center justify-center">
                    <PremiumInlineLoader size="sm" />
                </div>
            ) : items.length === 0 ? (
                <p className="py-12 text-center text-sm leading-relaxed text-custom-secondary">
                    {t("customBasket.emptyBasketHint")}
                </p>
            ) : (
                <div className="space-y-5">
                    <ul className="divide-y divide-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] dark:divide-white/10">
                        {items.map((item) => (
                            <li key={item.id} className="flex gap-3 py-4 first:pt-1">
                                {item.product.image ? (
                                    <img
                                        src={item.product.image}
                                        alt=""
                                        className="h-[4.25rem] w-[4.25rem] shrink-0 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="h-[4.25rem] w-[4.25rem] shrink-0 rounded-2xl bg-custom-tertiary" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-semibold leading-snug text-custom-primary dark:text-white">
                                                {item.product.name}
                                            </p>
                                            {item.variantLabel && (
                                                <p className="mt-0.5 text-xs text-custom-secondary">
                                                    {item.variantLabel}
                                                </p>
                                            )}
                                            <p className="text-xs text-custom-secondary">
                                                {[
                                                    item.shop?.name,
                                                    item.product.brand?.name,
                                                    item.unit,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" · ")}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className="rounded-full p-2 text-custom-tertiary transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                            aria-label={t("customBasket.remove")}
                                            onClick={() => deleteItem.mutate(item.id)}
                                        >
                                            <HiTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <QtyStepper
                                            value={item.quantity}
                                            disabled={updateItem.isPending}
                                            onChange={(qty) =>
                                                updateItem.mutate({
                                                    itemId: item.id,
                                                    quantity: qty,
                                                })
                                            }
                                        />
                                        <div className="text-end">
                                            {item.original_price_formatted && (
                                                <FormattedPrice
                                                    value={item.original_price_formatted}
                                                    className="block text-xs text-custom-secondary"
                                                />
                                            )}
                                            {item.line_total_formatted && (
                                                <FormattedPrice
                                                    value={item.line_total_formatted}
                                                    prominent
                                                    className="text-base font-bold text-custom-primary dark:text-white"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-2.5 rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-bg-card))] p-4 text-sm dark:bg-white/[0.04]">
                        <Row
                            label={t("customBasket.items")}
                            value={String(summary.items_count)}
                        />
                        <Row
                            label={t("customBasket.totalQuantity")}
                            value={String(summary.total_quantity)}
                        />
                        {summary.original_price_formatted && (
                            <Row
                                label={t("customBasket.originalPrice")}
                                value={summary.original_price_formatted}
                                money
                            />
                        )}
                        {discountLabel && (
                            <Row
                                label={t("customBasket.discount")}
                                value={discountLabel}
                            />
                        )}
                        {summary.savings_formatted && (
                            <Row
                                label={t("customBasket.savings")}
                                value={summary.savings_formatted}
                                money
                                accent
                            />
                        )}
                        {summary.final_price_formatted && (
                            <div className="border-t border-primary/15 pt-2.5 dark:border-white/10">
                                <Row
                                    label={t("customBasket.finalPrice")}
                                    value={summary.final_price_formatted}
                                    money
                                    bold
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </BasePopup>
    );
}

function Row({
    label,
    value,
    money,
    bold,
    accent,
}: {
    label: string;
    value: string;
    money?: boolean;
    bold?: boolean;
    accent?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className={bold ? "font-semibold text-custom-primary dark:text-white" : "text-custom-secondary"}>
                {label}
            </span>
            {money ? (
                <FormattedPrice
                    value={value}
                    prominent={bold}
                    className={
                        accent
                            ? "font-semibold text-green"
                            : bold
                              ? "text-lg font-bold text-custom-primary dark:text-white"
                              : "font-medium text-custom-primary dark:text-white"
                    }
                />
            ) : (
                <span
                    className={
                        bold
                            ? "font-bold text-custom-primary dark:text-white"
                            : "font-medium text-custom-primary dark:text-white"
                    }
                >
                    {value}
                </span>
            )}
        </div>
    );
}

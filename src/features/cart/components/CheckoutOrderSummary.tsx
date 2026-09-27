import { HiTruck } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { CheckoutOrderSummary } from "../types";

function isZeroMoney(value?: string | null) {
    if (value == null || value === "") return true;
    if (/free/i.test(value)) return false;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    return !Number.isFinite(numeric) || numeric === 0;
}

type CheckoutOrderSummaryProps = {
    summary: CheckoutOrderSummary;
    onPlaceOrder?: () => void;
    buttonText?: string;
    canContinue?: boolean;
    isLoading?: boolean;
    /** Review step: the total once, with no breakdown or delivery line. */
    totalOnly?: boolean;
    backHref?: string;
    backLabel?: string;
};

export default function CheckoutOrderSummary({
    summary,
    onPlaceOrder,
    buttonText,
    canContinue = true,
    isLoading = false,
    totalOnly = false,
    backHref = "/cart",
    backLabel,
}: CheckoutOrderSummaryProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const totalItems =
        summary.numOfItems ??
        summary.items.reduce((sum, item) => sum + item.quantity, 0);
    const shippingIsFree =
        summary.shippingIsFree ||
        summary.deliveryFees === "Free" ||
        /free/i.test(String(summary.deliveryFees ?? ""));
    const showItemsTotal =
        Boolean(summary.itemsTotal) &&
        summary.itemsTotal !== summary.subtotal &&
        !isZeroMoney(summary.itemsTotal);
    const hasRewardLines = (summary.rewardLines?.length ?? 0) > 0;

    return (
        <div
            className="rounded-3xl"
            style={{
                padding: "1px",
                background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--color-main) 50%, transparent), color-mix(in srgb, var(--color-api-second) 60%, transparent))",
                boxShadow:
                    "0 18px 45px -22px color-mix(in srgb, var(--color-main) 40%, transparent)",
            }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="overflow-hidden rounded-[calc(1.5rem-1px)] bg-custom-card">
                {!totalOnly && (
                <div className="flex items-baseline justify-between gap-3 px-4 pt-5 sm:px-5">
                    <h2 className="text-base font-bold text-[color:var(--color-text)]">
                        {t("checkout.orderSummary")}
                    </h2>
                    {totalItems > 0 && (
                        <span className="text-xs text-custom-secondary tabular-nums">
                            {t("cart.itemsInCart", "{{count}} items", {
                                count: totalItems,
                            })}
                        </span>
                    )}
                </div>
                )}

                {!totalOnly && (
                <div className="space-y-2.5 px-4 py-4 text-sm sm:px-5">
                    {showItemsTotal && (
                        <SummaryRow
                            label={t("cart.itemsTotal")}
                            value={summary.itemsTotal}
                        />
                    )}
                    <SummaryRow
                        label={t("checkout.subtotal")}
                        value={summary.subtotal}
                    />
                    {summary.deliveryFees && summary.deliveryFees !== "-" && (
                        <SummaryRow
                            label={t("checkout.deliveryFees")}
                            value={
                                shippingIsFree
                                    ? t("cart.freeDelivery")
                                    : summary.deliveryFees
                            }
                            accent={shippingIsFree ? "success" : undefined}
                        />
                    )}
                    {summary.productDiscount &&
                        !isZeroMoney(summary.productDiscount) && (
                            <SummaryRow
                                label={t("cart.productDiscount")}
                                value={summary.productDiscount}
                                accent="success"
                            />
                        )}
                    {summary.storeDiscounts &&
                        !isZeroMoney(summary.storeDiscounts) && (
                            <SummaryRow
                                label={t("cart.discounts")}
                                value={summary.storeDiscounts}
                                accent="success"
                            />
                        )}
                    {summary.couponDiscount &&
                        !isZeroMoney(summary.couponDiscount) && (
                            <SummaryRow
                                label={t("checkout.couponDiscount")}
                                value={summary.couponDiscount}
                                accent="success"
                            />
                        )}
                    {summary.subscriptionDiscount &&
                        !isZeroMoney(summary.subscriptionDiscount) && (
                            <SummaryRow
                                label={t("cart.subscriptionDiscount")}
                                value={summary.subscriptionDiscount}
                                accent="success"
                            />
                        )}
                    {summary.promotionDiscount &&
                        !isZeroMoney(summary.promotionDiscount) && (
                            <SummaryRow
                                label={t("cart.promotionDiscount")}
                                value={summary.promotionDiscount}
                                accent="success"
                            />
                        )}
                    {summary.rewardLines?.map((line) => (
                        <SummaryRow
                            key={line.id}
                            label={line.label}
                            value={line.value}
                            accent="success"
                        />
                    ))}
                </div>
                )}

                {totalOnly && summary.rewardLines && summary.rewardLines.length > 0 && (
                    <div className="space-y-2.5 px-4 pt-5 text-sm sm:px-5">
                        {summary.rewardLines.map((line) => (
                            <SummaryRow
                                key={line.id}
                                label={line.label}
                                value={line.value}
                                accent="success"
                            />
                        ))}
                    </div>
                )}

                <div className={cn("px-4 pb-5 sm:px-5", totalOnly && !hasRewardLines && "pt-5")}>
                    <div className="mb-4 flex items-baseline justify-between gap-3 border-t border-custom-primary pt-4">
                        <span className="text-base font-bold text-[color:var(--color-text)]">
                            {t(totalOnly ? "checkout.total" : "checkout.totalToPay")}
                        </span>
                        <span className="text-xl font-extrabold text-[color:var(--color-main)] tabular-nums">
                            {summary.total}
                        </span>
                    </div>

                    {!totalOnly && shippingIsFree && (
                        <div className="mb-4 flex items-center gap-2 rounded-xl bg-[color:color-mix(in_srgb,var(--color-success)_8%,var(--color-bg-card))] px-3 py-2.5 text-sm text-[var(--color-success)]">
                            <HiTruck className="h-4 w-4 shrink-0" />
                            <span className="font-medium">
                                {t("cart.freeDeliveryUnlocked")}
                            </span>
                        </div>
                    )}

                    {!totalOnly && summary.pointsEarned != null && summary.pointsEarned > 0 && (
                        <div className="mb-4 flex items-center gap-2 text-sm text-[var(--color-success)]">
                            <FaStar className="h-3.5 w-3.5 shrink-0" />
                            <span>
                                {t("cart.willEarnPoints", {
                                    points: summary.pointsEarned,
                                })}
                            </span>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            type="button"
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={!canContinue || isLoading}
                            isLoading={isLoading}
                            onClick={onPlaceOrder}
                            className={cn(
                                "flex min-h-[52px] items-center justify-center gap-2 rounded-2xl text-base font-bold text-white",
                                "!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] !border-transparent",
                                "disabled:cursor-not-allowed disabled:opacity-60",
                            )}
                        >
                            {isLoading
                                ? t("checkout.confirming")
                                : buttonText || t("checkout.confirmOrder")}
                        </Button>
                        <Link
                            to={backHref}
                            className="block py-1 text-center text-sm text-custom-secondary hover:text-[color:var(--color-main)] hover:underline"
                        >
                            {backLabel ?? t("checkout.backToCart")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

type SummaryRowProps = {
    label: string;
    value?: string;
    accent?: "success" | "danger";
};

function SummaryRow({ label, value, accent }: SummaryRowProps) {
    const colorVar =
        accent === "success"
            ? "var(--color-success)"
            : accent === "danger"
              ? "var(--color-error)"
              : undefined;
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-custom-secondary">{label}</span>
            {value ? (
                <span
                    className="font-semibold text-[color:var(--color-text)] tabular-nums"
                    style={colorVar ? { color: colorVar } : undefined}
                >
                    {value}
                </span>
            ) : null}
        </div>
    );
}

import { Link } from "react-router-dom";
import { HiOutlineClock } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { ReviewOrderSummary } from "../types";

type ReviewDeliveryDetailsSidebarProps = {
    summary: ReviewOrderSummary;
    onConfirmOrder: () => void;
    isLoading?: boolean;
};

export default function ReviewDeliveryDetailsSidebar({
    summary,
    onConfirmOrder,
    isLoading = false,
}: ReviewDeliveryDetailsSidebarProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    return (
        <div className="sticky top-4" dir={isRTL ? "rtl" : "ltr"}>
            <div
                className="rounded-3xl"
                style={{
                    padding: "1px",
                    background:
                        "linear-gradient(180deg, color-mix(in srgb, var(--color-main) 50%, transparent), color-mix(in srgb, var(--color-api-second) 60%, transparent))",
                    boxShadow:
                        "0 18px 45px -22px color-mix(in srgb, var(--color-main) 40%, transparent)",
                }}
            >
                <div className="rounded-[calc(1.5rem-1px)] bg-custom-card overflow-hidden">
                    {/* Header */}
                    <div
                        className="px-4 sm:px-6 pt-6 pb-3 border-b border-dashed"
                        style={{
                            borderColor:
                                "color-mix(in srgb, var(--color-main) 28%, transparent)",
                        }}
                    >
                        <div className="flex items-center justify-center">
                            <span
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, var(--color-main), var(--color-api-second))",
                                    boxShadow:
                                        "0 8px 18px -8px color-mix(in srgb, var(--color-main) 50%, transparent)",
                                }}
                            >
                                {t("checkout.deliveryDetails", "Delivery Details")}
                            </span>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 pb-7 pt-5 space-y-6">
                        <div className="space-y-3">
                            <SummaryRow
                                label={t("cart.numOfItems", "Num of items")}
                                value={summary.numOfItems}
                            />
                            <SummaryRow
                                label={t("cart.subtotal", "Subtotal")}
                                value={summary.subtotal}
                            />
                            <SummaryRow
                                label={t("cart.shipping", "Shipping")}
                                value={summary.shipping}
                                accent="success"
                            />
                            <SummaryRow
                                label={t("cart.discounts", "Discounts")}
                                value={summary.discounts}
                                accent="success"
                            />
                            <SummaryRow
                                label={t(
                                    "checkout.couponDiscount",
                                    "Coupon discount",
                                )}
                                value={summary.couponDiscount}
                                accent={
                                    summary.couponDiscount.trim().startsWith("-")
                                        ? "success"
                                        : "muted"
                                }
                            />
                            {summary.subscriptionDiscount != null && (
                                <SummaryRow
                                    label={t(
                                        "cart.subscriptionDiscount",
                                        "Subscription discount",
                                    )}
                                    value={summary.subscriptionDiscount}
                                    accent="success"
                                />
                            )}
                            {summary.promotionDiscount != null && (
                                <SummaryRow
                                    label={t(
                                        "cart.promotionDiscount",
                                        "Promotion discount",
                                    )}
                                    value={summary.promotionDiscount}
                                    accent="success"
                                />
                            )}
                            {summary.pointsRedeemed > 0 && (
                                <SummaryRow
                                    label={`${t("cart.pointsRedeemed", "Points redeemed")} (${summary.pointsRedeemed} pts)`}
                                    value={`- ${summary.pointsValue}`}
                                    accent="success"
                                />
                            )}
                        </div>

                        <div
                            className="border-t border-dashed pt-5"
                            style={{
                                borderColor:
                                    "color-mix(in srgb, var(--color-main) 28%, transparent)",
                            }}
                        >
                            <div className="flex items-baseline justify-between gap-4">
                                <span className="text-base font-bold text-[color:var(--color-text)]">
                                    {t("cart.totalToPay", "Total to pay")}
                                </span>
                                <span className="text-2xl font-extrabold text-[color:var(--color-main)] tabular-nums">
                                    {summary.total}
                                </span>
                            </div>
                        </div>

                        {/* Estimated delivery + points */}
                        <div
                            className="rounded-xl px-4 py-3 border space-y-2"
                            style={{
                                backgroundColor:
                                    "color-mix(in srgb, var(--color-main) 6%, var(--color-bg-card))",
                                borderColor:
                                    "color-mix(in srgb, var(--color-main) 18%, transparent)",
                            }}
                        >
                            <div className="flex items-center gap-2 text-xs font-medium text-custom-secondary">
                                <HiOutlineClock
                                    className="h-4 w-4 shrink-0"
                                    style={{ color: "var(--color-main)" }}
                                />
                                <span>
                                    {t(
                                        "cart.estimatedDelivery",
                                        "Estimated delivery:",
                                    )}{" "}
                                    <span className="font-semibold text-[color:var(--color-text)]">
                                        {summary.estimatedDelivery}
                                    </span>
                                </span>
                            </div>
                            {summary.pointsEarned > 0 && (
                                <div
                                    className="flex items-center gap-2 text-xs font-medium"
                                    style={{ color: "var(--color-success)" }}
                                >
                                    <FaStar className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        {t(
                                            "cart.willEarnPoints",
                                            "You'll earn {{points}} points",
                                            { points: summary.pointsEarned },
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pt-1">
                            <Button
                                type="button"
                                variant="primary"
                                size="lg"
                                fullWidth
                                disabled={isLoading}
                                onClick={onConfirmOrder}
                                className={cn(
                                    "min-h-[56px] rounded-2xl px-6 py-4 text-base font-bold text-white",
                                    "!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] !border-transparent",
                                    "transition-all duration-200 hover:-translate-y-0.5",
                                    "shadow-[0_10px_24px_-10px_color-mix(in_srgb,var(--color-main)_55%,transparent)]",
                                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
                                )}
                            >
                                {isLoading
                                    ? t("cart.confirming", "Confirming…")
                                    : t("cart.confirmOrder", "Confirm Order")}
                            </Button>

                            <Link
                                to="/cart/checkout"
                                className="block text-center text-sm font-medium text-custom-secondary hover:text-[color:var(--color-main)] hover:underline transition-colors"
                            >
                                {t("cart.backToCheckout", "Back to checkout")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

type SummaryRowProps = {
    label: string;
    value: string | number;
    accent?: "success" | "danger" | "muted";
};

function SummaryRow({ label, value, accent }: SummaryRowProps) {
    const colorVar =
        accent === "success"
            ? "var(--color-success)"
            : accent === "danger"
              ? "var(--color-error)"
              : accent === "muted"
                ? "var(--color-text-tertiary)"
                : undefined;

    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-custom-secondary">{label}</span>
            <span
                className="text-sm font-semibold text-[color:var(--color-text)] tabular-nums"
                style={colorVar ? { color: colorVar } : undefined}
            >
                {value}
            </span>
        </div>
    );
}

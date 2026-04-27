import { useState, useEffect, type ReactNode } from "react";
import {
    HiArrowRight,
    HiTruck,
    HiClock,
    HiGift,
    HiOutlineReceiptTax,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { cn } from "@/shared/lib/utils";
import type { OrderSummary } from "../types";

type CartSummaryStatus = "loading" | "no-address" | "ready";

type CartSummaryProps = {
    summary: OrderSummary;
    onCheckout: () => void;
    coupon?: string;
    onCouponChange?: (code: string) => void;
    isLoading?: boolean;
    status?: CartSummaryStatus;
    onAddAddress?: () => void;
    benefitsContent?: ReactNode;
    couponDisabled?: boolean;
    /** Points earned from this order (e.g. 145); shows rewards banner when provided */
    pointsEarned?: number;
};

export default function CartSummary({
    summary,
    onCheckout,
    coupon = "",
    onCouponChange,
    isLoading = false,
    status = "ready",
    onAddAddress,
    benefitsContent,
    couponDisabled = false,
    pointsEarned,
}: CartSummaryProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { formatPrice } = useCurrency();
    const [localCoupon, setLocalCoupon] = useState(coupon);

    useEffect(() => {
        setLocalCoupon(coupon);
    }, [coupon]);

    const handleApplyCoupon = () => {
        const code = localCoupon.trim().toUpperCase();
        if (onCouponChange && code) {
            onCouponChange(code);
        }
    };

    const handleCouponKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleApplyCoupon();
        }
    };

    const totalNum = parseFloat(summary.total.replace(/[^0-9.]/g, "")) || 0;
    const freeDeliveryThreshold = 50;
    const remainingForFreeDelivery = Math.max(
        0,
        freeDeliveryThreshold - totalNum,
    );
    const progressPercentage = Math.min(
        100,
        ((freeDeliveryThreshold - remainingForFreeDelivery) /
            freeDeliveryThreshold) *
            100,
    );

    if (status === "loading") {
        return (
            <SummaryShell isRTL={isRTL}>
                <div className="space-y-6 animate-pulse p-4 sm:p-6">
                    <div className="h-6 bg-custom-muted rounded w-1/3" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 bg-custom-muted rounded w-24" />
                                <div className="h-4 bg-custom-muted rounded w-16" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between pt-4 border-t border-custom-primary">
                        <div className="h-6 bg-custom-muted rounded w-20" />
                        <div className="h-6 bg-custom-muted rounded w-24" />
                    </div>
                    <div className="h-12 bg-custom-muted rounded-xl" />
                    <p className="text-xs text-custom-secondary text-center">
                        {t("cart.loadingPreview", "Loading order summary...")}
                    </p>
                </div>
            </SummaryShell>
        );
    }

    if (status === "no-address") {
        return (
            <SummaryShell isRTL={isRTL}>
                <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <SummaryIcon />
                        <h2 className="text-lg font-bold text-[color:var(--color-text)]">
                            {t("checkout.orderSummary")}
                        </h2>
                    </div>
                    <p className="text-sm text-custom-secondary leading-relaxed">
                        {t(
                            "cart.addAddressForPreview",
                            "Add a delivery address to see pricing and delivery details.",
                        )}
                    </p>
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onAddAddress}
                        className="rounded-xl text-white font-semibold !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] transition-colors"
                    >
                        {t("cart.addAddress", "Add Address")}
                    </Button>
                </div>
            </SummaryShell>
        );
    }

    return (
        <SummaryShell isRTL={isRTL}>
            <div className="p-4 sm:p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center gap-2.5">
                    <SummaryIcon />
                    <h2 className="text-lg font-bold text-[color:var(--color-text)]">
                        {t("checkout.orderSummary")}
                    </h2>
                </div>

                {/* Coupon */}
                <div className="space-y-1.5">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder={t("cart.enterCode", "Enter coupon code")}
                            value={localCoupon}
                            onChange={(e) => setLocalCoupon(e.target.value)}
                            onKeyDown={handleCouponKeyDown}
                            className="flex-1 !bg-custom-card !border-custom-primary rounded-xl focus:!border-[color:var(--color-main)] focus:!ring-2 focus:!ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]"
                            disabled={couponDisabled}
                        />
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleApplyCoupon}
                            disabled={isLoading || couponDisabled}
                            className="!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] disabled:!opacity-60 text-white font-semibold rounded-xl shrink-0 px-5 transition-colors"
                        >
                            {isLoading ? "…" : t("cart.apply", "Apply")}
                        </Button>
                    </div>
                    {couponDisabled && (
                        <p className="text-xs text-custom-secondary">
                            {t(
                                "cart.couponDisabledByBenefit",
                                "Remove the selected discount benefit to use a coupon code",
                            )}
                        </p>
                    )}
                </div>

                {/* Coupon feedback */}
                {summary.couponFeedback &&
                    summary.couponFeedback.fail_reasons?.length > 0 &&
                    !summary.couponFeedback.applied && (
                        <Alert tone="warning">
                            {summary.couponFeedback.fail_reasons
                                .filter((r) => r !== "No coupon provided")
                                .map((r, i) => (
                                    <p key={i}>{r}</p>
                                ))}
                        </Alert>
                    )}

                {/* Excluded items */}
                {(summary.excludedItemsCount ?? 0) > 0 && (
                    <Alert tone="warning">
                        {t(
                            "cart.couponExcludedItems",
                            "{{count}} item(s) in your cart are not eligible for this coupon.",
                            { count: summary.excludedItemsCount },
                        )}
                    </Alert>
                )}

                {/* Price breakdown */}
                <div className="space-y-2.5 text-sm">
                    <PriceRow
                        label={t("cart.numOfItems", "Num of items")}
                        value={String(summary.numOfItems)}
                    />
                    <PriceRow
                        label={t("cart.itemsSubtotal", "Items subtotal")}
                        value={summary.subtotal}
                    />
                    {summary.productDiscount != null && (
                        <PriceRow
                            label={t(
                                "cart.productDiscount",
                                "Product discount",
                            )}
                            value={summary.productDiscount}
                            tone="success"
                        />
                    )}
                    <PriceRow
                        label={t("cart.basketDiscount", "Basket discount")}
                        value={summary.storeDiscounts}
                        tone="success"
                    />
                    <PriceRow
                        label={t("cart.deliveryFee", "Delivery fee")}
                        value={summary.shipping}
                    />
                    <PriceRow
                        label={t(
                            "checkout.couponDiscount",
                            "Coupon discount",
                        )}
                        value={summary.couponDiscount}
                        tone="success"
                    />
                    {summary.subscriptionDiscount != null && (
                        <PriceRow
                            label={t(
                                "cart.subscriptionDiscount",
                                "Subscription discount",
                            )}
                            value={summary.subscriptionDiscount}
                            tone="success"
                        />
                    )}
                    {summary.promotionDiscount != null && (
                        <PriceRow
                            label={t(
                                "cart.promotionDiscount",
                                "Promotion discount",
                            )}
                            value={summary.promotionDiscount}
                            tone="success"
                        />
                    )}
                </div>

                {/* Perforated divider for receipt feel */}
                <div className="relative h-px">
                    <div className="absolute inset-0 border-t border-dashed border-[color:color-mix(in_srgb,var(--color-main)_30%,transparent)]" />
                    <span
                        className="absolute -start-9 -top-3 w-6 h-6 rounded-full bg-custom-tertiary"
                        aria-hidden
                    />
                    <span
                        className="absolute -end-9 -top-3 w-6 h-6 rounded-full bg-custom-tertiary"
                        aria-hidden
                    />
                </div>

                {/* Total */}
                <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-[color:var(--color-text)]">
                        {t("orders.total", "Total")}
                    </span>
                    <span className="text-2xl font-extrabold text-[color:var(--color-main)] tabular-nums">
                        {summary.total}
                    </span>
                </div>

                {/* Free delivery progress */}
                <FreeDeliveryProgress
                    remaining={remainingForFreeDelivery}
                    percentage={progressPercentage}
                    formatPrice={formatPrice}
                    t={t}
                />

                {/* Rewards banner */}
                {pointsEarned != null && pointsEarned > 0 && (
                    <div
                        className="rounded-xl py-3 px-4 flex items-center gap-3 border"
                        style={{
                            backgroundColor:
                                "color-mix(in srgb, var(--color-main) 8%, var(--color-bg-card))",
                            borderColor:
                                "color-mix(in srgb, var(--color-main) 24%, transparent)",
                        }}
                    >
                        <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg, var(--color-main), var(--color-api-second))",
                            }}
                        >
                            <HiGift className="w-5 h-5" />
                        </span>
                        <p className="text-sm font-medium text-[color:var(--color-text)]">
                            {t(
                                "cart.pointsEarned",
                                "You'll earn {{points}} points from this order.",
                                { points: pointsEarned },
                            )}
                        </p>
                    </div>
                )}

                {/* Active benefits */}
                {benefitsContent && (
                    <div className="space-y-4 pt-1">{benefitsContent}</div>
                )}

                {/* Proceed to checkout */}
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onCheckout}
                    className="group !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-[0_8px_22px_-8px_color-mix(in_srgb,var(--color-main)_45%,transparent)] transition-all duration-200 hover:-translate-y-0.5"
                >
                    <span>
                        {t("cart.proceedToCheckout", "Proceed to checkout")}
                    </span>
                    <HiArrowRight
                        className={cn(
                            "w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5",
                            isRTL && "rotate-180 group-hover:-translate-x-0.5",
                        )}
                    />
                </Button>

                {/* Estimated delivery */}
                <div className="flex items-center justify-center gap-2 text-sm text-custom-secondary">
                    <HiClock
                        className="w-4 h-4 shrink-0"
                        style={{ color: "var(--color-main)" }}
                    />
                    <span>
                        {t("cart.estimatedDelivery", "Estimated delivery:")}{" "}
                        <span className="font-semibold text-[color:var(--color-text)]">
                            Today, 2–4 PM
                        </span>
                    </span>
                </div>
            </div>
        </SummaryShell>
    );
}

type SummaryShellProps = {
    children: ReactNode;
    isRTL: boolean;
};

function SummaryShell({ children, isRTL }: SummaryShellProps) {
    return (
        <div
            className="sticky top-4 rounded-3xl"
            style={{
                padding: "1px",
                background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--color-main) 50%, transparent), color-mix(in srgb, var(--color-api-second) 60%, transparent))",
                boxShadow:
                    "0 12px 32px -16px color-mix(in srgb, var(--color-main) 35%, transparent)",
            }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="rounded-[calc(1.5rem-1px)] bg-custom-card relative overflow-hidden"
            >
                {/* Decorative top accent wash (uses main → api-second) */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.07]"
                    style={{
                        background:
                            "radial-gradient(120% 80% at 50% 0%, var(--color-main) 0%, transparent 70%)",
                    }}
                    aria-hidden
                />
                <div className="relative">{children}</div>
            </div>
        </div>
    );
}

function SummaryIcon() {
    return (
        <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
                background:
                    "color-mix(in srgb, var(--color-main) 14%, var(--color-bg-card))",
                color: "var(--color-main)",
            }}
        >
            <HiOutlineReceiptTax className="w-4 h-4" />
        </span>
    );
}

type PriceRowProps = {
    label: string;
    value: string;
    tone?: "success" | "danger";
};

function PriceRow({ label, value, tone }: PriceRowProps) {
    const colorVar =
        tone === "success"
            ? "var(--color-success)"
            : tone === "danger"
              ? "var(--color-error)"
              : undefined;

    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-custom-secondary">{label}</span>
            <span
                className="font-semibold text-[color:var(--color-text)] tabular-nums"
                style={colorVar ? { color: colorVar } : undefined}
            >
                {value}
            </span>
        </div>
    );
}

type AlertProps = {
    tone: "warning" | "info";
    children: ReactNode;
};

function Alert({ children }: AlertProps) {
    return (
        <div
            className="text-xs leading-relaxed flex items-start gap-2 rounded-xl px-3 py-2.5"
            style={{
                backgroundColor: "var(--color-ui-amber-50)",
                color: "var(--color-ui-amber-900)",
                border: "1px solid var(--color-ui-amber-200)",
            }}
        >
            <HiOutlineExclamationTriangle
                className="w-4 h-4 mt-0.5 shrink-0"
                style={{ color: "var(--color-ui-amber-400)" }}
            />
            <div className="flex-1 space-y-1">{children}</div>
        </div>
    );
}

type FreeDeliveryProgressProps = {
    remaining: number;
    percentage: number;
    formatPrice: (n: number) => string;
    t: TFunction;
};

function FreeDeliveryProgress({
    remaining,
    percentage,
    formatPrice,
    t,
}: FreeDeliveryProgressProps) {
    const unlocked = remaining <= 0;
    return (
        <div className="bg-custom-card rounded-2xl p-4 border border-custom-primary shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[color:var(--color-text)]">
                    {t(
                        "cart.freeDeliveryProgress",
                        "Free delivery progress",
                    )}
                </span>
                <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-main), var(--color-api-second))",
                    }}
                >
                    <HiTruck className="w-4 h-4" />
                </span>
            </div>
            <p
                className="text-sm font-medium mb-3"
                style={{ color: "var(--color-main)" }}
            >
                {unlocked
                    ? t(
                          "cart.freeDeliveryUnlocked",
                          "You've unlocked free delivery!",
                      )
                    : t(
                          "cart.awayFromFreeDelivery",
                          "You're {{amount}} away from free delivery",
                          { amount: formatPrice(remaining) },
                      )}
            </p>
            <div
                className="relative h-2 rounded-full overflow-hidden"
                style={{
                    backgroundColor:
                        "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-tertiary))",
                }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                        background:
                            "linear-gradient(90deg, var(--color-main) 0%, var(--color-api-second) 100%)",
                    }}
                />
            </div>
        </div>
    );
}

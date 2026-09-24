import { useState, useEffect, type ReactNode } from "react";
import { HiArrowRight, HiTruck, HiGift } from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
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
    pointsEarned?: number;
};

function isZeroMoney(value?: string | null) {
    if (value == null || value === "") return true;
    if (/free/i.test(value)) return false;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    return !Number.isFinite(numeric) || numeric === 0;
}

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

    if (status === "loading") {
        return (
            <SummaryShell isRTL={isRTL}>
                <div className="space-y-5 animate-pulse p-5 sm:p-6">
                    <div className="h-5 bg-custom-muted rounded w-1/3" />
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 bg-custom-muted rounded w-24" />
                                <div className="h-4 bg-custom-muted rounded w-16" />
                            </div>
                        ))}
                    </div>
                    <div className="h-12 bg-custom-muted rounded-xl" />
                    <p className="text-xs text-custom-secondary text-center">
                        {t("cart.loadingPreview")}
                    </p>
                </div>
            </SummaryShell>
        );
    }

    if (status === "no-address") {
        return (
            <SummaryShell isRTL={isRTL}>
                <div className="p-5 sm:p-6 space-y-4">
                    <h2 className="text-base font-semibold text-custom-primary">
                        {t("checkout.orderSummary")}
                    </h2>
                    <p className="text-sm text-custom-secondary leading-relaxed">
                        {t("cart.addAddressForPreview")}
                    </p>
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onAddAddress}
                        className="rounded-xl text-white font-semibold !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)]"
                    >
                        {t("cart.addAddress")}
                    </Button>
                </div>
            </SummaryShell>
        );
    }

    return (
        <SummaryShell isRTL={isRTL}>
            <div className="p-5 sm:p-6 space-y-5">
                <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-base font-semibold text-custom-primary">
                        {t("checkout.orderSummary")}
                    </h2>
                    <span className="text-xs text-custom-secondary tabular-nums">
                        {t("cart.itemsInCart", "{{count}} items", {
                            count: summary.numOfItems,
                        })}
                    </span>
                </div>

                <div className="space-y-2.5 text-sm">
                    <PriceRow
                        label={t("cart.itemsSubtotal")}
                        value={summary.subtotal}
                    />
                    {summary.productDiscount != null &&
                        !isZeroMoney(summary.productDiscount) && (
                            <PriceRow
                                label={t("cart.productDiscount")}
                                value={summary.productDiscount}
                                tone="success"
                            />
                        )}
                    {!isZeroMoney(summary.storeDiscounts) && (
                        <PriceRow
                            label={t("cart.basketDiscount")}
                            value={summary.storeDiscounts}
                            tone="success"
                        />
                    )}
                    <PriceRow
                        label={t("cart.deliveryFee", "Delivery fee")}
                        value={
                            summary.shippingIsFree
                                ? t("cart.freeDelivery")
                                : summary.shipping
                        }
                        tone={summary.shippingIsFree ? "success" : undefined}
                    />
                    {!isZeroMoney(summary.couponDiscount) && (
                        <PriceRow
                            label={t("checkout.couponDiscount")}
                            value={summary.couponDiscount}
                            tone="success"
                        />
                    )}
                    {summary.subscriptionDiscount != null &&
                        !isZeroMoney(summary.subscriptionDiscount) && (
                            <PriceRow
                                label={t("cart.subscriptionDiscount", "Subscription discount")}
                                value={summary.subscriptionDiscount}
                                tone="success"
                            />
                        )}
                    {summary.promotionDiscount != null &&
                        !isZeroMoney(summary.promotionDiscount) && (
                            <PriceRow
                                label={t("cart.promotionDiscount", "Promotion discount")}
                                value={summary.promotionDiscount}
                                tone="success"
                            />
                        )}
                </div>

                <div className="border-t border-custom-primary pt-4">
                    <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm font-semibold text-custom-primary">
                            {t("orders.total", "Total")}
                        </span>
                        <span className="text-xl font-bold text-custom-primary tabular-nums">
                            {summary.total}
                        </span>
                    </div>
                </div>

                {summary.shippingIsFree && (
                    <div className="flex items-center gap-2 rounded-xl bg-[color:color-mix(in_srgb,var(--color-success)_8%,var(--color-bg-card))] px-3 py-2.5 text-sm text-[var(--color-success)]">
                        <HiTruck className="h-4 w-4 shrink-0" />
                        <span className="font-medium">
                            {t("cart.freeDeliveryUnlocked", "Free delivery on this order")}
                        </span>
                    </div>
                )}

                {pointsEarned != null && pointsEarned > 0 && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-custom-primary px-3 py-2.5">
                        <HiGift
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--color-main)" }}
                        />
                        <p className="text-sm text-custom-primary">
                            {t(
                                "cart.pointsEarned",
                                "You'll earn {{points}} points from this order.",
                                { points: pointsEarned },
                            )}
                        </p>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-custom-secondary">
                        {t("cart.couponCode")}
                    </label>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder={t("cart.enterCode")}
                            value={localCoupon}
                            onChange={(e) => setLocalCoupon(e.target.value)}
                            onKeyDown={handleCouponKeyDown}
                            className="flex-1 !bg-custom-card !border-custom-primary rounded-xl"
                            disabled={couponDisabled}
                            aria-label={t("cart.couponCode")}
                        />
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleApplyCoupon}
                            disabled={isLoading || couponDisabled || !localCoupon.trim()}
                            className="!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] disabled:!opacity-60 text-white font-semibold rounded-xl shrink-0 px-4"
                        >
                            {isLoading ? "…" : t("cart.applyCoupon")}
                        </Button>
                    </div>
                    {couponDisabled && (
                        <p className="text-xs text-custom-secondary">
                            {t(
                                "cart.couponDisabledByBenefit",
                                "Remove the selected discount to use a coupon code",
                            )}
                        </p>
                    )}
                </div>

                {summary.couponFeedback &&
                    summary.couponFeedback.fail_reasons?.length > 0 &&
                    !summary.couponFeedback.applied && (
                        <Alert>
                            {summary.couponFeedback.fail_reasons
                                .filter((r) => r !== "No coupon provided")
                                .map((r, i) => (
                                    <p key={i}>{r}</p>
                                ))}
                        </Alert>
                    )}

                {(summary.excludedItemsCount ?? 0) > 0 && (
                    <Alert>
                        {t(
                            "cart.couponExcludedItems",
                            "{{count}} item(s) in your cart are not eligible for this coupon.",
                            { count: summary.excludedItemsCount },
                        )}
                    </Alert>
                )}

                {benefitsContent && (
                    <div className="space-y-4 pt-1">{benefitsContent}</div>
                )}

                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onCheckout}
                    className="group !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                    <span>{t("cart.proceedToCheckout")}</span>
                    <HiArrowRight
                        className={cn(
                            "w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5",
                            isRTL && "rotate-180 group-hover:-translate-x-0.5",
                        )}
                    />
                </Button>

                <p className="text-center text-xs leading-relaxed text-custom-secondary">
                    {t("cart.checkoutNote")}
                </p>
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
            className="rounded-2xl border border-custom-primary bg-custom-card shadow-[0_8px_24px_-18px_color-mix(in_srgb,var(--color-text-primary)_28%,transparent)]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {children}
        </div>
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
                className="font-medium text-custom-primary tabular-nums"
                style={colorVar ? { color: colorVar } : undefined}
            >
                {value}
            </span>
        </div>
    );
}

function Alert({ children }: { children: ReactNode }) {
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

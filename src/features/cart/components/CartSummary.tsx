import { useState, useEffect, type ReactNode } from "react";
import { HiArrowRight, HiTruck, HiClock, HiGift } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
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
        freeDeliveryThreshold - totalNum
    );
    const progressPercentage = Math.min(
        100,
        ((freeDeliveryThreshold - remainingForFreeDelivery) / freeDeliveryThreshold) * 100
    );

    const teal = "#00AED1";
    const cardGradientBg = "linear-gradient(180deg, #77BEFF 0%, #E5F3FF 100%)";
    const cardBorderGradient = "linear-gradient(180deg, #4CDAF6, #2C8090)";
    const cardShadow =
        "0 8px 10px -6px rgba(0, 174, 209, 0.1), 0 20px 25px -5px rgba(0, 174, 209, 0.1)";
    const cardWrapperStyle = {
        padding: "1px",
        borderRadius: "24px",
        background: cardBorderGradient,
        boxShadow: cardShadow,
    };
    const cardInnerStyle = {
        background: cardGradientBg,
        borderRadius: "23px",
        minHeight: "100%",
    };
    const cardStyle = "p-6 rounded-[23px]";

    if (status === "loading") {
        return (
            <div
                className="sticky top-4"
                style={cardWrapperStyle}
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div
                    className={`${cardStyle} space-y-6 animate-pulse`}
                    style={cardInnerStyle}
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="h-6 bg-custom-muted rounded w-1/3" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 bg-custom-muted rounded w-24" />
                            <div className="h-4 bg-custom-muted rounded w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-custom-secondary">
                    <div className="h-6 bg-custom-muted rounded w-20" />
                    <div className="h-6 bg-custom-muted rounded w-24" />
                </div>
                <div className="h-12 bg-custom-muted rounded" />
                <p className="text-sm text-custom-secondary text-center">
                    {t("cart.loadingPreview", "Loading order summary...")}
                </p>
                </div>
            </div>
        );
    }

    if (status === "no-address") {
        return (
            <div className="sticky top-4" style={cardWrapperStyle} dir={isRTL ? "rtl" : "ltr"}>
                <div className={cardStyle} style={cardInnerStyle}>
                <h2 className="text-lg font-bold text-custom-primary mb-4">
                    {t("checkout.orderSummary")}
                </h2>
                <p className="text-custom-secondary mb-4">
                    {t("cart.addAddressForPreview", "Add a delivery address to see pricing and delivery details.")}
                </p>
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onAddAddress}
                    className="bg-primary-light hover:opacity-90 text-white"
                >
                    {t("cart.addAddress", "Add Address")}
                </Button>
                </div>
            </div>
        );
    }

    const discountGreen = "#22C55E";

    return (
        <div className="sticky top-4" style={cardWrapperStyle} dir={isRTL ? "rtl" : "ltr"}>
            <div
                className={`${cardStyle} space-y-5`}
                style={cardInnerStyle}
            >
            {/* Order Summary Header */}
            <h2 className="text-lg font-bold text-custom-primary">
                {t("checkout.orderSummary")}
            </h2>

            {/* Coupon Code */}
            <div>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder={t("cart.enterCode", "Enter coupon code")}
                        value={localCoupon}
                        onChange={(e) => setLocalCoupon(e.target.value)}
                        onKeyDown={handleCouponKeyDown}
                        className="flex-1 bg-white rounded-xl border border-gray-200 focus:border-[#00AED1] focus:ring-1 focus:ring-[#00AED1]"
                        disabled={couponDisabled}
                    />
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleApplyCoupon}
                        disabled={isLoading || couponDisabled}
                        className="text-white whitespace-nowrap hover:opacity-90 rounded-xl shrink-0"
                        style={{ backgroundColor: teal }}
                    >
                        {isLoading ? "..." : t("cart.apply", "Apply")}
                    </Button>
                </div>
                {couponDisabled && (
                    <p className="text-xs text-amber-600 mt-1">
                        {t("cart.couponDisabledByBenefit", "Remove the selected discount benefit to use a coupon code")}
                    </p>
                )}
            </div>

            {/* Coupon feedback when invalid */}
            {summary.couponFeedback &&
                summary.couponFeedback.fail_reasons?.length > 0 &&
                !summary.couponFeedback.applied && (
                    <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                        {summary.couponFeedback.fail_reasons
                            .filter((r) => r !== "No coupon provided")
                            .map((r, i) => (
                                <p key={i}>{r}</p>
                            ))}
                    </div>
                )}

            {/* Excluded items warning */}
            {(summary.excludedItemsCount ?? 0) > 0 && (
                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    {t(
                        "cart.couponExcludedItems",
                        "{{count}} item(s) in your cart are not eligible for this coupon.",
                        { count: summary.excludedItemsCount }
                    )}
                </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm text-custom-primary">
                <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("cart.numOfItems", "Num of items")}:</span>
                    <span className="font-medium">{summary.numOfItems}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("cart.itemsSubtotal", "Items subtotal")}:</span>
                    <span className="font-medium">{summary.subtotal}</span>
                </div>
                {summary.productDiscount != null && (
                    <div className="flex justify-between">
                        <span className="text-custom-secondary">{t("cart.productDiscount", "Product discount")}:</span>
                        <span className="font-medium" style={{ color: discountGreen }}>{summary.productDiscount}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("cart.basketDiscount", "Basket discount")}:</span>
                    <span className="font-medium" style={{ color: discountGreen }}>{summary.storeDiscounts}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("cart.deliveryFee", "Delivery fee")}:</span>
                    <span className="font-medium">{summary.shipping}</span>
                </div>
                {/* <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("cart.tax", "Tax")}:</span>
                    <span className="font-medium">{summary.tax}</span>
                </div> */}
                <div className="flex justify-between">
                    <span className="text-custom-secondary">{t("checkout.couponDiscount", "Coupon discount")}:</span>
                    <span className="font-medium" style={{ color: discountGreen }}>{summary.couponDiscount}</span>
                </div>
                {summary.subscriptionDiscount != null && (
                    <div className="flex justify-between">
                        <span className="text-custom-secondary">{t("cart.subscriptionDiscount", "Subscription discount")}:</span>
                        <span className="font-medium" style={{ color: discountGreen }}>{summary.subscriptionDiscount}</span>
                    </div>
                )}
                {summary.promotionDiscount != null && (
                    <div className="flex justify-between">
                        <span className="text-custom-secondary">{t("cart.promotionDiscount", "Promotion discount")}:</span>
                        <span className="font-medium" style={{ color: discountGreen }}>{summary.promotionDiscount}</span>
                    </div>
                )}

                {/* Separator + Total */}
                <div className="pt-3 mt-1 border-t border-[#00AED1]/30">
                    <div className="flex justify-between pt-2">
                        <span className="font-bold text-custom-primary">{t("orders.total", "Total")}:</span>
                        <span className="font-bold text-custom-primary">{summary.total}</span>
                    </div>
                </div>
            </div>

            {/* Free Delivery Progress - White inner card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-custom-primary">
                        {t("cart.freeDeliveryProgress", "Free delivery progress")}
                    </span>
                    <HiTruck className="w-5 h-5 shrink-0" style={{ color: teal }} />
                </div>
                <p className="text-sm font-medium mb-3" style={{ color: teal }}>
                    {remainingForFreeDelivery > 0
                        ? t("cart.awayFromFreeDelivery", "You're {{amount}} away from free delivery", {
                              amount: formatPrice(remainingForFreeDelivery),
                          })
                        : t("cart.freeDeliveryUnlocked", "You've unlocked free delivery!")}
                </p>
                <div className="relative h-2.5 rounded-full overflow-hidden bg-gray-100">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercentage}%`,
                            background: `linear-gradient(90deg, #4CDAF6 0%, ${teal} 100%)`,
                        }}
                    />
                </div>
            </div>

            {/* Rewards / Points Earned */}
            {pointsEarned != null && pointsEarned > 0 && (
                <div
                    className="rounded-xl py-3 px-4 flex items-center gap-3 w-full"
                    style={{ backgroundColor: "#E9E0F5" }}
                >
                    <HiGift className="w-5 h-5 shrink-0" style={{ color: "#6B46C1" }} />
                    <p className="text-sm font-medium" style={{ color: "#6B46C1" }}>
                        {t("cart.pointsEarned", "You'll earn {{points}} points from this order.", {
                            points: pointsEarned,
                        })}
                    </p>
                </div>
            )}

            {/* Active Benefits */}
            {benefitsContent && (
                <div className="space-y-4 pt-1">
                    {benefitsContent}
                </div>
            )}

            {/* Proceed to checkout */}
            <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={onCheckout}
                className="hover:opacity-90 text-white flex items-center justify-center gap-2 rounded-2xl font-bold"
                style={{
                    background: "linear-gradient(180deg, #4CDAF6 0%, #00AED1 100%)",
                }}
            >
                {t("cart.proceedToCheckout", "Proceed to checkout")}
                <HiArrowRight className="w-5 h-5" />
            </Button>

            {/* Estimated Delivery Footer */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <HiClock className="w-4 h-4 shrink-0" style={{ color: "#FFD700" }} />
                <span>
                    {t("cart.estimatedDelivery", "Estimated delivery:")}{" "}
                    <span className="font-medium">Today, 2–4 PM</span>
                </span>
            </div>
            </div>
        </div>
    );
}

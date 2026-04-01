import { HiTruck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import PeanutButton from "./PeanutButton";
import type { CheckoutOrderSummary } from "../types";

type CheckoutOrderSummaryProps = {
    summary: CheckoutOrderSummary;
    onPlaceOrder?: () => void;
    buttonText?: string;
};

export default function CheckoutOrderSummary({
    summary,
    onPlaceOrder,
    buttonText,
}: CheckoutOrderSummaryProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const totalItems = summary.items.reduce(
        (sum, item) => sum + item.quantity,
        0,
    );

    return (
        <div
            className="sticky top-4 overflow-visible rounded-[28px] border border-[#C8EEF8] bg-white pt-0 shadow-[0_18px_45px_rgba(76,218,246,0.18)]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="relative h-[36px]">
                <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-[#E3F8FD]" />
                <div className="absolute left-1/2 top-0 z-10 w-[min(100%,220px)] -translate-x-1/2 -translate-y-1/2 px-2">
                    <PeanutButton className="mx-auto">
                        <h2 className="whitespace-nowrap text-sm">
                            {t("checkout.orderSummary")}
                        </h2>
                    </PeanutButton>
                </div>
            </div>

            {/* White content area */}
            <div className="bg-white px-5 pb-5 pt-3">
                {/* Products Table */}
                <div className="mb-5">
                    <table className="mt-2 w-full">
                        <thead>
                            <tr className="bg-[#FFD500]">
                                <th
                                    className={cn(
                                        isRTL ? "rounded-r-[16px] text-right" : "rounded-l-[16px] text-left",
                                        "px-3 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#303030]",
                                    )}
                                >
                                    {t("checkout.product")}
                                </th>
                                <th className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.04em] text-[#303030]">
                                    {t("checkout.price")}
                                </th>
                                <th className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.04em] text-[#303030]">
                                    {t("orders.qty")}
                                </th>
                                <th
                                    className={cn(
                                        isRTL ? "rounded-l-[16px] text-left" : "rounded-r-[16px] text-right",
                                        "px-3 py-3 text-[11px] font-bold uppercase tracking-[0.04em] text-[#303030]",
                                    )}
                                >
                                    {t("orders.total")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.items.map((item) => (
                                <tr key={item.id} className="last:border-b-0">
                                    <td className="py-3 pr-2 align-top">
                                        <div className="flex items-start gap-3">
                                            <div className="h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[10px] bg-[#F5F7FB]">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-[12px] font-semibold leading-tight text-[#303030]">
                                                    {item.name}
                                                    {(item as { _isFree?: boolean })._isFree && (
                                                        <span className="ml-1 font-medium" style={{ color: "var(--color-green)" }}>
                                                            ({t("cart.free", "FREE")})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[11px] leading-tight text-[#7D7D7D]">
                                                    {item.store}
                                                </div>
                                                <div className="text-[11px] leading-tight text-[#7D7D7D]">
                                                    {item.size}
                                                    {item.size && item.type ? "," : ""}
                                                    {item.type}
                                                </div>
                                                {((item as { _freeQuantity?: number })._freeQuantity ?? 0) > 0 && (
                                                        <div className="text-[10px] font-medium" style={{ color: "#22C55E" }}>
                                                            {t("cart.free", "FREE")} × {((item as { _freeQuantity?: number })._freeQuantity ?? 0)}
                                                        </div>
                                                    )}
                                                {(item as { _isExcludedFromCoupon?: boolean })._isExcludedFromCoupon && (
                                                    <div className="text-[10px] text-amber-600">
                                                        {t("cart.excludedFromCoupon", "Not eligible for coupon")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center align-top">
                                        <div className="text-[12px] font-semibold text-[#303030]">
                                            {item.price}
                                        </div>
                                        {item.originalPrice && (
                                            <div className="text-[11px] text-[#9A9A9A] line-through">
                                                {item.originalPrice}
                                            </div>
                                        )}
                                        {item.savingsText && (
                                            <div
                                                className="text-[11px] font-medium"
                                                style={{ color: "var(--color-green)" }}
                                            >
                                                {item.savingsText}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 text-center align-top">
                                        <div className="text-[12px] font-medium text-[#303030]">
                                            {item.quantity}
                                        </div>
                                    </td>
                                    <td
                                        className={cn(
                                            "py-3 align-top",
                                            isRTL ? "text-left" : "text-right",
                                        )}
                                    >
                                        <div className="text-[12px] font-semibold text-[#303030]">
                                            {item.subtotal}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Solid teal separator */}
                <div className="my-4 border-t border-[#8FE3F3]" />

                {/* Summary of Charges */}
                <div className="space-y-3.5 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[#676767]">
                            Items total ({totalItems} items)
                        </span>
                        <span className="text-sm font-medium text-[#303030]">
                            {summary.itemsTotal}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-[#676767]">
                            {t("checkout.subtotal")}
                        </span>
                        <span className="text-sm font-medium text-[#303030]">
                            {summary.subtotal}
                        </span>
                    </div>
                    {summary.deliveryFees && summary.deliveryFees !== "-" && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#676767]">
                                {t("checkout.deliveryFees")}
                            </span>
                            <span
                                className="text-sm font-medium text-[#303030]"
                                style={
                                    summary.deliveryFees === "Free"
                                        ? { color: "var(--color-green)" }
                                        : undefined
                                }
                            >
                                {summary.deliveryFees}
                            </span>
                        </div>
                    )}
                    {summary.storeDiscounts && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#676767]">Discounts</span>
                            <span
                                className="text-sm font-medium"
                                style={{ color: "var(--color-green)" }}
                            >
                                {summary.storeDiscounts}
                            </span>
                        </div>
                    )}
                    {summary.couponDiscount && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#676767]">
                                Coupon discount
                            </span>
                            <span
                                className="text-sm font-medium"
                                style={{ color: "var(--color-green)" }}
                            >
                                {summary.couponDiscount}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom section with gradient background */}
            <div className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFDF3_100%)] px-5 pb-6 pt-4 [background-image:radial-gradient(circle_at_12%_100%,rgba(255,214,0,0.12)_0,rgba(255,214,0,0.12)_18%,transparent_19%),radial-gradient(circle_at_78%_80%,rgba(255,214,0,0.08)_0,rgba(255,214,0,0.08)_14%,transparent_15%)]">
                {/* <div className="mb-4 rounded-[16px] bg-[#DDEEFF] px-4 py-4 shadow-[0_8px_18px_rgba(117,181,218,0.24)]">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#FFD500] text-[#1F1F1F] shadow-[0_4px_10px_rgba(255,213,0,0.28)]">
                                <HiGift className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold text-[#303030]">
                                    Use your QuickPoints
                                </p>
                                <p className="text-[11px] text-[#6C7A89]">
                                    Available: 1,450 pts ≈ $14.50
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Toggle QuickPoints"
                            className="relative h-[30px] w-[48px] rounded-full bg-white shadow-[inset_0_2px_6px_rgba(128,180,207,0.25),0_3px_8px_rgba(128,180,207,0.2)]"
                        >
                            <span className="absolute right-[3px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-[#8EDCEB] bg-white shadow-[0_2px_6px_rgba(76,218,246,0.35)]" />
                        </button>
                    </div>
                </div> */}

                <div className="mb-4 border-t border-[#8FE3F3]" />

                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[18px] font-bold text-[#303030]">
                        {t("orders.total")}
                    </span>
                    <span className="text-[18px] font-bold text-[#303030]">
                        {summary.total}
                    </span>
                </div>

                {/* Estimated Delivery — card with light background */}
                <div className="mb-5 max-w-[360px] rounded-[14px] bg-[#F5F7F8] px-4 py-3">
                    <div className="mb-1 flex items-center gap-2">
                        <HiTruck
                            className="h-4 w-4 shrink-0"
                            style={{ color: "var(--color-green)" }}
                        />
                        <span
                            className="text-[12px] font-semibold text-[#303030]"
                        >
                            {summary.estimatedDelivery ||
                                t("checkout.estimatedDeliveryDefault", "Estimated delivery: Tomorrow, 2-4 PM")}
                        </span>
                    </div>
                    <p className={cn("text-[11px] text-[#8A8A8A]", isRTL ? "mr-6" : "ml-6")}>
                        {summary.deliveryNote ||
                            t("checkout.deliveryNoteDefault", "Delivery time may vary based on location and traffic")}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onPlaceOrder}
                        className="min-h-[56px] rounded-[16px] border border-[#2C8090] py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(44,128,144,0.24)] hover:opacity-90"
                        style={{
                            background: "linear-gradient(180deg, #4CDAF6 0%, #2C8090 100%)",
                        }}
                    >
                        {buttonText || t("checkout.placeOrder")}
                    </Button>
                    <Link
                        to="/cart"
                        className="block py-1 text-center text-[12px] text-[#6F6F6F] underline hover:text-custom-primary"
                    >
                        {t("checkout.backToCart")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

import { HiTruck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
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
            className="rounded-2xl border border-custom-primary bg-custom-card shadow-lg sticky top-4 pt-6 overflow-hidden"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Header - Yellow organic blob shape */}
            {/* <div className="flex justify-center -mt-6 relative z-10 mb-2">
 <div
 className="px-10 py-3 text-custom-primary text-base font-bold"
 style={{
 background:"#FFD700",
 borderRadius:"40% 60% 55% 45% / 40% 45% 55% 60%",
 boxShadow:"0 4px 12px rgba(255, 215, 0, 0.35)",
 }}
 >
 {t("checkout.orderSummary")}
 </div>
 </div> */}

            <div className="flex justify-center pt-6 pb-2 relative">
                <div
                    className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat absolute left-1/2 -top-1/2 -translate-x-1/2"
                    style={{ backgroundImage: "url('/images/backOrder.png')" }}
                >
                    <h2 className="text-custom-primary text-sm font-bold whitespace-nowrap">
                        {t("checkout.orderSummary")}
                    </h2>
                </div>
            </div>

            {/* White content area */}
            <div className="bg-custom-card px-4 pb-4">
                {/* Products Table */}
                <div className="mb-4">
                    <table className="w-full mt-2">
                        <thead>
                            <tr className="bg-secondary">
                                <th
                                    className={cn(
                                        isRTL ? "text-right rounded-r-2xl" : "text-left rounded-l-2xl",
                                        "py-3 px-3 text-xs font-bold text-custom-primary uppercase",
                                    )}
                                >
                                    {t("checkout.product")}
                                </th>
                                <th className="py-3 px-2 text-xs font-bold text-custom-primary uppercase text-center">
                                    {t("checkout.price")}
                                </th>
                                <th className="py-3 px-2 text-xs font-bold text-custom-primary uppercase text-center">
                                    {t("orders.qty")}
                                </th>
                                <th
                                    className={cn(
                                        isRTL ? "text-left rounded-l-2xl" : "text-right rounded-r-2xl",
                                        "py-3 px-3 text-xs font-bold text-custom-primary uppercase",
                                    )}
                                >
                                    {t("orders.total")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.items.map((item) => (
                                <tr key={item.id} className="border-b border-custom-primary last:border-b-0">
                                    <td className="py-3">
                                        <div className="flex items-start gap-2">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-custom-light">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-xs font-semibold text-custom-primary leading-tight">
                                                    {item.name}
                                                    {(item as { _isFree?: boolean })._isFree && (
                                                        <span className="ml-1 font-medium" style={{ color: "var(--color-green)" }}>
                                                            ({t("cart.free", "FREE")})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-[10px] text-custom-secondary leading-tight">
                                                    {item.store}
                                                </div>
                                                <div className="text-[10px] text-custom-secondary leading-tight">
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
                                        <div className="text-xs font-semibold text-custom-primary">
                                            {item.price}
                                        </div>
                                        {item.originalPrice && (
                                            <div className="text-[10px] line-through text-custom-secondary">
                                                {item.originalPrice}
                                            </div>
                                        )}
                                        {item.savingsText && (
                                            <div
                                                className="text-[10px] font-medium"
                                                style={{ color: "var(--color-green)" }}
                                            >
                                                {item.savingsText}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 text-center align-top">
                                        <div className="text-xs text-custom-primary">
                                            {item.quantity}
                                        </div>
                                    </td>
                                    <td
                                        className={cn(
                                            "py-3 align-top",
                                            isRTL ? "text-left" : "text-right",
                                        )}
                                    >
                                        <div className="text-xs font-semibold text-custom-primary">
                                            {item.subtotal}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Solid teal separator */}
                <div className="border-t border-primary-light/50 my-4" />

                {/* Summary of Charges */}
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-custom-primary text-sm">
                            Items total ({totalItems} items)
                        </span>
                        <span className="font-semibold text-custom-primary text-sm">
                            {summary.itemsTotal}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-custom-primary text-sm">
                            {t("checkout.subtotal")}
                        </span>
                        <span className="font-semibold text-custom-primary text-sm">
                            {summary.subtotal}
                        </span>
                    </div>
                    {summary.storeDiscounts && (
                        <div className="flex items-center justify-between">
                            <span className="text-custom-primary text-sm">Discounts</span>
                            <span
                                className="font-semibold text-sm"
                                style={{ color: "var(--color-green)" }}
                            >
                                {summary.storeDiscounts}
                            </span>
                        </div>
                    )}
                    {summary.couponDiscount && (
                        <div className="flex items-center justify-between">
                            <span className="text-custom-primary text-sm">
                                Coupon discount
                            </span>
                            <span
                                className="font-semibold text-sm"
                                style={{ color: "var(--color-green)" }}
                            >
                                {summary.couponDiscount}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom section with gradient background */}
            <div className="bg-gradient-to-b from-secondary/10 to-secondary/30 px-4 py-4">
           
                {/* Dashed separator before Total */}
                <div className="border-t border-dashed border-primary-light/40 mb-4" />

                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-base font-bold text-custom-primary">
                        {t("orders.total")}
                    </span>
                    <span className="text-xl font-bold text-custom-primary">
                        {summary.total}
                    </span>
                </div>

                {/* Estimated Delivery — card with light background */}
                <div className="bg-custom-tertiary rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <HiTruck
                            className="w-4 h-4 shrink-0"
                            style={{ color: "var(--color-green)" }}
                        />
                        <span
                            className="text-xs font-semibold"
                            style={{ color: "var(--color-green)" }}
                        >
                            {summary.estimatedDelivery ||
                                t("checkout.estimatedDeliveryDefault", "Estimated delivery: Tomorrow, 2-4 PM")}
                        </span>
                    </div>
                    <p className={cn("text-[10px] text-custom-secondary", isRTL ? "mr-6" : "ml-6")}>
                        {summary.deliveryNote ||
                            t("checkout.deliveryNoteDefault", "Delivery time may vary based on location and traffic")}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onPlaceOrder}
                        className="hover:opacity-90 text-white rounded-2xl py-4 text-base font-semibold"
                        style={{
                            background: "linear-gradient(90deg, #4CDAF6 0%, #2C8090 100%)",
                            minHeight: "60px",
                        }}
                    >
                        {buttonText || t("checkout.placeOrder")}
                    </Button>
                    <Link
                        to="/cart"
                        className="block text-center text-xs text-custom-secondary hover:text-custom-primary underline py-2"
                    >
                        {t("checkout.backToCart")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

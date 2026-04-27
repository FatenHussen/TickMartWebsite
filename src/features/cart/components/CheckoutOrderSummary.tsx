import { HiTruck, HiArrowRight } from "react-icons/hi";
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
            className="sticky top-4 rounded-3xl"
            style={{
                padding: "1px",
                background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--color-main) 50%, transparent), color-mix(in srgb, var(--color-api-second) 60%, transparent))",
                boxShadow:
                    "0 18px 45px -22px color-mix(in srgb, var(--color-main) 40%, transparent)",
            }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="rounded-[calc(1.5rem-1px)] bg-custom-card overflow-hidden relative">
                {/* Decorative top wash */}
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-[0.06]"
                    style={{
                        background:
                            "radial-gradient(120% 80% at 50% 0%, var(--color-main) 0%, transparent 70%)",
                    }}
                    aria-hidden
                />

                {/* Header */}
                <div
                    className="relative px-4 sm:px-5 pt-5 pb-3 border-b border-dashed"
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
                            {t("checkout.orderSummary")}
                        </span>
                    </div>
                </div>

                {/* Content area */}
                <div className="relative bg-custom-card px-4 sm:px-5 pb-5 pt-5">
                    {/* Products Table */}
                    <div className="mb-5 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        background:
                                            "color-mix(in srgb, var(--color-main) 10%, var(--color-bg-card))",
                                    }}
                                >
                                    <th
                                        className={cn(
                                            isRTL
                                                ? "rounded-r-2xl text-right"
                                                : "rounded-l-2xl text-left",
                                            "px-3 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--color-text)]/80",
                                        )}
                                    >
                                        {t("checkout.product")}
                                    </th>
                                    <th className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--color-text)]/80">
                                        {t("checkout.price")}
                                    </th>
                                    <th className="px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--color-text)]/80">
                                        {t("orders.qty")}
                                    </th>
                                    <th
                                        className={cn(
                                            isRTL
                                                ? "rounded-l-2xl text-left"
                                                : "rounded-r-2xl text-right",
                                            "px-3 py-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[color:var(--color-text)]/80",
                                        )}
                                    >
                                        {t("orders.total")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {summary.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-custom-primary last:border-b-0"
                                    >
                                        <td className="py-3 pe-2 align-top">
                                            <div className="flex items-start gap-3">
                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-custom-tertiary">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-semibold leading-tight text-[color:var(--color-text)]">
                                                        {item.name}
                                                        {(
                                                            item as {
                                                                _isFree?: boolean;
                                                            }
                                                        )._isFree && (
                                                            <span
                                                                className="ms-1 font-medium"
                                                                style={{
                                                                    color: "var(--color-success)",
                                                                }}
                                                            >
                                                                (
                                                                {t(
                                                                    "cart.free",
                                                                    "FREE",
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] leading-tight text-custom-tertiary">
                                                        {item.store}
                                                    </div>
                                                    <div className="text-[11px] leading-tight text-custom-tertiary">
                                                        {item.size}
                                                        {item.size && item.type
                                                            ? ", "
                                                            : ""}
                                                        {item.type}
                                                    </div>
                                                    {((
                                                        item as {
                                                            _freeQuantity?: number;
                                                        }
                                                    )._freeQuantity ?? 0) >
                                                        0 && (
                                                        <div
                                                            className="text-[10px] font-medium"
                                                            style={{
                                                                color: "var(--color-success)",
                                                            }}
                                                        >
                                                            {t(
                                                                "cart.free",
                                                                "FREE",
                                                            )}{" "}
                                                            ×{" "}
                                                            {(
                                                                item as {
                                                                    _freeQuantity?: number;
                                                                }
                                                            )._freeQuantity ??
                                                                0}
                                                        </div>
                                                    )}
                                                    {(
                                                        item as {
                                                            _isExcludedFromCoupon?: boolean;
                                                        }
                                                    )._isExcludedFromCoupon && (
                                                        <div
                                                            className="text-[10px]"
                                                            style={{
                                                                color: "var(--color-ui-amber-800)",
                                                            }}
                                                        >
                                                            {t(
                                                                "cart.excludedFromCoupon",
                                                                "Not eligible for coupon",
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center align-top">
                                            <div className="text-xs font-semibold text-[color:var(--color-text)] tabular-nums">
                                                {item.price}
                                            </div>
                                            {item.originalPrice && (
                                                <div className="text-[11px] text-custom-tertiary line-through">
                                                    {item.originalPrice}
                                                </div>
                                            )}
                                            {item.savingsText && (
                                                <div
                                                    className="text-[11px] font-medium"
                                                    style={{
                                                        color: "var(--color-success)",
                                                    }}
                                                >
                                                    {item.savingsText}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 text-center align-top">
                                            <div className="text-xs font-medium text-[color:var(--color-text)] tabular-nums">
                                                {item.quantity}
                                            </div>
                                        </td>
                                        <td
                                            className={cn(
                                                "py-3 align-top",
                                                isRTL
                                                    ? "text-left"
                                                    : "text-right",
                                            )}
                                        >
                                            <div className="text-xs font-semibold text-[color:var(--color-text)] tabular-nums">
                                                {item.subtotal}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Divider */}
                    <div
                        className="my-4 border-t border-dashed"
                        style={{
                            borderColor:
                                "color-mix(in srgb, var(--color-main) 28%, transparent)",
                        }}
                    />

                    {/* Charges */}
                    <div className="space-y-3 text-sm">
                        <SummaryRow
                            label={`${t("cart.itemsTotal", "Items total")} (${totalItems})`}
                            value={summary.itemsTotal}
                        />
                        <SummaryRow
                            label={t("checkout.subtotal")}
                            value={summary.subtotal}
                        />
                        {summary.deliveryFees &&
                            summary.deliveryFees !== "-" && (
                                <SummaryRow
                                    label={t("checkout.deliveryFees")}
                                    value={summary.deliveryFees}
                                    accent={
                                        summary.deliveryFees === "Free"
                                            ? "success"
                                            : undefined
                                    }
                                />
                            )}
                        {summary.storeDiscounts && (
                            <SummaryRow
                                label={t("cart.discounts", "Discounts")}
                                value={summary.storeDiscounts}
                                accent="success"
                            />
                        )}
                        {summary.couponDiscount && (
                            <SummaryRow
                                label={t(
                                    "checkout.couponDiscount",
                                    "Coupon discount",
                                )}
                                value={summary.couponDiscount}
                                accent="success"
                            />
                        )}
                    </div>
                </div>

                {/* Bottom section */}
                <div
                    className="px-4 sm:px-5 pb-6 pt-4 border-t"
                    style={{
                        borderColor:
                            "color-mix(in srgb, var(--color-main) 20%, transparent)",
                        background:
                            "linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-main) 4%, transparent) 100%)",
                    }}
                >
                    {/* Total */}
                    <div className="flex items-baseline justify-between mb-4">
                        <span className="text-lg font-bold text-[color:var(--color-text)]">
                            {t("orders.total")}
                        </span>
                        <span className="text-2xl font-extrabold text-[color:var(--color-main)] tabular-nums">
                            {summary.total}
                        </span>
                    </div>

                    {/* Estimated Delivery */}
                    <div
                        className="mb-5 max-w-[360px] rounded-xl px-4 py-3 border"
                        style={{
                            backgroundColor:
                                "color-mix(in srgb, var(--color-main) 6%, var(--color-bg-card))",
                            borderColor:
                                "color-mix(in srgb, var(--color-main) 18%, transparent)",
                        }}
                    >
                        <div className="mb-1 flex items-center gap-2">
                            <HiTruck
                                className="h-4 w-4 shrink-0"
                                style={{
                                    color: "var(--color-main)",
                                }}
                            />
                            <span className="text-xs font-semibold text-[color:var(--color-text)]">
                                {summary.estimatedDelivery ||
                                    t(
                                        "checkout.estimatedDeliveryDefault",
                                        "Estimated delivery: Tomorrow, 2-4 PM",
                                    )}
                            </span>
                        </div>
                        <p className="text-[11px] text-custom-tertiary ms-6">
                            {summary.deliveryNote ||
                                t(
                                    "checkout.deliveryNoteDefault",
                                    "Delivery time may vary based on location and traffic",
                                )}
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
                            className={cn(
                                "group min-h-[56px] rounded-2xl py-4 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2",
                                "!bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] !border-transparent",
                                "shadow-[0_10px_24px_-10px_color-mix(in_srgb,var(--color-main)_55%,transparent)]",
                            )}
                        >
                            <span>{buttonText || t("checkout.placeOrder")}</span>
                            <HiArrowRight
                                className={cn(
                                    "w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5",
                                    isRTL && "rotate-180 group-hover:-translate-x-0.5",
                                )}
                            />
                        </Button>
                        <Link
                            to="/cart"
                            className="block py-1 text-center text-xs text-custom-secondary hover:text-[color:var(--color-main)] hover:underline transition-colors"
                        >
                            {t("checkout.backToCart")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

type SummaryRowProps = {
    label: string;
    value: string;
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

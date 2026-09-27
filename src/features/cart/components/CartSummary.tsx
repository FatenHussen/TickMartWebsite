import { useState, useEffect, type ReactNode } from "react";
import { HiArrowRight } from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import FormattedPrice from "@/shared/component/FormattedPrice";
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
    /** `false` disables checkout and shows `checkoutMessage` as returned by the API. */
    canCheckout?: boolean;
    checkoutMessage?: string | null;
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
    canCheckout = true,
    checkoutMessage = null,
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
                    <div className="h-10 bg-custom-muted rounded-xl" />
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

                {summary.rewardLines && summary.rewardLines.length > 0 && (
                    <div className="space-y-2 text-sm">
                        {summary.rewardLines.map((line) => (
                            <div
                                key={line.id}
                                className="flex items-center justify-between gap-3"
                            >
                                <span className="text-custom-secondary">{line.label}</span>
                                {line.value ? (
                                    <FormattedPrice
                                        value={line.value}
                                        layout="inline"
                                        className="font-semibold tabular-nums text-[var(--color-success)]"
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-2.5 border-t border-custom-primary pt-4 text-sm">
                    <InvoiceRow
                        label={t("cart.invoiceSubtotal")}
                        value={summary.invoiceSubtotal ?? summary.subtotal}
                    />
                    <InvoiceRow
                        label={t("cart.invoiceDiscount")}
                        value={summary.discountTotal ?? summary.storeDiscounts}
                        accent={
                            (summary.discountTotal ?? summary.storeDiscounts).startsWith("-")
                                ? "success"
                                : undefined
                        }
                    />
                    <InvoiceRow
                        label={t("cart.invoiceDelivery")}
                        value={
                            summary.shippingIsFree
                                ? t("cart.freeDelivery")
                                : summary.shipping
                        }
                        accent={summary.shippingIsFree ? "success" : undefined}
                    />
                </div>

                <div className="flex items-baseline justify-between gap-3 border-t border-custom-primary pt-4">
                    <span className="text-base font-bold text-[color:var(--color-text)]">
                        {t("checkout.total", "Total")}
                    </span>
                    <FormattedPrice
                        value={summary.total}
                        layout="inline"
                        className="text-xl font-extrabold tabular-nums text-[color:var(--color-main)]"
                    />
                </div>

                {!canCheckout && checkoutMessage && <Alert>{checkoutMessage}</Alert>}

                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={onCheckout}
                    disabled={!canCheckout}
                    className="group !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] disabled:!opacity-60 disabled:pointer-events-none text-white font-semibold rounded-xl flex items-center justify-center gap-2"
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

function InvoiceRow({
    label,
    value,
    accent,
}: {
    label: string;
    value?: string;
    accent?: "success";
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-custom-secondary">{label}</span>
            <span
                className="font-semibold tabular-nums text-[color:var(--color-text)]"
                style={accent === "success" ? { color: "var(--color-success)" } : undefined}
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

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiTag } from "react-icons/hi";
import Button from "@/shared/ui/Button";

type CheckoutCouponSectionProps = {
    /** The code currently stored on the checkout, if any. */
    coupon: string;
    onApply: (code: string) => void;
    onRemove: () => void;
    isLoading?: boolean;
    /** A selected benefit already supplies a discount; a code cannot stack on it. */
    disabled?: boolean;
    disabledHint?: string | null;
    /** `fail_reasons` from the preview when the code was rejected. */
    failReasons?: string[];
    applied?: boolean;
};

/**
 * `وفر على طلبك` — discount-code entry with an apply button, required on the
 * payment/delivery step by the order spec.
 */
export default function CheckoutCouponSection({
    coupon,
    onApply,
    onRemove,
    isLoading = false,
    disabled = false,
    disabledHint = null,
    failReasons = [],
    applied = false,
}: CheckoutCouponSectionProps) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState(coupon);

    useEffect(() => {
        setDraft(coupon);
    }, [coupon]);

    const handleApply = () => {
        const code = draft.trim().toUpperCase();
        if (code && !disabled) onApply(code);
    };

    return (
        <section className="rounded-2xl border border-custom-secondary bg-custom-primary p-4 sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-custom-primary">
                <HiTag className="h-5 w-5 text-custom-accent" />
                {t("cart.saveOnOrder", "وفر على طلبك")}
            </h2>

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            handleApply();
                        }
                    }}
                    disabled={disabled || isLoading}
                    placeholder={t("cart.couponCode")}
                    aria-label={t("cart.couponCode")}
                    dir="ltr"
                    className="min-w-0 flex-1 rounded-xl border border-custom-secondary bg-custom-primary px-3 py-2 text-sm text-custom-primary placeholder:text-custom-secondary focus:outline-none focus:ring-2 focus:ring-[color:var(--color-api-second)] disabled:opacity-50"
                />
                {applied && coupon ? (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onRemove}
                        disabled={isLoading}
                    >
                        {t("cart.removeCoupon", "إزالة")}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleApply}
                        disabled={disabled || isLoading || !draft.trim()}
                    >
                        {isLoading ? "…" : t("cart.applyCoupon")}
                    </Button>
                )}
            </div>

            {disabled && disabledHint && (
                <p className="mt-2 text-xs text-custom-secondary">{disabledHint}</p>
            )}

            {applied && coupon && !disabled && (
                <p className="mt-2 text-xs font-medium" style={{ color: "var(--color-green)" }}>
                    {t("cart.couponApplied", "تم تطبيق الكود")}
                </p>
            )}

            {!applied && failReasons.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {failReasons.map((reason) => (
                        <li key={reason} className="text-xs text-[color:var(--color-ui-amber-900)]">
                            {reason}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

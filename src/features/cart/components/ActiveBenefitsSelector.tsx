import { useTranslation } from "react-i18next";
import { HiGift, HiTruck } from "react-icons/hi";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/shared/lib/utils";
import type { BenefitItem } from "../api/activeBenefitsApi";

interface ActiveBenefitsSelectorProps {
    coupons: BenefitItem[];
    freeDeliveries: BenefitItem[];
    selectedCouponKey: string | null;
    selectedDeliveryKey: string | null;
    onSelectCoupon: (key: string | null, value: number | boolean | null) => void;
    onSelectDelivery: (
        key: string | null,
        value: number | boolean | null,
    ) => void;
}

export default function ActiveBenefitsSelector({
    coupons,
    freeDeliveries,
    selectedCouponKey,
    selectedDeliveryKey,
    onSelectCoupon,
    onSelectDelivery,
}: ActiveBenefitsSelectorProps) {
    const { t } = useTranslation();

    if (coupons.length === 0 && freeDeliveries.length === 0) return null;

    return (
        <div className="space-y-4">
            {coupons.length > 0 && (
                <BenefitSection
                    title={t("cart.availableCoupons", "Available Discounts")}
                >
                    {coupons.map((item) => {
                        const isSelected = selectedCouponKey === item.key;
                        return (
                            <BenefitButton
                                key={item.key}
                                icon={HiGift}
                                title={item.title}
                                isSelected={isSelected}
                                onClick={() =>
                                    isSelected
                                        ? onSelectCoupon(null, null)
                                        : onSelectCoupon(item.key, item.value)
                                }
                                trailing={
                                    item.discount_amount != null
                                        ? `-${item.discount_amount}`
                                        : item.discount_percentage != null
                                          ? `-${item.discount_percentage}%`
                                          : ""
                                }
                            />
                        );
                    })}
                </BenefitSection>
            )}

            {freeDeliveries.length > 0 && (
                <BenefitSection
                    title={t("cart.freeDeliveryOptions", "Free Delivery Options")}
                >
                    {freeDeliveries.map((item) => {
                        const isSelected = selectedDeliveryKey === item.key;
                        return (
                            <BenefitButton
                                key={item.key}
                                icon={HiTruck}
                                title={item.title}
                                isSelected={isSelected}
                                onClick={() =>
                                    isSelected
                                        ? onSelectDelivery(null, null)
                                        : onSelectDelivery(item.key, item.value)
                                }
                                trailing={
                                    item.remaining_count != null
                                        ? `${item.remaining_count} ${t("cart.remaining", "left")}`
                                        : ""
                                }
                                trailingMuted
                            />
                        );
                    })}
                </BenefitSection>
            )}
        </div>
    );
}

function BenefitSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-custom-tertiary mb-2">
                {title}
            </p>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

type BenefitButtonProps = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    title: string;
    isSelected: boolean;
    onClick: () => void;
    trailing?: string;
    trailingMuted?: boolean;
};

function BenefitButton({
    icon: Icon,
    title,
    isSelected,
    onClick,
    trailing,
    trailingMuted = false,
}: BenefitButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between gap-3",
                "px-4 py-3 rounded-xl border text-sm transition-all duration-200 text-start",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_25%,transparent)]",
                isSelected
                    ? "border-[color:color-mix(in_srgb,var(--color-main)_55%,transparent)] bg-[color:color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))]"
                    : "border-custom-primary bg-custom-card hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--color-main)_35%,transparent)] hover:shadow-sm",
            )}
        >
            <span className="flex items-center gap-2 min-w-0">
                <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{
                        background:
                            "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card))",
                        color: "var(--color-main)",
                    }}
                >
                    <Icon className="w-4 h-4" />
                </span>
                <span className="font-medium text-[color:var(--color-text)] truncate">
                    {title}
                </span>
            </span>
            {trailing && (
                <span
                    className={cn(
                        "whitespace-nowrap tabular-nums",
                        trailingMuted
                            ? "text-xs font-semibold text-custom-tertiary"
                            : "font-bold",
                    )}
                    style={
                        !trailingMuted
                            ? {
                                  color: isSelected
                                      ? "var(--color-main)"
                                      : "var(--color-text)",
                              }
                            : undefined
                    }
                >
                    {trailing}
                </span>
            )}
        </button>
    );
}

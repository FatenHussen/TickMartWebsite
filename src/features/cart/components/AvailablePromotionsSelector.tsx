import { useTranslation } from "react-i18next";
import { HiTag } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { AvailablePromotion } from "../types";

interface AvailablePromotionsSelectorProps {
    promotions: AvailablePromotion[];
    selectedPromotionId: number | null;
    onSelect: (id: number | null) => void;
}

function resolveLocalizedText(
    value: string | { ar?: string | null; en?: string | null } | null | undefined,
    language: string,
): string {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    const isArabic = language.toLowerCase().startsWith("ar");
    return (isArabic ? value.ar : value.en) ?? value.en ?? value.ar ?? "";
}

export default function AvailablePromotionsSelector({
    promotions,
    selectedPromotionId,
    onSelect,
}: AvailablePromotionsSelectorProps) {
    const { t, i18n } = useTranslation();

    if (promotions.length === 0) return null;

    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-custom-tertiary mb-2">
                {t("cart.availablePromotions", "Available Offers")}
            </p>
            <div className="space-y-2">
                {promotions.map((promo) => {
                    const isSelected = selectedPromotionId === promo.id;
                    const promoName = resolveLocalizedText(
                        promo.name,
                        i18n.language,
                    );
                    return (
                        <button
                            key={promo.id}
                            type="button"
                            onClick={() => onSelect(isSelected ? null : promo.id)}
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
                                    <HiTag className="w-4 h-4" />
                                </span>
                                <span className="font-medium text-[color:var(--color-text)] truncate">
                                    {promoName}
                                </span>
                            </span>
                            {promo.discount_value != null && (
                                <span
                                    className="font-bold whitespace-nowrap tabular-nums"
                                    style={{
                                        color: isSelected
                                            ? "var(--color-main)"
                                            : "var(--color-text)",
                                    }}
                                >
                                    {promo.discount_type === "percentage"
                                        ? `-${promo.discount_value}%`
                                        : `-${promo.discount_value}`}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

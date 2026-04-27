import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi2";
import { cn } from "@/shared/lib/utils";

/** QTY stepper ring: API `main` → `second` on card surface */
const qtyStepperButtonStyle = (): CSSProperties => ({
    backgroundImage:
        "linear-gradient(var(--color-bg-card), var(--color-bg-card)), linear-gradient(180deg, var(--color-main) 0%, var(--color-api-second) 100%)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
});

const selectInputClassName =
    "w-full min-w-[10rem] max-w-full rounded-xl border border-custom-primary/15 bg-custom-card px-3 py-2.5 text-sm text-custom-primary shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-main)]/30 dark:border-custom-primary/25";

export interface ProductItemCompany {
    id: number;
    name: string;
    is_default?: boolean;
    has_custom_price?: boolean;
    effective_price?: number;
}

export interface ProductItemVariant {
    id: number | string;
    name: string;
    value?: string | number;
}

export interface ProductItemData {
    id: number;
    name: string;
    image?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    /** When set (e.g. API price_after_discount_formatted at default qty), shown in price column instead of computed */
    priceLineFormatted?: string;
    min_quantity?: number;
    max_quantity?: number;
    can_adjust?: boolean;
    is_required?: boolean;
    companies?: ProductItemCompany[];
    variants?: ProductItemVariant[];
    selectedCompanyId?: number;
    selectedVariantId?: number | string;
    variant?: (string | number)[]; // For basket items
    /** Variant label shown below product name (e.g. "Large") */
    variantLabel?: string;
}

export interface ProductItemsTableProps {
    items: ProductItemData[];
    onQuantityChange?: (itemId: number, newQuantity: number) => void;
    onCompanyChange?: (itemId: number, companyId: number) => void;
    onVariantChange?: (itemId: number, variantId: number | string) => void;
    onRemoveItem?: (itemId: number) => void;
    readonly?: boolean;
    showCompanyColumn?: boolean;
    showVariantColumn?: boolean;
    showActionColumn?: boolean;
    currencySymbol?: string;
    className?: string;
}

export default function ProductItemsTable({
    items,
    onQuantityChange,
    onCompanyChange,
    onVariantChange,
    onRemoveItem,
    readonly = false,
    showCompanyColumn = true,
    showVariantColumn = true,
    showActionColumn = true,
    currencySymbol = "$",
    className,
}: ProductItemsTableProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    const handleQuantityIncrease = (item: ProductItemData) => {
        if (readonly || !item.can_adjust) return;
        const maxQty = item.max_quantity ?? 999;
        if (item.quantity < maxQty) {
            onQuantityChange?.(item.id, item.quantity + 1);
        }
    };

    const handleQuantityDecrease = (item: ProductItemData) => {
        if (readonly || !item.can_adjust) return;
        const minQty = item.min_quantity ?? 1;
        if (item.quantity > minQty) {
            onQuantityChange?.(item.id, item.quantity - 1);
        }
    };

    const handleCompanySelect = (itemId: number, companyId: number) => {
        if (readonly) return;
        onCompanyChange?.(itemId, companyId);
    };

    const handleVariantSelect = (itemId: number, variantId: number | string) => {
        if (readonly) return;
        onVariantChange?.(itemId, variantId);
    };



    const headerCell = (align: "left" | "center" | "right") =>
        cn(
            "py-3.5 px-5 sm:px-6 text-[11px] font-bold uppercase tracking-wider text-white/95",
            align === "left" && (isRTL ? "text-right" : "text-left"),
            align === "right" && (isRTL ? "text-left" : "text-right"),
            align === "center" && "text-center"
        );

    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-custom-primary/10 bg-custom-card shadow-[var(--shadow-card-neutral)]",
                className
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr
                            className={cn(
                                "bg-gradient-to-r from-[var(--color-main)] to-[var(--color-api-second)]",
                                isRTL && "bg-gradient-to-l"
                            )}
                        >
                            <th className={headerCell("left")}>{t("recipes.product")}</th>
                            {showCompanyColumn && (
                                <th className={headerCell("left")}>{t("recipes.companyBrand")}</th>
                            )}
                            {showVariantColumn && (
                                <th className={headerCell("left")}>{t("recipes.variantOption")}</th>
                            )}
                            <th className={headerCell("center")}>{t("recipes.quantity")}</th>
                            <th className={headerCell("right")}>{t("recipes.price")}</th>
                            {showActionColumn && !readonly && (
                                <th className={headerCell("center")}>{t("recipes.action")}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const minQty = item.min_quantity ?? 1;
                            const maxQty = item.max_quantity ?? 999;

                            return (
                                <tr
                                    key={item.id}
                                    className={cn(
                                        "border-b border-custom-primary/10 transition-colors last:border-b-0",
                                        "bg-custom-card hover:bg-[color-mix(in_srgb,var(--color-main)_5%,var(--color-bg-card))]",
                                        "even:bg-[color-mix(in_srgb,var(--color-main)_2.5%,var(--color-bg-card))]",
                                        "dark:border-custom-primary/15 dark:hover:bg-white/[0.04]"
                                    )}
                                >
                                    {/* Product */}
                                    <td className="align-middle px-5 py-4 sm:px-6 sm:py-5">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                                />
                                            )}
                                            <div className="flex min-w-0 flex-col">
                                                <span className="font-bold text-custom-primary">
                                                    {item.name}
                                                    {item.is_required && (
                                                        <span className="ms-1 text-[var(--color-error)]">*</span>
                                                    )}
                                                </span>
                                                {item.variantLabel && (
                                                    <span className="mt-0.5 text-xs text-custom-secondary">
                                                        {item.variantLabel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company/Brand */}
                                    {showCompanyColumn && (
                                        <td className="align-middle px-5 py-4 sm:px-6 sm:py-5">
                                            {item.companies && item.companies.length > 0 ? (
                                                <select
                                                    value={item.selectedCompanyId ?? item.companies.find((c) => c.is_default)?.id}
                                                    onChange={(e) => handleCompanySelect(item.id, Number(e.target.value))}
                                                    disabled={readonly}
                                                    className={cn(
                                                        selectInputClassName,
                                                        readonly && "cursor-not-allowed opacity-50"
                                                    )}
                                                >
                                                    {item.companies.map((company) => (
                                                        <option key={company.id} value={company.id}>
                                                            {company.name}
                                                            {company.is_default && ` (${t("common.default")})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-sm text-custom-secondary">-</span>
                                            )}
                                        </td>
                                    )}

                                    {/* Variant/Option */}
                                    {showVariantColumn && (
                                        <td className="align-middle px-5 py-4 sm:px-6 sm:py-5">
                                            {item.variants && item.variants.length > 0 ? (
                                                <select
                                                    value={item.selectedVariantId ?? item.variants[0]?.id}
                                                    onChange={(e) => handleVariantSelect(item.id, e.target.value)}
                                                    disabled={readonly}
                                                    className={cn(
                                                        selectInputClassName,
                                                        readonly && "cursor-not-allowed opacity-50"
                                                    )}
                                                >
                                                    {item.variants.map((variant) => (
                                                        <option key={variant.id} value={variant.id}>
                                                            {variant.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : item.variant && item.variant.length > 0 ? (
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-normal text-custom-secondary">
                                                    {item.variant.map((val, idx) => {
                                                        const strVal = String(val);
                                                        const isHex = /^#[0-9A-Fa-f]{3,8}$/.test(strVal);
                                                        return (
                                                            <span key={idx} className="inline-flex items-center gap-1.5">
                                                                {idx > 0 && <span className="text-custom-tertiary">•</span>}
                                                                {isHex ? (
                                                                    <>
                                                                        <span
                                                                            className="h-4 w-4 shrink-0 rounded border border-custom-primary/20 dark:border-custom-primary/30"
                                                                            style={{ backgroundColor: strVal }}
                                                                            title={strVal}
                                                                        />
                                                                        <span className="text-custom-secondary">{strVal}</span>
                                                                    </>
                                                                ) : (
                                                                    strVal
                                                                )}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-custom-secondary">-</span>
                                            )}
                                        </td>
                                    )}

                                    {/* Quantity */}
                                    <td className="align-middle px-5 py-4 sm:px-6 sm:py-5">
                                        {!readonly && item.can_adjust !== false ? (
                                            <div className="flex items-center justify-center gap-3 sm:gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityDecrease(item)}
                                                    disabled={item.quantity <= minQty}
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 text-custom-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
                                                        item.quantity <= minQty && "cursor-not-allowed opacity-50"
                                                    )}
                                                    style={qtyStepperButtonStyle()}
                                                    aria-label={t("cart.decreaseQuantity")}
                                                >
                                                    <HiMinus className="h-4 w-4" />
                                                </button>
                                                <span className="min-w-[2rem] text-center text-lg font-bold text-custom-primary tabular-nums">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityIncrease(item)}
                                                    disabled={item.quantity >= maxQty}
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 text-custom-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40",
                                                        item.quantity >= maxQty && "cursor-not-allowed opacity-50"
                                                    )}
                                                    style={qtyStepperButtonStyle()}
                                                    aria-label={t("cart.increaseQuantity")}
                                                >
                                                    <HiPlus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center text-lg font-bold text-custom-primary tabular-nums">
                                                {item.quantity}
                                            </div>
                                        )}
                                    </td>

                                    {/* Price */}
                                    <td
                                        className={cn(
                                            "align-middle px-5 py-4 text-base font-bold text-custom-primary tabular-nums sm:px-6 sm:py-5 sm:text-lg",
                                            isRTL ? "text-left" : "text-right"
                                        )}
                                    >
                                        {item.priceLineFormatted ??
                                            `${currencySymbol}${Number.isFinite(item.subtotal) ? item.subtotal.toFixed(2) : "0.00"}`}
                                    </td>

                                    {/* Action */}
                                    {showActionColumn && !readonly && (
                                        <td className="px-5 py-4 text-center align-middle sm:px-6 sm:py-5">
                                            <button
                                                type="button"
                                                onClick={() => onRemoveItem?.(item.id)}
                                                className="inline-flex text-[var(--color-error)] transition hover:opacity-80"
                                                aria-label={t("cart.removeItem")}
                                            >
                                                <HiTrash className="h-5 w-5" />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

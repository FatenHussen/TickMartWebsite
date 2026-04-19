import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi2";
import { cn } from "@/shared/lib/utils";

/** Figma: QTY stepper — 32px circle, 1px border as cyan→teal gradient */
const QTY_STEPPER_BUTTON_STYLE: CSSProperties = {
    backgroundImage:
        "linear-gradient(#ffffff, #ffffff), linear-gradient(180deg, #4cdaf6 0%, #2c8090 100%)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
};

const selectInputClassName =
    "w-full min-w-[10rem] max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-custom-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00AED1]/40 dark:border-slate-600 dark:bg-custom-primary";

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
            "py-3 px-6 text-xs font-bold uppercase tracking-wide text-white",
            align === "left" && (isRTL ? "text-right" : "text-left"),
            align === "right" && (isRTL ? "text-left" : "text-right"),
            align === "center" && "text-center"
        );

    return (
        <div
            className={cn(
                "overflow-hidden   bg-custom-primary ",
                className
            )}
        >
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-[#4CDAF6] to-[#2C8090]">
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
                                    className="border-b border-slate-200 bg-custom-primary transition last:border-b-0 hover:bg-slate-50/70 dark:border-slate-700 dark:hover:bg-white/[0.04]"
                                >
                                    {/* Product */}
                                    <td className="align-middle px-6 py-5">
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
                                                        <span className="ml-1 text-red-500">*</span>
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
                                        <td className="align-middle px-6 py-5">
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
                                        <td className="align-middle px-6 py-5">
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
                                                                            className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 shrink-0"
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
                                    <td className="align-middle px-6 py-5">
                                        {!readonly && item.can_adjust !== false ? (
                                            <div className="flex items-center justify-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuantityDecrease(item)}
                                                    disabled={item.quantity <= minQty}
                                                    className={cn(
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 text-neutral-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-100",
                                                        item.quantity <= minQty && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    style={QTY_STEPPER_BUTTON_STYLE}
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
                                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 text-neutral-900 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:text-neutral-100",
                                                        item.quantity >= maxQty && "opacity-50 cursor-not-allowed"
                                                    )}
                                                    style={QTY_STEPPER_BUTTON_STYLE}
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
                                            "align-middle px-6 py-5 text-lg font-bold text-custom-primary tabular-nums",
                                            isRTL ? "text-left" : "text-right"
                                        )}
                                    >
                                        {item.priceLineFormatted ??
                                            `${currencySymbol}${Number.isFinite(item.subtotal) ? item.subtotal.toFixed(2) : "0.00"}`}
                                    </td>

                                    {/* Action */}
                                    {showActionColumn && !readonly && (
                                        <td className="px-6 py-5 text-center align-middle">
                                            <button
                                                type="button"
                                                onClick={() => onRemoveItem?.(item.id)}
                                                className="inline-flex text-[#EF4444] transition hover:text-red-700"
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

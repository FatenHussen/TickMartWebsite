import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/shared/lib/utils";
import type { ShopVariant, VariantAttribute } from "../types/productDetails";
import { isPurchasableVariant } from "../types/productDetails";
import { gallerySrcsForSelection, mediaSrc, type ProductMediaSource } from "../lib/productMedia";
import {
    resolveDisplayListPrice,
    resolveDisplaySalePrice,
} from "@/shared/lib/formatApiPrice";
import { formatStorefrontDiscountBadge } from "@/shared/lib/productDiscountDisplay";
import { cssColorForSwatch } from "../lib/attributeValueColor";

export type ShopVariantsPreviewProps = {
    variants: ShopVariant[];
    className?: string;
    /** Product gallery used when a row has `has_variant_images === false`. */
    productMedia?: ProductMediaSource | null;
    /** When set, one variant can be chosen (e.g. add to cart) */
    selectedId?: number | null;
    onSelect?: (shopVariantId: number) => void;
};

function renderAttributeValue(attr: VariantAttribute) {
    if (attr.type === "color") {
        return (
            <span
                role="img"
                aria-label={`${attr.attribute}: ${attr.value}`}
                className="inline-block h-7 w-7 shrink-0 rounded-full border-2 border-custom-primary shadow-sm"
                style={{
                    backgroundColor: cssColorForSwatch({
                        hex: attr.hex,
                        id: attr.id,
                        label: attr.value,
                    }),
                }}
                title={`${attr.attribute}: ${attr.value}`}
            />
        );
    }
    return (
        <span className="inline-flex min-h-8 min-w-[2.5rem] items-center justify-center rounded-lg bg-custom-tertiary px-3 text-xs font-medium text-custom-primary">
            {attr.value}
        </span>
    );
}

export default function ShopVariantsPreview({
    variants,
    className,
    productMedia,
    selectedId,
    onSelect,
}: ShopVariantsPreviewProps) {
    const { t } = useTranslation();
    const { currency } = useCurrency();
    const selectable = typeof onSelect === "function";

    if (!variants?.length) return null;

    const hasComboRows = variants.some((v) => (v.attributes?.length ?? 0) > 0);
    const rows = hasComboRows
        ? variants.filter((v) => (v.attributes?.length ?? 0) > 0)
        : variants;

    if (!rows.length) return null;

    return (
        <div className={cn("space-y-3", className)}>
            <h3 className="text-base font-semibold text-custom-primary">
                {t("product.shopVariants", "Variants")}
            </h3>
            {selectable && (
                <p className="text-xs text-custom-secondary">
                    {t(
                        "product.selectOneVariant",
                        "Choose one option to add to cart",
                    )}
                </p>
            )}
            <ul className="flex max-h-[min(320px,40vh)] flex-col gap-3 overflow-y-auto pr-1">
                {rows.map((v, index) => {
                    const thumb =
                        gallerySrcsForSelection(v, productMedia)[0] ||
                        mediaSrc(v.images?.[0]);
                    const priceLabel = resolveDisplaySalePrice(v, currency);
                    const originalLabel = resolveDisplayListPrice(v, currency);
                    const discountBadge = formatStorefrontDiscountBadge(v, undefined, t);
                    // `id`/`shop_id` null = display-only (price shown, not addable).
                    const purchasable = isPurchasableVariant(v);
                    const outOfStock = !purchasable;
                    const isSelected = v.id != null && selectedId === v.id;

                    const rowClass = cn(
                        "flex w-full gap-3 rounded-xl border p-3 text-start transition-all",
                        selectable && !outOfStock && "cursor-pointer",
                        selectable && isSelected
                            ? "border-primary bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--color-bg-card))] shadow-md ring-2 ring-primary/35 dark:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-bg-surface))]"
                            : "border-custom-primary/60 bg-custom-secondary/40 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] dark:bg-[color-mix(in_srgb,var(--color-api-second)_18%,#10121a)]",
                        selectable &&
                            !isSelected &&
                            !outOfStock &&
                            "hover:border-[color-mix(in_srgb,var(--color-api-second)_55%,var(--color-border-primary))]",
                        outOfStock && "opacity-60",
                    );

                    const inner = (
                        <>
                            {thumb ? (
                                <img
                                    src={thumb}
                                    alt=""
                                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-20 w-20 shrink-0 rounded-lg bg-custom-tertiary" />
                            )}
                            <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    {(v.attributes ?? []).map((attr) => (
                                        <div
                                            key={`${v.id ?? index}-${attr.id ?? attr.attribute}`}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-xs text-custom-secondary">
                                                {attr.attribute}
                                            </span>
                                            {renderAttributeValue(attr)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                                    <span className="font-bold text-custom-primary">
                                        {priceLabel}
                                    </span>
                                    {originalLabel ? (
                                        <span className="text-custom-tertiary line-through">
                                            {originalLabel}
                                        </span>
                                    ) : null}
                                    {discountBadge ? (
                                        <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-white">
                                            {discountBadge}
                                        </span>
                                    ) : null}
                                    <span className="text-custom-secondary">
                                        {t("product.quantity", "Quantity")}:{" "}
                                        {v.quantity == null
                                            ? t("product.stockUnspecified", "—")
                                            : v.quantity}
                                    </span>
                                    {v.sku?.trim() ? (
                                        <span dir="ltr" className="text-xs text-custom-secondary">
                                            {t("product.sku", "SKU")}: {v.sku}
                                        </span>
                                    ) : null}
                                    {outOfStock && (
                                        <span className="text-xs font-medium text-red-600">
                                            {v.id == null || v.shop_id == null
                                                ? t(
                                                      "product.unavailable",
                                                      "Currently unavailable",
                                                  )
                                                : t("product.outOfStock", "Out of stock")}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selectable && isSelected && (
                                <span className="shrink-0 self-center text-primary">
                                    <svg
                                        className="h-6 w-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        aria-hidden
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </>
                    );

                    return (
                        <li key={v.id ?? `variant-${index}`}>
                            {selectable ? (
                                <button
                                    type="button"
                                    disabled={outOfStock}
                                    onClick={() =>
                                        purchasable &&
                                        v.id != null &&
                                        onSelect?.(v.id)
                                    }
                                    className={rowClass}
                                >
                                    {inner}
                                </button>
                            ) : (
                                <div className={rowClass}>{inner}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

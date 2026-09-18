import { Link } from "react-router-dom";
import { HiMinus, HiPlus, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/shared/lib/utils";
import { toNum } from "../utils";
import type { CartItem } from "../types";

type CartItemCardProps = {
    item: CartItem;
    previewPrices?: Map<number, { price: number; priceBeforeDiscount?: number }>;
    previewPrice?: { price: number; priceBeforeDiscount?: number };
    previewSubtotal?: string | null;
    extrasTotal?: string | null;
    note?: string | null;
    image?: string | null;
    displayName?: string;
    displayVariant?: string[];
    displayStore?: string;
    productHref?: string;
    freeQuantity?: number;
    isExcludedFromCoupon?: boolean;
    canEditQuantity?: boolean;
    onQuantityChange: (itemId: number | string, quantity: number) => void;
    onRemove: (itemId: number | string) => void;
};

export default function CartItemCard({
    item,
    previewPrices,
    previewPrice,
    previewSubtotal,
    extrasTotal,
    note,
    image,
    displayName,
    displayVariant,
    displayStore,
    productHref,
    freeQuantity = 0,
    isExcludedFromCoupon = false,
    canEditQuantity = true,
    onQuantityChange,
    onRemove,
}: CartItemCardProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { formatPrice } = useCurrency();

    const preview =
        previewPrice ??
        (item.shop_product_variant_id != null
            ? previewPrices?.get(item.shop_product_variant_id)
            : undefined);
    const displayPrice = preview ? formatPrice(preview.price) : item.price;
    const displayOriginalPrice =
        preview?.priceBeforeDiscount != null &&
        preview.priceBeforeDiscount > (preview.price ?? 0)
            ? formatPrice(preview.priceBeforeDiscount)
            : item.originalPrice;
    const priceNum = preview?.price ?? (item.priceNumeric ?? toNum(item.price));
    const priceBeforeNum = preview?.priceBeforeDiscount;
    const originalSubtotal =
        priceBeforeNum != null ? priceBeforeNum * item.quantity : undefined;
    const savedAmount =
        originalSubtotal != null
            ? originalSubtotal - priceNum * item.quantity
            : 0;
    const variantText = displayVariant?.length
        ? displayVariant.join(" · ")
        : item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0
            ? Object.values(item.selectedAttributes).join(" · ")
            : undefined;
    const storeName = displayStore ?? item.store;
    const imageSrc = image || item.image;
    const title = displayName ?? item.name;
    const lineNote = note ?? item.note;

    const handleDecrease = () => {
        onQuantityChange(item.id, Math.max(1, item.quantity - 1));
    };

    const handleIncrease = () => {
        onQuantityChange(item.id, item.quantity + 1);
    };

    const titleClassName = cn(
        "block text-[15px] font-semibold leading-snug text-custom-primary",
        productHref && "hover:text-[color:var(--color-main)] transition-colors",
    );

    return (
        <article
            className="px-4 py-4 sm:px-5 sm:py-5"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="flex gap-3 sm:gap-4">
                <div className="h-[72px] w-[72px] sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-custom-muted ring-1 ring-[color:color-mix(in_srgb,var(--color-border-primary)_80%,transparent)]">
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-custom-tertiary text-[11px]">
                                {t("cart.noImage", "No image")}
                            </span>
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            {productHref ? (
                                <Link to={productHref} className={titleClassName}>
                                    {title}
                                </Link>
                            ) : (
                                <h3 className={titleClassName}>{title}</h3>
                            )}
                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-custom-secondary">
                                {storeName && <span>{storeName}</span>}
                                {storeName && variantText && (
                                    <span aria-hidden className="text-custom-tertiary">
                                        ·
                                    </span>
                                )}
                                {variantText && <span>{variantText}</span>}
                            </div>
                        </div>

                        {canEditQuantity && (
                            <button
                                type="button"
                                onClick={() => onRemove(item.id)}
                                className="shrink-0 rounded-lg p-1.5 text-custom-tertiary transition-colors hover:bg-[color:color-mix(in_srgb,var(--color-error)_10%,transparent)] hover:text-[color:var(--color-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-error)_35%,transparent)]"
                                aria-label={t("cart.removeItem")}
                            >
                                <HiTrash className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        {freeQuantity > 0 && (
                            <span className="rounded-md bg-[color:color-mix(in_srgb,var(--color-success)_12%,var(--color-bg-card))] px-2 py-0.5 text-[11px] font-medium text-[var(--color-success)]">
                                {t("cart.free")} × {freeQuantity}
                            </span>
                        )}
                        {isExcludedFromCoupon && (
                            <span className="rounded-md bg-[color:color-mix(in_srgb,var(--color-warning)_14%,var(--color-bg-card))] px-2 py-0.5 text-[11px] font-medium text-[var(--color-warning-dark)]">
                                {t("cart.excludedFromCoupon")}
                            </span>
                        )}
                    </div>

                    {lineNote && (
                        <p className="mt-2 text-xs text-custom-secondary">
                            {t("cart.note", "Note")}: {lineNote}
                        </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                        <div
                            className="inline-flex items-center rounded-lg border border-custom-primary bg-custom-card"
                            role="group"
                            aria-label={t("cart.quantity")}
                        >
                            <button
                                type="button"
                                onClick={canEditQuantity ? handleDecrease : undefined}
                                disabled={!canEditQuantity || item.quantity <= 1}
                                className="flex h-9 w-9 items-center justify-center text-custom-secondary transition-colors hover:bg-custom-hover disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={t("cart.decreaseQuantity")}
                            >
                                <HiMinus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-custom-primary">
                                {item.quantity}
                            </span>
                            <button
                                type="button"
                                onClick={canEditQuantity ? handleIncrease : undefined}
                                disabled={!canEditQuantity}
                                className="flex h-9 w-9 items-center justify-center text-custom-secondary transition-colors hover:bg-custom-hover disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={t("cart.increaseQuantity")}
                            >
                                <HiPlus className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="text-end">
                            <div className="flex items-baseline justify-end gap-2">
                                {displayOriginalPrice && (
                                    <span className="text-xs text-custom-tertiary line-through tabular-nums">
                                        {displayOriginalPrice}
                                    </span>
                                )}
                                <span className="text-base font-bold tabular-nums text-custom-primary">
                                    {displayPrice}
                                </span>
                            </div>
                            <p className="mt-0.5 text-[11px] text-custom-secondary">
                                {t("cart.each", "each")}
                            </p>
                            {previewSubtotal != null && previewSubtotal !== "" && (
                                <p className="mt-1 text-sm font-semibold tabular-nums text-custom-primary">
                                    {previewSubtotal}
                                </p>
                            )}
                            {extrasTotal && (
                                <p className="text-[11px] text-custom-secondary">
                                    {t("cart.extras", "Extras")}: {extrasTotal}
                                </p>
                            )}
                            {savedAmount > 0 && (
                                <p className="mt-0.5 text-[11px] font-medium text-[var(--color-success)]">
                                    {t("cart.youSave", "You save")}{" "}
                                    {formatPrice(savedAmount)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

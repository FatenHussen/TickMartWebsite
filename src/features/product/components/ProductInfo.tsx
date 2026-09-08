import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import FormattedPrice from "@/shared/component/FormattedPrice";

export type ProductInfoBadge = {
    label: string;
    className?: string;
    type?: "image" | "text" | string;
    image?: string;
};

export type ProductInfoProps = {
    category?: string;
    brand?: string;
    name: string;
    sku?: string;
    barcode?: string;
    origin?: string;
    price: string;
    originalPrice?: string;
    savings?: string;
    sold?: number;
    rating?: number;
    badges?: ProductInfoBadge[];
    topRightSlot?: ReactNode;
    className?: string;
};

export default function ProductInfo({
    category,
    brand,
    name,
    sku,
    barcode,
    origin,
    price,
    originalPrice,
    savings,
    sold,
    rating,
    badges = [],
    topRightSlot,
    className,
}: ProductInfoProps) {
    const { t } = useTranslation();
    return (
        <div className={cn("flex flex-col gap-4", className)}>
            {/* Top badges row */}
            {badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {badges.map((badge, idx) => (
                        <Badge
                            key={idx}
                            label={badge.label}
                            type={badge.type}
                            imageSrc={badge.image}
                            imageAlt={badge.label}
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                badge.className,
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Category / Brand row with optional top-right slot (e.g. ShopSelector) */}
            {(category || brand || topRightSlot) && (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 text-sm text-gray">
                        {category && <span>{category}</span>}
                        {brand && <span>{brand}</span>}
                    </div>
                    {topRightSlot && <div className="shrink-0">{topRightSlot}</div>}
                </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl font-bold tracking-tight text-text-primary lg:text-[2.1rem]">
                {name}
            </h1>

            {/* SKU, barcode & origin — from the selected shop variant */}
            {(sku || barcode || origin) && (
                <div className="flex flex-col gap-1.5 text-sm">
                    {sku && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray">{t("product.sku", "SKU")}:</span>
                            <span dir="ltr" className="font-semibold text-primary-light underline underline-offset-2 decoration-1">
                                {sku}
                            </span>
                        </div>
                    )}
                    {barcode && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray">{t("product.barcode", "Barcode")}:</span>
                            <span dir="ltr" className="font-semibold text-primary-light">
                                {barcode}
                            </span>
                        </div>
                    )}
                    {origin && (
                        <div className="flex items-center gap-1">
                            <span className="text-gray">{t("product.origin", "Origin")}:</span>
                            <span className="font-semibold text-primary-light">{origin}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Pricing — each currency paired: sale + original */}
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                <div className="flex flex-col gap-2">
                    <FormattedPrice
                        value={price}
                        compareValue={originalPrice}
                        prominent
                        layout="stack"
                        className="text-[2rem] font-bold leading-none text-text-primary"
                    />
                    {savings && (
                        <span className="text-sm font-medium text-[color-mix(in_srgb,var(--color-main)_72%,#44403c)]">
                            {savings}
                        </span>
                    )}
                </div>

                {/* Sold + Rating */}
                {(sold !== undefined || rating !== undefined) && (
                    <div className="flex items-center gap-3 text-base">
                        {sold !== undefined && (
                            <span className="text-gray">{sold.toLocaleString()} {t("product.sold", "Sold")}</span>
                        )}
                        {sold !== undefined && rating !== undefined && (
                            <span className="text-[#D7A800] dark:text-[color-mix(in_srgb,#D7A800_72%,var(--color-text))]">|</span>
                        )}
                        {rating !== undefined && <Rating rating={rating} size="md" />}
                    </div>
                )}
            </div>

            {/* Discount / offer badges below price */}
            {badges.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {badges.map((badge, idx) => (
                        <Badge
                            key={idx}
                            label={badge.label}
                            type={badge.type}
                            imageSrc={badge.image}
                            imageAlt={badge.label}
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                badge.className,
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Dashed separator */}
            <hr className="border-dashed border-custom-primary" />
        </div>
    );
}

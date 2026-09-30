import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import PriceBlock from "@/shared/component/PriceBlock";

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
    reviewCount?: number;
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
    reviewCount,
    badges = [],
    topRightSlot,
    className,
}: ProductInfoProps) {
    const { t } = useTranslation();
    const metaItems = [
        sku ? { label: t("product.sku", "SKU"), value: sku, ltr: true } : null,
        barcode
            ? { label: t("product.barcode", "Barcode"), value: barcode, ltr: true }
            : null,
        origin
            ? { label: t("product.origin", "Origin"), value: origin, ltr: false }
            : null,
    ].filter(Boolean) as Array<{ label: string; value: string; ltr: boolean }>;

    return (
        <div className={cn("flex flex-col gap-3.5", className)}>
            {(category || brand || topRightSlot) && (
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-custom-secondary">
                        {category && (
                            <span className="font-medium text-primary dark:text-[color-mix(in_srgb,var(--color-main)_78%,#fff)]">
                                {category}
                            </span>
                        )}
                        {category && brand && (
                            <span className="text-custom-tertiary" aria-hidden>
                                /
                            </span>
                        )}
                        {brand && <span>{brand}</span>}
                    </div>
                    {topRightSlot && <div className="shrink-0">{topRightSlot}</div>}
                </div>
            )}

            <h1 className="text-[1.65rem] font-semibold leading-snug tracking-tight text-text-primary sm:text-[1.85rem] lg:text-[2rem]">
                {name}
            </h1>

            {(sold !== undefined || rating !== undefined) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {rating !== undefined && (
                        <div className="flex items-center gap-2">
                            <Rating rating={rating} size="sm" />
                            {reviewCount !== undefined && reviewCount > 0 && (
                                <span className="text-custom-secondary">
                                    ({reviewCount.toLocaleString()}{" "}
                                    {t(
                                        reviewCount === 1
                                            ? "product.review"
                                            : "product.reviews",
                                    )}
                                    )
                                </span>
                            )}
                        </div>
                    )}
                    {sold !== undefined && rating !== undefined && (
                        <span className="hidden h-3 w-px bg-border-secondary sm:block dark:bg-white/15" />
                    )}
                    {sold !== undefined && (
                        <span className="text-custom-secondary">
                            {t("product.soldCount", {
                                count: sold,
                                defaultValue: "{{count}} sold",
                            })}
                        </span>
                    )}
                </div>
            )}

            {metaItems.length > 0 && (
                <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-custom-secondary">
                    {metaItems.map((item, index) => (
                        <div
                            key={item.label}
                            className="inline-flex min-w-0 max-w-full items-baseline gap-1.5"
                        >
                            <dt className="shrink-0">{item.label}</dt>
                            <dd
                                dir={item.ltr ? "ltr" : undefined}
                                className="truncate font-medium text-text-primary/85"
                            >
                                {item.value}
                            </dd>
                            {index < metaItems.length - 1 ? (
                                <span className="ms-0.5 text-custom-tertiary" aria-hidden>
                                    ·
                                </span>
                            ) : null}
                        </div>
                    ))}
                </dl>
            )}

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
                                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                                badge.className,
                            )}
                        />
                    ))}
                </div>
            )}

            <PriceBlock
                price={price}
                originalPrice={originalPrice}
                savings={savings}
                size="2xl"
                className="w-fit"
            />
        </div>
    );
}

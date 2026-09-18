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
        <div className={cn("flex flex-col gap-4", className)}>
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

            {metaItems.length > 0 && (
                <dl className="flex flex-col gap-1 text-sm">
                    {metaItems.map((item) => (
                        <div key={item.label} className="flex min-w-0 items-baseline gap-2">
                            <dt className="shrink-0 text-custom-secondary">{item.label}</dt>
                            <dd
                                dir={item.ltr ? "ltr" : undefined}
                                className="truncate font-medium text-text-primary"
                            >
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
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

            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-api-second)_18%,var(--color-border-primary))] bg-[color-mix(in_srgb,var(--color-api-second)_5%,var(--color-bg-card))] px-4 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <FormattedPrice
                    value={price}
                    compareValue={originalPrice}
                    prominent
                    layout="stack"
                    className="text-[1.85rem] font-semibold leading-none text-text-primary sm:text-[2rem]"
                    compareClassName="text-[1.2rem] font-semibold text-red-600 decoration-2 decoration-red-600/80 dark:text-red-400 dark:decoration-red-400/80 sm:text-[1.35rem]"
                />
                {savings && (
                    <p className="mt-2 text-sm font-medium text-[color-mix(in_srgb,var(--color-trust)_88%,#0f766e)] dark:text-[color-mix(in_srgb,#34d399_70%,#e4e4e7)]">
                        {savings}
                    </p>
                )}
            </div>
        </div>
    );
}

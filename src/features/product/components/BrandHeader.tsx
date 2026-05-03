import { useTranslation } from "react-i18next";
import { HiStar, HiShoppingBag, HiCube } from "react-icons/hi";
import type { BrandDetails } from "../types/brand";

type BrandHeaderProps = {
    brand: BrandDetails;
    onViewDetails?: () => void;
};

export default function BrandHeader({ brand }: BrandHeaderProps) {
    const { t } = useTranslation();
    return (
        <div className="bg-blue-off/50 rounded-2xl border border-custom-secondary shadow-sm p-6 dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)]">
            <div className="flex items-start justify-between gap-6">
                {/* Left: Logo and Brand Info */}
                <div className="flex items-start gap-4 flex-1">
                    {/* Brand Logo */}
                    <div className="w-16 h-16 rounded-lg bg-custom-primary border border-custom-secondary flex items-center justify-center shrink-0">
                        <img
                            src={brand.image}
                            alt={brand.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Brand Details */}
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-custom-primary mb-1">
                            {brand.name}
                        </h1>
                        {brand.description && (
                            <p className="text-sm text-custom-secondary mb-4">
                                {brand.description}
                            </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-6 flex-wrap">
                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <HiStar className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm font-semibold text-custom-primary">
                                    {brand.rating}
                                </span>
                            </div>

                            {/* Store Count */}
                            <div className="flex items-center gap-2">
                                <HiShoppingBag className="w-5 h-5 text-custom-secondary" />
                                <span className="text-sm text-custom-secondary">
                                    {brand.shops_count}{""}
                                    {brand.shops_count === 1 ? t("brands.store") : t("brands.stores")}
                                </span>
                            </div>

                            {/* Product Count */}
                            <div className="flex items-center gap-2">
                                <HiCube className="w-5 h-5 text-custom-secondary" />
                                <span className="text-sm text-custom-secondary">
                                    {brand.products_count.toLocaleString()} {t("brands.products")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

              
            </div>
        </div>
    );
}

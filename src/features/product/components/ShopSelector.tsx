import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { HiChevronDown } from "react-icons/hi";
import type { AvailableShop } from "../types/productDetails";

interface ShopSelectorProps {
    shops: AvailableShop[];
    selectedShopId: number;
    onShopChange: (shopId: number) => void;
    compact?: boolean;
    className?: string;
}

export default function ShopSelector({
    shops,
    selectedShopId,
    onShopChange,
    compact = false,
    className,
}: ShopSelectorProps) {
    const { t } = useTranslation();

    if (compact) {
        return (
            <div className={cn("flex w-full flex-col gap-1.5", className)}>
                <label className="text-sm text-custom-secondary">
                    {t("product.branch", "Branch")}
                </label>
                <div className="relative">
                    <select
                        value={selectedShopId}
                        onChange={(e) => onShopChange(Number(e.target.value))}
                        className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-[color-mix(in_srgb,var(--color-api-second)_28%,var(--color-border-primary))] bg-custom-card ps-3.5 pe-9 text-sm font-medium text-text-primary outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10"
                    >
                        {shops.map((shop) => (
                            <option key={shop.id} value={shop.id}>
                                {shop.name}
                            </option>
                        ))}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-custom-secondary" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <label className="text-sm text-gray">
                {t("product.availableShops", "Available Shops")}
            </label>
            <select
                value={selectedShopId}
                onChange={(e) => onShopChange(Number(e.target.value))}
                className="w-full rounded-lg border border-custom-primary bg-custom-primary px-4 py-2.5 text-sm text-custom-primary outline-none transition-colors focus:border-primary-light focus:ring-1 focus:ring-primary-light"
            >
                {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                        {shop.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

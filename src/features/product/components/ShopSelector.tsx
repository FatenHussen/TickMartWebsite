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
        const selectedShop = shops.find((s) => s.id === selectedShopId);
        return (
            <div className={cn("relative inline-flex items-center", className)}>
                <div className="relative flex items-center">
                    <select
                        value={selectedShopId}
                        onChange={(e) => onShopChange(Number(e.target.value))}
                        className="min-w-[170px] appearance-none rounded-full border border-[#E7EEF3] dark:border-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] bg-[#F8FBFD] dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] py-2 pl-4 pr-9 text-sm font-medium text-[#495666] dark:text-[var(--color-text)] outline-none transition-colors focus:border-[#B8DDEA] dark:focus:border-[color-mix(in_srgb,var(--color-api-second)_45%,transparent)] cursor-pointer"
                    >
                        {shops.map((shop) => (
                            <option key={shop.id} value={shop.id}>
                                {`${t("product.branch", "Branch")}: ${shop.name}`}
                            </option>
                        ))}
                    </select>
                    <HiChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[#7C8A97] dark:text-[color-mix(in_srgb,var(--color-text)_70%,transparent)]" />
                </div>
                {/* Hidden – keeps selectedShop in scope to avoid unused var */}
                {selectedShop && null}
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

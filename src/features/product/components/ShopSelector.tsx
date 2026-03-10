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
        <span className="text-xs text-gray mr-1 whitespace-nowrap">
          {t("product.branch", "Branch:")}
        </span>
        <div className="relative flex items-center">
          <select
            value={selectedShopId}
            onChange={(e) => onShopChange(Number(e.target.value))}
            className="appearance-none rounded-full border border-gray-200 bg-custom-primary pl-3 pr-7 py-1 text-xs font-medium text-custom-primary outline-none transition-colors focus:border-primary-light cursor-pointer"
          >
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </select>
          <HiChevronDown className="pointer-events-none absolute right-2 h-3 w-3 text-gray-500" />
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
        className="w-full rounded-lg border border-gray-200 bg-custom-primary px-4 py-2.5 text-sm text-custom-primary outline-none transition-colors focus:border-primary-light focus:ring-1 focus:ring-primary-light"
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

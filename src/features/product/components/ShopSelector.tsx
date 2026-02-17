import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { AvailableShop } from "../types/productDetails";

interface ShopSelectorProps {
  shops: AvailableShop[];
  selectedShopId: number;
  onShopChange: (shopId: number) => void;
  className?: string;
}

export default function ShopSelector({
  shops,
  selectedShopId,
  onShopChange,
  className,
}: ShopSelectorProps) {
  const { t } = useTranslation();

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

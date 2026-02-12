import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import type { BasketType } from "../types";

type BasketFiltersSidebarProps = {
  selectedType: BasketType;
  onTypeChange: (type: BasketType) => void;
};

const basketTypes: BasketType[] = ["all", "custom", "subscription"];

export default function BasketFiltersSidebar({
  selectedType,
  onTypeChange,
}: BasketFiltersSidebarProps) {
  const { t } = useTranslation();

  const getTypeLabel = (type: BasketType): string => {
    switch (type) {
      case "all":
        return t("baskets.allBaskets");
      case "custom":
        return t("baskets.customBaskets");
      case "subscription":
        return t("baskets.subscriptionBaskets");
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Basket Type Filter */}
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          {t("baskets.basketType")}
        </h3>

        <div className="space-y-2">
          {basketTypes.map((type) => {
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-all text-sm font-medium",
                  isSelected
                    ? "bg-primary-light text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                )}
              >
                {getTypeLabel(type)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional info card (optional) */}
      <div className="bg-blue-50 rounded-xl p-5">
        <p className="text-sm text-gray-600">
          {selectedType === "custom" &&
            t(
              "baskets.customBasketsInfo",
              "Browse all ready-made and custom baskets."
            )}
          {selectedType === "subscription" &&
            t(
              "baskets.subscriptionBasketsInfo",
              "Browse all subscription baskets."
            )}
          {selectedType === "all" &&
            t(
              "baskets.allBasketsInfo",
              "Browse all ready-made and subscription baskets. Use filters to find the perfect one."
            )}
        </p>
      </div>
    </div>
  );
}

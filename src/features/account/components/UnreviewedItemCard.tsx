import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui";
import type { UnreviewedItem } from "../types";

type UnreviewedItemCardProps = {
  item: UnreviewedItem;
  onRateNow?: (id: string | number) => void;
};

export default function UnreviewedItemCard({
  item,
  onRateNow,
}: UnreviewedItemCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {item.productName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("account.myReviews.deliveredOn")} {item.deliveryDate}
          </p>
        </div>

        {/* Rate Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => onRateNow?.(item.id)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
        >
          {t("account.myReviews.rateNow")}
        </Button>
      </div>
    </div>
  );
}

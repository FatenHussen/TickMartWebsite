import { useTranslation } from "react-i18next";
import type { UnreviewedItem } from "../types";

type UnreviewedItemCardProps = {
  item: UnreviewedItem;
  onRateNow?: (id: string | number, orderId?: string) => void;
  /** When true, render as row without card styling (for divided list inside colored section) */
  compact?: boolean;
};

export default function UnreviewedItemCard({
  item,
  onRateNow,
  compact = false,
}: UnreviewedItemCardProps) {
  const { t } = useTranslation();

  const content = (
    <div className="flex items-center gap-4 py-4">
      {/* Product Image - square thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
        <img
          src={item.productImage}
          alt={item.productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {item.productName}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("account.myReviews.deliveredOn")} {item.deliveryDate}
        </p>
      </div>

      {/* Rate Button - blue */}
      <button
        onClick={() => onRateNow?.(item.id, item.orderId)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0"
      >
        {t("account.myReviews.rateNow")}
      </button>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      {content}
    </div>
  );
}

import { useTranslation } from "react-i18next";
import { HiPencil, HiClipboardList } from "react-icons/hi";
import StarRating from "./StarRating";
import type { RecipeReview } from "../types";

type RecipeReviewCardProps = {
  review: RecipeReview;
  onEdit?: (id: string | number) => void;
};

export default function RecipeReviewCard({
  review,
  onEdit,
}: RecipeReviewCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Recipe Icon */}
          <div className="w-16 h-16 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
            <HiClipboardList className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>

          {/* Recipe Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
              {review.recipeName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("account.myReviews.types.recipe")} • {t("account.myReviews.triedOn")} {review.triedDate}
            </p>
          </div>
        </div>

        {/* Category Tag - Top Right */}
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full whitespace-nowrap">
          {t("account.myReviews.types.recipe")}
        </span>
      </div>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-2">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {review.rating.toFixed(1)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <a
          href="#"
          className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          {t("account.myReviews.viewDetails")}
        </a>
        <button
          onClick={() => onEdit?.(review.id)}
          className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          {t("account.myReviews.editRating")}
        </button>
      </div>
    </div>
  );
}

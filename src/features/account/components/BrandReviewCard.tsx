import { useTranslation } from "react-i18next";
import { HiTag } from "react-icons/hi";
import StarRating from "./StarRating";
import type { BrandReview } from "../types";

type BrandReviewCardProps = {
  review: BrandReview;
  onEdit?: (id: string | number) => void;
  compact?: boolean;
};

export default function BrandReviewCard({
  review,
  onEdit,
  compact = false,
}: BrandReviewCardProps) {
  const { t } = useTranslation();

  const content = (
    <>
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 overflow-hidden">
          {review.brandIcon ? (
            <img
              src={review.brandIcon}
              alt={review.brandName}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <HiTag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {review.brandName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("account.myReviews.types.brand")} • {t("account.myReviews.ratedOn")} {review.date}
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full whitespace-nowrap shrink-0">
          {t("account.myReviews.types.brand")}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {review.rating.toFixed(1)}
        </span>
      </div>

      {review.reviewText && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
          {review.reviewText}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <a
          href="#"
          className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          {t("account.myReviews.viewDetails")}
        </a>
        <button
          onClick={() => onEdit?.(review.id)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1"
        >
          {t("account.myReviews.editRating")}
        </button>
      </div>
    </>
  );

  if (compact) {
    return content;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      {content}
    </div>
  );
}

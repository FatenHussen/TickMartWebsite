import { useTranslation } from "react-i18next";
import { HiPencil, HiTrash } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import StarRating from "./StarRating";
import type { ProductReview } from "../types";

type ProductReviewCardProps = {
  review: ProductReview;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
};

export default function ProductReviewCard({
  review,
  onEdit,
  onDelete,
}: ProductReviewCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Product Image */}
          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
            <img
              src={review.productImage}
              alt={review.productName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5 truncate">
              {review.productName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t("account.myReviews.from")}: {review.seller}
            </p>
          </div>
        </div>

        {/* Category Tag - Top Right */}
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium rounded-full whitespace-nowrap">
          {t("account.myReviews.types.product")}
        </span>
      </div>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-2">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {review.rating.toFixed(1)}
        </span>
      </div>

      {/* Review Text */}
      {review.reviewText && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {review.reviewText}
        </p>
      )}

      {/* Images Gallery */}
      {review.images && review.images.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {review.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600"
            >
              <img
                src={image}
                alt={`Review image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {review.images.length > 3 && (
            <div className="w-14 h-14 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300">
              +{review.images.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Date & Order ID */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {t("account.myReviews.reviewedOn")} {review.date} • {t("account.myReviews.order")} #{review.orderId}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onEdit?.(review.id)}
          className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          {t("account.myReviews.editReview")}
        </button>
        <button
          onClick={() => onDelete?.(review.id)}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium"
        >
          {t("account.myReviews.delete")}
        </button>
      </div>
    </div>
  );
}

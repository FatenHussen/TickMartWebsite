import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import type { ProductReview } from "../types";

type ProductReviewCardProps = {
  review: ProductReview;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  compact?: boolean;
};

export default function ProductReviewCard({
  review,
  onEdit,
  onDelete,
  compact = false,
}: ProductReviewCardProps) {
  const { t } = useTranslation();

  const content = (
    <>
      {/* Row 1: image + name + "Product" badge top right */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-700">
          {review.productImage ? (
            <img
              src={review.productImage}
              alt={review.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
              {review.productName?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {review.productName}
          </h3>
          {review.seller && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("account.myReviews.from")}: {review.seller}
            </p>
          )}
        </div>

        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full whitespace-nowrap shrink-0">
          {t("account.myReviews.types.product").replace(" review", "").replace(" تقييم", "")}
        </span>
      </div>

      {/* Row 2: stars + "Product review" badge */}
      <div className="flex items-center gap-2 mt-3">
        <StarRating rating={review.rating} size="sm" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {review.rating.toFixed(1)}
        </span>
        <span className="px-3 py-0.5 bg-cyan-500 text-white text-xs font-medium rounded-full">
          {t("account.myReviews.types.product")}
        </span>
      </div>

      {/* Review Text */}
      {review.reviewText && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
          {review.reviewText}
        </p>
      )}

      {/* Images Gallery */}
      {review.images && review.images.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          {review.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 shrink-0"
            >
              <img
                src={image}
                alt={`Review ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {review.images.length > 3 && (
            <div className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 shrink-0">
              +{review.images.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Row last: date left, actions right */}
      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t("account.myReviews.reviewedOn")} {review.date}
          {review.orderId && (
            <> • {t("account.myReviews.order")} #{review.orderId}</>
          )}
        </p>
        <div className="flex items-center gap-3">
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

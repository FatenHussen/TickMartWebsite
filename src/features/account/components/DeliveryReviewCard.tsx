import { useTranslation } from"react-i18next";
import { HiTruck } from"react-icons/hi";
import StarRating from"./StarRating";
import type { DeliveryReview } from"../types";

type DeliveryReviewCardProps = {
 review: DeliveryReview;
 onEdit?: (id: string | number) => void;
 compact?: boolean;
};

export default function DeliveryReviewCard({
 review,
 onEdit,
 compact = false,
}: DeliveryReviewCardProps) {
 const { t } = useTranslation();

 const content = (
 <>
 <div className="flex items-start gap-4 flex-1 min-w-0">
 {/* Delivery Icon - green */}
 <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
 <HiTruck className="w-6 h-6 text-green-600 dark:text-green-400"/>
 </div>

 {/* Delivery Info */}
 <div className="flex-1 min-w-0">
 <h3 className="text-base font-semibold text-custom-primary">
 {review.orderId
 ? `${t("account.myReviews.deliveryFor")} ${t("account.myReviews.order")} #${review.orderId}`
 : review.targetName
 ? review.targetName
 : t("account.myReviews.types.delivery")}
 </h3>
 <p className="text-sm text-custom-secondary">
 {t("account.myReviews.deliveredOn")} {review.deliveryDate}
 </p>
 </div>

 {/* Badge - green */}
 <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full whitespace-nowrap shrink-0">
 {t("account.myReviews.types.delivery")}
 </span>
 </div>

 {/* Rating */}
 <div className="flex items-center gap-2 mt-3">
 <StarRating rating={review.rating} size="sm"/>
 <span className="text-sm font-bold text-custom-primary">
 {review.rating.toFixed(1)}
 </span>
 </div>

 {/* Review Text */}
 {review.reviewText && (
 <p className="text-sm text-custom-primary mt-3 leading-relaxed">
 {review.reviewText}
 </p>
 )}

 {/* Actions row */}
 <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
 <a
 href="#"
 className="text-sm text-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
 >
 {t("account.myReviews.viewDetails")}
 </a>
 <button
 onClick={() => onEdit?.(review.id)}
 className="text-sm text-custom-secondary hover:text-custom-secondary transition-colors border border-custom-secondary rounded-md px-3 py-1"
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
 <div className="bg-custom-card rounded-xl p-5 border border-custom-primary">
 {content}
 </div>
 );
}

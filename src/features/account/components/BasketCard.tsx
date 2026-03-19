import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import {
 HiShoppingCart,
 HiTrash,
 HiPencil,
 HiCalendar,
 HiPause,
 HiPlay,
} from"react-icons/hi";
import Button from"@/shared/ui/Button";
import type { Basket } from"../types";

type BasketCardProps = {
 basket: Basket;
 onViewDetails?: () => void;
 onEditItems?: () => void;
 onEditSchedule?: () => void;
 onPauseBasket?: () => void;
 onResumeBasket?: () => void;
 onReschedule?: () => void;
 onDelete?: () => void;
};

export default function BasketCard({
 basket,
 onViewDetails,
 onEditItems,
 onEditSchedule,
 onPauseBasket,
 onResumeBasket,
 onReschedule,
 onDelete,
}: BasketCardProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();

 const getCategoryLabel = (category: string) => {
 switch (category) {
 case"scheduled":
 return t("baskets.scheduled");
 case"occasion":
 return t("baskets.occasion");
 case"suggested":
 return t("baskets.suggested");
 default:
 return category;
 }
 };

 const getCategoryColor = (category: string) => {
 switch (category) {
 case"scheduled":
 return"text-custom-secondary";
 case"occasion":
 return"text-orange-600";
 case"suggested":
 return"text-blue-600";
 default:
 return"text-custom-secondary";
 }
 };

 return (
 <div
 className="bg-custom-card rounded-xl border border-custom-primary p-5 shadow-sm hover:shadow-md transition-shadow"
 dir={isRTL ?"rtl":"ltr"}
 >
 {/* Header Row */}
 <div className="flex items-start justify-between mb-4">
 {/* Left: Icon + Name + Badges */}
 <div className="flex items-center gap-3">
 {/* Basket Icon */}
 <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
 <HiShoppingCart className="w-5 h-5 text-amber-600"/>
 </div>
 <div className="flex items-center gap-2 flex-wrap">
 <h3 className="font-semibold text-custom-primary">{basket.name}</h3>
 {/* Status Badge */}
 {basket.status ==="active"&& (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
 {t("baskets.active")}
 </span>
 )}
 {basket.status ==="paused"&& (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-custom-tertiary text-custom-secondary">
 {t("baskets.paused")}
 </span>
 )}
 {basket.status ==="expired"&& (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
 {t("baskets.expired")}
 </span>
 )}
 {/* Discount Badge */}
 {basket.discount && (
 <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
 {basket.discount}
 </span>
 )}
 </div>
 </div>
 {/* Right: Category Tag */}
 <span
 className={`text-sm font-medium ${getCategoryColor(basket.category)}`}
 >
 {getCategoryLabel(basket.category)}
 </span>
 </div>

 {/* Content Row */}
 <div className="flex items-start justify-between gap-4 mb-4">
 {/* Left: Description and Schedule */}
 <div className="space-y-1 text-sm text-custom-secondary">
 <div>
 {basket.itemsCount} {t("baskets.items")} • {basket.description}
 </div>
 <div>{basket.scheduleInfo}</div>
 {basket.nextDelivery && (
 <div className="font-medium text-custom-primary">
 {t("baskets.nextDelivery")}: {basket.nextDelivery}
 </div>
 )}
 {basket.scheduledFor && (
 <div className="font-medium text-custom-primary">
 {t("baskets.scheduledFor")}: {basket.scheduledFor}
 </div>
 )}
 {basket.pausedSince && (
 <div className="text-custom-secondary">
 {t("baskets.pausedSince")}: {basket.pausedSince}
 </div>
 )}
 </div>

 {/* Right: Price and Info */}
 <div className="text-right shrink-0 space-y-1">
 <div className="text-sm text-custom-secondary">
 {t("baskets.items")}: {basket.itemsCount}
 </div>
 <div className="flex items-center gap-2 justify-end">
 {basket.originalPrice && (
 <span className="text-sm text-custom-tertiary line-through">
 {basket.originalPrice}
 </span>
 )}
 <span className="font-bold text-lg text-custom-primary">
 {basket.price}
 </span>
 </div>
 {basket.savings && (
 <div className="text-sm text-green-600 font-medium">
 {basket.savings}
 </div>
 )}
 <div className="text-xs text-custom-secondary">
 {t("baskets.createdOn")}: {basket.createdOn}
 </div>
 </div>
 </div>

 {/* Actions Row */}
 <div className="flex items-center justify-between pt-3 border-t border-custom-primary">
 <div className="flex items-center gap-2 flex-wrap">
 {onViewDetails && (
 <Button
 type="button"
 variant="primary"
 size="sm"
 onClick={onViewDetails}
 className="bg-primary hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
 >
 {t("baskets.viewBasketDetails")}
 </Button>
 )}
 {onEditItems && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onEditItems}
 className="border-custom-secondary text-custom-primary hover:bg-custom-light px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
 >
 <HiPencil className="w-4 h-4"/>
 {t("baskets.editItems")}
 </Button>
 )}
 {basket.status ==="active"&&
 basket.scheduleType ==="recurring"&&
 onEditSchedule && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onEditSchedule}
 className="border-custom-secondary text-custom-primary hover:bg-custom-light px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
 >
 <HiCalendar className="w-4 h-4"/>
 {t("baskets.editSchedule")}
 </Button>
 )}
 {basket.status ==="active"&&
 basket.scheduleType ==="one_time"&&
 onReschedule && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onReschedule}
 className="border-custom-secondary text-custom-primary hover:bg-custom-light px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
 >
 <HiCalendar className="w-4 h-4"/>
 {t("baskets.reschedule")}
 </Button>
 )}
 {basket.status ==="active"&& onPauseBasket && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onPauseBasket}
 className="border-custom-secondary text-custom-primary hover:bg-custom-light px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
 >
 <HiPause className="w-4 h-4"/>
 {t("baskets.pauseBasket")}
 </Button>
 )}
 {basket.status ==="paused"&& onResumeBasket && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onResumeBasket}
 className="border-custom-secondary text-custom-primary hover:bg-custom-light px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5"
 >
 <HiPlay className="w-4 h-4"/>
 {t("baskets.resumeBasket")}
 </Button>
 )}
 </div>

 {/* Delete Button */}
 {onDelete && (
 <button
 type="button"
 onClick={onDelete}
 className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
 >
 <HiTrash className="w-4 h-4"/>
 {t("baskets.deleteBasket")}
 </button>
 )}
 </div>
 </div>
 );
}

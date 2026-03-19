import { useTranslation } from "react-i18next";
import { HiTag } from "react-icons/hi";
import type { AvailablePromotion } from "../types";

interface AvailablePromotionsSelectorProps {
 promotions: AvailablePromotion[];
 selectedPromotionId: number | null;
 onSelect: (id: number | null) => void;
}

export default function AvailablePromotionsSelector({
 promotions,
 selectedPromotionId,
 onSelect,
}: AvailablePromotionsSelectorProps) {
 const { t } = useTranslation();

 if (promotions.length === 0) return null;

 return (
 <div>
 <p className="text-xs font-semibold text-custom-secondary mb-2 uppercase tracking-wide">
 {t("cart.availablePromotions","Available Offers")}
 </p>
 <div className="space-y-2">
 {promotions.map((promo) => {
 const isSelected = selectedPromotionId === promo.id;
 return (
 <button
 key={promo.id}
 type="button"
 onClick={() => onSelect(isSelected ? null : promo.id)}
 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all text-left ${
 isSelected
 ?"border-primary-light bg-primary-light/15 text-primary"
 :"border-custom-secondary bg-custom-card dark:bg-custom-primary text-custom-primary hover:border-primary-light/60 hover:shadow-sm"
 }`}
 >
<span className="flex items-center gap-2">
 <HiTag className="w-5 h-5 shrink-0 text-primary-light" />
 <span className="font-medium">{promo.name}</span>
</span>
 {promo.discount_value != null && (
 <span className="font-bold text-custom-primary whitespace-nowrap">
 {promo.discount_type ==="percentage"
 ? `-${promo.discount_value}%`
 : `-${promo.discount_value}`}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>
 );
}

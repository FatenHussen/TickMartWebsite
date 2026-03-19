import { useTranslation } from "react-i18next";
import { HiGift, HiTruck } from "react-icons/hi";
import type { BenefitItem } from "../api/activeBenefitsApi";

interface ActiveBenefitsSelectorProps {
 coupons: BenefitItem[];
 freeDeliveries: BenefitItem[];
 selectedCouponKey: string | null;
 selectedDeliveryKey: string | null;
 onSelectCoupon: (key: string | null, value: number | boolean | null) => void;
 onSelectDelivery: (key: string | null, value: number | boolean | null) => void;
}

export default function ActiveBenefitsSelector({
 coupons,
 freeDeliveries,
 selectedCouponKey,
 selectedDeliveryKey,
 onSelectCoupon,
 onSelectDelivery,
}: ActiveBenefitsSelectorProps) {
 const { t } = useTranslation();

 if (coupons.length === 0 && freeDeliveries.length === 0) return null;

 return (
 <div className="space-y-4">
 {coupons.length > 0 && (
 <div>
 <p className="text-xs font-semibold text-custom-secondary mb-2 uppercase tracking-wide">
 {t("cart.availableCoupons","Available Discounts")}
 </p>
 <div className="space-y-2">
 {coupons.map((item) => {
 const isSelected = selectedCouponKey === item.key;
 return (
 <button
 key={item.key}
 type="button"
 onClick={() =>
 isSelected
 ? onSelectCoupon(null, null)
 : onSelectCoupon(item.key, item.value)
 }
 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
 isSelected
 ?"border-primary-light bg-primary-light/15 text-primary"
 :"border-custom-secondary bg-custom-card dark:bg-custom-primary text-custom-primary hover:border-primary-light/60 hover:shadow-sm"
 }`}
 >
<span className="flex items-center gap-2">
 <HiGift className="w-5 h-5 shrink-0 text-primary-light" />
 <span className="font-medium">{item.title}</span>
</span>
 <span className="font-bold text-custom-primary">
 {item.discount_amount != null
 ? `-${item.discount_amount}`
 : item.discount_percentage != null
 ? `-${item.discount_percentage}%`
 :""}
 </span>
 </button>
 );
 })}
 </div>
 </div>
 )}

 {freeDeliveries.length > 0 && (
 <div>
 <p className="text-xs font-semibold text-custom-secondary mb-2 uppercase tracking-wide">
 {t("cart.freeDeliveryOptions","Free Delivery Options")}
 </p>
 <div className="space-y-2">
 {freeDeliveries.map((item) => {
 const isSelected = selectedDeliveryKey === item.key;
 return (
 <button
 key={item.key}
 type="button"
 onClick={() =>
 isSelected
 ? onSelectDelivery(null, null)
 : onSelectDelivery(item.key, item.value)
 }
 className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
 isSelected
 ?"border-primary-light bg-primary-light/15 text-primary"
 :"border-custom-secondary bg-custom-card dark:bg-custom-primary text-custom-primary hover:border-primary-light/60 hover:shadow-sm"
 }`}
 >
<span className="flex items-center gap-2">
 <HiTruck className="w-5 h-5 shrink-0 text-primary-light" />
 <span className="font-medium">{item.title}</span>
</span>
 {item.remaining_count != null && (
 <span className="text-xs font-semibold text-custom-secondary">
 {item.remaining_count} {t("cart.remaining","left")}
 </span>
 )}
 </button>
 );
 })}
 </div>
 </div>
 )}
 </div>
 );
}

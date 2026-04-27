import { useParams, useLocation } from"react-router-dom";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { useBasketDetails } from"../hooks/useBaskets";
import SubscriptionBasketDetails from"./SubscriptionBasketDetails";
import CustomBasketDetails from"./CustomBasketDetails";

export default function BasketDetailsPage() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { id } = useParams<{ id: string }>();
 const location = useLocation();
 const basketId = parseInt(id ||"0", 10);

 // Get next_delivery_date from navigation state
 const stateNextDeliveryDate = (location.state as { next_delivery_date?: string })?.next_delivery_date;

 const {
 data: basket,
 isLoading,
 error,
 } = useBasketDetails(basketId);

 // Loading state
 if (isLoading) {
 return (
 <div
 className="min-h-screen bg-custom-light flex items-center justify-center"
 dir={isRTL ?"rtl":"ltr"}
 >
 <div className="h-12 w-12 rounded-full border-2 border-[color-mix(in_srgb,var(--color-main)_20%,transparent)] border-t-[var(--color-main)] animate-spin" />
 </div>
 );
 }

 // Error state
 if (error || !basket) {
 return (
 <div className="min-h-screen bg-custom-light" dir={isRTL ?"rtl":"ltr"}>
 <div className="page-container flex min-h-[50vh] items-center justify-center py-12">
 <div className="max-w-md w-full text-center rounded-2xl border border-custom-primary/10 bg-custom-card px-8 py-10 shadow-[var(--shadow-card-neutral)]">
 <h2 className="text-2xl font-bold text-custom-primary mb-2">
 {t("baskets.basketNotFound")}
 </h2>
 <p className="text-custom-secondary leading-relaxed">
 {t("baskets.basketNotFoundDescription")}
 </p>
 </div>
 </div>
 </div>
 );
 }

 // Check if this is a subscription basket (has next_delivery_date from state or API)
 const nextDeliveryDate = stateNextDeliveryDate || basket.next_delivery_date;
 const isSubscriptionBasket =
 nextDeliveryDate !== null &&
 nextDeliveryDate !== undefined &&
 nextDeliveryDate !=="";

 // Render appropriate component based on basket type
 if (isSubscriptionBasket) {
 return <SubscriptionBasketDetails basket={basket} />;
 }

 return <CustomBasketDetails basket={basket} />;
}

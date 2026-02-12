import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useBasketDetails } from "../hooks/useBaskets";
import SubscriptionBasketDetails from "./SubscriptionBasketDetails";
import CustomBasketDetails from "./CustomBasketDetails";

export default function BasketDetailsPage() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const basketId = parseInt(id || "0", 10);

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
        className="min-h-screen bg-custom-primary flex items-center justify-center"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  // Error state
  if (error || !basket) {
    return (
      <div
        className="min-h-screen bg-custom-primary flex items-center justify-center p-6"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-custom-primary mb-2">
            {t("baskets.basketNotFound")}
          </h2>
          <p className="text-custom-secondary">
            {t("baskets.basketNotFoundDescription")}
          </p>
        </div>
      </div>
    );
  }

  // Check if this is a subscription basket (has next_delivery_date from state or API)
  const nextDeliveryDate = stateNextDeliveryDate || basket.next_delivery_date;
  const isSubscriptionBasket =
    nextDeliveryDate !== null &&
    nextDeliveryDate !== undefined &&
    nextDeliveryDate !== "";

  // Render appropriate component based on basket type
  if (isSubscriptionBasket) {
    return <SubscriptionBasketDetails basket={basket} />;
  }

  return <CustomBasketDetails basket={basket} />;
}

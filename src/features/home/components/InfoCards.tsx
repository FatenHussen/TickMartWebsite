import { useAuthStore } from "@/store/auth";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveOrder } from "@/features/cart/hooks/useActiveOrder";
import { useActivePoints } from "@/features/account/hooks/usePoints";
import PointsRewardsCard from "./PointsRewardsCard";
import OrderTrackingCard from "./OrderTrackingCard";

export default function InfoCards() {
  const authenticated = useAuthStore((s) => s.authenticated);
  const { isRTL } = useLanguage();
  const { data: activeOrder } = useActiveOrder(authenticated);
  const { data: activePoints } = useActivePoints(authenticated);

  if (!authenticated) {
    return null;
  }

  return (
    <div className="space-y-6 pt-8 pb-2" dir={isRTL ? "rtl" : "ltr"}>
      <PointsRewardsCard
        points={activePoints?.points ?? 0}
        rewardsCount={activePoints?.gifts_count ?? 0}
        subscriptionName={activePoints?.subscription_name ?? null}
      />
      {activeOrder && <OrderTrackingCard order={activeOrder} />}
    </div>
  );
}

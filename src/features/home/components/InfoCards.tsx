import PointsRewardsCard from "./PointsRewardsCard";
import OrderTrackingCard from "./OrderTrackingCard";

export default function InfoCards() {
  return (
    <div className="mt-8 space-y-4">
      <PointsRewardsCard />
      <OrderTrackingCard />
    </div>
  );
}

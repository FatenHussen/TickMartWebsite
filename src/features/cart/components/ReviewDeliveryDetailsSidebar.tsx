import { Link } from"react-router-dom";
import { HiOutlineClock } from"react-icons/hi";
import { FaStar } from"react-icons/fa";
import Button from"@/shared/ui/Button";
import ReviewPointsSummary from"./ReviewPointsSummary";
import type { ReviewOrderSummary } from"../types";

type ReviewDeliveryDetailsSidebarProps = {
 summary: ReviewOrderSummary;
 onConfirmOrder: () => void;
 isLoading?: boolean;
};

export default function ReviewDeliveryDetailsSidebar({
 summary,
 onConfirmOrder,
 isLoading = false,
}: ReviewDeliveryDetailsSidebarProps) {
 return (
 <div
 className="rounded-3xl shadow-md sticky top-4 overflow-hidden bg-gradient-to-b from-secondary/15 to-secondary/35 dark:from-secondary/10 dark:to-secondary/20"
 >
 {/* Header - Yellow pill */}
 <div className="flex justify-center pt-6 pb-2 relative">
 <div
 className="px-4 py-2 rounded-full bg-cover bg-center bg-no-repeat absolute left-1/2 top-0 -translate-x-1/2"
 style={{ backgroundImage:"url('/images/backOrder.png')"}}
 >
 <h2 className="text-custom-primary text-sm font-bold whitespace-nowrap">
 Delivery Details
 </h2>
 </div>
 </div>

 {/* Content */}
 <div className="px-5 pb-4 pt-6">
 {/* Summary rows */}
 <div className="space-y-3 text-sm">
 <SummaryRow label="Num of Items"value={summary.numOfItems} />
 <SummaryRow label="Subtotal"value={summary.subtotal} />
 <SummaryRow label="Discounts"value={summary.discounts} color="cyan"/>
 <SummaryRow label="Coupon discount"value={summary.couponDiscount} />
 {summary.subscriptionDiscount != null && (
 <SummaryRow label="Subscription discount"value={summary.subscriptionDiscount} color="cyan"/>
 )}
 {summary.promotionDiscount != null && (
 <SummaryRow label="Promotion discount"value={summary.promotionDiscount} color="cyan"/>
 )}
 <SummaryRow
 label={`Points redeemed (${summary.pointsRedeemed} pts)`}
 value={`- ${summary.pointsValue}`}
 color="cyan"
 />
 </div>

 {/* Total */}
 <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-custom-secondary">
 <span className="text-base font-bold text-custom-primary">
 Total to pay
 </span>
 <span className="text-2xl font-bold"style={{ color:"#22C55E"}}>
 {summary.total}
 </span>
 </div>

 {/* Estimated Delivery */}
 <div className="flex items-center gap-2 mt-4 text-custom-secondary text-sm">
 <HiOutlineClock className="w-4 h-4"style={{ color:"#2C8090"}} />
 <span>Estimated delivery: {summary.estimatedDelivery}</span>
 </div>

 {/* Points earned */}
 <div className="flex items-center gap-2 mt-2">
 <FaStar className="w-4 h-4"style={{ color:"#FBBF24"}} />
 <span className="text-sm text-custom-secondary">
 You'll earn{""}
 <span className="font-semibold"style={{ color:"#22C55E"}}>
 {summary.pointsEarned} points
 </span>
 </span>
 </div>
 </div>

 {/* Actions */}
 <div className="px-5">
 <Button
 type="button"
 variant="primary"
 size="lg"
 fullWidth
 disabled={isLoading}
 onClick={onConfirmOrder}
 className="text-white rounded-2xl py-4 text-base font-semibold mb-3"
 style={{
 background:"linear-gradient(90deg, #4CDAF6 0%, #2C8090 100%)",
 minHeight:"60px",
 }}
 >
 Confirm Order
 </Button>

 <Link
 to="/cart/checkout"
 className="block text-center text-sm text-custom-secondary hover:text-custom-primary hover:underline py-2"
 >
 Back to checkout
 </Link>
 </div>

 {/* Points Summary */}
 <div className="pt-4">
 <ReviewPointsSummary
 pointsBefore={summary.pointsBefore}
 pointsUsed={summary.pointsRedeemed}
 pointsEarned={summary.pointsEarned}
 pointsNewBalance={summary.pointsNewBalance}
 pointsSavings={summary.pointsSavings}
 />
 </div>
 </div>
 );
}

type SummaryRowProps = {
 label: string;
 value: string | number;
 color?:"green"|"cyan";
};

function SummaryRow({ label, value, color }: SummaryRowProps) {
 const colorStyle = color ==="green"
 ? { color:"#22C55E"} 
 : color ==="cyan"
 ? { color:"#4CDAF6"} 
 : undefined;

 return (
 <div className="flex items-center justify-between">
 <span className="text-custom-secondary">{label}</span>
 <span className="font-medium"style={colorStyle}>
 {value}
 </span>
 </div>
 );
}

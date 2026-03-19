import { HiCreditCard } from"react-icons/hi";
import { FaMoneyBillWave, FaMobileAlt } from"react-icons/fa";
import type { PaymentMethodOption } from"../types";

type ReviewPaymentCardProps = {
 paymentMethod: PaymentMethodOption;
 onEdit: () => void;
};

function getPaymentIcon(type?: string) {
 switch (type) {
 case"credit_card":
 return <HiCreditCard className="w-5 h-5 text-white"/>;
 case"cash_on_delivery":
 return <FaMoneyBillWave className="w-5 h-5 text-white"/>;
 case"syriatel_cash":
 case"mtn_cash":
 return <FaMobileAlt className="w-5 h-5 text-white"/>;
 default:
 return <HiCreditCard className="w-5 h-5 text-white"/>;
 }
}

export default function ReviewPaymentCard({
 paymentMethod,
 onEdit,
}: ReviewPaymentCardProps) {
 return (
 <div
 className="rounded-2xl"
 
 >
 <div className="rounded-2xl p-4 bg-custom-secondary dark:bg-custom-tertiary">
 <div className="flex items-center justify-between mb-2">
 <h3 className="text-sm font-semibold text-status-warning">
 Payment Method
 </h3>
 <button
 onClick={onEdit}
 className="text-sm font-medium text-custom-accent"
 >
 Edit
 </button>
 </div>
 <div className="flex items-center gap-3">
 <div
 className="w-10 h-7 rounded flex items-center justify-center"
 style={{
 background:"linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
 }}
 >
 {getPaymentIcon(paymentMethod?.type)}
 </div>
 <div className="text-sm text-custom-secondary">
 <p className="font-medium text-custom-primary">
 {paymentMethod?.name ||"Payment Method"}
 </p>
 <p className="text-xs text-custom-tertiary">
 {paymentMethod?.description ||"Select a payment method"}
 </p>
 </div>
 </div>
 </div>
 </div>
 );
}

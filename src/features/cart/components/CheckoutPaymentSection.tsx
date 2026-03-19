import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import type { PaymentMethodOption } from"../types";

type CheckoutPaymentSectionProps = {
 paymentMethods: PaymentMethodOption[];
 selectedPaymentMethodId: string;
 onPaymentMethodSelect: (methodId: string) => void;
};

export default function CheckoutPaymentSection({
 paymentMethods,
 selectedPaymentMethodId,
 onPaymentMethodSelect,
}: CheckoutPaymentSectionProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();

 const defaultMethodId =
 selectedPaymentMethodId || paymentMethods[0]?.id ||"";

 return (
 <div className="mb-6"dir={isRTL ?"rtl":"ltr"}>
 {/* Header */}
 <h2 className="text-lg font-bold mb-4 text-custom-primary">
 {t("checkout.paymentMethod","Payment Method")}
 </h2>

 {/* Payment Method Cards - Horizontal */}
 <div className="flex flex-wrap gap-4">
 {paymentMethods.map((method) => {
 const isSelected =
 method.id === (selectedPaymentMethodId || defaultMethodId);

 return (
 <button
 key={method.id}
 type="button"
 onClick={() => onPaymentMethodSelect(method.id)}
 className={cn(
"flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center flex-1 min-w-[140px] max-w-[220px]",
 isSelected
 ?"border-primary-light bg-cart-items"
 :"border-custom-primary bg-custom-card hover:border-custom-secondary"
 )}
 >
 {/* Radio circle at top */}
 <div
 className={cn(
"w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
 isSelected
 ?"border-primary-light bg-primary-light"
 :"border-custom-secondary bg-custom-card"
 )}
 >
 {isSelected && (
 <div className="w-2 h-2 rounded-full bg-custom-card"/>
 )}
 </div>

 {/* Icon */}
 <div className="w-16 h-12 flex items-center justify-center flex-shrink-0">
 {method.icon ? (
 <img
 src={method.icon}
 alt=""
 className="max-w-full max-h-full object-contain"
 />
 ) : (
 <div className="w-10 h-10 rounded-full bg-custom-muted"/>
 )}
 </div>

 {/* Name + Description */}
 <div className="min-w-0 w-full">
 <p className="font-semibold text-sm text-custom-primary leading-tight">
 {method.name}
 </p>
 {method.description && (
 <p className="text-xs text-custom-secondary mt-1 line-clamp-2">
 {method.description}
 </p>
 )}
 </div>
 </button>
 );
 })}
 </div>
 </div>
 );
}

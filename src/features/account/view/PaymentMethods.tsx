import { useEffect, useState } from"react";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import { usePaymentMethods } from"@/features/cart/hooks/usePaymentMethods";
import { useCheckoutStore } from"@/store/checkout";

import backimage from"/images/accounts/PaymentMethods.png";

const PAYMENT_STORAGE_KEY ="tikmool_payment_method_id";

export default function PaymentMethods() {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const { methods, isLoading } = usePaymentMethods();
 const { paymentMethodId: storedPaymentId, setPaymentMethodId } =
 useCheckoutStore();

 const [selectedId, setSelectedId] = useState<string>(
 () =>
 storedPaymentId ||
 localStorage.getItem(PAYMENT_STORAGE_KEY) ||
""
 );

 // Once methods are loaded, ensure a valid selection exists
 useEffect(() => {
 if (methods.length === 0) return;
 const saved = localStorage.getItem(PAYMENT_STORAGE_KEY);
 const validSaved = saved && methods.find((m) => m.id === saved);
 if (!validSaved) {
 const first = methods[0].id;
 setSelectedId(first);
 setPaymentMethodId(first);
 localStorage.setItem(PAYMENT_STORAGE_KEY, first);
 }
 }, [methods, setPaymentMethodId]);

 const handleSelect = (methodId: string) => {
 setSelectedId(methodId);
 setPaymentMethodId(methodId);
 localStorage.setItem(PAYMENT_STORAGE_KEY, methodId);
 };

 // The"Default"badge shows on the first method from the API
 const defaultMethodId = methods[0]?.id;

 return (
 <div className="space-y-6"dir={isRTL ?"rtl":"ltr"}>
 {/* Header */}
 <div className="mb-2">
 <h1 className="text-2xl font-bold text-text-primary mb-1">
 {t("account.paymentMethods.title","Payment methods")}
 </h1>
 <p className="text-text-secondary text-sm">
 {t(
"account.paymentMethods.subtitle",
"Choose how you prefer to pay for your orders."
 )}
 </p>
 </div>

 {/* Payment Method List */}
 <div className="space-y-3">
 {isLoading && (
 <div className="flex justify-center py-8">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"/>
 </div>
 )}

 {!isLoading &&
 methods.map((method) => {
 const isSelected = method.id === (selectedId || defaultMethodId);
 const isDefault = method.id === defaultMethodId;

 return (
 <div
 key={method.id}
 className={cn(
"bg-custom-card rounded-2xl p-4 cursor-pointer transition-all border-2",
 isSelected
 ?"border-primary-light bg-blue-50/50 shadow-sm"
 :"border-custom-primary hover:border-primary-light/50"
 )}
 onClick={() => handleSelect(method.id)}
 >
 <div className="flex items-center gap-4">
 {/* Icon */}
 <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-custom-light flex items-center justify-center">
 {method.icon ? (
 <img
 src={method.icon}
 alt={method.name}
 className="w-full h-full object-contain"
 />
 ) : (
 <div className="w-10 h-10 rounded-full bg-custom-muted"/>
 )}
 </div>

 {/* Name + Description */}
 <div className="flex-1 min-w-0">
 <p className="text-base font-semibold text-text-primary leading-tight">
 {method.name}
 </p>
 {method.description && (
 <p className="text-sm text-text-secondary mt-0.5">
 {method.description}
 </p>
 )}
 </div>

 {/* Default Badge */}
 {isDefault && (
 <span className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500 text-white">
 {t("account.addresses.default","Default")}
 </span>
 )}

 {/* Radio Button */}
 <div
 className={cn(
"flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
 isSelected ?"border-primary-light":"border-custom-secondary"
 )}
 >
 {isSelected && (
 <div className="w-3 h-3 rounded-full bg-primary-light"/>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>

 {/* Note */}
 <p className="text-xs text-text-secondary">
 {t(
"account.paymentMethods.note",
"Available payment methods may change depending on your location and order type."
 )}
 </p>

 {/* How Payments Work */}
 <div
 className="bg-custom-card rounded-2xl p-6 relative overflow-hidden"
 >
 {/* Background Image */}
 <div
 className="absolute inset-0 opacity-10 pointer-events-none"
 style={{
 backgroundImage: `url(${backimage})`,
 backgroundSize:"cover",
 backgroundPosition:"bottom right",
 backgroundRepeat:"no-repeat",
 }}
 />

 <div className="relative z-10">
 <h2 className="text-base font-bold text-text-primary mb-4">
 {t("account.paymentMethods.howPaymentsWork","How payments work")}
 </h2>
 <ul className="space-y-3">
 {[
 t(
"account.paymentMethods.howPaymentsWork1",
"Cash on delivery is available for selected stores and areas."
 ),
 t(
"account.paymentMethods.howPaymentsWork2",
"Online payment uses the gateways and wallets configured by the platform."
 ),
 t(
"account.paymentMethods.howPaymentsWork3",
"The final list of options will always appear on the checkout page before you confirm."
 ),
 ].map((text, i) => (
 <li key={i} className="flex items-start gap-3">
 <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-xs font-bold bg-primary-light">
 {i + 1}
 </div>
 <p className="text-sm text-text-secondary">{text}</p>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 );
}

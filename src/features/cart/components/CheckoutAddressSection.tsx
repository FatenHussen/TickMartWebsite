import { useState } from"react";
import { HiCheck, HiPlus } from"react-icons/hi";
import { useTranslation } from"react-i18next";
import { useLanguage } from"@/context/LanguageContext";
import { cn } from"@/shared/lib/utils";
import Button from"@/shared/ui/Button";
import type { DeliveryAddress } from"../types";

import imgDelivery from"/images/DeliveryAddress.png";

type CheckoutAddressSectionProps = {
 addresses: DeliveryAddress[];
 selectedAddressId: number | string;
 onAddressSelect: (addressId: number | string) => void;
 onAddNewAddress?: () => void;
};

export default function CheckoutAddressSection({
 addresses,
 selectedAddressId,
 onAddressSelect,
 onAddNewAddress,
}: CheckoutAddressSectionProps) {
 const { t } = useTranslation();
 const { isRTL } = useLanguage();
 const [showAddressPicker, setShowAddressPicker] = useState(false);
 const selectedAddress = addresses.find(
 (addr) => addr.id === selectedAddressId,
 );

 return (
 <section className="mb-8"dir={isRTL ?"rtl":"ltr"}>
 {/* Header */}
 <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
 <h2 className="text-[20px] font-bold leading-none text-custom-primary md:text-[22px]">
 {t("checkout.deliveryAddress")}
 </h2>
 <div className="flex flex-wrap items-center gap-3">
 {addresses.length > 1 && (
 <button
 type="button"
 onClick={() => setShowAddressPicker((p) => !p)}
 className="inline-flex min-h-[52px] items-center justify-center rounded-2xl border border-[#E7EAF0] bg-white px-6 text-[15px] font-medium text-custom-secondary shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-colors hover:bg-slate-50"
 >
 {t("checkout.changeAddress")}
 </button>
 )}
 {onAddNewAddress && (
 <Button
 type="button"
 variant="outline"
 size="sm"
 onClick={onAddNewAddress}
 className="inline-flex min-h-[56px] rounded-2xl border-2 border-primary-light bg-white px-6 text-[15px] font-medium text-primary-light shadow-none hover:bg-primary-light/5"
 >
 <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-current">
 <HiPlus className="h-4 w-4"/>
 </span>
 {t("checkout.addNewAddress")}
 </Button>
 )}
 </div>
 </div>

 {/* Address picker dropdown - when Change address clicked */}
 {showAddressPicker && addresses.length > 1 && (
 <div className="mb-5 space-y-2 rounded-2xl border border-[#D8EAF0] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
 {addresses.map((addr) => (
 <button
 key={addr.id}
 type="button"
 onClick={() => {
 onAddressSelect(addr.id);
 setShowAddressPicker(false);
 }}
 className={`w-full rounded-xl px-4 py-3 text-left transition-colors ${
 selectedAddressId === addr.id
 ?"border border-primary-light bg-primary-light/10 font-medium text-primary-light"
 :"text-custom-primary hover:bg-blue-off"
 }`}
 >
 <div className="flex items-center justify-between gap-2">
 <span className="font-medium">{addr.fullName}</span>
 {addr.id === selectedAddressId && (
 <HiCheck className="w-5 h-5 text-primary-light shrink-0"/>
 )}
 </div>
 <p className="text-sm text-custom-secondary mt-0.5 truncate">
 {addr.address}
 </p>
 </button>
 ))}
 </div>
 )}

 {/* Selected Address Card */}
 {selectedAddress && (
 <div className="relative overflow-hidden rounded-[20px] border-2 border-primary-light bg-[#EEF8FD] px-5 py-5 shadow-[0_10px_30px_rgba(14,165,233,0.08)] sm:px-6">
 {/* Checkmark - top right (or top left in RTL) */}
 <div
 className={cn(
"absolute top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-primary-light shadow-[0_4px_12px_rgba(14,165,233,0.25)] shrink-0",
 isRTL ?"left-4":"right-4"
 )}
 >
 <HiCheck className="h-5 w-5 text-white"/>
 </div>
 <div className="flex items-center justify-between gap-4">
 <div className="min-w-0 flex-1 pr-12">
 <div className="mb-3 flex flex-wrap items-center gap-2.5">
 <span className="text-[19px] font-semibold leading-none text-custom-primary">
 {selectedAddress.fullName}
 </span>
 {selectedAddress.tags?.map((tag, index) => (
 <span
 key={index}
 className={cn(
 "rounded-full px-3 py-1 text-xs font-medium leading-none",
 index === 0
 ? "bg-primary-light text-white"
 : "bg-transparent text-custom-primary"
 )}
 >
 {tag}
 </span>
 ))}
 </div>
 <div className="mb-3 text-[15px] font-medium text-custom-secondary">
 {selectedAddress.phoneNumber}
 </div>
 <div className="max-w-[620px] text-[15px] leading-7 text-custom-secondary">
 {selectedAddress.address}
 </div>
 </div>
 {/* Right side - Delivery illustration */}
 <div className="pointer-events-none shrink-0 self-end pr-6">
 <div className="flex h-[108px] w-[108px] items-end justify-center sm:h-[118px] sm:w-[118px]">
 <img src={imgDelivery} width={118} height={118} alt=""/>
 </div>
 </div>
 </div>
 </div>
 )}
 </section>
 );
}

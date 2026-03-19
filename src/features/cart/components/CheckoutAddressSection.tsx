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
 <div className="mb-6"dir={isRTL ?"rtl":"ltr"}>
 {/* Header */}
 <div className="flex items-center justify-between mb-4">
 <h2 className="text-lg font-bold text-custom-primary">
 {t("checkout.deliveryAddress")}
 </h2>
 <div className="flex items-center gap-3">
 {addresses.length > 1 && (
 <button
 type="button"
 onClick={() => setShowAddressPicker((p) => !p)}
 className="px-4 py-2 rounded-lg bg-custom-card border border-primary-light text-primary-light text-sm font-medium hover:bg-primary-light/5 transition-colors"
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
 className="px-4 py-2 rounded-lg bg-custom-card border border-primary-light text-primary-light hover:bg-primary-light/5 flex items-center gap-1.5 text-sm font-medium"
 >
 <HiPlus className="w-4 h-4"/>
 {t("checkout.addNewAddress")}
 </Button>
 )}
 </div>
 </div>

 {/* Address picker dropdown - when Change address clicked */}
 {showAddressPicker && addresses.length > 1 && (
 <div className="mb-4 p-4 bg-custom-card rounded-xl border border-custom-primary space-y-2 max-h-48 overflow-y-auto">
 {addresses.map((addr) => (
 <button
 key={addr.id}
 type="button"
 onClick={() => {
 onAddressSelect(addr.id);
 setShowAddressPicker(false);
 }}
 className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
 selectedAddressId === addr.id
 ?"bg-primary-light/10 font-medium text-primary-light border border-primary-light"
 :"hover:bg-blue-off text-custom-primary"
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
 <div className="checkout-address-card relative overflow-visible">
 {/* Checkmark - top right (or top left in RTL) */}
 <div
 className={cn(
"absolute top-4 w-7 h-7 rounded-full flex items-center justify-center bg-primary-light shrink-0",
 isRTL ?"left-4":"right-4"
 )}
 >
 <HiCheck className="w-5 h-5 text-white"/>
 </div>
 <div className="flex items-start justify-between gap-4">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-3">
 <span className="font-bold text-custom-primary text-base">
 {selectedAddress.fullName}
 </span>
 {selectedAddress.tags?.map((tag, index) => (
 <span
 key={index}
 className="text-xs px-2.5 py-0.5 rounded-full bg-primary-light text-white font-medium"
 >
 {tag}
 </span>
 ))}
 </div>
 <div className="text-sm text-custom-secondary mb-2">
 {selectedAddress.phoneNumber}
 </div>
 <div className="text-sm text-custom-secondary">
 {selectedAddress.address}
 </div>
 </div>
 {/* Right side - Delivery illustration */}
 <div className="shrink-0">
 <div className="w-20 h-20 flex items-center justify-center">
 <img src={imgDelivery} width={100} height={100} alt=""/>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}

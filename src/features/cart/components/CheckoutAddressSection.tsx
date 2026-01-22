import { HiCheck, HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import type { DeliveryAddress } from "../types";

import imgDelivery from "/images/DeliveryAddress.png";

type CheckoutAddressSectionProps = {
  addresses: DeliveryAddress[];
  selectedAddressId: number | string;
  onAddressSelect: (addressId: number | string) => void;
  onChangeAddress?: () => void;
  onAddNewAddress?: () => void;
};

export default function CheckoutAddressSection({
  addresses,
  selectedAddressId,
  onChangeAddress,
  onAddNewAddress,
}: CheckoutAddressSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId,
  );

  return (
    <div className="mb-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-custom-primary">
          {t("checkout.deliveryAddress")}
        </h2>
        <div className="flex items-center gap-3">
          {onChangeAddress && (
            <button
              type="button"
              onClick={onChangeAddress}
              className="text-sm text-custom-secondary hover:text-custom-primary transition-colors"
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
              className="bg-primary-light/10 border-primary-light text-primary-light hover:bg-primary-light/20 flex items-center gap-1.5"
            >
              <HiPlus className="w-4 h-4" />
              {t("checkout.addNewAddress")}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Address Card */}
      {selectedAddress && (
        <div className="bg-blue-off rounded-2xl border-2 border-primary-light p-5 relative">
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
            {/* Right side - Checkmark and delivery illustration */}
            <div className="flex items-start gap-3 shrink-0">
              {/* Delivery illustration - person with boxes */}
              <div className="w-20 h-20 flex items-center justify-center">
                <img src={imgDelivery} width={100} height={100} alt="" />
              </div>
              {/* Selection Indicator - Checkmark */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary-light">
                <HiCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

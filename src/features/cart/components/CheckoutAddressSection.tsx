import { HiCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import type { DeliveryAddress } from "../types";

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
  onAddressSelect,
  onChangeAddress,
  onAddNewAddress,
}: CheckoutAddressSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div className="mb-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-custom-primary">{t("checkout.deliveryAddress")}</h2>
        <div className="flex items-center gap-2">
          {onChangeAddress && (
            <button
              type="button"
              onClick={onChangeAddress}
              className="text-sm text-custom-secondary hover:text-custom-primary"
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
              className="border-custom-accent text-custom-accent hover:bg-custom-accent-light"
            >
              {t("checkout.addNewAddress")}
            </Button>
          )}
        </div>
      </div>

      {/* Selected Address Card */}
      {selectedAddress && (
        <div
          className="rounded-lg border-2 p-4 relative"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-primary-light)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-custom-primary">
                  {selectedAddress.fullName}
                </span>
                {selectedAddress.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      tag === "Default"
                        ? "bg-custom-tertiary text-custom-secondary"
                        : ""
                    )}
                    style={
                      tag !== "Default"
                        ? {
                            backgroundColor: "var(--color-accent-primary)",
                            color: "var(--color-text-inverse)",
                          }
                        : undefined
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-custom-secondary mb-1">
                {selectedAddress.phoneNumber}
              </div>
              <div className="text-sm text-custom-secondary">
                {selectedAddress.address}
              </div>
            </div>
            {/* Selection Indicator */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--color-accent-primary)" }}
            >
              <HiCheck className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


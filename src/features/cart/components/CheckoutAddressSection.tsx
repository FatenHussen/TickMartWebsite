import { HiCheck, HiPlus } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import Button from "@/shared/ui/Button";
import type { DeliveryAddress } from "../types";

import imgDelivery from "/images/DeliveryAddress.png";

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

    return (
        <section dir={isRTL ? "rtl" : "ltr"}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[color:var(--color-text)]">
                    {t("checkout.deliveryAddress")}
                </h2>
                {onAddNewAddress && (
                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={onAddNewAddress}
                        className="inline-flex min-h-10 rounded-xl px-4 text-sm font-semibold text-white !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] !border-transparent"
                    >
                        <HiPlus className="h-4 w-4" />
                        {t("checkout.addNewAddress")}
                    </Button>
                )}
            </div>

            {addresses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-custom-primary bg-custom-card px-5 py-8 text-center">
                    <p className="text-sm text-custom-secondary">
                        {t(
                            "checkout.noAddressHint",
                            "Add an address so we know where to deliver this order.",
                        )}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                            <button
                                key={addr.id}
                                type="button"
                                onClick={() => onAddressSelect(addr.id)}
                                className={cn(
                                    "relative w-full overflow-hidden rounded-2xl border-2 px-4 py-4 text-start sm:px-5 sm:py-5",
                                    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_srgb,var(--color-main)_30%,transparent)]",
                                )}
                                style={
                                    isSelected
                                        ? {
                                              borderColor:
                                                  "color-mix(in srgb, var(--color-main) 50%, transparent)",
                                              backgroundColor:
                                                  "color-mix(in srgb, var(--color-main) 7%, var(--color-bg-card))",
                                              boxShadow:
                                                  "0 10px 30px -12px color-mix(in srgb, var(--color-main) 30%, transparent)",
                                          }
                                        : {
                                              borderColor:
                                                  "color-mix(in srgb, var(--color-text) 10%, transparent)",
                                              backgroundColor:
                                                  "var(--color-bg-card)",
                                          }
                                }
                            >
                                {isSelected && (
                                    <div
                                        className={cn(
                                            "absolute top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white sm:top-5 sm:h-9 sm:w-9",
                                            isRTL
                                                ? "left-3 sm:left-4"
                                                : "right-3 sm:right-4",
                                        )}
                                        style={{
                                            backgroundColor:
                                                "var(--color-api-second)",
                                        }}
                                    >
                                        <HiCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1 pe-10 sm:pe-12">
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <span className="text-base font-bold leading-tight text-[color:var(--color-text)] sm:text-lg">
                                                {addr.fullName}
                                            </span>
                                            {addr.isDefault && (
                                                <span
                                                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none text-white"
                                                    style={{
                                                        backgroundColor:
                                                            "var(--color-api-second)",
                                                    }}
                                                >
                                                    {t(
                                                        "checkout.defaultAddress",
                                                        "Default",
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                        {addr.phoneNumber && (
                                            <p className="mb-1 text-sm font-medium text-custom-secondary">
                                                {addr.phoneNumber}
                                            </p>
                                        )}
                                        <p className="max-w-[620px] text-sm leading-relaxed text-custom-secondary">
                                            {addr.address}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <div className="pointer-events-none hidden shrink-0 self-end pe-2 md:block lg:pe-4">
                                            <img
                                                src={imgDelivery}
                                                width={108}
                                                height={108}
                                                alt=""
                                                className="h-[88px] w-[88px] object-contain lg:h-[108px] lg:w-[108px]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

import { useState } from "react";
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
    const [showAddressPicker, setShowAddressPicker] = useState(false);
    const selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId,
    );

    return (
        <section className="mb-8" dir={isRTL ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl sm:text-2xl font-bold leading-none text-[color:var(--color-text)]">
                    {t("checkout.deliveryAddress")}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    {addresses.length > 1 && (
                        <button
                            type="button"
                            onClick={() => setShowAddressPicker((p) => !p)}
                            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-custom-primary bg-custom-card px-5 text-sm font-medium text-custom-secondary shadow-sm transition-colors hover:bg-custom-hover hover:text-[color:var(--color-text)]"
                        >
                            {t("checkout.changeAddress")}
                        </button>
                    )}
                    {onAddNewAddress && (
                        <Button
                            type="button"
                            variant="primary"
                            size="sm"
                            onClick={onAddNewAddress}
                            className="inline-flex min-h-[48px] rounded-xl px-5 text-sm font-semibold text-white !bg-[color:var(--color-api-second)] hover:!bg-[color:var(--color-api-second-hover)] !border-transparent shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current">
                                <HiPlus className="h-3.5 w-3.5" />
                            </span>
                            {t("checkout.addNewAddress")}
                        </Button>
                    )}
                </div>
            </div>

            {/* Address picker dropdown */}
            {showAddressPicker && addresses.length > 1 && (
                <div
                    className="mb-5 space-y-2 rounded-2xl border bg-custom-card p-3 shadow-sm"
                    style={{
                        borderColor:
                            "color-mix(in srgb, var(--color-main) 25%, transparent)",
                    }}
                >
                    {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                            <button
                                key={addr.id}
                                type="button"
                                onClick={() => {
                                    onAddressSelect(addr.id);
                                    setShowAddressPicker(false);
                                }}
                                className={cn(
                                    "w-full rounded-xl px-4 py-3 text-start transition-all border",
                                    isSelected
                                        ? "border-[color:color-mix(in_srgb,var(--color-main)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--color-main)_10%,var(--color-bg-card))] text-[color:var(--color-text)]"
                                        : "border-transparent text-[color:var(--color-text)]/85 hover:bg-custom-hover",
                                )}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="font-semibold">
                                        {addr.fullName}
                                    </span>
                                    {isSelected && (
                                        <HiCheck
                                            className="w-5 h-5 shrink-0"
                                            style={{
                                                color: "var(--color-main)",
                                            }}
                                        />
                                    )}
                                </div>
                                <p className="text-sm text-custom-secondary mt-0.5 truncate">
                                    {addr.address}
                                </p>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Selected Address Card */}
            {selectedAddress && (
                <div
                    className="relative overflow-hidden rounded-2xl border-2 px-4 py-4 sm:px-6 sm:py-5"
                    style={{
                        borderColor:
                            "color-mix(in srgb, var(--color-main) 50%, transparent)",
                        backgroundColor:
                            "color-mix(in srgb, var(--color-main) 7%, var(--color-bg-card))",
                        boxShadow:
                            "0 10px 30px -12px color-mix(in srgb, var(--color-main) 30%, transparent)",
                    }}
                >
                    {/* Checkmark badge */}
                    <div
                        className={cn(
                            "absolute top-4 sm:top-5 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full shrink-0 text-white",
                            isRTL ? "left-3 sm:left-4" : "right-3 sm:right-4",
                        )}
                        style={{
                            backgroundColor: "var(--color-api-second)",
                            boxShadow:
                                "0 4px 12px -2px color-mix(in srgb, var(--color-api-second) 50%, transparent)",
                        }}
                    >
                        <HiCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1 pe-10 sm:pe-12">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="text-base sm:text-lg md:text-xl font-bold leading-tight text-[color:var(--color-text)] break-words">
                                    {selectedAddress.fullName}
                                </span>
                                {selectedAddress.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none"
                                        style={
                                            index === 0
                                                ? {
                                                      backgroundColor:
                                                          "var(--color-api-second)",
                                                      color: "white",
                                                  }
                                                : {
                                                      backgroundColor:
                                                          "color-mix(in srgb, var(--color-main) 12%, var(--color-bg-card))",
                                                      color: "var(--color-text)",
                                                  }
                                        }
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mb-2 text-sm font-medium text-custom-secondary break-words">
                                {selectedAddress.phoneNumber}
                            </div>
                            <div className="max-w-[620px] text-sm leading-relaxed text-custom-secondary break-words">
                                {selectedAddress.address}
                            </div>
                        </div>
                        {/* Delivery illustration — hidden on mobile/tablet, shows from md+ */}
                        <div className="pointer-events-none hidden md:block shrink-0 self-end pe-4 lg:pe-6">
                            <div className="flex h-[100px] w-[100px] items-end justify-center lg:h-[118px] lg:w-[118px]">
                                <img
                                    src={imgDelivery}
                                    width={118}
                                    height={118}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "@/shared/ui/ToggleSwitch";
import type { NewAddressFormData } from "@/features/account/types";

type AddressFormDefaultToggleCardProps = {
    control: Control<NewAddressFormData>;
};

export function AddressFormDefaultToggleCard({ control }: AddressFormDefaultToggleCardProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between rounded-2xl border border-custom-primary bg-custom-light p-4 transition-colors duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.03)] dark:hover:border-[color-mix(in_srgb,var(--color-main)_18%,transparent)] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_6%,rgba(16,17,20,0.5))]">
            <div>
                <p className="text-sm font-medium text-custom-primary">
                    {t("account.addAddress.setAsDefault")}
                </p>
                <p className="mt-0.5 text-xs text-custom-secondary">
                    {t("account.addAddress.setAsDefaultDesc")}
                </p>
            </div>
            <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                    <ToggleSwitch checked={field.value} onChange={field.onChange} />
                )}
            />
        </div>
    );
}

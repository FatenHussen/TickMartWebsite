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
        <div className="flex items-center justify-between rounded-xl border border-custom-primary bg-custom-light p-4">
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

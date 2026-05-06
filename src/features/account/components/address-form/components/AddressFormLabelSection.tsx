import type { Control, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { NewAddressFormData } from "@/features/account/types";
import AddressLabelSelector from "@/features/account/components/AddressLabelSelector";

type AddressFormLabelSectionProps = {
    control: Control<NewAddressFormData>;
    errors: FieldErrors<NewAddressFormData>;
};

export function AddressFormLabelSection({ control, errors }: AddressFormLabelSectionProps) {
    const { t } = useTranslation();

    return (
        <div>
            <div className="mb-3 w-full rounded-2xl border border-transparent bg-[var(--color-api-second)] px-4 py-2.5 shadow-sm dark:border-[rgba(255,255,255,0.06)] dark:bg-[color-mix(in_srgb,var(--color-api-second)_14%,#141418)] dark:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-main)_12%,transparent),0_8px_28px_-16px_rgba(0,0,0,0.55)]">
                <label className="block text-sm font-semibold text-white dark:text-[#FFFFFF]">
                    {t("account.addAddress.addressLabel")}
                    <span className="ml-1 font-bold" aria-hidden>
                        *
                    </span>
                </label>
            </div>
            <AddressLabelSelector
                control={control}
                name="label"
                error={errors.label}
                className="[&_button]:rounded-xl"
            />
        </div>
    );
}

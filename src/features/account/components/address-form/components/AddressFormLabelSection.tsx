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
            <div className="mb-3 w-full rounded-xl bg-[var(--color-api-second)] px-4 py-2.5 shadow-sm">
                <label className="block text-sm font-semibold text-white">
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

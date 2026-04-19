import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { NewAddressFormData } from "@/features/account/types";

type AddressFormContactPhoneFieldProps = {
    register: UseFormRegister<NewAddressFormData>;
    errors: FieldErrors<NewAddressFormData>;
};

export function AddressFormContactPhoneField({ register, errors }: AddressFormContactPhoneFieldProps) {
    const { t } = useTranslation();

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-custom-primary">
                {t("account.addAddress.contactPhone")}
                <span className="ml-1 text-[var(--color-ui-red-500)]">*</span>
            </label>
            <div className="flex overflow-hidden rounded-xl border border-custom-secondary bg-custom-card">
                <div className="shrink-0 bg-custom-tertiary px-4 py-2.5 text-sm font-medium text-custom-secondary">
                    {t("account.addAddress.phonePrefix")}
                </div>
                <input
                    type="tel"
                    placeholder={t("account.addAddress.contactPhonePlaceholder")}
                    className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-custom-primary placeholder:text-custom-tertiary focus:outline-none focus:ring-0"
                    {...register("contactPhone", {
                        required: t("validation.required"),
                        pattern: {
                            value: /^\+?[0-9]{10,15}$/,
                            message: t("validation.phoneInvalid"),
                        },
                    })}
                />
            </div>
            <p className="text-xs text-custom-secondary">{t("account.addAddress.contactPhoneHelper")}</p>
            {errors.contactPhone && (
                <p className="text-sm text-[var(--color-ui-red-600)] dark:text-[var(--color-ui-red-400)]">
                    {errors.contactPhone.message as string}
                </p>
            )}
        </div>
    );
}

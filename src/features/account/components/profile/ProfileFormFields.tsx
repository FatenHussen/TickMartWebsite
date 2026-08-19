import type { UIEvent } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { User, Phone, Mail } from "lucide-react";
import type { SelectOption } from "@/shared/hooks/useInfiniteSelect";
import type { ProfileFormValues } from "../../types/profileForm";

interface ProfileFormFieldsProps {
    register: UseFormRegister<ProfileFormValues>;
    errors: FieldErrors<ProfileFormValues>;
    isEditing: boolean;
    displayPhone: string;
    displayEmail: string;
    governorateOptions: SelectOption[];
    cityOptions: SelectOption[];
    onGovernorateSelectScroll: (event: UIEvent<HTMLElement>) => void;
    onCitySelectScroll: (event: UIEvent<HTMLElement>) => void;
    isFetchingMoreGovernorates: boolean;
    isFetchingMoreCities: boolean;
    selectedGovernorateId: number | null;
}

export function ProfileFormFields({
    register,
    errors,
    isEditing,
    displayPhone,
    displayEmail,
    governorateOptions,
    cityOptions,
    onGovernorateSelectScroll,
    onCitySelectScroll,
    isFetchingMoreGovernorates,
    isFetchingMoreCities,
    selectedGovernorateId,
}: ProfileFormFieldsProps) {
    const { t } = useTranslation();
    const requiredMessage = t("validation.required", "هذا الحقل مطلوب");

    return (
        <>
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-custom-primary">
                        {t("account.profile.fullName")}
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <User className="w-5 h-5 text-primary" />
                        </span>
                        <input
                            {...register("name", { required: requiredMessage })}
                            readOnly={!isEditing}
                            placeholder={t("account.profile.enterFullName")}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-accent-light dark:border-border-accent bg-bg-input text-custom-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent transition-all read-only:cursor-default"
                        />
                    </div>
                    {errors.name && (
                        <p className="text-xs text-[var(--color-ui-red-500)]">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-custom-primary">
                        {t("account.profile.mobileNumber")}
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                            <Phone className="w-5 h-5 text-primary" />
                        </span>
                        <input
                            readOnly
                            value={displayPhone}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-accent-light dark:border-border-accent bg-bg-input text-custom-primary cursor-default focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="relative space-y-2 mb-1">
                <label className="block text-sm font-medium text-custom-primary">
                    {t("account.profile.emailAddress")} ({t("common.optional")})
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Mail className="w-5 h-5 text-primary" />
                    </span>
                    <input
                        readOnly
                        value={displayEmail}
                        placeholder={t("account.profile.noEmail")}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-border-accent-light dark:border-border-accent bg-bg-input text-custom-primary placeholder:text-text-tertiary cursor-default focus:outline-none"
                    />
                </div>
            </div>

            {isEditing && (
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-custom-primary">
                            {t("auth.governorate", "المحافظة")}
                        </label>
                        <select
                            {...register("governorate_id", {
                                required: requiredMessage,
                            })}
                            onScroll={onGovernorateSelectScroll}
                            className="w-full px-4 py-3 rounded-xl border border-border-accent-light dark:border-border-accent bg-bg-input text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent"
                        >
                            <option value="">
                                {t("auth.selectGovernorate", "اختر المحافظة")}
                            </option>
                            {governorateOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                            {isFetchingMoreGovernorates && (
                                <option value="" disabled>
                                    {t("common.loading")}
                                </option>
                            )}
                        </select>
                        {errors.governorate_id && (
                            <p className="text-xs text-[var(--color-ui-red-500)]">
                                {errors.governorate_id.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-custom-primary">
                            {t("auth.city", "المدينة")}
                        </label>
                        <select
                            {...register("city_id", { required: requiredMessage })}
                            disabled={!selectedGovernorateId}
                            onScroll={onCitySelectScroll}
                            className="w-full px-4 py-3 rounded-xl border border-border-accent-light dark:border-border-accent bg-bg-input text-custom-primary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {t("auth.selectCity", "اختر المدينة")}
                            </option>
                            {cityOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                            {isFetchingMoreCities && (
                                <option value="" disabled>
                                    {t("common.loading")}
                                </option>
                            )}
                        </select>
                        {errors.city_id && (
                            <p className="text-xs text-[var(--color-ui-red-500)]">
                                {errors.city_id.message}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

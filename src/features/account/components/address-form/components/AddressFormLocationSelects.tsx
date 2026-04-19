import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Select } from "@/shared/ui";
import type { NewAddressFormData } from "@/features/account/types";
import type { SelectOption } from "@/shared/hooks/useInfiniteSelect";

type AddressFormLocationSelectsProps = {
    register: UseFormRegister<NewAddressFormData>;
    errors: FieldErrors<NewAddressFormData>;
    selectedGovernorateId: string | undefined;
    selectedCityId: string | undefined;
    governorateOptions: SelectOption[];
    cityOptions: SelectOption[];
    areaOptions: SelectOption[];
    isGovernorateListLoading: boolean;
    isCityListLoading: boolean;
    isAreaListLoading: boolean;
    isFetchingMoreGovernorates: boolean;
    isFetchingMoreCities: boolean;
    isFetchingMoreAreas: boolean;
    onGovernorateSelectScroll: (event: React.UIEvent<HTMLElement>) => void;
    onCitySelectScroll: (event: React.UIEvent<HTMLElement>) => void;
    onAreaSelectScroll: (event: React.UIEvent<HTMLElement>) => void;
};

export function AddressFormLocationSelects({
    register,
    errors,
    selectedGovernorateId,
    selectedCityId,
    governorateOptions,
    cityOptions,
    areaOptions,
    isGovernorateListLoading,
    isCityListLoading,
    isAreaListLoading,
    isFetchingMoreGovernorates,
    isFetchingMoreCities,
    isFetchingMoreAreas,
    onGovernorateSelectScroll,
    onCitySelectScroll,
    onAreaSelectScroll,
}: AddressFormLocationSelectsProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Select
                label={t("auth.governorate")}
                required
                placeholder={
                    isGovernorateListLoading ? t("common.loading") : t("auth.selectGovernorate")
                }
                options={governorateOptions}
                isLoadingMore={isFetchingMoreGovernorates}
                onScroll={onGovernorateSelectScroll}
                {...register("governorate", {
                    required: t("validation.required"),
                })}
                error={errors.governorate}
            />
            <Select
                label={t("auth.city")}
                required
                placeholder={isCityListLoading ? t("common.loading") : t("auth.selectCity")}
                options={cityOptions}
                isLoadingMore={isFetchingMoreCities}
                onScroll={onCitySelectScroll}
                disabled={!selectedGovernorateId || isCityListLoading}
                {...register("city", {
                    required: t("validation.required"),
                })}
                error={errors.city}
            />
            <Select
                label={t("account.addAddress.area")}
                required
                placeholder={
                    isAreaListLoading ? t("common.loading") : t("account.addAddress.selectArea")
                }
                options={areaOptions}
                isLoadingMore={isFetchingMoreAreas}
                onScroll={onAreaSelectScroll}
                disabled={!selectedCityId || isAreaListLoading}
                {...register("area", {
                    required: t("validation.required"),
                })}
                error={errors.area}
            />
        </div>
    );
}

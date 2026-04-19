import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputField } from "@/shared/ui";
import type { NewAddressFormData } from "@/features/account/types";

type StreetLandmarkGridProps = {
    register: UseFormRegister<NewAddressFormData>;
    errors: FieldErrors<NewAddressFormData>;
};

export function AddressFormStreetLandmarkGrid({ register, errors }: StreetLandmarkGridProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
                label={t("account.addAddress.streetName")}
                placeholder={t("account.addAddress.streetNamePlaceholder")}
                required
                {...register("streetName", {
                    required: t("validation.required"),
                })}
                error={errors.streetName}
            />
            <InputField
                label={t("account.addAddress.nearestLandmark")}
                placeholder={t("account.addAddress.nearestLandmarkPlaceholder")}
                required
                {...register("nearestLandmark", {
                    required: t("validation.required"),
                })}
                error={errors.nearestLandmark}
            />
        </div>
    );
}

type BuildingFloorGridProps = {
    register: UseFormRegister<NewAddressFormData>;
    errors: FieldErrors<NewAddressFormData>;
};

export function AddressFormBuildingFloorGrid({ register, errors }: BuildingFloorGridProps) {
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
                label={t("account.addAddress.buildingNumber")}
                placeholder={t("account.addAddress.buildingNumberPlaceholder")}
                {...register("buildingNumber")}
                error={errors.buildingNumber}
            />
            <InputField
                label={t("account.addAddress.floorApartment")}
                placeholder={t("account.addAddress.floorApartmentPlaceholder")}
                {...register("floorApartment")}
                error={errors.floorApartment}
            />
        </div>
    );
}

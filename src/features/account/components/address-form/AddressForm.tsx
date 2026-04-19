import { useCallback } from "react";
import { useAddressForm, type UseAddressFormOptions } from "./hooks/useAddressForm";
import { AddressFormCard } from "./components/AddressFormCard";
import { AddressFormHero } from "./components/AddressFormHero";
import { AddressFormLabelSection } from "./components/AddressFormLabelSection";
import { AddressFormLocationSelects } from "./components/AddressFormLocationSelects";
import {
    AddressFormBuildingFloorGrid,
    AddressFormStreetLandmarkGrid,
} from "./components/AddressFormStreetAndBuildingGrids";
import { AddressFormContactPhoneField } from "./components/AddressFormContactPhoneField";
import { AddressFormMapSection } from "./components/AddressFormMapSection";
import { AddressFormDefaultToggleCard } from "./components/AddressFormDefaultToggleCard";
import { AddressFormFooter } from "./components/AddressFormFooter";
import { AddressFormEditLoadingState } from "./components/AddressFormEditLoadingState";

export type AddressFormProps = UseAddressFormOptions;

export default function AddressForm(props: AddressFormProps) {
    const addressForm = useAddressForm(props);
    const { setValue } = addressForm;

    const handleMapLocationChange = useCallback(
        (nextLat: number, nextLng: number) => {
            setValue("lat", nextLat);
            setValue("lng", nextLng);
        },
        [setValue],
    );

    if (addressForm.isEditDataPending) {
        return <AddressFormEditLoadingState />;
    }

    return (
        <AddressFormCard>
            <AddressFormHero
                isEditMode={addressForm.isEditMode}
                title={addressForm.heroTitle}
                subtitle={addressForm.heroSubtitle}
            />

            <form
                onSubmit={addressForm.handleSubmit(addressForm.handleValidSubmit)}
                className="space-y-6 border-t border-custom-primary/60 p-6 sm:p-8"
            >
                <AddressFormLabelSection control={addressForm.control} errors={addressForm.errors} />

                <AddressFormLocationSelects
                    register={addressForm.register}
                    errors={addressForm.errors}
                    selectedGovernorateId={addressForm.selectedGovernorateId}
                    selectedCityId={addressForm.selectedCityId}
                    governorateOptions={addressForm.governorateOptions}
                    cityOptions={addressForm.cityOptions}
                    areaOptions={addressForm.areaOptions}
                    isGovernorateListLoading={addressForm.isGovernorateListLoading}
                    isCityListLoading={addressForm.isCityListLoading}
                    isAreaListLoading={addressForm.isAreaListLoading}
                    isFetchingMoreGovernorates={addressForm.isFetchingMoreGovernorates}
                    isFetchingMoreCities={addressForm.isFetchingMoreCities}
                    isFetchingMoreAreas={addressForm.isFetchingMoreAreas}
                    onGovernorateSelectScroll={addressForm.onGovernorateSelectScroll}
                    onCitySelectScroll={addressForm.onCitySelectScroll}
                    onAreaSelectScroll={addressForm.onAreaSelectScroll}
                />

                <AddressFormStreetLandmarkGrid register={addressForm.register} errors={addressForm.errors} />
                <AddressFormBuildingFloorGrid register={addressForm.register} errors={addressForm.errors} />

                <AddressFormContactPhoneField register={addressForm.register} errors={addressForm.errors} />

                <AddressFormMapSection
                    latitude={addressForm.latitude}
                    longitude={addressForm.longitude}
                    onLocationChange={handleMapLocationChange}
                    onUseCurrentLocation={addressForm.applyCurrentGeolocation}
                />

                <AddressFormDefaultToggleCard control={addressForm.control} />

                <AddressFormFooter
                    isEditMode={addressForm.isEditMode}
                    isSubmitPending={addressForm.isSubmitPending}
                    onCancel={addressForm.handleCancelClick}
                />
            </form>
        </AddressFormCard>
    );
}

import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button, InputField, Select } from "@/shared/ui";
import ToggleSwitch from "@/shared/ui/ToggleSwitch";
import { HiArrowLeft } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import {
  useGovernorates,
  useCities,
  useAreas,
} from "@/features/auth/hooks/useLocation";
import {
  useCreateAddress,
  useUpdateAddress,
  useAddresses,
} from "../hooks/useAddress";
import AddressLabelSelector from "../components/AddressLabelSelector";
import LocationPickerMap from "../components/LocationPickerMap";
import type {
  NewAddressFormData,
  CreateAddressPayload,
  UpdateAddressPayload,
} from "../types";

export default function AddressForm() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const { mutate: createAddress, isPending: isCreating } = useCreateAddress();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { data: addresses = [] } = useAddresses();

  const isPending = isCreating || isUpdating;

  // Find the address to edit if in edit mode
  const addressToEdit = isEditMode
    ? addresses.find((addr) => addr.id === Number(id))
    : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<NewAddressFormData>({
    defaultValues: {
      label: "Home",
      governorate: "",
      city: "",
      area: "",
      streetName: "",
      nearestLandmark: "",
      buildingNumber: "",
      floorApartment: "",
      contactPhone: "",
      lat: 33.5138, // Default to Damascus, Syria
      lng: 36.2765,
      isDefault: false,
    },
  });

  // Populate form when address data is loaded (edit mode only)
  useEffect(() => {
    if (isEditMode && addressToEdit) {
      reset({
        label: addressToEdit.label,
        governorate: String(addressToEdit.area.city.governorate.id),
        city: String(addressToEdit.area.city.id),
        area: String(addressToEdit.area.id),
        streetName: addressToEdit.street_name,
        nearestLandmark: addressToEdit.nearest_landmark,
        buildingNumber: addressToEdit.building_number || "",
        floorApartment: addressToEdit.floor_apartment || "",
        contactPhone: addressToEdit.contact_phone,
        lat: addressToEdit.lat,
        lng: addressToEdit.lng,
        isDefault: addressToEdit.is_default,
      });
    }
  }, [isEditMode, addressToEdit, reset]);

  const selectedGovernorateId = watch("governorate");
  const selectedCityId = watch("city");
  const lat = watch("lat");
  const lng = watch("lng");

  const { data: governorates = [] } = useGovernorates();
  const { data: cities = [], isLoading: isLoadingCities } = useCities(
    selectedGovernorateId &&
      selectedGovernorateId !== "" &&
      selectedGovernorateId !== "0"
      ? Number(selectedGovernorateId)
      : null,
  );
  const { data: areas = [], isLoading: isLoadingAreas } = useAreas(
    selectedCityId && selectedCityId !== "" && selectedCityId !== "0"
      ? Number(selectedCityId)
      : null,
  );

  // Reset city when governorate changes
  useEffect(() => {
    if (selectedGovernorateId) {
      const currentGovernorateId =
        isEditMode && addressToEdit
          ? addressToEdit.area.city.governorate.id
          : null;

      if (currentGovernorateId !== Number(selectedGovernorateId)) {
        setValue("city", "");
        setValue("area", "");
      }
    }
  }, [selectedGovernorateId, setValue, isEditMode, addressToEdit]);

  // Reset area when city changes
  useEffect(() => {
    if (selectedCityId) {
      const currentCityId =
        isEditMode && addressToEdit ? addressToEdit.area.city.id : null;

      if (currentCityId !== Number(selectedCityId)) {
        setValue("area", "");
      }
    }
  }, [selectedCityId, setValue, isEditMode, addressToEdit]);

  const onSubmit = async (data: NewAddressFormData) => {
    if (isEditMode) {
      if (!id) return;

      const payload: UpdateAddressPayload = {
        label: data.label,
        governorate_id: Number(data.governorate),
        city_id: Number(data.city),
        area_id: Number(data.area),
        street_name: data.streetName,
        nearest_landmark: data.nearestLandmark,
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        contact_phone: data.contactPhone,
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
      };

      updateAddress({ id, payload });
    } else {
      const payload: CreateAddressPayload = {
        label: data.label,
        area_id: Number(data.area),
        street_name: data.streetName,
        nearest_landmark: data.nearestLandmark,
        building_number: data.buildingNumber || undefined,
        floor_apartment: data.floorApartment || undefined,
        contact_phone: data.contactPhone,
        lat: data.lat,
        lng: data.lng,
        is_default: data.isDefault,
      };

      createAddress(payload);
    }
  };

  // Show loading if in edit mode and address not loaded yet
  if (isEditMode && !addressToEdit) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className={cn(
            "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            isRTL && "rotate-180",
          )}
        >
          <HiArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEditMode
              ? t("account.editAddress.title")
              : t("account.addAddress.title")}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {isEditMode
              ? t("account.editAddress.subtitle")
              : t("account.addAddress.subtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Address Label Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("account.addAddress.addressLabel")}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <AddressLabelSelector
            control={control}
            name="label"
            error={errors.label}
          />
        </div>

        {/* Location Selection */}
        <div className="space-y-4">
          {/* Governorate */}
          <Select
            label={t("auth.governorate")}
            required
            placeholder={t("auth.selectGovernorate")}
            options={governorates.map((gov) => ({
              value: gov.id,
              label: gov.name,
            }))}
            {...register("governorate", {
              required: t("validation.required"),
            })}
            error={errors.governorate}
          />

          {/* City */}
          <Select
            label={t("auth.city")}
            required
            placeholder={
              isLoadingCities ? t("common.loading") : t("auth.selectCity")
            }
            options={cities.map((city) => ({
              value: city.id,
              label: city.name,
            }))}
            disabled={!selectedGovernorateId || isLoadingCities}
            {...register("city", {
              required: t("validation.required"),
            })}
            error={errors.city}
          />

          {/* Area */}
          <Select
            label={t("account.addAddress.area")}
            required
            placeholder={
              isLoadingAreas
                ? t("common.loading")
                : t("account.addAddress.selectArea")
            }
            options={areas.map((area) => ({
              value: area.id,
              label: area.name,
            }))}
            disabled={!selectedCityId || isLoadingAreas}
            {...register("area", {
              required: t("validation.required"),
            })}
            error={errors.area}
          />
        </div>

        {/* Street Name */}
        <InputField
          label={t("account.addAddress.streetName")}
          placeholder={t("account.addAddress.streetNamePlaceholder")}
          required
          {...register("streetName", {
            required: t("validation.required"),
          })}
          error={errors.streetName}
        />

        {/* Nearest Landmark */}
        <InputField
          label={t("account.addAddress.nearestLandmark")}
          placeholder={t("account.addAddress.nearestLandmarkPlaceholder")}
          required
          {...register("nearestLandmark", {
            required: t("validation.required"),
          })}
          error={errors.nearestLandmark}
        />

        {/* Building Number & Floor/Apartment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Contact Phone */}
        <InputField
          label={t("account.addAddress.contactPhone")}
          placeholder={t("account.addAddress.contactPhonePlaceholder")}
          type="tel"
          required
          {...register("contactPhone", {
            required: t("validation.required"),
            pattern: {
              value: /^\+?[0-9]{10,15}$/,
              message: t("validation.phoneInvalid"),
            },
          })}
          error={errors.contactPhone}
        />

        {/* Location Picker Map */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t("account.addAddress.selectLocation")}
            <span className="ml-1 text-red-500">*</span>
          </label>
          <LocationPickerMap
            lat={lat}
            lng={lng}
            onLocationChange={(newLat, newLng) => {
              setValue("lat", newLat);
              setValue("lng", newLng);
            }}
          />
        </div>

        {/* Set as Default */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <p className="text-sm font-medium text-text-primary">
              {t("account.addAddress.setAsDefault")}
            </p>
            <p className="text-xs text-text-secondary mt-1">
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
            disabled={isPending}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isPending}
            style={{
              background: "#4CDAF6",
              borderRadius: "24px",
            }}
          >
            {isEditMode
              ? t("account.editAddress.updateAddress")
              : t("account.addAddress.saveAddress")}
          </Button>
        </div>
      </form>
    </div>
  );
}

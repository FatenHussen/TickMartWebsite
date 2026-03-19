import { useForm, Controller } from"react-hook-form";
import { useEffect } from"react";
import { useTranslation } from"react-i18next";
import { useNavigate, useParams } from"react-router-dom";
// import { useLanguage } from"@/context/LanguageContext";
import { Button, InputField, Select } from"@/shared/ui";
import ToggleSwitch from"@/shared/ui/ToggleSwitch";
import { HiPlus, HiLocationMarker, HiSearch } from"react-icons/hi";
// import { cn } from"@/shared/lib/utils";
import { _LocationApi } from"@/features/auth/api/location.service";
import { useInfiniteSelect } from"@/shared/hooks/useInfiniteSelect";
import type { Governorate, City, Area } from"@/features/auth/types";
import {
 useCreateAddress,
 useUpdateAddress,
 useAddresses,
} from"../hooks/useAddress";
import AddressLabelSelector from"../components/AddressLabelSelector";
import LocationPickerMap from"../components/LocationPickerMap";
import type {
 NewAddressFormData,
 CreateAddressPayload,
 UpdateAddressPayload,
} from"../types";

function resolveLocalized(value: unknown, lang: string): string {
 if (value == null) return"";
 if (typeof value ==="string") return value;
 if (typeof value ==="object"&& value !== null && ("ar"in value ||"en"in value)) {
 const o = value as { ar?: string; en?: string };
 return (lang.startsWith("ar") ? o.ar ?? o.en : o.en ?? o.ar) ??"";
 }
 return String(value);
}

type AddressFormProps = {
 inline?: boolean;
 onSuccess?: (addressId?: number) => void;
 onCancel?: () => void;
};

export default function AddressForm(props?: AddressFormProps) {
 const { inline, onSuccess, onCancel } = props ?? {};
 const { t, i18n } = useTranslation();
 const lang = i18n.language ||"en";
 // const { isRTL } = useLanguage();
 const navigate = useNavigate();
 const { id } = useParams<{ id?: string }>();
 const isEditMode = !inline && !!id;

 const { mutate: createAddress, isPending: isCreating } = useCreateAddress({
 redirectOnSuccess: !inline,
 });
 const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
 const { data: addresses = [] } = useAddresses();

 const isPending = isCreating || isUpdating;

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
 label:"Home",
 governorate:"",
 city:"",
 area:"",
 streetName:"",
 nearestLandmark:"",
 buildingNumber:"",
 floorApartment:"",
 contactPhone:"",
 lat: 33.5138,
 lng: 36.2765,
 isDefault: false,
 },
 });

 useEffect(() => {
 if (isEditMode && addressToEdit) {
 reset({
 label: addressToEdit.label,
 governorate: String(addressToEdit.area.city.governorate.id),
 city: String(addressToEdit.area.city.id),
 area: String(addressToEdit.area.id),
 streetName: addressToEdit.street_name,
 nearestLandmark: addressToEdit.nearest_landmark,
 buildingNumber: addressToEdit.building_number ||"",
 floorApartment: addressToEdit.floor_apartment ||"",
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

 const govId =
 selectedGovernorateId &&
 selectedGovernorateId !==""&&
 selectedGovernorateId !=="0"
 ? Number(selectedGovernorateId)
 : null;
 const ctyId =
 selectedCityId && selectedCityId !==""&& selectedCityId !=="0"
 ? Number(selectedCityId)
 : null;

 const {
 options: governorateOptions,
 isLoading: isLoadingGovernorates,
 isFetchingNextPage: isFetchingMoreGov,
 handleScroll: handleGovScroll,
 } = useInfiniteSelect<Governorate>({
 queryKey: ["location","governorates","select"],
 fetchFn: async (page) => {
 const res = await _LocationApi.getGovernorates(page);
 return res.data;
 },
 mapToOption: (gov) => ({
 value: gov.id,
 label: resolveLocalized(gov.name, lang),
 }),
 });

 const {
 options: cityOptions,
 isLoading: isLoadingCities,
 isFetchingNextPage: isFetchingMoreCities,
 handleScroll: handleCityScroll,
 } = useInfiniteSelect<City>({
 queryKey: ["location","cities","select", govId],
 fetchFn: async (page) => {
 const res = await _LocationApi.getCities(govId!, page);
 const data = res.data as unknown;
 if (data && typeof data ==="object"&&"items"in (data as Record<string, unknown>)) {
 const d = data as { items: City[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } | null };
 return { items: d.items, pagination: d.pagination ?? null };
 }
 if (Array.isArray(data)) {
 return { items: data as City[], pagination: null };
 }
 return { items: [], pagination: null };
 },
 mapToOption: (city) => ({
 value: city.id,
 label: resolveLocalized(city.name, lang),
 }),
 enabled: !!govId,
 });

 const {
 options: areaOptions,
 isLoading: isLoadingAreas,
 isFetchingNextPage: isFetchingMoreAreas,
 handleScroll: handleAreaScroll,
 } = useInfiniteSelect<Area>({
 queryKey: ["location","areas","select", ctyId],
 fetchFn: async (page) => {
 const res = await _LocationApi.getAreas(ctyId!, page);
 const data = res.data;
 if (Array.isArray(data)) {
 return { items: data, pagination: null };
 }
 if (data && typeof data ==="object"&&"items"in data) {
 return data as { items: Area[]; pagination: { current_page: number; last_page: number; per_page: number; total: number } };
 }
 return { items: [], pagination: null };
 },
 mapToOption: (area) => ({
 value: area.id,
 label: resolveLocalized(area.name, lang),
 }),
 enabled: !!ctyId,
 });

 useEffect(() => {
 if (selectedGovernorateId) {
 const currentGovernorateId =
 isEditMode && addressToEdit
 ? addressToEdit.area.city.governorate.id
 : null;
 if (currentGovernorateId !== Number(selectedGovernorateId)) {
 setValue("city","");
 setValue("area","");
 }
 }
 }, [selectedGovernorateId, setValue, isEditMode, addressToEdit]);

 useEffect(() => {
 if (selectedCityId) {
 const currentCityId =
 isEditMode && addressToEdit ? addressToEdit.area.city.id : null;
 if (currentCityId !== Number(selectedCityId)) {
 setValue("area","");
 }
 }
 }, [selectedCityId, setValue, isEditMode, addressToEdit]);

 const handleUseCurrentLocation = () => {
 if (!navigator.geolocation) return;
 navigator.geolocation.getCurrentPosition(
 (pos) => {
 setValue("lat", pos.coords.latitude);
 setValue("lng", pos.coords.longitude);
 },
 () => {},
 );
 };

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
 createAddress(payload, {
 onSuccess: (res) => {
 if (inline) {
 const newId = res?.data?.id;
 onSuccess?.(newId);
 }
 },
 });
 }
 };

 if (isEditMode && !addressToEdit) {
 return (
 <div className="flex items-center justify-center py-12">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"/>
 </div>
 );
 }

 return (
 <div className="bg-custom-card rounded-2xl shadow-sm p-6 sm:p-8">
 {/* Header */}
 <div className="mb-8">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 {!isEditMode && (
 <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center shrink-0">
 <HiPlus className="w-5 h-5 text-white"/>
 </div>
 )}
 <h1 className="text-2xl font-bold text-custom-primary">
 {isEditMode
 ? t("account.editAddress.title")
 : t("account.addAddress.title")}
 </h1>
 </div>
 <p className="text-sm text-custom-secondary mt-1">
 {isEditMode
 ? t("account.editAddress.subtitle")
 : t("account.addAddress.subtitle")}
 </p>
 </div>
 </div>

 <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 {/* Address Label */}
 <div>
 <label className="block text-sm font-medium text-custom-primary mb-3">
 {t("account.addAddress.addressLabel")}
 <span className="text-red-500 ml-1">*</span>
 </label>
 <AddressLabelSelector
 control={control}
 name="label"
 error={errors.label}
 className="[&_button]:rounded-xl"
 />
 </div>

 {/* Governorate, City, Area */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 <Select
 label={t("auth.governorate")}
 required
 placeholder={
 isLoadingGovernorates
 ? t("common.loading")
 : t("auth.selectGovernorate")
 }
 options={governorateOptions}
 isLoadingMore={isFetchingMoreGov}
 onScroll={handleGovScroll}
 {...register("governorate", {
 required: t("validation.required"),
 })}
 error={errors.governorate}
 />
 <Select
 label={t("auth.city")}
 required
 placeholder={
 isLoadingCities ? t("common.loading") : t("auth.selectCity")
 }
 options={cityOptions}
 isLoadingMore={isFetchingMoreCities}
 onScroll={handleCityScroll}
 disabled={!selectedGovernorateId || isLoadingCities}
 {...register("city", {
 required: t("validation.required"),
 })}
 error={errors.city}
 />
 <Select
 label={t("account.addAddress.area")}
 required
 placeholder={
 isLoadingAreas
 ? t("common.loading")
 : t("account.addAddress.selectArea")
 }
 options={areaOptions}
 isLoadingMore={isFetchingMoreAreas}
 onScroll={handleAreaScroll}
 disabled={!selectedCityId || isLoadingAreas}
 {...register("area", {
 required: t("validation.required"),
 })}
 error={errors.area}
 />
 </div>

 {/* Street Name & Nearest Landmark */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

 {/* Building & Floor */}
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

 {/* Contact Phone with prefix */}
 <div className="space-y-2">
 <label className="block text-sm font-medium text-custom-primary">
 {t("account.addAddress.contactPhone")}
 <span className="text-red-500 ml-1">*</span>
 </label>
 <div className="flex rounded-xl border border-custom-secondary overflow-hidden bg-custom-card">
 <div className="px-4 py-2.5 bg-custom-tertiary text-custom-secondary text-sm font-medium shrink-0">
 {t("account.addAddress.phonePrefix")}
 </div>
 <input
 type="tel"
 placeholder={t("account.addAddress.contactPhonePlaceholder")}
 className="flex-1 min-w-0 px-4 py-2.5 text-sm text-custom-primary bg-transparent focus:outline-none focus:ring-0 placeholder:text-custom-tertiary"
 {...register("contactPhone", {
 required: t("validation.required"),
 pattern: {
 value: /^\+?[0-9]{10,15}$/,
 message: t("validation.phoneInvalid"),
 },
 })}
 />
 </div>
 <p className="text-xs text-custom-secondary">
 {t("account.addAddress.contactPhoneHelper")}
 </p>
 {errors.contactPhone && (
 <p className="text-sm text-red-600 dark:text-red-400">
 {errors.contactPhone.message as string}
 </p>
 )}
 </div>

 {/* Location on Map */}
 <div className="space-y-3">
 <div className="flex items-center gap-2">
 <HiLocationMarker className="w-5 h-5 text-cyan-500 shrink-0"/>
 <label className="text-sm font-medium text-custom-primary">
 {t("account.addAddress.locationOnMap")}
 </label>
 </div>
 <div className="relative">
 <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-custom-tertiary"/>
 <input
 type="text"
 placeholder={t("account.addAddress.searchLocationPlaceholder")}
 readOnly
 className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-custom-secondary bg-custom-light text-custom-secondary text-sm"
 />
 </div>
 <LocationPickerMap
 lat={lat}
 lng={lng}
 onLocationChange={(newLat, newLng) => {
 setValue("lat", newLat);
 setValue("lng", newLng);
 }}
 />
 <button
 type="button"
 onClick={handleUseCurrentLocation}
 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-custom-secondary text-custom-secondary hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm font-medium"
 >
 <svg
 className="w-5 h-5"
 fill="none"
 stroke="currentColor"
 viewBox="0 0 24 24"
 >
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
 />
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
 />
 </svg>
 {t("account.addAddress.useCurrentLocation")}
 </button>
 <p className="text-xs text-custom-secondary">
 {t("account.addAddress.pinnedLocation")}: {Number(lat)?.toFixed(4)}°{""}
 {Number(lat) >= 0 ?"N":"S"}, {Number(lng)?.toFixed(4)}°{""}
 {Number(lng) >= 0 ?"E":"W"}
 </p>
 </div>

 {/* Set as Default */}
 <div className="flex items-center justify-between p-4 rounded-xl bg-custom-light border border-custom-primary">
 <div>
 <p className="text-sm font-medium text-custom-primary">
 {t("account.addAddress.setAsDefault")}
 </p>
 <p className="text-xs text-custom-secondary mt-0.5">
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

 {/* Footer */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-custom-primary">
 <button
 type="button"
 onClick={inline ? onCancel : () => navigate(-1)}
 disabled={isPending}
 className="text-sm font-medium text-custom-secondary hover:text-custom-primary transition-colors"
 >
 {t("common.cancel")}
 </button>
 <div className="flex flex-col sm:items-end gap-2">
 <p className="text-xs text-custom-secondary">
 {t("account.addAddress.requiredFieldsNote")}
 </p>
 <Button
 type="submit"
 variant="primary"
 isLoading={isPending}
 className="bg-cyan-500 hover:bg-cyan-600 rounded-xl px-8"
 >
 {isEditMode
 ? t("account.editAddress.updateAddress")
 : t("account.addAddress.saveAddress")}
 </Button>
 </div>
 </div>
 </form>
 </div>
 );
}

import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { _LocationApi } from "@/features/auth/api/location.service";
import type { Area, City, Governorate } from "@/features/auth/types";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import { parseCitiesPageResponse } from "@/features/account/utils/parseCitiesPageResponse";
import {
    useAddresses,
    useCreateAddress,
    useUpdateAddress,
} from "@/features/account/hooks/useAddress";
import type { NewAddressFormData } from "@/features/account/types";
import {
    DEFAULT_ADDRESS_LATITUDE,
    DEFAULT_ADDRESS_LONGITUDE,
} from "../constants";
import { buildCreateAddressPayload, buildUpdateAddressPayload } from "../utils/buildAddressPayloads";
import { parseAreasPageForSelect } from "../utils/parseAreasPageForSelect";
import { resolveLocalizedOptionLabel } from "../utils/resolveLocalizedOptionLabel";

export type UseAddressFormOptions = {
    inline?: boolean;
    onSuccess?: (addressId?: number) => void;
    onCancel?: () => void;
};

function parseGovernoratePageResponse(
    response: Awaited<ReturnType<typeof _LocationApi.getGovernorates>>,
) {
    return response.data;
}

export function useAddressForm(options: UseAddressFormOptions = {}) {
    const { inline, onSuccess, onCancel } = options;
    const { t, i18n } = useTranslation();
    const lang = i18n.language || "en";
    const navigate = useNavigate();
    const { id: routeAddressId } = useParams<{ id?: string }>();
    const isEditMode = !inline && !!routeAddressId;

    const { mutate: createAddress, isPending: isCreating } = useCreateAddress({
        redirectOnSuccess: !inline,
    });
    const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
    const { data: addresses = [] } = useAddresses();

    const isSubmitPending = isCreating || isUpdating;

    const addressBeingEdited = useMemo(() => {
        if (!isEditMode || !routeAddressId) return null;
        return addresses.find((addr) => addr.id === Number(routeAddressId)) ?? null;
    }, [addresses, isEditMode, routeAddressId]);

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
            lat: DEFAULT_ADDRESS_LATITUDE,
            lng: DEFAULT_ADDRESS_LONGITUDE,
            isDefault: false,
        },
    });

    useEffect(() => {
        if (!isEditMode || !addressBeingEdited) return;
        reset({
            label: addressBeingEdited.label,
            governorate: String(addressBeingEdited.area.city.governorate.id),
            city: String(addressBeingEdited.area.city.id),
            area: String(addressBeingEdited.area.id),
            streetName: addressBeingEdited.street_name,
            nearestLandmark: addressBeingEdited.nearest_landmark,
            buildingNumber: addressBeingEdited.building_number || "",
            floorApartment: addressBeingEdited.floor_apartment || "",
            contactPhone: addressBeingEdited.contact_phone,
            lat: addressBeingEdited.lat,
            lng: addressBeingEdited.lng,
            isDefault: addressBeingEdited.is_default,
        });
    }, [isEditMode, addressBeingEdited, reset]);

    const selectedGovernorateId = watch("governorate");
    const selectedCityId = watch("city");
    const latitude = watch("lat");
    const longitude = watch("lng");

    const governorateNumericId =
        selectedGovernorateId &&
            selectedGovernorateId !== "" &&
            selectedGovernorateId !== "0"
            ? Number(selectedGovernorateId)
            : null;

    const cityNumericId =
        selectedCityId && selectedCityId !== "" && selectedCityId !== "0"
            ? Number(selectedCityId)
            : null;

    const mapGovernorateToOption = useCallback(
        (gov: Governorate) => ({
            value: gov.id,
            label: resolveLocalizedOptionLabel(gov.name, lang),
        }),
        [lang],
    );

    const mapCityToOption = useCallback(
        (city: City) => ({
            value: city.id,
            label: resolveLocalizedOptionLabel(city.name, lang),
        }),
        [lang],
    );

    const mapAreaToOption = useCallback(
        (area: Area) => ({
            value: area.id,
            label: resolveLocalizedOptionLabel(area.name, lang),
        }),
        [lang],
    );

    const {
        options: governorateOptions,
        isLoading: isGovernorateListLoading,
        isFetchingNextPage: isFetchingMoreGovernorates,
        handleScroll: onGovernorateSelectScroll,
    } = useInfiniteSelect<Governorate>({
        queryKey: ["location", "governorates", "select"],
        fetchFn: async (page) => parseGovernoratePageResponse(await _LocationApi.getGovernorates(page)),
        mapToOption: mapGovernorateToOption,
    });

    const {
        options: cityOptions,
        isLoading: isCityListLoading,
        isFetchingNextPage: isFetchingMoreCities,
        handleScroll: onCitySelectScroll,
    } = useInfiniteSelect<City>({
        queryKey: ["location", "cities", "select", governorateNumericId],
        fetchFn: async (page) => {
            const response = await _LocationApi.getCities(governorateNumericId!, page);
            return parseCitiesPageResponse(response.data as unknown);
        },
        mapToOption: mapCityToOption,
        enabled: !!governorateNumericId,
    });

    const {
        options: areaOptions,
        isLoading: isAreaListLoading,
        isFetchingNextPage: isFetchingMoreAreas,
        handleScroll: onAreaSelectScroll,
    } = useInfiniteSelect<Area>({
        queryKey: ["location", "areas", "select", cityNumericId],
        fetchFn: async (page) => {
            const response = await _LocationApi.getAreas(cityNumericId!, page);
            return parseAreasPageForSelect(response.data);
        },
        mapToOption: mapAreaToOption,
        enabled: !!cityNumericId,
    });

    useEffect(() => {
        if (!selectedGovernorateId) return;
        const initialGovernorateId =
            isEditMode && addressBeingEdited
                ? addressBeingEdited.area.city.governorate.id
                : null;
        if (initialGovernorateId !== Number(selectedGovernorateId)) {
            setValue("city", "");
            setValue("area", "");
        }
    }, [selectedGovernorateId, setValue, isEditMode, addressBeingEdited]);

    useEffect(() => {
        if (!selectedCityId) return;
        const initialCityId =
            isEditMode && addressBeingEdited ? addressBeingEdited.area.city.id : null;
        if (initialCityId !== Number(selectedCityId)) {
            setValue("area", "");
        }
    }, [selectedCityId, setValue, isEditMode, addressBeingEdited]);

    const applyCurrentGeolocation = useCallback(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue("lat", position.coords.latitude);
                setValue("lng", position.coords.longitude);
            },
            () => { },
        );
    }, [setValue]);

    const handleValidSubmit = useCallback(
        (data: NewAddressFormData) => {
            if (isEditMode) {
                if (!routeAddressId) return;
                updateAddress({
                    id: routeAddressId,
                    payload: buildUpdateAddressPayload(data),
                });
                return;
            }
            createAddress(buildCreateAddressPayload(data), {
                onSuccess: (response) => {
                    if (!inline) return;
                    const newId = response?.data?.id;
                    onSuccess?.(newId);
                },
            });
        },
        [createAddress, inline, isEditMode, onSuccess, routeAddressId, updateAddress],
    );

    const handleCancelClick = useCallback(() => {
        if (inline) {
            onCancel?.();
            return;
        }
        navigate(-1);
    }, [inline, navigate, onCancel]);

    const isEditDataPending = isEditMode && !addressBeingEdited;

    const heroTitle = isEditMode ? t("account.editAddress.title") : t("account.addAddress.title");
    const heroSubtitle = isEditMode
        ? t("account.editAddress.subtitle")
        : t("account.addAddress.subtitle");

    return {
        isEditMode,
        isEditDataPending,
        isSubmitPending,
        errors,
        register,
        control,
        setValue,
        handleSubmit,
        handleValidSubmit,
        handleCancelClick,
        applyCurrentGeolocation,
        selectedGovernorateId,
        selectedCityId,
        latitude,
        longitude,
        governorateOptions,
        isGovernorateListLoading,
        isFetchingMoreGovernorates,
        onGovernorateSelectScroll,
        cityOptions,
        isCityListLoading,
        isFetchingMoreCities,
        onCitySelectScroll,
        areaOptions,
        isAreaListLoading,
        isFetchingMoreAreas,
        onAreaSelectScroll,
        heroTitle,
        heroSubtitle,
    };
}

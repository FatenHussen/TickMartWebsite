import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { _LocationApi } from "@/features/auth/api/location.service";
import type { Governorate, City } from "@/features/auth/types";
import { useInfiniteSelect } from "@/shared/hooks/useInfiniteSelect";
import type { ProfileData, UpdateProfilePayload } from "../types";
import type { ProfileFormValues } from "../types/profileForm";
import { parseCitiesPageResponse } from "../utils/parseCitiesPageResponse";
import { resolveLocalizedValue } from "../utils/resolveLocalizedValue";

interface UseProfileEditorParams {
    profileData: ProfileData;
    lang: string;
    updateProfile: (
        payload: UpdateProfilePayload,
        options?: { onSuccess?: () => void }
    ) => void;
    isUpdating: boolean;
}

export function useProfileEditor({
    profileData,
    lang,
    updateProfile,
    isUpdating,
}: UseProfileEditorParams) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedGovernorateId, setSelectedGovernorateId] = useState<
        number | null
    >(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null
    );
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<ProfileFormValues>();

    const watchedGovernorateId = watch("governorate_id");

    useEffect(() => {
        setValue(
            "name",
            resolveLocalizedValue(profileData.name as unknown, lang)
        );
    }, [profileData, setValue, lang]);

    useEffect(() => {
        if (watchedGovernorateId) {
            setSelectedGovernorateId(Number(watchedGovernorateId));
        }
    }, [watchedGovernorateId]);

    const {
        options: governorateOptions,
        handleScroll: handleGovernorateSelectScroll,
        isFetchingNextPage: isFetchingMoreGovernorates,
    } = useInfiniteSelect<Governorate>({
        queryKey: ["location", "governorates", "select"],
        fetchFn: async (page) => {
            const res = await _LocationApi.getGovernorates(page);
            return res.data;
        },
        mapToOption: (gov) => ({
            value: gov.id,
            label: resolveLocalizedValue(gov.name as unknown, lang),
        }),
    });

    const {
        options: cityOptions,
        handleScroll: handleCitySelectScroll,
        isFetchingNextPage: isFetchingMoreCities,
    } = useInfiniteSelect<City>({
        queryKey: ["location", "cities", "select", selectedGovernorateId],
        fetchFn: async (page) => {
            const res = await _LocationApi.getCities(selectedGovernorateId!, page);
            return parseCitiesPageResponse(res.data as unknown);
        },
        mapToOption: (city) => ({
            value: city.id,
            label: resolveLocalizedValue(city.name as unknown, lang),
        }),
        enabled: !!selectedGovernorateId,
    });

    const handleAvatarFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;
            setSelectedImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        },
        []
    );

    const submitProfileUpdate = useCallback(
        (formValues: ProfileFormValues) => {
            const payload: UpdateProfilePayload = {
                name: formValues.name,
                city_id: Number(formValues.city_id),
            };
            if (selectedImageFile) {
                payload.image = selectedImageFile;
            }
            updateProfile(payload, {
                onSuccess: () => {
                    setSelectedImageFile(null);
                    setImagePreviewUrl(null);
                    setIsEditing(false);
                },
            });
        },
        [selectedImageFile, updateProfile]
    );

    const onSubmitForm = handleSubmit(submitProfileUpdate);

    const toggleEditMode = useCallback(() => {
        setIsEditing((previous) => !previous);
    }, []);

    const displayName = resolveLocalizedValue(profileData.name as unknown, lang);
    const displayEmail = resolveLocalizedValue(
        profileData.email as unknown,
        lang
    );
    const displayPhone = resolveLocalizedValue(
        profileData.phone as unknown,
        lang
    );
    const avatarSrc = imagePreviewUrl || profileData.image;

    return {
        register,
        errors,
        onSubmitForm,
        isEditing,
        toggleEditMode,
        fileInputRef,
        handleAvatarFileChange,
        avatarSrc,
        displayName,
        displayEmail,
        displayPhone,
        governorateOptions,
        cityOptions,
        handleGovernorateSelectScroll,
        handleCitySelectScroll,
        isFetchingMoreGovernorates,
        isFetchingMoreCities,
        selectedGovernorateId,
        isUpdating,
    };
}

export type ProfileEditorApi = ReturnType<typeof useProfileEditor>;

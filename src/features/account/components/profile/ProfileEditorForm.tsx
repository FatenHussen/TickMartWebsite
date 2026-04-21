import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { API_SECOND_BUTTON_CLASS } from "./apiPaletteClasses";
import type { ProfileEditorApi } from "../../hooks/useProfileEditor";
import { ProfileAvatarBanner } from "./ProfileAvatarBanner";
import { ProfileFormFields } from "./ProfileFormFields";
import { ProfileSectionShell } from "./ProfileSectionShell";

interface ProfileEditorFormProps {
    editor: ProfileEditorApi;
}

export function ProfileEditorForm({ editor }: ProfileEditorFormProps) {
    const { t } = useTranslation();

    const {
        onSubmitForm,
        register,
        errors,
        isEditing,
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
    } = editor;

    return (
        <form onSubmit={onSubmitForm}>
            <ProfileSectionShell>
                <ProfileAvatarBanner
                    avatarSrc={avatarSrc}
                    displayName={displayName}
                    displayEmail={displayEmail}
                    isEditing={isEditing}
                    fileInputRef={fileInputRef}
                    onAvatarFileChange={handleAvatarFileChange}
                    profileTitleLabel={t("account.profile.title")}
                />

                <div className="h-px bg-gradient-to-r from-primary-light via-primary to-primary/20 mb-8 rounded-full" />

                <ProfileFormFields
                    register={register}
                    errors={errors}
                    isEditing={isEditing}
                    displayPhone={displayPhone}
                    displayEmail={displayEmail}
                    governorateOptions={governorateOptions}
                    cityOptions={cityOptions}
                    onGovernorateSelectScroll={handleGovernorateSelectScroll}
                    onCitySelectScroll={handleCitySelectScroll}
                    isFetchingMoreGovernorates={isFetchingMoreGovernorates}
                    isFetchingMoreCities={isFetchingMoreCities}
                    selectedGovernorateId={selectedGovernorateId}
                />

                {isEditing && (
                    <div className="relative mt-6 flex justify-end">
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isUpdating}
                            className={cn(
                                API_SECOND_BUTTON_CLASS,
                                "px-6 shadow-md shadow-primary/20",
                            )}
                        >
                            <Pencil className="w-4 h-4" />
                            {t("common.saveChanges", "حفظ التغييرات")}
                        </Button>
                    </div>
                )}
            </ProfileSectionShell>
        </form>
    );
}

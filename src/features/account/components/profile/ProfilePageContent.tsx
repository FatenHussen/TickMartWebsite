import { useTranslation } from "react-i18next";
import { useLogout } from "@/features/auth/hooks/useAuth";
import type { ProfileData } from "../../types";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useProfileEditor } from "../../hooks/useProfileEditor";
import { useProfileModals } from "../../hooks/useProfileModals";
import { ProfileAccountModals } from "./ProfileAccountModals";
import { ProfileDecorativeBackground } from "./ProfileDecorativeBackground";
import { ProfileEditorForm } from "./ProfileEditorForm";
import { ProfileLogoutSection } from "./ProfileLogoutSection";
import { ProfileSpotlightSection } from "./ProfileSpotlightSection";
import { ProfileSecuritySection } from "./ProfileSecuritySection";

interface ProfilePageContentProps {
    profileData: ProfileData;
}

export function ProfilePageContent({ profileData }: ProfilePageContentProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language || "en";

    const { mutate: updateProfileMutate, isPending: isProfileUpdating } =
        useUpdateProfile();
    const modals = useProfileModals();
    const logoutMutation = useLogout();

    const editor = useProfileEditor({
        profileData,
        lang,
        updateProfile: updateProfileMutate,
        isUpdating: isProfileUpdating,
    });

    const handleConfirmLogout = () => {
        logoutMutation.mutate();
        modals.setLogoutModalOpen(false);
    };

    return (
        <div className="space-y-6 relative">
            <ProfileDecorativeBackground />

            <ProfileSpotlightSection
                userName={profileData.name}
                title={t("account.profile.title")}
                subtitle={t("account.profile.subtitle")}
                editProfileLabel={t("account.profile.editProfile")}
                onToggleEditMode={editor.toggleEditMode}
            />

            <ProfileEditorForm editor={editor} />

            <ProfileSecuritySection
                displayEmail={editor.displayEmail}
                displayPhone={editor.displayPhone}
                onOpenChangePassword={() => modals.setPasswordModalOpen(true)}
                onOpenUpdateEmail={() => modals.setEmailModalOpen(true)}
                onOpenUpdatePhone={() => modals.setPhoneModalOpen(true)}
            />

            <ProfileLogoutSection
                onOpenLogoutConfirm={() => modals.setLogoutModalOpen(true)}
            />

            <ProfileAccountModals
                modals={modals}
                onConfirmLogout={handleConfirmLogout}
            />
        </div>
    );
}

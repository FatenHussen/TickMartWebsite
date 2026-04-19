import { useTranslation } from "react-i18next";
import { LogoutPopup } from "@/shared/component";
import ChangePasswordModal from "../ChangePasswordModal";
import UpdateEmailModal from "../UpdateEmailModal";
import UpdatePhoneModal from "../UpdatePhoneModal";
import VerifyProfileModal from "../VerifyProfileModal";
import type { ProfileModalsApi } from "../../hooks/useProfileModals";

interface ProfileAccountModalsProps {
    modals: ProfileModalsApi;
    onConfirmLogout: () => void;
}

export function ProfileAccountModals({
    modals,
    onConfirmLogout,
}: ProfileAccountModalsProps) {
    const { t } = useTranslation();

    const {
        isPasswordModalOpen,
        setPasswordModalOpen,
        isEmailModalOpen,
        setEmailModalOpen,
        isPhoneModalOpen,
        setPhoneModalOpen,
        isVerifyModalOpen,
        setVerifyModalOpen,
        pendingVerifyEmail,
        pendingVerifyPhone,
        isLogoutModalOpen,
        setLogoutModalOpen,
        startEmailVerification,
        startPhoneVerification,
    } = modals;

    return (
        <>
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
            />
            <UpdateEmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setEmailModalOpen(false)}
                onVerify={startEmailVerification}
            />
            <UpdatePhoneModal
                isOpen={isPhoneModalOpen}
                onClose={() => setPhoneModalOpen(false)}
                onVerify={startPhoneVerification}
            />
            <VerifyProfileModal
                isOpen={isVerifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                email={pendingVerifyEmail}
                phone={pendingVerifyPhone}
            />
            <LogoutPopup
                isOpen={isLogoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={onConfirmLogout}
                cancelButtonText={t("common.cancel")}
            />
        </>
    );
}

import { useTranslation } from "react-i18next";
import { HiLockClosed, HiMail, HiPhone } from "react-icons/hi";
import { API_SECOND_BUTTON_CLASS } from "./apiPaletteClasses";
import { ProfileSectionShell } from "./ProfileSectionShell";

interface ProfileSecuritySectionProps {
    displayEmail: string;
    displayPhone: string;
    onOpenChangePassword: () => void;
    onOpenUpdateEmail: () => void;
    onOpenUpdatePhone: () => void;
}

export function ProfileSecuritySection({
    displayEmail,
    displayPhone,
    onOpenChangePassword,
    onOpenUpdateEmail,
    onOpenUpdatePhone,
}: ProfileSecuritySectionProps) {
    const { t } = useTranslation();

    return (
        <ProfileSectionShell>
            <h2 className="text-xl font-bold text-custom-primary mb-6">
                {t("account.profile.security")}
            </h2>

            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-custom-primary">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
                        <HiLockClosed className="w-5 h-5 text-custom-secondary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-custom-primary">
                            {t("account.profile.changePassword")}
                        </h3>
                        <p className="text-sm text-custom-secondary">
                            {t("account.profile.changePasswordDesc")}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenChangePassword}
                    className={API_SECOND_BUTTON_CLASS}
                >
                    {t("account.profile.changePassword")}
                </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-b border-custom-primary">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
                        <HiMail className="w-5 h-5 text-custom-secondary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-custom-primary">
                            {t("account.profile.updateEmail")}
                        </h3>
                        <p className="text-sm text-custom-secondary">
                            {t("account.profile.currentEmail")}: {displayEmail}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenUpdateEmail}
                    className={API_SECOND_BUTTON_CLASS}
                >
                    {t("account.profile.updateEmail")}
                </button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-custom-tertiary flex items-center justify-center shrink-0">
                        <HiPhone className="w-5 h-5 text-custom-secondary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-custom-primary">
                            {t("account.profile.updatePhone")}
                        </h3>
                        <p className="text-sm text-custom-secondary">
                            {t("account.profile.currentPhone")}: {displayPhone}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenUpdatePhone}
                    className={API_SECOND_BUTTON_CLASS}
                >
                    {t("account.profile.updatePhone")}
                </button>
            </div>

            <div className="h-px bg-gradient-to-r from-primary-light via-primary to-transparent my-5" />

            <p className="text-sm text-custom-tertiary">
                {t("account.profile.loginActivityNote")}
            </p>
        </ProfileSectionShell>
    );
}

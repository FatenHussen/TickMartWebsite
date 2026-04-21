import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { ProfileSectionShell } from "./ProfileSectionShell";

interface ProfileLogoutSectionProps {
    onOpenLogoutConfirm: () => void;
}

export function ProfileLogoutSection({ onOpenLogoutConfirm }: ProfileLogoutSectionProps) {
    const { t } = useTranslation();

    return (
        <ProfileSectionShell tone="danger">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-custom-tertiary">
                        <LogOut className="h-5 w-5 text-custom-secondary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-custom-primary">
                            {t("account.profile.logout")}
                        </h2>
                        <p className="text-sm text-custom-secondary">{t("account.profile.logoutDesc")}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onOpenLogoutConfirm}
                    className="shrink-0 rounded-full bg-[var(--color-ui-red-500)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--color-ui-red-600)]"
                >
                    {t("account.profile.logout")}
                </button>
            </div>
        </ProfileSectionShell>
    );
}

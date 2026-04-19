import { useTranslation } from "react-i18next";
import accountBg from "/images/accounts/Account.png";

export function ProfileDecorativeBackground() {
    const { t } = useTranslation();
    return (
        <img
            src={accountBg}
            alt={t("account.profile.decorativeBackgroundAlt")}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 h-screen w-auto object-contain select-none z-0"
        />
    );
}

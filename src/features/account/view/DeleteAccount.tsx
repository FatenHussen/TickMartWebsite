import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function DeleteAccount() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div
      className="p-6 text-center text-text-secondary dark:text-gray-400"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {t("account.menu.deleteAccountComingSoon")}
    </div>
  );
}

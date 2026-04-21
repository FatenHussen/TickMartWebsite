import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";

export function ProfileErrorView() {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-[var(--color-ui-red-500)] mx-auto mb-4" />
                <p className="text-lg text-custom-primary">
                    {t("account.profile.loadError", "فشل تحميل البيانات")}
                </p>
            </div>
        </div>
    );
}

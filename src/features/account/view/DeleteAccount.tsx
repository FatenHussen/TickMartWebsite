import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { MdDeleteForever } from "react-icons/md";
import Button from "@/shared/ui/Button";
import BasePopup from "@/shared/component/BasePopup";
import { useDeleteAccount } from "../hooks/useProfile";

export default function DeleteAccount() {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [showConfirm, setShowConfirm] = useState(false);
    const deleteAccount = useDeleteAccount();

    return (
        <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
            <h2 className="text-xl font-bold text-custom-primary mb-2">
                {t("account.settings.deleteAccount")}
            </h2>
            <p className="text-sm text-custom-secondary mb-6">
                {t("account.settings.deleteAccountDesc")}
            </p>

            <Button
                type="button"
                variant="danger"
                size="lg"
                onClick={() => setShowConfirm(true)}
                className="text-white rounded-xl"
            >
                {t("account.settings.deleteAccount")}
            </Button>

            <BasePopup
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                icon={
                    <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                        <MdDeleteForever className="w-10 h-10 text-white" />
                    </div>
                }
                title={t("account.settings.deleteAccount")}
                description={t("account.settings.deleteAccountDesc")}
                contentClassName="pt-12 p-8"
                actions={
                    <div className="flex flex-col gap-3">
                        <Button
                            type="button"
                            variant="danger"
                            size="lg"
                            fullWidth
                            onClick={() => deleteAccount.mutate()}
                            disabled={deleteAccount.isPending}
                            className="text-white rounded-xl"
                        >
                            {deleteAccount.isPending
                                ? t("common.loading", "جاري...")
                                : t("account.settings.deleteAccount")}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            className="text-sm text-custom-secondary hover:text-custom-primary hover:underline transition-colors"
                        >
                            {t("common.cancel")}
                        </button>
                    </div>
                }
            />
        </div>
    );
}

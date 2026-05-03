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
        <div
            className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--color-error)_22%,var(--color-border-primary))] bg-[linear-gradient(135deg,var(--color-bg-card)_0%,color-mix(in_srgb,var(--color-error)_8%,var(--color-bg-card))_100%)] p-6 shadow-[0_18px_44px_-22px_color-mix(in_srgb,var(--color-error)_35%,transparent)]"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="pointer-events-none absolute -end-16 -top-20 h-44 w-44 rounded-full bg-[var(--color-error)] opacity-[0.12] blur-3xl"
                aria-hidden
            />
            <div className="relative">
                <h2 className="text-xl font-bold text-custom-primary mb-2">
                    {t("account.settings.deleteAccount")}
                </h2>
                <p className="text-sm text-custom-secondary mb-6 leading-relaxed max-w-xl">
                    {t("account.settings.deleteAccountDesc")}
                </p>

                <Button
                    type="button"
                    variant="danger"
                    size="lg"
                    onClick={() => setShowConfirm(true)}
                    className="text-white rounded-xl shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-error)_55%,transparent)]"
                >
                    {t("account.settings.deleteAccount")}
                </Button>
            </div>

            <BasePopup
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                icon={
                    <div className="w-20 h-20 rounded-full bg-[var(--color-error)] flex items-center justify-center shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-error)_55%,transparent)] ring-4 ring-[color-mix(in_srgb,var(--color-error)_18%,transparent)]">
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

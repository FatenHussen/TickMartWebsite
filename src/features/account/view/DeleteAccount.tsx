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
            className="relative overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--color-error)_22%,var(--color-border-primary))] bg-[linear-gradient(135deg,var(--color-bg-card)_0%,color-mix(in_srgb,var(--color-error)_8%,var(--color-bg-card))_100%)] p-6 shadow-[0_18px_44px_-22px_color-mix(in_srgb,var(--color-error)_35%,transparent)] transition-shadow duration-300 dark:border-[rgba(255,255,255,0.06)] dark:bg-[linear-gradient(135deg,rgba(16,17,20,0.92)_0%,color-mix(in_srgb,var(--color-error)_6%,rgba(11,11,12,0.98))_100%)] dark:shadow-[0_24px_64px_-28px_rgba(0,0,0,0.72),inset_0_1px_0_0_rgba(255,255,255,0.04)] dark:backdrop-blur-xl"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div
                className="pointer-events-none absolute -end-16 -top-20 h-44 w-44 rounded-full bg-[var(--color-error)] opacity-[0.12] blur-3xl dark:opacity-[0.06]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -start-10 bottom-0 h-32 w-32 rounded-full bg-[var(--color-error)] opacity-[0.06] blur-3xl dark:opacity-[0.04]"
                aria-hidden
            />
            <div className="relative">
                <h2 className="mb-2 text-xl font-bold text-custom-primary dark:text-[#FFFFFF]">
                    {t("account.settings.deleteAccount")}
                </h2>
                <p className="mb-6 max-w-xl text-sm leading-relaxed text-custom-secondary dark:text-[#A1A1AA]">
                    {t("account.settings.deleteAccountDesc")}
                </p>

                <Button
                    type="button"
                    variant="danger"
                    size="lg"
                    onClick={() => setShowConfirm(true)}
                    className="rounded-xl text-white shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-error)_55%,transparent)] transition-all duration-200 dark:shadow-[0_14px_40px_-16px_color-mix(in_srgb,var(--color-error)_42%,transparent)] dark:ring-1 dark:ring-white/[0.06]"
                >
                    {t("account.settings.deleteAccount")}
                </Button>
            </div>

            <BasePopup
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                icon={
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-error)] shadow-[0_10px_28px_-10px_color-mix(in_srgb,var(--color-error)_55%,transparent)] ring-4 ring-[color-mix(in_srgb,var(--color-error)_18%,transparent)] dark:shadow-[0_12px_36px_-12px_color-mix(in_srgb,var(--color-error)_38%,transparent)] dark:ring-[color-mix(in_srgb,var(--color-error)_12%,transparent)]">
                        <MdDeleteForever className="h-10 w-10 text-white" />
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
                            className="rounded-xl text-white dark:shadow-[0_12px_36px_-14px_color-mix(in_srgb,var(--color-error)_40%,transparent)] dark:ring-1 dark:ring-white/[0.06]"
                        >
                            {deleteAccount.isPending
                                ? t("common.loading", "جاري...")
                                : t("account.settings.deleteAccount")}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setShowConfirm(false)}
                            className="text-sm text-custom-secondary transition-colors duration-200 hover:text-custom-primary hover:underline dark:text-[#A1A1AA] dark:hover:text-[#FFFFFF]"
                        >
                            {t("common.cancel")}
                        </button>
                    </div>
                }
            />
        </div>
    );
}

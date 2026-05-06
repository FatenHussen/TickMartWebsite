import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { LegalDocumentData } from "@/features/legal/types";
import { API_SECOND_CTA_CLASS } from "@/features/marketer/constants/apiSecondClasses";
import { PremiumInlineLoader } from "@/shared/component/loading";

interface BecomeMarketerTermsSectionProps {
    termsData: LegalDocumentData | null | undefined;
    isLoading: boolean;
    termsLoadError: unknown;
    cancelHref: string;
    isSubmitDisabled: boolean;
    isRequestPending: boolean;
    onAgree: () => void;
}

function termsErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return "Failed to load terms and conditions.";
}

export function BecomeMarketerTermsSection({
    termsData,
    isLoading,
    termsLoadError,
    cancelHref,
    isSubmitDisabled,
    isRequestPending,
    onAgree,
}: BecomeMarketerTermsSectionProps) {
    const { t } = useTranslation();

    return (
        <div className="overflow-hidden rounded-xl border border-custom-primary bg-custom-card shadow-lg">
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <PremiumInlineLoader size="md" />
                </div>
            ) : termsLoadError ? (
                <p className="px-6 py-8 text-center text-error">{termsErrorMessage(termsLoadError)}</p>
            ) : termsData ? (
                <>
                    <div className="flex flex-col gap-2 bg-accent-light-bg px-6 py-4 dark:bg-bg-hover/90 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-bold text-primary">{termsData.title}</h2>
                        <span className="text-xs text-custom-secondary sm:text-right">
                            {t("marketer.lastUpdated") || "Last updated: 2026-01-01"}
                        </span>
                    </div>

                    <div className="px-6 py-5">
                        <div
                            className="prose prose-sm max-w-none space-y-4 leading-relaxed text-custom-secondary"
                            dangerouslySetInnerHTML={{ __html: termsData.content }}
                        />

                        <p className="mt-6 text-xs text-custom-secondary">
                            {t("marketer.agreeDisclaimer") ||
                                "By clicking 'I agree' you confirm you accept all marketer terms and conditions."}
                        </p>

                        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                            <Link
                                to={cancelHref}
                                className="rounded-lg border border-custom-secondary px-5 py-2.5 text-center font-medium text-custom-primary transition-colors hover:bg-custom-light"
                            >
                                {t("common.cancel") || "Cancel"}
                            </Link>
                            <button
                                type="button"
                                onClick={onAgree}
                                disabled={isSubmitDisabled}
                                className={API_SECOND_CTA_CLASS}
                            >
                                {isRequestPending
                                    ? t("common.loading", "Loading...")
                                    : t("marketer.iAgree") || "I agree"}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <p className="px-6 py-8 text-center text-custom-secondary">
                    {t("marketer.noTermsAvailable") || "Terms and conditions not available."}
                </p>
            )}
        </div>
    );
}

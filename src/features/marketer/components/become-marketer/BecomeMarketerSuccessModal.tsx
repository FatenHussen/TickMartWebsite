import { Gift, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { API_SECOND_CTA_WIDE_CLASS } from "@/features/marketer/constants/apiSecondClasses";

interface BecomeMarketerSuccessModalProps {
    isOpen: boolean;
    isRTL: boolean;
    onDismiss: () => void;
    onNavigateHome: () => void;
}

export function BecomeMarketerSuccessModal({
    isOpen,
    isRTL,
    onDismiss,
    onNavigateHome,
}: BecomeMarketerSuccessModalProps) {
    const { t } = useTranslation();

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/50" onClick={onDismiss} />
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
                    isRTL ? "flex-row-reverse" : ""
                }`}
            >
                <div
                    className="relative w-full max-w-md rounded-2xl bg-custom-card p-8 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        onClick={onDismiss}
                        className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-custom-muted text-custom-secondary transition-colors hover:bg-custom-hover"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="mb-5 flex justify-center pt-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-bg dark:bg-warning-bg/40">
                            <Gift className="h-9 w-9 text-warning-dark" />
                        </div>
                    </div>

                    <h2 className="mb-4 text-center text-xl font-bold text-custom-primary">
                        {t("marketer.thankYouTitle") || "Thank you for your application!"}
                    </h2>

                    <div className="mb-8 space-y-2 text-center text-sm text-custom-secondary">
                        <p>
                            {t("marketer.thankYouMessage1") ||
                                "Your request to join as a marketer has been submitted."}
                        </p>
                        <p>
                            {t("marketer.thankYouMessage2") ||
                                "Please wait while our team reviews your application."}
                        </p>
                        <p>
                            {t("marketer.thankYouMessage3") ||
                                "You'll be notified once it's approved."}
                        </p>
                        <p className="text-xs">
                            {t("marketer.thankYouMessage4") ||
                                "Approval may take up to 24-48 hours depending on review."}
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <button type="button" onClick={onNavigateHome} className={API_SECOND_CTA_WIDE_CLASS}>
                            {t("marketer.backToHome") || "Back to home"}
                        </button>
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="text-sm text-custom-secondary transition-colors hover:text-primary"
                        >
                            {t("common.close") || "Close"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

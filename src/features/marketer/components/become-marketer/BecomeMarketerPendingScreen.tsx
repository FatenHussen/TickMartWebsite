import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { API_SECOND_CTA_WIDE_CLASS } from "@/features/marketer/constants/apiSecondClasses";

interface BecomeMarketerPendingScreenProps {
    isRTL: boolean;
    homePath: string;
}

export function BecomeMarketerPendingScreen({ isRTL, homePath }: BecomeMarketerPendingScreenProps) {
    const { t } = useTranslation();

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-custom-muted p-4"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="w-full max-w-md rounded-2xl bg-custom-card p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning-bg dark:bg-warning-bg/35">
                        <Clock className="h-12 w-12 text-warning-dark" />
                    </div>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-custom-primary">
                    {t("marketer.pendingTitle", "Request Under Review")}
                </h2>
                <p className="mb-6 text-custom-secondary">
                    {t(
                        "marketer.pendingMessage",
                        "Your marketer request is being reviewed by our team. You'll be notified once it's approved.",
                    )}
                </p>
                <Link to={homePath} className={API_SECOND_CTA_WIDE_CLASS}>
                    {t("marketer.backToHome", "Back to home")}
                </Link>
            </div>
        </div>
    );
}

import { useRouteError, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiExclamationCircle } from "react-icons/hi";
import Button from "@/shared/ui/Button";

export type RouteErrorFallbackProps = {
    /** Overrides the default headline (e.g. per-route wording). */
    title?: string;
    description?: string;
};

/**
 * Route-level error boundary UI. Replaces the blank screen React Router shows
 * when a page throws while rendering: states what happened and offers a retry
 * plus a way back home, and keeps the parent layout (navbar/footer) intact when
 * mounted on a child route.
 */
export default function RouteErrorFallback({
    title,
    description,
}: RouteErrorFallbackProps) {
    const error = useRouteError();
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (import.meta.env.DEV) {
        console.error("Route error:", error);
    }

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
            <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                    <HiExclamationCircle className="h-9 w-9" aria-hidden />
                </span>

                <h2 className="text-xl font-bold text-custom-primary dark:text-[#FFFFFF]">
                    {title ??
                        t("errors.somethingWentWrong", "Something went wrong")}
                </h2>

                <p className="text-sm leading-relaxed text-custom-secondary dark:text-[#A1A1AA]">
                    {description ??
                        t(
                            "errors.pageLoadFailed",
                            "We could not display this page. Please try again.",
                        )}
                </p>

                {import.meta.env.DEV && error instanceof Error && (
                    <pre className="max-h-40 w-full overflow-auto rounded-lg bg-custom-secondary/40 p-3 text-start text-xs text-custom-secondary dark:bg-[#0B0B0C]">
                        {error.message}
                    </pre>
                )}

                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => window.location.reload()}
                        className="cursor-pointer rounded-xl px-6"
                    >
                        {t("errors.retry", "Try again")}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="cursor-pointer rounded-xl px-6"
                    >
                        {t("errors.backHome", "Back to home")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

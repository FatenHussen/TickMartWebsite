import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function MyReviewsPageHeader() {
    const { t } = useTranslation();

    return (
        <div
            className={cn(
                "relative mb-2 overflow-hidden rounded-2xl",
                "bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-bg-card)_88%,var(--color-api-second))_0%,var(--color-bg-card)_48%,color-mix(in_srgb,var(--color-bg-card)_94%,var(--color-main))_100%)]",
                "p-4 shadow-sm sm:p-5",
            )}
        >
            <div
                className="pointer-events-none absolute -end-10 -top-12 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-2xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -bottom-16 start-1/2 h-28 w-52 -translate-x-1/2 rounded-full bg-[var(--color-main)] opacity-[0.06] blur-3xl sm:start-auto sm:end-8 sm:translate-x-0"
                aria-hidden
            />

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3.5 sm:items-center">
                    <div
                        className={cn(
                            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md",
                            "bg-gradient-to-br from-[var(--color-api-second)] to-[var(--color-api-second-hover)]",
                        )}
                    >
                        <Star className="h-6 w-6 text-white" aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-custom-primary sm:text-2xl">
                            {t("account.myReviews.title")}
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-custom-secondary">
                            {t("account.myReviews.description")}
                        </p>
                    </div>
                </div>

                <p
                    className={cn(
                        "shrink-0 rounded-xl bg-custom-card/75 px-3 py-2 text-xs leading-snug text-custom-tertiary shadow-inner backdrop-blur-sm",
                        "sm:max-w-[220px] sm:text-end",
                    )}
                >
                    {t("account.myReviews.editDeleteNote")}
                </p>
            </div>
        </div>
    );
}

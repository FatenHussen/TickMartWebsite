import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import UnreviewedItemCard from "../../UnreviewedItemCard";
import { mockUnreviewedItems } from "../../../data/mockData";

type MyReviewsUnreviewedSectionProps = {
    isParentLoading: boolean;
    onRateNow: (id: string | number, orderId?: string) => void;
};

export default function MyReviewsUnreviewedSection({
    isParentLoading,
    onRateNow,
}: MyReviewsUnreviewedSectionProps) {
    const { t } = useTranslation();

    if (isParentLoading || mockUnreviewedItems.length === 0) {
        return null;
    }

    return (
        <div
            className={cn(
                "relative mt-8 overflow-hidden rounded-2xl p-6 shadow-md shadow-black/5 dark:shadow-black/25",
                "bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-api-second)_10%,var(--color-bg-card))_0%,var(--color-bg-card)_52%)]",
                "dark:bg-[linear-gradient(120deg,color-mix(in_srgb,var(--color-api-second)_16%,var(--color-bg-card))_0%,var(--color-bg-card)_58%)]",
            )}
        >
            <div
                className="pointer-events-none absolute -end-16 -top-20 h-40 w-40 rounded-full bg-[var(--color-api-second)] opacity-[0.12] blur-3xl"
                aria-hidden
            />
            <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_20%,var(--color-bg-card))] text-[var(--color-api-second)] shadow-md">
                        <Sparkles className="h-5 w-5" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-custom-primary">
                            {t("account.myReviews.unreviewed.title")}
                        </h2>
                        <p className="mt-0.5 text-sm leading-relaxed text-custom-secondary">
                            {t("account.myReviews.unreviewed.description")}
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative rounded-xl bg-custom-card/50 backdrop-blur-sm">
                {mockUnreviewedItems.map((item) => (
                    <UnreviewedItemCard
                        key={item.id}
                        item={item}
                        onRateNow={onRateNow}
                        compact
                    />
                ))}
            </div>
        </div>
    );
}

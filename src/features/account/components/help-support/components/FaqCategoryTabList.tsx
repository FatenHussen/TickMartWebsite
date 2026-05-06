import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import { FAQ_TYPE_TO_LOCALE } from "@/features/account/hooks/useFaqs";
import { HELP_FOCUS_RING } from "../focusRingClasses";

type FaqCategoryTabListProps = {
    categoryIds: string[];
    selectedCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
};

export function FaqCategoryTabList({
    categoryIds,
    selectedCategoryId,
    onSelectCategory,
}: FaqCategoryTabListProps) {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap gap-2.5 mb-6">
            {categoryIds.map((typeId) => {
                const isSelected = selectedCategoryId === typeId;
                const localeKey = FAQ_TYPE_TO_LOCALE[typeId] ?? typeId;
                return (
                    <button
                        key={typeId}
                        type="button"
                        onClick={() => onSelectCategory(typeId)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                            HELP_FOCUS_RING,
                            isSelected
                                ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg shadow-primary/30 dark:from-[var(--color-api-second)] dark:to-[var(--color-api-second-hover)] dark:shadow-[0_10px_32px_-14px_color-mix(in_srgb,var(--color-api-second)_40%,transparent)] dark:ring-1 dark:ring-white/[0.08]"
                                : "bg-custom-tertiary/90 text-custom-primary hover:bg-primary/[0.14] hover:text-primary dark:bg-[rgba(255,255,255,0.04)] dark:text-[#A1A1AA] dark:hover:bg-[color-mix(in_srgb,var(--color-main)_10%,transparent)] dark:hover:text-[#FFFFFF]"
                        )}
                    >
                        {t(localeKey)}
                    </button>
                );
            })}
        </div>
    );
}

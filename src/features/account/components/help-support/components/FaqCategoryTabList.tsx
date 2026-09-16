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
                                ? "bg-cta text-white"
                                : "border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-custom-primary hover:border-[#ff9f00]/50"
                        )}
                    >
                        {t(localeKey)}
                    </button>
                );
            })}
        </div>
    );
}

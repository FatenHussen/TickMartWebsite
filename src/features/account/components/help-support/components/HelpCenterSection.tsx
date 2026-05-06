import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import type { FaqItem } from "@/features/account/api/faqsApi";
import { filterFaqsBySearch } from "../utils/filterFaqsBySearch";
import { FaqAccordionList } from "./FaqAccordionList";
import { FaqCategoryTabList } from "./FaqCategoryTabList";
import { FaqSearchField } from "./FaqSearchField";
import { ContactChannelsGrid } from "./ContactChannelsGrid";
import { HelpSupportSectionCard } from "./HelpSupportSectionCard";
import { HelpSupportSectionHeader } from "./HelpSupportSectionHeader";

type ContactInfo = {
    whatsapp?: string;
    phone?: string;
    email?: string;
};

type HelpCenterSectionProps = {
    selectedCategoryId: string;
    onSelectCategory: (categoryId: string) => void;
    searchQuery: string;
    onSearchQueryChange: (value: string) => void;
    openFaqId: number | null;
    onToggleFaq: (id: number) => void;
    faqTypeIds: string[];
    faqs: FaqItem[];
    faqsLoading: boolean;
    contact: ContactInfo | undefined;
    appColor: { main_color?: string; text_color?: string } | undefined;
};

export function HelpCenterSection({
    selectedCategoryId,
    onSelectCategory,
    searchQuery,
    onSearchQueryChange,
    openFaqId,
    onToggleFaq,
    faqTypeIds,
    faqs,
    faqsLoading,
    contact,
    appColor,
}: HelpCenterSectionProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    const filteredFaqs = filterFaqsBySearch(faqs, searchQuery);
    const hasActiveSearch = Boolean(searchQuery.trim());

    return (
        <HelpSupportSectionCard>
            <HelpSupportSectionHeader
                icon={
                    <CircleHelp
                        className="h-7 w-7 text-primary dark:text-[color-mix(in_srgb,var(--color-main)_65%,#a1a1aa)]"
                        aria-hidden
                    />
                }
                title={t("helpCenter.title")}
                subtitle={t("helpCenter.subtitle")}
            />

            <FaqSearchField
                value={searchQuery}
                onChange={onSearchQueryChange}
                placeholder={t("helpCenter.searchPlaceholder")}
                isRTL={isRTL}
            />

            <FaqCategoryTabList
                categoryIds={faqTypeIds}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={onSelectCategory}
            />

            <FaqAccordionList
                isLoading={faqsLoading}
                faqs={filteredFaqs}
                hasActiveSearch={hasActiveSearch}
                openFaqId={openFaqId}
                onToggleFaq={onToggleFaq}
                emptySearchMessage={t("helpCenter.noSearchResults", "No matching FAQs found.")}
                emptyCategoryMessage={t("helpCenter.noFaqs", "No FAQs available for this category.")}
            />

            <ContactChannelsGrid contact={contact} appColor={appColor} />
        </HelpSupportSectionCard>
    );
}

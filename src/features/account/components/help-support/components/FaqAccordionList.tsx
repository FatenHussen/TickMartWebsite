import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import type { FaqItem } from "@/features/account/api/faqsApi";
import { HELP_FOCUS_RING } from "../focusRingClasses";
import { HelpSupportInlineSpinner } from "./HelpSupportInlineSpinner";

type FaqAccordionListProps = {
    isLoading: boolean;
    faqs: FaqItem[];
    hasActiveSearch: boolean;
    openFaqId: number | null;
    onToggleFaq: (id: number) => void;
    emptySearchMessage: string;
    emptyCategoryMessage: string;
};

export function FaqAccordionList({
    isLoading,
    faqs,
    hasActiveSearch,
    openFaqId,
    onToggleFaq,
    emptySearchMessage,
    emptyCategoryMessage,
}: FaqAccordionListProps) {
    if (isLoading) {
        return (
            <div className="space-y-2 mb-8">
                <HelpSupportInlineSpinner />
            </div>
        );
    }

    if (faqs.length === 0) {
        return (
            <div className="space-y-2 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-custom-light/90 via-blue-off/[0.25] to-[var(--color-api-second)]/[0.06] px-6 py-14 text-center shadow-inner dark:from-custom-card dark:via-custom-card dark:to-[var(--color-api-second)]/[0.05]">
                    <p className="text-sm leading-relaxed text-custom-secondary">
                        {hasActiveSearch ? emptySearchMessage : emptyCategoryMessage}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3 mb-8">
            {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                    <div
                        key={faq.id}
                        className={cn(
                            "group overflow-hidden rounded-2xl transition-all duration-200",
                            isOpen
                                ? "bg-custom-card shadow-xl shadow-[color-mix(in_srgb,var(--color-primary)_14%,transparent)]"
                                : "bg-gradient-to-br from-custom-light/70 to-blue-off/[0.2] shadow-sm hover:shadow-lg hover:shadow-primary/[0.08] dark:from-custom-card/80 dark:to-primary/[0.05]"
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => onToggleFaq(faq.id)}
                            className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors",
                                HELP_FOCUS_RING,
                                isOpen
                                    ? "bg-gradient-to-r from-primary/[0.1] via-primary/[0.05] to-[var(--color-api-second)]/[0.12]"
                                    : "hover:bg-custom-tertiary/75"
                            )}
                        >
                            <span className="font-semibold text-custom-primary leading-snug">{faq.question}</span>
                            {isOpen ? (
                                <HiChevronUp className="w-5 h-5 shrink-0 text-primary" />
                            ) : (
                                <HiChevronDown className="w-5 h-5 shrink-0 text-custom-secondary group-hover:text-primary/80" />
                            )}
                        </button>
                        {isOpen && (
                            <div className="bg-custom-light/60 px-4 py-4 text-custom-secondary text-sm leading-relaxed dark:bg-custom-card/80">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

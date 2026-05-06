import { ChevronDown, ChevronUp } from "lucide-react";
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
                <div className="rounded-2xl bg-gradient-to-br from-custom-light/90 via-blue-off/[0.25] to-[var(--color-api-second)]/[0.06] px-6 py-14 text-center shadow-inner dark:border dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.03)] dark:shadow-none">
                    <p className="text-sm leading-relaxed text-custom-secondary dark:text-[#A1A1AA]">
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
                                ? "bg-custom-card shadow-xl shadow-[color-mix(in_srgb,var(--color-primary)_14%,transparent)] dark:border dark:border-[rgba(255,255,255,0.08)] dark:bg-[rgba(16,17,20,0.85)] dark:shadow-[0_16px_44px_-20px_rgba(0,0,0,0.65),0_0_0_1px_color-mix(in_srgb,var(--color-main)_12%,transparent)]"
                                : "bg-gradient-to-br from-custom-light/70 to-blue-off/[0.2] shadow-sm hover:shadow-lg hover:shadow-primary/[0.08] dark:border dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(255,255,255,0.03)] dark:hover:border-[rgba(255,255,255,0.09)] dark:hover:shadow-[0_12px_36px_-18px_rgba(0,0,0,0.55)]",
                        )}
                    >
                        <button
                            type="button"
                            onClick={() => onToggleFaq(faq.id)}
                            className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors",
                                HELP_FOCUS_RING,
                                isOpen
                                    ? "bg-gradient-to-r from-primary/[0.1] via-primary/[0.05] to-[var(--color-api-second)]/[0.12] dark:bg-[color-mix(in_srgb,var(--color-main)_9%,rgba(255,255,255,0.02))]"
                                    : "hover:bg-custom-tertiary/75 dark:hover:bg-[rgba(255,255,255,0.04)]",
                            )}
                        >
                            <span className="font-semibold text-custom-primary leading-snug">{faq.question}</span>
                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 shrink-0 text-primary dark:text-[color-mix(in_srgb,var(--color-main)_72%,#a1a1aa)]" aria-hidden />
                            ) : (
                                <ChevronDown className="h-5 w-5 shrink-0 text-custom-secondary group-hover:text-primary/80 dark:text-[#71717A] dark:group-hover:text-[color-mix(in_srgb,var(--color-main)_65%,#a1a1aa)]" aria-hidden />
                            )}
                        </button>
                        {isOpen && (
                            <div className="bg-custom-light/60 px-4 py-4 text-sm leading-relaxed text-custom-secondary dark:border-t dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(0,0,0,0.2)] dark:text-[#A1A1AA]">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

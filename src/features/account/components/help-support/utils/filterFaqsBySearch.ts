import type { FaqItem } from "../../../api/faqsApi";

export function filterFaqsBySearch(faqs: FaqItem[], searchQuery: string): FaqItem[] {
    const trimmed = searchQuery.trim();
    if (!trimmed) return faqs;
    const q = trimmed.toLowerCase();
    return faqs.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
}

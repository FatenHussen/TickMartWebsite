import { HowPaymentsWorkIntroRow } from "./HowPaymentsWorkIntroRow";
import { HowPaymentsWorkTimeline } from "./HowPaymentsWorkTimeline";

const PAYMENT_HOW_SECTION_TITLE_ID = "payment-how-title";

interface HowPaymentsWorkPanelProps {
    eyebrow: string;
    title: string;
    intro: string;
    checkoutPath: string;
    checkoutCtaLabel: string;
    timelineSteps: string[];
}

export function HowPaymentsWorkPanel({
    eyebrow,
    title,
    intro,
    checkoutPath,
    checkoutCtaLabel,
    timelineSteps,
}: HowPaymentsWorkPanelProps) {
    return (
        <section
            className="account-shell relative z-0 overflow-hidden rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] shadow-[0_2px_12px_-4px_var(--color-shadow)]"
            aria-labelledby={PAYMENT_HOW_SECTION_TITLE_ID}
        >
            <div className="relative z-10 p-6 sm:p-8">
                <HowPaymentsWorkIntroRow
                    eyebrow={eyebrow}
                    title={title}
                    intro={intro}
                    checkoutPath={checkoutPath}
                    checkoutCtaLabel={checkoutCtaLabel}
                    titleId={PAYMENT_HOW_SECTION_TITLE_ID}
                />
                <HowPaymentsWorkTimeline steps={timelineSteps} />
            </div>
        </section>
    );
}

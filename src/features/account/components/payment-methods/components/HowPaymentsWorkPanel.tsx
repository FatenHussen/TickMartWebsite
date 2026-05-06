import { HowPaymentsWorkBackdrop } from "./HowPaymentsWorkBackdrop";
import { HowPaymentsWorkIntroRow } from "./HowPaymentsWorkIntroRow";
import { HowPaymentsWorkTimeline } from "./HowPaymentsWorkTimeline";

const PAYMENT_HOW_SECTION_TITLE_ID = "payment-how-title";

interface HowPaymentsWorkPanelProps {
    illustrationSrc: string;
    eyebrow: string;
    title: string;
    intro: string;
    checkoutPath: string;
    checkoutCtaLabel: string;
    timelineSteps: string[];
}

export function HowPaymentsWorkPanel({
    illustrationSrc,
    eyebrow,
    title,
    intro,
    checkoutPath,
    checkoutCtaLabel,
    timelineSteps,
}: HowPaymentsWorkPanelProps) {
    return (
        <section
            className="account-shell relative z-0 overflow-hidden rounded-3xl border border-[var(--color-border-primary)] bg-[var(--color-bg-card)] shadow-[0_4px_24px_-8px_var(--color-shadow)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.04)]"
            aria-labelledby={PAYMENT_HOW_SECTION_TITLE_ID}
        >
            <HowPaymentsWorkBackdrop illustrationSrc={illustrationSrc} />

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

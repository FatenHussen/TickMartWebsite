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
            className="relative z-0 overflow-hidden rounded-3xl border border-custom-primary/80 bg-custom-card shadow-[0_24px_60px_-12px_color-mix(in_srgb,var(--color-main)_12%,transparent)]"
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

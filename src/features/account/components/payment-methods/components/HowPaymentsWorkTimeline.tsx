interface HowPaymentsWorkTimelineProps {
    steps: string[];
}

export function HowPaymentsWorkTimeline({ steps }: HowPaymentsWorkTimelineProps) {
    return (
        <div className="relative ms-0">
            <div
                className="absolute start-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-[var(--color-api-second)] via-[var(--color-main)] to-transparent opacity-80 sm:start-[17px]"
                aria-hidden
            />
            <ul className="space-y-5">
                {steps.map((stepText, stepIndex) => (
                    <li
                        key={stepIndex}
                        className="relative flex gap-4 ps-10 sm:ps-11"
                    >
                        <div
                            className="absolute start-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-api-second)] text-xs font-bold text-white shadow-sm ring-2 ring-[var(--color-bg-card)]"
                            aria-hidden
                        >
                            {stepIndex + 1}
                        </div>
                        <p className="pt-1 text-sm leading-relaxed text-text-secondary">
                            {stepText}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

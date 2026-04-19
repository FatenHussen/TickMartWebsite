import { Link } from "react-router-dom";
import { HiOutlineCreditCard } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { API_SECOND_BUTTON_CLASS } from "@/features/account/components/profile/apiPaletteClasses";

interface HowPaymentsWorkIntroRowProps {
    eyebrow: string;
    title: string;
    intro: string;
    checkoutPath: string;
    checkoutCtaLabel: string;
    titleId: string;
}

export function HowPaymentsWorkIntroRow({
    eyebrow,
    title,
    intro,
    checkoutPath,
    checkoutCtaLabel,
    titleId,
}: HowPaymentsWorkIntroRowProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-custom-primary/60 bg-custom-primary/35 px-3 py-1 backdrop-blur-sm">
                    <HiOutlineCreditCard
                        className="h-4 w-4 shrink-0 text-[var(--color-main)]"
                        aria-hidden
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-custom-secondary">
                        {eyebrow}
                    </span>
                </div>
                <h2
                    id={titleId}
                    className="text-xl font-bold tracking-tight text-custom-primary sm:text-2xl"
                >
                    {title}
                </h2>
                <p className="text-sm leading-relaxed text-custom-secondary">
                    {intro}
                </p>
            </div>

            <Link
                to={checkoutPath}
                className={cn(
                    API_SECOND_BUTTON_CLASS,
                    "shrink-0 self-start sm:self-center",
                )}
            >
                {checkoutCtaLabel}
            </Link>
        </div>
    );
}

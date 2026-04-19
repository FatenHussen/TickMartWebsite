import { HOW_PAYMENTS_WORK_SPOTLIGHT_BACKGROUND } from "../constants";

interface HowPaymentsWorkBackdropProps {
    illustrationSrc: string;
}

export function HowPaymentsWorkBackdrop({
    illustrationSrc,
}: HowPaymentsWorkBackdropProps) {
    return (
        <>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.97]"
                style={{
                    background: HOW_PAYMENTS_WORK_SPOTLIGHT_BACKGROUND,
                }}
            />
            <div className="pointer-events-none absolute -right-14 top-1/2 h-52 w-52 -translate-y-1/2 rounded-full bg-[var(--color-main)] opacity-[0.11] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-[var(--color-api-second)] opacity-[0.18] blur-3xl" />

            <div
                className="pointer-events-none absolute -bottom-6 end-0 h-48 w-64 opacity-[0.14] sm:h-56 sm:w-72"
                style={{
                    backgroundImage: `url(${illustrationSrc})`,
                    backgroundSize: "contain",
                    backgroundPosition: "bottom right",
                    backgroundRepeat: "no-repeat",
                }}
            />
        </>
    );
}

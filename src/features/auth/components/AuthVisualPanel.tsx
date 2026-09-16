import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";

const FALLBACK_SRC = "/images/auth/seller.jpg";

type AuthVisualPanelProps = {
    src?: string;
    alt?: string;
    href?: string;
};

export default function AuthVisualPanel({
    src,
    alt = "",
    href,
}: AuthVisualPanelProps) {
    const { t } = useTranslation();
    const [imageSrc, setImageSrc] = useState(
        src && src.trim() && src.trim() !== FALLBACK_SRC ? src.trim() : FALLBACK_SRC,
    );

    const panel = (
        <>
            <img
                src={imageSrc}
                alt={alt}
                onError={() => {
                    if (imageSrc !== FALLBACK_SRC) setImageSrc(FALLBACK_SRC);
                }}
                className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
            />
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5"
                aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                    TickMart
                </p>
                <h2 className="brand-display max-w-md text-4xl font-semibold leading-[1.12] tracking-tight text-white xl:text-[2.75rem]">
                    {t("auth.visualHeadline")}
                </h2>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/80">
                    {t("auth.visualSub")}
                </p>
                <ul className="mt-8 space-y-2.5 text-sm text-white/85">
                    <li className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        {t("auth.orderFromNearby")}
                    </li>
                    <li className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        {t("auth.collectPoints")}
                    </li>
                    <li className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                        {t("auth.manageOrders")}
                    </li>
                </ul>
            </div>
        </>
    );

    return (
        <aside
            className={cn(
                "relative hidden min-h-screen overflow-hidden bg-stone-800 lg:sticky lg:top-0 lg:block lg:h-screen",
            )}
        >
            {href ? (
                <a href={href} target="_blank" rel="noreferrer" className="absolute inset-0">
                    {panel}
                </a>
            ) : (
                panel
            )}
        </aside>
    );
}

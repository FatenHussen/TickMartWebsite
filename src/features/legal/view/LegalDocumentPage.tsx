import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { ExpandableHtmlContent } from "@/shared/ui/ExpandableText";
import { cn } from "@/shared/lib/utils";
import { enhanceLegalDocumentHtml } from "../utils/enhanceLegalDocumentHtml";
import type { LegalDocumentData } from "../types";

export type LegalDocumentVariant = "privacy" | "terms";

type LegalDocumentPageProps = {
    variant: LegalDocumentVariant;
    data: LegalDocumentData | null | undefined;
    isLoading: boolean;
    error: Error | null;
    heroImageSrc: string;
};

/** Diagonal bottom edge: opposite angles for privacy vs terms; mirror in RTL */
function heroClipClass(variant: LegalDocumentVariant, isRTL: boolean): string {
    const privacyLTR = "md:[clip-path:polygon(0_0,100%_0,100%_100%,0_86%)] [clip-path:polygon(0_0,100%_0,100%_100%,0_92%)]";
    const privacyRTL = "md:[clip-path:polygon(0_0,100%_0,100%_86%,0_100%)] [clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]";
    const termsLTR = "md:[clip-path:polygon(0_0,100%_0,100%_86%,0_100%)] [clip-path:polygon(0_0,100%_0,100%_92%,0_100%)]";
    const termsRTL = "md:[clip-path:polygon(0_0,100%_0,100%_100%,0_86%)] [clip-path:polygon(0_0,100%_0,100%_100%,0_92%)]";

    if (variant === "privacy") {
        return isRTL ? privacyRTL : privacyLTR;
    }
    return isRTL ? termsRTL : termsLTR;
}

export default function LegalDocumentPage({
    variant,
    data,
    isLoading,
    error,
    heroImageSrc,
}: LegalDocumentPageProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();

    const formattedContent = useMemo(
        () => (data?.content ? enhanceLegalDocumentHtml(data.content) : ""),
        [data]
    );

    if (isLoading) {
        return (
            <div
                className="min-h-[60vh] flex items-center justify-center"
                dir={isRTL ? "rtl" : "ltr"}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="page-container py-16 text-center" dir={isRTL ? "rtl" : "ltr"}>
                <p className="text-custom-secondary">
                    {error ? error.message : "Content not available."}
                </p>
            </div>
        );
    }

    const clip = heroClipClass(variant, isRTL);

    return (
        <div dir={isRTL ? "rtl" : "ltr"}>
            <section
                className={cn(
                    "relative w-full overflow-hidden",
                    "bg-gradient-to-r from-[#00A8C5] via-[#00a0b8] to-[#0a6b82]",
                    "dark:from-[#0088a0] dark:via-[#007a8f] dark:to-[#0a4d5c]",
                    clip
                )}
            >
                <div className="page-container pt-12 pb-28 md:pt-16 md:pb-36">
                    <div
                        className={cn(
                            "flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-12",
                            isRTL && "md:flex-row-reverse"
                        )}
                    >
                        <div className="flex-1 min-w-0 text-white md:pb-2">
                            <h1 className="text-3xl md:text-[2.5rem] font-bold tracking-tight text-white mb-3">
                                {data.title}
                            </h1>
                            <p className="text-base md:text-lg font-normal text-white/95 leading-normal">
                                {t("legal.heroSubtitle")}
                            </p>
                        </div>

                        <div
                            className={cn(
                                "flex-1 flex justify-center shrink-0",
                                isRTL ? "md:justify-start" : "md:justify-end"
                            )}
                        >
                            <div className="relative flex items-end justify-center w-full max-w-[min(100%,380px)] min-h-[200px] md:min-h-[260px]">
                                {/* <div
                                    className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[108%] max-w-[340px] aspect-[1.85/1] -translate-x-1/2 rounded-[50%] bg-white shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
                                    aria-hidden
                                /> */}
                                <img
                                    src={heroImageSrc}
                                    alt=""
                                    className="relative z-10 max-h-[220px] sm:max-h-[260px] md:max-h-[300px] w-auto object-contain object-bottom drop-shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="relative bg-white dark:bg-custom-card">
                {variant === "privacy" && (
                    <div
                        className={cn(
                            "pointer-events-none absolute top-24 md:top-32 w-[min(55vw,420px)] h-[min(70vh,520px)] opacity-[0.08] dark:opacity-[0.06]",
                            isRTL ? "left-0" : "right-0"
                        )}
                        aria-hidden
                    >
                        <svg
                            viewBox="0 0 400 500"
                            className="h-full w-full text-[#77beff]"
                            fill="currentColor"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <path d="M280 40 L360 120 L240 200 L340 320 L180 420 L220 500 L40 380 L120 260 L200 180 L120 80 Z" />
                        </svg>
                    </div>
                )}

                <div
                    className={cn(
                        "page-container relative z-10",
                        "py-10 md:py-14 pb-16 md:pb-20"
                    )}
                >
                    {variant === "privacy" ? (
                        <ExpandableHtmlContent
                            html={formattedContent}
                            lines={4}
                            animate
                            contentClassName={cn(
                                "prose prose-gray max-w-none text-[#444444] dark:prose-invert",
                                "leading-[1.65] text-base md:text-[1.0625rem]",
                                "[&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline",
                                "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[#2a2a2a] [&_h1]:mt-10 [&_h1]:mb-4",
                                "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#2a2a2a] [&_h2]:mt-8 [&_h2]:mb-3",
                                "[&_p:not(.legal-doc-sentence)]:mb-4 [&_p.legal-doc-sentence]:mt-0 [&_li]:my-1"
                            )}
                        />
                    ) : (
                        <ExpandableHtmlContent
                            html={formattedContent}
                            lines={4}
                            animate
                            contentClassName="legal-document-terms-body max-w-none text-base md:text-[1.0625rem]"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

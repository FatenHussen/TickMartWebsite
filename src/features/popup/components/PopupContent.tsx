import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { contentItemVariants } from "../animations/variants";
import { localize } from "../utils/localize";
import type { Language, PopupCampaign, PopupTheme } from "../types";

type Props = {
    popup: PopupCampaign;
    lang: Language;
    theme: PopupTheme;
    isFullScreen?: boolean;
};

export function PopupContent({ popup, lang, theme, isFullScreen }: Props) {
    const title = localize(popup.content?.headline, lang);
    const subtitle = localize(popup.content?.subheadline, lang);
    const description = localize(popup.content?.description, lang);
    const campaignLabel = localize(popup.title, lang);
    const badgeLabel = lang === "ar" ? "عرض خاص" : "Special offer";

    return (
        <>
            {/* Badge */}
            <motion.div
                variants={contentItemVariants}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-3 w-fit backdrop-blur-md text-xs font-semibold tracking-wide shadow-sm"
                style={{
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: `1px solid color-mix(in srgb, ${theme.secondary} 55%, white)`,
                    color: `color-mix(in srgb, ${theme.secondary} 85%, white)`,
                    boxShadow: `0 2px 12px color-mix(in srgb, ${theme.secondary} 30%, transparent)`,
                }}
            >
                <HiSparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {badgeLabel}
            </motion.div>

            {/* Campaign label */}
            {campaignLabel && (
                <motion.span
                    variants={contentItemVariants}
                    className="block text-[11px] uppercase tracking-widest opacity-70 mb-1.5"
                    style={{ color: theme.text }}
                >
                    {campaignLabel}
                </motion.span>
            )}

            {/* Headline — gradient ink for a premium feel */}
            {title && (
                <motion.h2
                    variants={contentItemVariants}
                    className="text-3xl md:text-4xl font-extrabold leading-tight mb-1.5 drop-shadow-sm"
                    style={{
                        color: theme.text,
                        backgroundImage: `linear-gradient(120deg, ${theme.text}, color-mix(in srgb, ${theme.secondary} 60%, ${theme.text}))`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {title}
                </motion.h2>
            )}

            {/* Subheadline */}
            {subtitle && (
                <motion.h3
                    variants={contentItemVariants}
                    className="text-base md:text-lg opacity-85 mb-2"
                    style={{ color: theme.text }}
                >
                    {subtitle}
                </motion.h3>
            )}

            {/* Description */}
            {description && (
                <motion.p
                    variants={contentItemVariants}
                    className="text-sm leading-relaxed opacity-80 mb-5 max-w-sm"
                    style={{ color: theme.text }}
                >
                    {description}
                </motion.p>
            )}

            {/* Debug meta — full_screen only, hidden in production via opacity */}
            {isFullScreen && import.meta.env.DEV && (
                <motion.div
                    variants={contentItemVariants}
                    className="flex flex-wrap gap-1.5 mb-4"
                >
                    {[
                        `type: ${popup.type}`,
                        `trigger: ${popup.trigger?.type ?? "delay"}`,
                        `every: ${popup.frequency?.show_every ?? "∞"}d`,
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 border border-white/15"
                            style={{ color: theme.text }}
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>
            )}
        </>
    );
}

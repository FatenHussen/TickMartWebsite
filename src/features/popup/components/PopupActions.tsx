import { motion } from "framer-motion";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";
import { contentItemVariants } from "../animations/variants";
import type { PopupCampaign, PopupTheme } from "../types";

type Props = {
    popup: PopupCampaign;
    theme: PopupTheme;
    onPrimaryClick: () => void;
    onClose: () => void;
};

export function PopupActions({ popup, theme, onPrimaryClick, onClose }: Props) {
    const primaryLabel = popup.buttons?.primary;
    const secondaryLabel = popup.buttons?.secondary;
    const url = popup.buttons?.url?.trim();
    const hasPrimary = Boolean(primaryLabel && url);

    if (!hasPrimary && !secondaryLabel) return null;

    return (
        <motion.div
            variants={contentItemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-1"
        >
            {hasPrimary && (
                <button
                    type="button"
                    onClick={onPrimaryClick}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-3 text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
                    style={{
                        backgroundImage: `linear-gradient(135deg, ${theme.secondary}, color-mix(in srgb, ${theme.secondary} 70%, ${theme.main}))`,
                        color: "#0f172a",
                        boxShadow: `0 10px 30px color-mix(in srgb, ${theme.secondary} 45%, transparent)`,
                    }}
                >
                    {/* Sheen sweep on hover */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <HiArrowTopRightOnSquare className="w-4 h-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
                    {primaryLabel}
                </button>
            )}

            {secondaryLabel && (
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/15 active:scale-[0.98]"
                    style={{
                        color: theme.text,
                        border: `1px solid color-mix(in srgb, ${theme.main} 30%, white)`,
                        backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                >
                    {secondaryLabel}
                </button>
            )}
        </motion.div>
    );
}

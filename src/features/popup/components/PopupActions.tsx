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
            className="flex flex-col sm:flex-row items-center gap-3 mt-1"
        >
            {hasPrimary && (
                <button
                    type="button"
                    onClick={onPrimaryClick}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] border-0"
                    style={{
                        backgroundColor: theme.secondary,
                        color: "#0f172a",
                        boxShadow: `0 8px 24px color-mix(in srgb, ${theme.secondary} 40%, transparent)`,
                    }}
                >
                    <HiArrowTopRightOnSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                    {primaryLabel}
                </button>
            )}

            {secondaryLabel && (
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/15 active:scale-[0.98]"
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

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { contentContainerVariants } from "../animations/variants";
import { usePopupTheme } from "../hooks/usePopupTheme";
import { usePopupContext } from "../providers/PopupProvider";
import { localize } from "../utils/localize";
import { PopupTracker } from "../tracking/popupTracking";
import { PopupShell } from "./PopupShell";
import { PopupMedia } from "./PopupMedia";
import { PopupContent } from "./PopupContent";
import { PopupActions } from "./PopupActions";
import { PopupForm } from "../forms/PopupForm";
import type { PopupCampaign as PopupCampaignType, PopupCloseReason } from "../types";

type Props = {
    popup: PopupCampaignType | null;
    isOpen: boolean;
};

export default function PopupCampaign({ popup, isOpen }: Props) {
    const { language } = useLanguage();
    const { close, trackClick, trackPayload } = usePopupContext();
    const theme = usePopupTheme(popup);

    if (!popup) return null;

    const type = (popup.type || "modal") as string;
    const isFullScreen =
        type.replace(/[-\s]+/g, "_").toLowerCase() === "full_screen" ||
        type.toLowerCase() === "fullscreen";
    const hasMedia = Boolean(
        popup.media?.path &&
        (popup.media.type === "image" || popup.media.type === "gif" || popup.media.type === "video")
    );
    const hasForm = Boolean(popup.form?.enabled && popup.form.fields?.length);
    const title = localize(popup.content?.headline, language);

    const handleClose = (reason: PopupCloseReason) => {
        if (reason === "secondary_cta") {
            // secondary CTA is a soft dismiss, not tracked as primary click
        }
        close(reason);
    };

    const handlePrimaryClick = () => {
        const url = popup.buttons?.url?.trim();
        if (!url) return;
        trackClick();
        PopupTracker.trackClick(popup.id, trackPayload);
        window.open(url, "_blank", "noopener,noreferrer");
        close("primary_cta");
    };

    const handleFormSuccess = () => {
        setTimeout(() => close("form_submit"), 1800);
    };

    // ─── Background gradient ──────────────────────────────────────────────────

    const gradient = isFullScreen
        ? `radial-gradient(circle at 72% 18%, color-mix(in srgb, ${theme.secondary} 35%, transparent), transparent 42%),
           radial-gradient(circle at 20% 82%, color-mix(in srgb, ${theme.main} 42%, transparent), transparent 46%),
           linear-gradient(128deg, color-mix(in srgb, ${theme.main} 82%, #020617), color-mix(in srgb, ${theme.secondary} 76%, #0f172a))`
        : `linear-gradient(135deg, color-mix(in srgb, ${theme.main} 80%, #111827), color-mix(in srgb, ${theme.secondary} 68%, #0f172a))`;

    return (
        <PopupShell isOpen={isOpen} popupType={type} onClose={handleClose}>
            {/* Decorative blobs */}
            <div
                className="absolute -top-16 -left-10 w-52 h-52 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"
                style={{ backgroundColor: `color-mix(in srgb, ${theme.secondary} 65%, white)` }}
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-20 -right-8 w-60 h-60 rounded-full blur-3xl opacity-35 animate-pulse pointer-events-none"
                style={{ backgroundColor: `color-mix(in srgb, ${theme.main} 75%, white)` }}
                aria-hidden="true"
            />

            {/* Main surface */}
            <div
                className="relative"
                style={{ background: gradient }}
                aria-labelledby={`popup-title-${popup.id}`}
            >
                {/* Subtle noise overlay for depth */}
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/15 pointer-events-none" aria-hidden="true" />

                <div
                    className={`relative grid ${
                        hasMedia
                            ? isFullScreen
                                ? "lg:grid-cols-12 min-h-[70vh]"
                                : "md:grid-cols-2"
                            : ""
                    }`}
                >
                    {/* Media panel */}
                    {hasMedia && (
                        <PopupMedia
                            media={popup.media!}
                            lang={language}
                            title={title}
                            isFullScreen={isFullScreen}
                        />
                    )}

                    {/* Content panel */}
                    <motion.div
                        variants={contentContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex flex-col justify-center p-6 md:p-8 ${
                            isFullScreen
                                ? "lg:col-span-5 lg:m-5 lg:rounded-2xl lg:border lg:border-white/18 lg:bg-black/22 lg:backdrop-blur-md"
                                : ""
                        }`}
                    >
                        {/* Headline / description */}
                        <PopupContent
                            popup={popup}
                            lang={language}
                            theme={theme}
                            isFullScreen={isFullScreen}
                        />

                        {/* Dynamic form — rendered instead of CTA buttons when enabled */}
                        {hasForm ? (
                            <PopupForm
                                popup={popup}
                                lang={language}
                                textColor={theme.text}
                                accentColor={theme.secondary}
                                trackPayload={trackPayload}
                                onSubmitSuccess={handleFormSuccess}
                            />
                        ) : (
                            <PopupActions
                                popup={popup}
                                theme={theme}
                                onPrimaryClick={handlePrimaryClick}
                                onClose={() => handleClose("secondary_cta")}
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </PopupShell>
    );
}

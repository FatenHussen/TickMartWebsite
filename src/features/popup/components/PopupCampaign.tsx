import { useMemo } from "react";
import { HiSparkles, HiGift, HiArrowTopRightOnSquare } from "react-icons/hi2";
import { useLanguage } from "@/context/LanguageContext";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { usePopupCampaign } from "../hooks/usePopupCampaign";
import type { LocalizedString } from "../types";

function getLocalizedText(
  text: LocalizedString | string | null | undefined,
  language: "ar" | "en"
): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[language] || text.en || text.ar || "";
}

function extractColorFromSource(
  source: unknown,
  keys: string[]
): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const sourceRecord = source as Record<string, unknown>;

  for (const key of keys) {
    const value = sourceRecord[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function normalizePopupType(type: string | undefined): "modal" | "slide_in" | "full_screen" {
  const normalized = (type || "modal").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "slide_in" || normalized === "slidein") return "slide_in";
  if (normalized === "full_screen" || normalized === "fullscreen") return "full_screen";
  return "modal";
}

export default function PopupCampaign() {
  const { language } = useLanguage();
  const { popup, isOpen, close, trackClick } = usePopupCampaign();

  const title = useMemo(
    () => getLocalizedText(popup?.content?.headline, language),
    [popup?.content?.headline, language]
  );
  const subtitle = useMemo(
    () => getLocalizedText(popup?.content?.subheadline, language),
    [popup?.content?.subheadline, language]
  );
  const description = useMemo(
    () => getLocalizedText(popup?.content?.description, language),
    [popup?.content?.description, language]
  );
  const campaignTitle = useMemo(
    () => getLocalizedText(popup?.title, language),
    [popup?.title, language]
  );

  if (!popup) return null;

  const colorSources: unknown[] = [
    popup.colors,
    popup.theme,
    (popup as Record<string, unknown>).style,
    (popup as Record<string, unknown>).design,
    popup,
  ];

  const pickColor = (keys: string[]) =>
    colorSources
      .map((source) => extractColorFromSource(source, keys))
      .find(Boolean);

  const mainColor =
    pickColor(["main", "primary", "main_color", "primary_color"]) || "#0ea5e9";
  const secondaryColor =
    pickColor(["secondary", "secondary_color", "accent", "accent_color"]) ||
    "#f59e0b";
  const textColor =
    pickColor(["text", "text_color", "foreground", "font_color"]) || "#ffffff";

  const popupUrl = popup.buttons?.url?.trim() || "";
  const hasPrimaryAction = Boolean(popup.buttons?.primary && popupUrl);
  const popupType = normalizePopupType(popup.type);
  const isSlideIn = popupType === "slide_in";
  const isFullScreen = popupType === "full_screen";
  const popupShellClass = isFullScreen
    ? "!max-w-[96vw] h-[92vh] mx-0 !bg-transparent shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    : isSlideIn
      ? "popup-slide-in-from-bottom"
      : "";
  const popupContentClass = isFullScreen
    ? "p-0 overflow-hidden rounded-2xl h-full"
    : "p-0 overflow-hidden rounded-2xl";

  const onPrimaryClick = () => {
    if (!popupUrl) return;
    trackClick();
    window.open(popupUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={close}
      maxWidth={isFullScreen ? "2xl" : "lg"}
      className={popupShellClass}
      contentClassName={popupContentClass}
    >
      <div
        className={`relative ${isFullScreen ? "h-full" : ""}`}
        style={{
          background: isFullScreen
            ? `radial-gradient(circle at 75% 20%, color-mix(in srgb, ${secondaryColor} 35%, transparent), transparent 40%), radial-gradient(circle at 20% 85%, color-mix(in srgb, ${mainColor} 40%, transparent), transparent 45%), linear-gradient(130deg, color-mix(in srgb, ${mainColor} 84%, #020617), color-mix(in srgb, ${secondaryColor} 78%, #0f172a))`
            : `linear-gradient(135deg, color-mix(in srgb, ${mainColor} 82%, #111827), color-mix(in srgb, ${secondaryColor} 70%, #0f172a))`,
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
        <div
          className="absolute -top-12 -left-8 w-48 h-48 rounded-full blur-3xl opacity-45 animate-pulse"
          style={{
            backgroundColor: `color-mix(in srgb, ${secondaryColor} 70%, white)`,
          }}
        />
        <div
          className="absolute -bottom-16 -right-5 w-56 h-56 rounded-full blur-3xl opacity-40 animate-pulse"
          style={{
            backgroundColor: `color-mix(in srgb, ${mainColor} 80%, white)`,
          }}
        />

        <div
          className={`relative grid ${
            isFullScreen
              ? "h-full lg:grid-cols-12 min-h-[70vh]"
              : "md:grid-cols-2"
          }`}
        >
          <div
            className={`relative ${
              isFullScreen ? "h-72 lg:h-full lg:col-span-7" : "h-64 md:h-full"
            }`}
          >
            {popup.media?.type === "image" && popup.media.path && (
              <img
                src={popup.media.path}
                alt={title || popup.slug}
                className="w-full h-full object-cover"
              />
            )}

            {popup.media?.type === "video" && popup.media.path && (
              <video
                src={popup.media.path}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
              />
            )}

            <div className="absolute inset-0 bg-black/30" />
            <div
              className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.22)",
                color: textColor,
                border: `1px solid color-mix(in srgb, ${secondaryColor} 50%, white)`,
              }}
            >
              <HiGift className="w-4 h-4" />
              <span>Limited Offer</span>
            </div>
          </div>

          <div
            className={`flex flex-col justify-center p-6 md:p-8 ${
              isFullScreen
                ? "lg:col-span-5 lg:m-6 lg:rounded-2xl lg:border lg:border-white/20 lg:bg-black/25 lg:backdrop-blur-md"
                : ""
            }`}
            style={{ color: textColor }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full backdrop-blur-md px-3 py-1 mb-3 w-fit"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                border: `1px solid color-mix(in srgb, ${secondaryColor} 60%, white)`,
              }}
            >
              <HiSparkles
                className="w-4 h-4"
                style={{ color: `color-mix(in srgb, ${secondaryColor} 75%, white)` }}
              />
              <span className="text-xs font-medium tracking-wide">
                Special offer for you
              </span>
            </div>

            {campaignTitle && (
              <span className="text-xs uppercase tracking-widest opacity-80 mb-2">
                {campaignTitle}
              </span>
            )}

            {title && (
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-2">
                {title}
              </h2>
            )}

            {subtitle && (
              <h3 className="text-lg opacity-90 mb-2">
                {subtitle}
              </h3>
            )}

            {description && (
              <p className="text-sm opacity-90 mb-6 max-w-xl">
                {description}
              </p>
            )}

            {isFullScreen && (
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20">
                  Type: {popupType}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20">
                  Trigger: {popup.trigger?.type || "delay"}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20">
                  Every {popup.frequency?.show_every ?? "-"} min
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start items-center">
              {hasPrimaryAction && (
                <Button
                  type="button"
                  onClick={onPrimaryClick}
                  className="hover:scale-105 transition-transform font-semibold border-0"
                  style={{
                    backgroundColor: secondaryColor,
                    color: "#0f172a",
                    boxShadow: `0 10px 24px color-mix(in srgb, ${secondaryColor} 45%, transparent)`,
                  }}
                >
                  <HiArrowTopRightOnSquare className="w-4 h-4" />
                  {popup.buttons?.primary}
                </Button>
              )}

              {popup.buttons?.secondary && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={close}
                  className="hover:bg-white/10"
                  style={{
                    color: textColor,
                    border: `1px solid color-mix(in srgb, ${mainColor} 35%, white)`,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {popup.buttons.secondary}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </BasePopup>
  );
}
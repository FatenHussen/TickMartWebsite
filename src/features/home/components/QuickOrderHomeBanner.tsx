import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Zap, PenLine, BadgeDollarSign, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useQuickOrderSettings } from "@/features/account/hooks/useQuickOrderSettings";
import { paths } from "@/app/routes/path/paths";
import { cn } from "@/shared/lib/utils";
import { isLightHex } from "@/shared/lib/colorUtils";
import { DARK_ELEVATED, DARK_SECTION } from "@/shared/lib/themeColors";

const FALLBACK_STEPS = [
    { key: "stepWrite", hintKey: "stepWriteHint", Icon: PenLine },
    { key: "stepPrice", hintKey: "stepPriceHint", Icon: BadgeDollarSign },
    { key: "stepDeliver", hintKey: "stepDeliverHint", Icon: Truck },
] as const;

const STEP_ICONS = [PenLine, BadgeDollarSign, Truck] as const;

type QuickOrderHomeBannerProps = {
    /** Current page builder / static slug (`home`, CMS slug, `categories`, …). */
    pageSlug?: string;
};

export default function QuickOrderHomeBanner({
    pageSlug = "home",
}: QuickOrderHomeBannerProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";
    const { quickOrder } = useQuickOrderSettings();
    const Arrow = isRTL ? ArrowLeft : ArrowRight;

    // Visibility: `is_enabled` + current slug in `page_slugs` (default `home`).
    // Do not gate on settings `isLoading` — defaults already allow home, and a
    // stuck loader would permanently hide the section.
    if (!quickOrder.isVisibleOnPage(pageSlug)) return null;

    const badge = quickOrder.badge || t("customOrder.homeBanner.kicker");
    const title = quickOrder.title || t("customOrder.homeBanner.headline");
    const subtitle = quickOrder.subtitle || t("customOrder.homeBanner.hint");
    const cta = quickOrder.cta || t("customOrder.homeBanner.cta");

    const apiSteps = quickOrder.steps;
    const useApiSteps = apiSteps.length > 0;
    const cardVariant = quickOrder.cardVariant;
    const isVerticalCards = cardVariant === "vertical";
    const isSquareCards = cardVariant === "square";

    const bandStyle: CSSProperties = {};
    const apiFillIsLight = isLightHex(quickOrder.backgroundColor);
    if (quickOrder.backgroundImage) {
        bandStyle.backgroundImage = isDarkTheme
            ? `linear-gradient(120deg, rgba(28,25,22,0.88), rgba(36,32,28,0.82)), url(${quickOrder.backgroundImage})`
            : `linear-gradient(120deg, rgba(255,247,240,0.92), rgba(255,232,214,0.88)), url(${quickOrder.backgroundImage})`;
        bandStyle.backgroundSize = "cover";
        bandStyle.backgroundPosition = "center";
    } else if (quickOrder.backgroundColor && !(isDarkTheme && apiFillIsLight)) {
        bandStyle.background = quickOrder.backgroundColor;
    } else if (isDarkTheme) {
        bandStyle.background = `linear-gradient(165deg, ${DARK_ELEVATED} 0%, ${DARK_SECTION} 100%)`;
    }

    const cardStyle: CSSProperties | undefined =
        quickOrder.cardBackgroundColor && !(isDarkTheme && isLightHex(quickOrder.cardBackgroundColor))
            ? { backgroundColor: quickOrder.cardBackgroundColor }
            : undefined;

    const usesCssFallback =
        !quickOrder.backgroundImage &&
        (!quickOrder.backgroundColor || (isDarkTheme && apiFillIsLight));

    return (
        <section
            className="quick-order-home relative mb-4 overflow-hidden rounded-[1.75rem] sm:mb-6"
            dir={isRTL ? "rtl" : "ltr"}
            aria-labelledby="quick-order-home-title"
        >
            <div
                className={cn(
                    "relative isolate overflow-hidden px-5 py-6 sm:px-8 sm:py-8",
                    usesCssFallback &&
                        "border border-stone-200/80 bg-[#FFFcf8] dark:border-white/10 dark:bg-[#24201C]",
                )}
                style={Object.keys(bandStyle).length ? bandStyle : undefined}
            >
                <div
                    className="pointer-events-none absolute -top-20 end-[-3rem] h-56 w-56 rounded-full opacity-15 blur-3xl dark:opacity-20"
                    style={{ background: "var(--color-primary)" }}
                    aria-hidden
                />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                    <div className="min-w-0 max-w-2xl">
                        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[11px] font-bold text-[var(--color-warning-dark,#b45309)] shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-amber-200">
                            <Zap className="h-3.5 w-3.5 fill-current" aria-hidden />
                            {badge}
                        </p>
                        <h2
                            id="quick-order-home-title"
                            className="brand-display text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-stone-900 sm:text-4xl dark:text-white"
                        >
                            {title}
                        </h2>
                        <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-stone-700 sm:text-base dark:text-[#E8E4DC]/85">
                            {subtitle}
                        </p>

                        <ol
                            className={cn(
                                "mt-5 grid gap-2.5 sm:gap-3",
                                isVerticalCards
                                    ? "grid-cols-1 sm:grid-cols-3"
                                    : isSquareCards
                                      ? "grid-cols-2 sm:grid-cols-3"
                                      : "grid-cols-1 sm:grid-cols-3",
                            )}
                        >
                            {useApiSteps
                                ? apiSteps.map((step, index) => {
                                      const Icon = STEP_ICONS[index % STEP_ICONS.length];
                                      return (
                                          <li
                                              key={`${step.title}-${index}`}
                                              className={cn(
                                                  "flex gap-3 rounded-2xl border border-stone-200/80 px-3.5 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none",
                                                  !cardStyle && "bg-white",
                                                  isVerticalCards && "flex-col items-start",
                                                  isSquareCards && "aspect-square flex-col items-center justify-center text-center",
                                                  !isVerticalCards && !isSquareCards && "items-center",
                                              )}
                                              style={cardStyle}
                                          >
                                              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-800 ring-1 ring-stone-200/80 dark:bg-white/10 dark:text-white dark:ring-white/10">
                                                  <Icon className="h-5 w-5" aria-hidden />
                                                  <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[10px] font-semibold text-white">
                                                      {index + 1}
                                                  </span>
                                              </span>
                                              <span className="min-w-0">
                                                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                                                      {step.title}
                                                  </span>
                                                  {step.subtitle ? (
                                                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-white/55">
                                                          {step.subtitle}
                                                      </span>
                                                  ) : null}
                                              </span>
                                          </li>
                                      );
                                  })
                                : FALLBACK_STEPS.map(({ key, hintKey, Icon }, index) => (
                                      <li
                                          key={key}
                                          className={cn(
                                              "flex items-center gap-3 rounded-2xl border border-stone-200/80 px-3.5 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.07] dark:shadow-none",
                                              !cardStyle && "bg-white",
                                          )}
                                          style={cardStyle}
                                      >
                                          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-800 ring-1 ring-stone-200/80 dark:bg-white/10 dark:text-white dark:ring-white/10">
                                              <Icon className="h-5 w-5" aria-hidden />
                                              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[10px] font-semibold text-white">
                                                  {index + 1}
                                              </span>
                                          </span>
                                          <span className="min-w-0">
                                              <span className="block text-sm font-bold text-slate-900 dark:text-white">
                                                  {t(`customOrder.homeBanner.${key}`)}
                                              </span>
                                              <span className="mt-0.5 block text-xs text-slate-500 dark:text-white/55">
                                                  {t(`customOrder.homeBanner.${hintKey}`)}
                                              </span>
                                          </span>
                                      </li>
                                  ))}
                        </ol>
                    </div>

                    <Link
                        to={paths.client.customOrderCreate}
                        className="cta-honey group inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2 self-start rounded-full px-7 py-3.5 text-base font-semibold shadow-none transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Zap className="h-5 w-5 fill-current transition-transform duration-200 group-hover:scale-110" />
                        {cta}
                        <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

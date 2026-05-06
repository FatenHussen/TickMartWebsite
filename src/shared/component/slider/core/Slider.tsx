import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { type ReactNode } from "react";
import Button from "@/shared/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/shared/lib/utils";

type SliderProps = {
    title?: string;
    /** When set (light UI), section title uses a clipped gradient instead of plain theme text. */
    titleMainColor?: string | null;
    titleSecondColor?: string | null;
    flashSaleEndDate?: string | null;
    flashSaleMainColor?: string | null;
    flashSaleSecondColor?: string | null;
    viewAllLabel?: string;
    onViewAll?: () => void;
    /** Merged onto the “View all” control (e.g. `dark:text-white` for dark rows). */
    viewAllButtonClassName?: string;
    children: ReactNode[];
    slidesPerView?: number | "auto";
    spaceBetween?: number;
    breakpoints?: {
        [width: number]: {
            slidesPerView: number | "auto";
            spaceBetween?: number;
        };
    };
    className?: string;
    slideClassName?: string;
    sectionBackgroundColor?: string | null;
    /**
     * When `sectionBackgroundColor` is set, the tint always spans the full viewport
     * (breakout from `.page-container`); title + swiper stay in `.page-container`.
     * When true without a section color, wraps content in `.page-container` only.
     */
    edgeToEdgeSectionBackground?: boolean;
    removeVerticalSpacing?: boolean;
};

export default function Slider({
    title,
    titleMainColor,
    titleSecondColor,
    viewAllLabel,
    onViewAll,
    viewAllButtonClassName,
    children,
    slidesPerView = 2.2,
    spaceBetween = 16,
    breakpoints,
    className = "",
    slideClassName = "",
    sectionBackgroundColor,
    edgeToEdgeSectionBackground = false,
    removeVerticalSpacing = false,
}: SliderProps) {
    const { theme } = useTheme();
    const isDarkTheme = theme === "dark";

    const defaultBreakpoints = breakpoints || {
        640: { slidesPerView: 2.5 },
        768: { slidesPerView: 3.5 },
        1024: { slidesPerView: 4.5 },
    };

    const titleGradientMain = titleMainColor?.trim() || titleSecondColor?.trim();
    const titleGradientSecond = titleSecondColor?.trim() || titleMainColor?.trim();
    /** Dark: always solid API `text_color` from settings (`--color-text`), not brand gradient. */
    const useTitleGradient =
        Boolean(title && titleGradientMain && titleGradientSecond) && !isDarkTheme;

    const header =
        (title || viewAllLabel) && (
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {title &&
                        (useTitleGradient ? (
                            <h2
                                className="text-2xl font-bold tracking-tight bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: `linear-gradient(105deg, ${titleGradientMain}, ${titleGradientSecond})`,
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                }}
                            >
                                {title}
                            </h2>
                        ) : (
                            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-[color:var(--color-text,var(--color-text-primary))]">
                                {title}
                            </h2>
                        ))}
                </div>
                {viewAllLabel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onViewAll}
                        className={cn(
                            "group h-auto rounded-full border border-primary/20 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary hover:text-white hover:shadow-md dark:border-white/15 dark:bg-white/5 dark:text-[color:var(--color-text,var(--color-text-primary))] dark:hover:border-primary/40 dark:hover:bg-primary dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                            viewAllButtonClassName,
                        )}
                    >
                        <span>{viewAllLabel}</span>
                        <span
                            aria-hidden="true"
                            className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/12 text-xs leading-none transition-all duration-200 group-hover:bg-white/20 group-hover:translate-x-0.5 dark:bg-white/12"
                        >
                            <svg
                                viewBox="0 0 20 20"
                                fill="none"
                                className="h-3.5 w-3.5"
                            >
                                <path
                                    d="M7 5L12 10L7 15"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </Button>
                )}
            </div>
        );

    const swiper = (
        <Swiper
            modules={[FreeMode]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            breakpoints={defaultBreakpoints}
            freeMode={true}
            className="shared-swiper"
        >
            {children.map((child, index) => (
                <SwiperSlide key={index} className={slideClassName}>
                    {child}
                </SwiperSlide>
            ))}
        </Swiper>
    );

    const inner = (
        <>
            {header}
            {swiper}
        </>
    );

    /** Full-viewport tint while keeping title + swiper aligned to `.page-container`. */
    if (sectionBackgroundColor) {
        return (
            <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full min-w-0 ${className}`}>
                <div
                    className="relative w-screen max-w-[100vw] py-4 sm:py-5 [margin-inline-start:calc(50%-50vw)]"
                    style={{ backgroundColor: sectionBackgroundColor }}
                >
                    <div className="page-container">{inner}</div>
                </div>
            </div>
        );
    }

    if (edgeToEdgeSectionBackground) {
        return (
            <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full ${className}`}>
                <div className="page-container">{inner}</div>
            </div>
        );
    }

    return (
        <div className={`${removeVerticalSpacing ? "mt-0" : "mt-8"} w-full ${className}`}>
            {inner}
        </div>
    );
}

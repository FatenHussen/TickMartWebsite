import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { ReactNode } from "react";
import Button from "@/shared/ui/Button";

type SliderProps = {
    title?: string;
    viewAllLabel?: string;
    onViewAll?: () => void;
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
     * When true (e.g. home / brands API rows outside page-container), the section
     * background spans the viewport; title and swiper stay in page-container.
     */
    edgeToEdgeSectionBackground?: boolean;
};

export default function Slider({
    title,
    viewAllLabel,
    onViewAll,
    children,
    slidesPerView = 2.2,
    spaceBetween = 16,
    breakpoints,
    className = "",
    slideClassName = "",
    sectionBackgroundColor,
    edgeToEdgeSectionBackground = false,
}: SliderProps) {
    const defaultBreakpoints = breakpoints || {
        640: { slidesPerView: 2.5 },
        768: { slidesPerView: 3.5 },
        1024: { slidesPerView: 4.5 },
    };

    const header =
        (title || viewAllLabel) && (
            <div className="mb-6 flex items-center justify-between">
                {title && (
                    <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-custom-primary">
                        {title}
                    </h2>
                )}
                {viewAllLabel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onViewAll}
                        className="h-auto p-0 text-sm font-semibold text-primary hover:underline"
                    >
                        {viewAllLabel}
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

    if (edgeToEdgeSectionBackground) {
        return (
            <div className={`mt-8 w-full ${className}`}>
                {sectionBackgroundColor ? (
                    <div
                        className="w-full py-4"
                        style={{ backgroundColor: sectionBackgroundColor }}
                    >
                        <div className="page-container">{inner}</div>
                    </div>
                ) : (
                    <div className="page-container">{inner}</div>
                )}
            </div>
        );
    }

    return (
        <div
            className={`mt-8 w-full ${className}`}
            style={
                sectionBackgroundColor
                    ? { backgroundColor: sectionBackgroundColor }
                    : undefined
            }
        >
            {inner}
        </div>
    );
}

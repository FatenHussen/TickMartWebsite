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
};

export default function Slider({
  title,
  viewAllLabel,
  onViewAll,
  children,
  slidesPerView = "auto",
  spaceBetween = 16,
  breakpoints,
  className = "",
  slideClassName = "",
}: SliderProps) {
  const defaultBreakpoints = breakpoints || {
    640: {
      slidesPerView: 2.5,
    },
    768: {
      slidesPerView: 3.5,
    },
    1024: {
      slidesPerView: 4.5,
    },
  };

  return (
    <div className={`mt-8 ${className}`}>
      {/* Header */}
      {(title || viewAllLabel) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-custom-primary">{title}</h2>
          )}
          {viewAllLabel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-primary font-semibold hover:underline text-sm p-0 h-auto"
            >
              {viewAllLabel}
            </Button>
          )}
        </div>
      )}

      {/* Slider */}
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
    </div>
  );
}

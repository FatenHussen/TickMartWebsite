import type { ReactNode, ReactElement } from"react";
import { isValidElement, cloneElement } from"react";
import Slider from"./Slider";

type SliderSectionProps<T extends { id: number | string }> = {
  title?: string;
  flashSaleEndDate?: string | null;
  flashSaleMainColor?: string | null;
  flashSaleSecondColor?: string | null;
  viewAllLabel?: string;
  onViewAllClick?: () => void;
  items: T[];
  renderItem: (item: T) => ReactNode;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number | "auto";
      spaceBetween?: number;
    };
  };
  className?: string;
  slideClassName?: string;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  sectionBackgroundColor?: string | null;
  edgeToEdgeSectionBackground?: boolean;
  removeVerticalSpacing?: boolean;
};

const defaultBreakpoints = {
 640: {
 slidesPerView: 2.5 as const,
 },
 768: {
 slidesPerView: 3.5 as const,
 },
 1024: {
 slidesPerView: 4.5 as const,
 },
};

export default function SliderSection<T extends { id: number | string }>({
  title,
  flashSaleEndDate,
  flashSaleMainColor,
  flashSaleSecondColor,
  viewAllLabel,
  onViewAllClick,
  items,
  renderItem,
  breakpoints = defaultBreakpoints,
  className,
  slideClassName,
  slidesPerView,
  spaceBetween,
  sectionBackgroundColor,
  edgeToEdgeSectionBackground,
  removeVerticalSpacing = false,
}: SliderSectionProps<T>) {
 const children = items.map((item) => {
 const rendered = renderItem(item);
 // Ensure each rendered item has a stable key using item.id
 if (isValidElement(rendered)) {
 // Clone element with key - this ensures React uses item.id as the key
 // This overwrites any existing key, ensuring we always use item.id
 return cloneElement(rendered as ReactElement, { key: item.id });
 }
 // For non-element nodes (strings, numbers, etc.), return as-is
 // React will use the array index as key in this case
 return rendered;
 });

  return (
    <Slider
      title={title}
      flashSaleEndDate={flashSaleEndDate}
      flashSaleMainColor={flashSaleMainColor}
      flashSaleSecondColor={flashSaleSecondColor}
      viewAllLabel={viewAllLabel}
      onViewAll={onViewAllClick}
      breakpoints={breakpoints}
      className={className}
      slideClassName={slideClassName}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      sectionBackgroundColor={sectionBackgroundColor}
      edgeToEdgeSectionBackground={edgeToEdgeSectionBackground}
      removeVerticalSpacing={removeVerticalSpacing}
    >
      {children}
    </Slider>
  );
}


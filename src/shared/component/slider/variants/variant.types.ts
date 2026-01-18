export type SliderVariantProps = {
  title?: string;
  viewAllLabel?: string;
  payload?: unknown;
  ui?: {
    limit?: number;
    breakpoints?: Record<number, { slidesPerView: number }>;
  };
};


export type SectionBase = {
 id: string;
 type:"slider"|"grid"|"hero"|"custom";
};

export type SliderUiConfig = {
 limit?: number;
 breakpoints?: Record<number, { slidesPerView: number }>;
};

export type SliderSectionConfig = SectionBase & {
 type:"slider";
 variant: string;
 titleKey?: string;
 viewAllKey?: string;
 payload?: unknown;
 ui?: SliderUiConfig;
};

export type AppSection = SliderSectionConfig;


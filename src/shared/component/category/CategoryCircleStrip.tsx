import SliderSection from "@/shared/component/SliderSection";
import { PremiumSkeletonBlock } from "@/shared/component/loading";
import { cn } from "@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from "@/features/categories/lib/categoriesApiDarkSurface";
import CategoryCircle, {
    CATEGORY_CIRCLE_ITEM_WIDTH,
    type CategoryCircleSize,
} from "./CategoryCircle";

export type CategoryCircleStripItem = {
    id: number;
    name: string;
    icon?: string | null;
    mainColor?: string | null;
    secondColor?: string | null;
    hasChildren?: boolean;
};

type StripItem = CategoryCircleStripItem & { skeleton?: boolean };

/** Circular skeleton dimensions, mirroring each `CategoryCircle` size. */
const SKELETON_CIRCLE: Record<CategoryCircleSize, string> = {
    lg: "h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32",
    md: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24",
    sm: "h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20",
};

export type CategoryCircleStripProps = {
    items: CategoryCircleStripItem[];
    size?: CategoryCircleSize;
    selectedId?: number | null;
    onSelect: (id: number) => void;
    title?: string;
    titleMainColor?: string | null;
    titleSecondColor?: string | null;
    viewAllLabel?: string;
    onViewAllClick?: () => void;
    isLoading?: boolean;
    skeletonCount?: number;
    apiSurface?: CategoriesApiDarkSurface | null;
    className?: string;
};

/** Horizontal strip of circular categories — one level of the category tree. */
export default function CategoryCircleStrip({
    items,
    size = "lg",
    selectedId,
    onSelect,
    title,
    titleMainColor,
    titleSecondColor,
    viewAllLabel,
    onViewAllClick,
    isLoading = false,
    skeletonCount = 7,
    apiSurface,
    className,
}: CategoryCircleStripProps) {
    // Negative ids keep the keys `SliderSection` clones off `item.id` unique.
    const data: StripItem[] = isLoading
        ? Array.from({ length: skeletonCount }, (_, i) => ({
              id: -1 - i,
              name: "",
              skeleton: true,
          }))
        : items;

    if (data.length === 0) return null;

    /**
     * Every item gets a fixed width and the slider runs on `slidesPerView: "auto"`.
     * One item then sits naturally at the start instead of being stretched across
     * an empty row, and the arrows only light up once the row actually overflows.
     */
    const renderCircle = (item: StripItem) => (
        <div className={cn("shrink-0", CATEGORY_CIRCLE_ITEM_WIDTH[size])}>
            {item.skeleton ? (
                <div
                    className={cn(
                        "flex w-full flex-col items-center",
                        size === "lg" ? "gap-3" : "gap-2.5",
                    )}
                >
                    <PremiumSkeletonBlock rounded="rounded-full" className={SKELETON_CIRCLE[size]} />
                    <PremiumSkeletonBlock rounded="rounded-md" className="h-3 w-14" />
                </div>
            ) : (
                <CategoryCircle
                    name={item.name}
                    icon={item.icon}
                    mainColor={item.mainColor}
                    secondColor={item.secondColor}
                    size={size}
                    selected={selectedId === item.id}
                    hasChildren={item.hasChildren}
                    apiSurface={apiSurface}
                    onClick={() => onSelect(item.id)}
                />
            )}
        </div>
    );

    return (
        <div className={cn("w-full min-w-0", className)}>
            <SliderSection
                title={title}
                titleMainColor={titleMainColor}
                titleSecondColor={titleSecondColor}
                viewAllLabel={viewAllLabel}
                onViewAllClick={onViewAllClick}
                items={data}
                removeVerticalSpacing
                showNavigation
                slidesPerView="auto"
                spaceBetween={20}
                slideClassName="slide-auto-width"
                // Overrides SliderSection's numeric defaults, which would stretch slides.
                breakpoints={{ 0: { slidesPerView: "auto", spaceBetween: 16 }, 640: { slidesPerView: "auto", spaceBetween: 20 } }}
                renderItem={renderCircle}
            />
        </div>
    );
}

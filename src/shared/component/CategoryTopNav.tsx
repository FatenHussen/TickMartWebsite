import { cn } from"@/shared/lib/utils";
import type { CategoriesApiDarkSurface } from"@/features/categories/lib/categoriesApiDarkSurface";

export type CategoryNavItem = {
 id: number;
 name: string;
 selected?: boolean;
};

type CategoryTopNavProps = {
 categories: CategoryNavItem[];
 onFilterClick?: () => void;
onCategoryClick?: (categoryId: number) => void;
 apiSurface?: CategoriesApiDarkSurface | null;
};

export default function CategoryTopNav({
 categories,
onCategoryClick,
 apiSurface,
}: CategoryTopNavProps) {
 return (
 <div className="flex items-center rtl:flex-row-reverse">
 <div className="flex items-center gap-2 flex-wrap">
{categories.map((category) => (
<button
 key={category.id}
type="button"
onClick={() => onCategoryClick?.(category.id)}
 className={cn(
"rounded-full px-4 py-2 text-sm font-medium transition-colors",
 !apiSurface &&
 (category.selected
 ? "bg-primary-light text-white"
 :"bg-custom-card text-primary-light border border-primary-light"),
 )}
 style={
 apiSurface
 ? {
 backgroundColor: category.selected
 ? apiSurface.main
 : apiSurface.cardBackground,
 color: category.selected ? "#fafafa" : apiSurface.mutedColor,
 border: category.selected ? "none" : `1px solid ${apiSurface.cardBorder}`,
 }
 : undefined
 }
 >
 {category.name}
</button>
 ))}
 </div>
 {/* <Button
 variant="ghost"
 size="sm"
 onClick={onFilterClick}
 className="w-10 h-10! rounded-full! bg-custom-card! border! border-custom-secondary! hover:bg-custom-light! p-0!"
 aria-label="Filter"
 title="Filter"
 >
 <HiFilter className="w-5 h-5 text-custom-primary"/>
 </Button> */}
 </div>
 );
}

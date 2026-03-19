import type { CategoryChild } from"../types";

type SubcategoryTabsProps = {
 subcategories: CategoryChild[];
 selectedSubcategoryId: number | undefined;
 onSubcategorySelect: (subcategory: CategoryChild) => void;
};

export default function SubcategoryTabs({
 subcategories,
 selectedSubcategoryId,
 onSubcategorySelect,
}: SubcategoryTabsProps) {
 if (subcategories.length === 0) return null;

 return (
 <div className="flex flex-wrap gap-2 mb-4">
 {subcategories.map((subcategory) => {
 const isSelected = selectedSubcategoryId === subcategory.id;
 return (
 <button
 key={subcategory.id}
 onClick={() => onSubcategorySelect(subcategory)}
 className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border ${
 isSelected
 ?"bg-primary-light text-white border-primary-light"
 :"bg-custom-card text-custom-primary border-custom-primary hover:border-custom-secondary hover:bg-custom-light"
 }`}
 >
 {subcategory.name}
 </button>
 );
 })}
 </div>
 );
}

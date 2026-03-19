import { useTranslation } from"react-i18next";
import type { Subcategory } from"../types";

type SubcategoriesSidebarProps = {
 subcategories: Subcategory[];
 selectedSubcategoryId?: number;
 onSubcategorySelect?: (subcategory: Subcategory) => void;
 title?: string;
};

export default function SubcategoriesSidebar({
 subcategories,
 selectedSubcategoryId,
 onSubcategorySelect,
 title,
}: SubcategoriesSidebarProps) {
 const { t } = useTranslation();

 return (
 <div className="bg-custom-primary rounded-2xl p-6 shadow-sm border border-custom-primary">
 <h2 className="text-xl font-bold text-custom-primary mb-6">
 {title || t("categories.subcategories")}
 </h2>
 <div className="space-y-2">
 {subcategories.map((subcategory) => (
 <button
 key={subcategory.id}
 onClick={() => onSubcategorySelect?.(subcategory)}
 className={`w-full flex flex-col items-start gap-2 p-4 rounded-xl transition-all text-left ${
 selectedSubcategoryId === subcategory.id
 ?"bg-custom-active text-custom-accent"
 :"hover:bg-custom-hover text-custom-secondary"
 }`}
 >
 <span className="font-medium text-sm">{subcategory.name}</span>
 <p className="text-xs text-custom-tertiary">
 {subcategory.description}
 </p>
 </button>
 ))}
 </div>
 </div>
 );
}

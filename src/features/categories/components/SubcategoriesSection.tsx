import { useTranslation } from"react-i18next";
import type { Subcategory } from"../types";

type SubcategoriesSectionProps = {
 subcategories: Subcategory[];
 onBrowseProducts?: (subcategoryId: number) => void;
};

export default function SubcategoriesSection({
 subcategories,
 onBrowseProducts,
}: SubcategoriesSectionProps) {
 const { t } = useTranslation();

 if (subcategories.length === 0) return null;

 return (
 <section>
 <h2 className="text-lg sm:text-xl font-bold text-custom-primary mb-5">
 {t("categories.subcategories")}
 </h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
 {subcategories.map((subcategory) => (
 <div
 key={subcategory.id}
 className="rounded-2xl bg-custom-secondary border border-custom-primary p-6 shadow-sm hover:shadow-md transition-shadow"
 >
 <h3 className="text-base font-semibold text-custom-primary">
 {subcategory.name}
 </h3>
 <p className="text-sm text-custom-secondary mt-1">
 {subcategory.description}
 </p>

 <div className="mt-4">
 <p className="text-[11px] font-semibold text-custom-tertiary tracking-wide">
 {t("categories.includes")}:
 </p>

 <div className="flex flex-wrap gap-2 mt-2">
 {subcategory.tags.slice(0, 3).map((tag, index) => (
 <span
 key={index}
 className="px-3 py-1 rounded-full text-xs font-medium bg-custom-secondary text-custom-primary"
 >
 {tag}
 </span>
 ))}

 {subcategory.tags.length > 3 && (
 <span className="px-3 py-1 rounded-full text-xs font-medium bg-custom-accent-light text-custom-accent">
 +{subcategory.tags.length - 3} more
 </span>
 )}
 </div>
 </div>

 <button
 onClick={() => onBrowseProducts?.(subcategory.id)}
 className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-custom-accent hover:text-custom-accent-hover"
 >
 {t("categories.browseProducts")}{""}
 <span aria-hidden className="rtl:rotate-180">
 →
 </span>
 </button>
 </div>
 ))}
 </div>
 </section>
 );
}

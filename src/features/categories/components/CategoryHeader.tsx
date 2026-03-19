import { useTranslation } from"react-i18next";
import Button from"@/shared/ui/Button";
import type { Category } from"../types";

type CategoryHeaderProps = {
 category: Category;
 onViewAllProducts?: () => void;
 onViewAllStores?: () => void;
};

export default function CategoryHeader({
 category,
 onViewAllProducts,
 onViewAllStores,
}: CategoryHeaderProps) {
 const { t } = useTranslation();

 return (
 <div className="rounded-2xl bg-custom-light border border-custom-primary p-6 sm:p-7">
 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
 <div className="flex items-start gap-4">
 <div
 className={`w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center text-2xl`}
 >
 {category.icon}
 </div>

 <div>
 <h1 className="text-xl sm:text-2xl font-bold text-custom-primary">
 {category.name}
 </h1>
 <p className="text-custom-secondary mt-1">{category.description}</p>
 </div>
 </div>

 <div className="flex flex-wrap gap-3">
 <Button variant="primary"onClick={onViewAllProducts}>
 🛒 {t("categories.viewAllProducts")}
 </Button>

 <Button variant="outline"onClick={onViewAllStores}>
 🏪 {t("categories.viewAllStores")}
 </Button>
 </div>
 </div>
 </div>
 );
}

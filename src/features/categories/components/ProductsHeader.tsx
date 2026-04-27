import { useTranslation } from"react-i18next";

type ProductsHeaderProps = {
 categoryName: string;
 subcategoryName?: string;
 sortBy?: string;
 onSortChange?: (sort: string) => void;
 freeDeliveryOnly?: boolean;
 onFreeDeliveryToggle?: (checked: boolean) => void;
 inStockOnly?: boolean;
 onInStockToggle?: (checked: boolean) => void;
};

export default function ProductsHeader({
 categoryName,
 subcategoryName,
 sortBy ="recommended",
 onSortChange,
 freeDeliveryOnly = false,
 onFreeDeliveryToggle,
 inStockOnly = false,
 onInStockToggle,
}: ProductsHeaderProps) {
 const { t } = useTranslation();
 const displayName = subcategoryName || categoryName;

 const sortOptions = [
 { value:"recommended", label: t("categories.sortRecommended","Recommended") },
 { value:"priceLow", label: t("categories.sortPriceLow","Price: Low to High") },
 { value:"priceHigh", label: t("categories.sortPriceHigh","Price: High to Low") },
 { value:"rating", label: t("categories.sortRating","Rating") },
 { value:"newest", label: t("categories.sortNewest","Newest") },
 ];

 return (
 <div className="mb-6 rounded-2xl border border-primary-light/15 bg-gradient-to-r from-custom-card via-custom-card to-blue-50/50 p-4 shadow-sm">
 <div className="flex flex-wrap items-center justify-between gap-4">
 <p className="text-sm text-custom-secondary">
 {t("categories.showingProductsIn","Showing products in")}{" "}
 <span className="font-bold text-primary-light">{displayName}</span>
 </p>

 <div className="flex flex-wrap items-center gap-2 sm:gap-3">
 <label className="inline-flex items-center gap-2 rounded-full border border-primary-light/20 bg-white/80 px-3 py-1.5 text-sm text-custom-secondary shadow-sm transition hover:border-primary-light/40">
 <input
 type="checkbox"
 checked={freeDeliveryOnly}
 onChange={(e) => onFreeDeliveryToggle?.(e.target.checked)}
 className="h-4 w-4 rounded border-custom-secondary accent-primary-light"
 />
 <span>{t("product.filters.freeDeliveryOnly","Free delivery")}</span>
 </label>

 <label className="inline-flex items-center gap-2 rounded-full border border-primary-light/20 bg-white/80 px-3 py-1.5 text-sm text-custom-secondary shadow-sm transition hover:border-primary-light/40">
 <input
 type="checkbox"
 checked={inStockOnly}
 onChange={(e) => onInStockToggle?.(e.target.checked)}
 className="h-4 w-4 rounded border-custom-secondary accent-primary-light"
 />
 <span>{t("product.filters.inStockOnly","In stock")}</span>
 </label>

 <div className="relative">
 <select
 value={sortBy}
 onChange={(e) => onSortChange?.(e.target.value)}
 className="appearance-none rounded-full border border-primary-light/25 bg-white px-4 py-2 pr-9 text-sm font-semibold text-custom-primary shadow-sm transition hover:border-primary-light/45 focus:outline-none focus:ring-2 focus:ring-primary-light/30"
 >
 {sortOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-custom-secondary">
 <svg className="h-4 w-4"fill="none"stroke="currentColor"viewBox="0 0 24 24">
 <path strokeLinecap="round"strokeLinejoin="round"strokeWidth={2} d="M19 9l-7 7-7-7"/>
 </svg>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

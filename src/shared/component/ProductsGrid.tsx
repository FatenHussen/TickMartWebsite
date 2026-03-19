import { useState, useMemo } from"react";
import { useTranslation } from"react-i18next";
import ProductCard from"@/shared/component/card/ProductCard";
import Button from"@/shared/ui/Button";
import type { Product } from"@/features/categories/types";

type SortOption =
 |"mostOrdered"
 |"priceLow"
 |"priceHigh"
 |"rating"
 |"newest";

type ProductsGridProps = {
 products: Product[];
 onProductClick?: (productId: number) => void;
 onLoadMore?: () => void;
 hasMore?: boolean;
 displayCount?: number; // Number of products to display
 showHeader?: boolean; // Show/hide the header with title and sort
 className?: string;
};

export default function ProductsGrid({
 products,
 onProductClick,
 onLoadMore,
 hasMore = false,
 displayCount,
 showHeader = true,
 className,
}: ProductsGridProps) {
 const { t } = useTranslation();
 const [sortBy, setSortBy] = useState<SortOption>("mostOrdered");

 const sortOptions: { value: SortOption; label: string }[] = [
 { value:"mostOrdered", label: t("categories.sortMostOrdered") },
 { value:"priceLow", label: t("categories.sortPriceLow") },
 { value:"priceHigh", label: t("categories.sortPriceHigh") },
 { value:"rating", label: t("categories.sortRating") },
 { value:"newest", label: t("categories.sortNewest") },
 ];

 // Limit products based on displayCount
 const displayedProducts = useMemo(() => {
 if (displayCount && displayCount > 0) {
 return products.slice(0, displayCount);
 }
 return products;
 }, [products, displayCount]);

 if (products.length === 0) return null;

 return (
 <section className={className}>
 {showHeader && (
 <div className="flex items-center justify-between mb-5">
 <h2 className="text-lg sm:text-xl font-bold text-custom-primary">
 {t("categories.productsIn")}
 </h2>
 <div className="flex items-center gap-2">
 <label className="text-sm text-custom-secondary">
 {t("categories.sortBy")}:
 </label>
 <select
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value as SortOption)}
 className="px-3 py-2 rounded-lg border border-custom-primary bg-custom-primary text-custom-primary text-sm focus:outline-none focus:ring-2 focus:ring-custom-accent"
 >
 {sortOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </div>
 </div>
 )}

 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
 {displayedProducts.map((product) => (
 <ProductCard
 key={product.id}
 {...product}
 category={product.category}
 onClick={onProductClick}
 t={t}
 />
 ))}
 </div>

 {hasMore && (
 <div className="flex justify-center">
 <Button variant="outline"onClick={onLoadMore}>
 {t("categories.loadMoreProducts")}
 </Button>
 </div>
 )}
 </section>
 );
}

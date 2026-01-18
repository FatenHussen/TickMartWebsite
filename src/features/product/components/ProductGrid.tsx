import ProductCard from "@/shared/component/card/ProductCard";
import type { ProductCardProps } from "@/shared/component/card/ProductCard";

type ProductGridProps = {
  products: Omit<ProductCardProps, "onClick" | "onToggleFavorite" | "t">[];
  onProductClick?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  columns?: 2 | 3 | 4 | 5;
};

export default function ProductGrid({
  products,
  onProductClick,
  onToggleFavorite,
  columns = 5,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onClick={onProductClick}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}


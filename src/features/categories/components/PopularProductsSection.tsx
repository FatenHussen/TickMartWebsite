import { useTranslation } from "react-i18next";
import type { Category, Product } from "../types";

type PopularProductsSectionProps = {
  products: Product[];
  category: Category;
  onProductClick?: (productId: number) => void;
};

function CategoryProductCard({
  product,
  onClick,
  t,
}: {
  product: Product;
  onClick?: (id: number) => void;
  t: (key: string) => string;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(product.id)}
      className="text-left rounded-2xl overflow-hidden bg-custom-primary border border-custom-primary shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] w-full bg-custom-secondary overflow-hidden">
        <img
          src={(product as any).image || (product as any).imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <p className="font-semibold text-custom-primary leading-snug">
          {product.name}
        </p>

        <p className="text-xs text-custom-tertiary mt-1">
          {t("categories.from")}{" "}
          {(product as any).storeName ||
            (product as any).vendorName ||
            product.store ||
            "—"}
        </p>

        <span className="inline-flex mt-3 text-sm font-semibold text-custom-accent hover:text-custom-accent-hover">
          {t("categories.viewProduct")}{" "}
          <span aria-hidden className="rtl:rotate-180">
            →
          </span>
        </span>
      </div>
    </button>
  );
}

export default function PopularProductsSection({
  products,
  category,
  onProductClick,
}: PopularProductsSectionProps) {
  const { t } = useTranslation();

  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg sm:text-xl font-bold text-custom-primary mb-5">
        {t("categories.popularIn")} {category.name}
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <CategoryProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            t={t}
          />
        ))}
      </div>
    </section>
  );
}

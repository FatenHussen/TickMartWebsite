import SliderSection from "../core/SliderSection";
import ProductCard from "@/shared/component/card/ProductCard";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import type { SliderVariantProps } from "./variant.types";

type Product = {
  id: number | string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
  badge?: { label: string; className?: string };
  category?: string;
  sold?: number;
  savings?: string;
  deliveryInfo?: string;
  isFavorite?: boolean;
};

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Premium Coffee Beans",
    price: "$32.99",
    originalPrice: "$50.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    badge: { label: "New", className: "bg-blue-500 text-white" },
    category: "Drinks",
    sold: 1238,
    savings: "$30 You saved $180",
    deliveryInfo: "Free Delivery",
    isFavorite: true,
  },
];

export default function SoldWithThisProductVariant({
  title,
  viewAllLabel,
  payload,
  ui,
}: SliderVariantProps) {
  const items: Product[] =
    (payload as { items?: Product[] })?.items || defaultProducts;
  const limitedItems =
    ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;
  const totalPrice =
    (payload as { totalPrice?: string })?.totalPrice || "$35";

  const handleAddAllToCart =
    (payload as { onAddAllToCart?: () => void })?.onAddAllToCart ||
    (() => console.log("Add all to cart:", limitedItems.map((p) => p.id)));

  return (
    <div>
      <SliderSection
        title={title}
        viewAllLabel={viewAllLabel}
        items={limitedItems}
        breakpoints={
          ui?.breakpoints || {
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 2 },
          }
        }
        renderItem={(product) => (
          <ProductCard
            key={product.id}
            id={product.id as number}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            image={product.image}
            badge={product.badge}
            category={product.category}
            sold={product.sold}
            savings={product.savings}
            deliveryInfo={product.deliveryInfo}
            isFavorite={product.isFavorite}
            onToggleFavorite={(id) => console.log("toggle fav", id)}
            onClick={(id) => console.log("open product", id)}
          />
        )}
      />

      <div className="mt-6 flex justify-center">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleAddAllToCart}
          className={cn(
            "rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 px-8 py-3 font-semibold text-white hover:from-sky-500 hover:to-sky-700"
          )}
        >
          {totalPrice} {viewAllLabel ?? ""}
        </Button>
      </div>
    </div>
  );
}


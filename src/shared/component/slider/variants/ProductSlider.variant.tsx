import SliderSection from "../core/SliderSection";
import ProductCard from "@/shared/component/card/ProductCard";
import type { SliderVariantProps } from "./variant.types";

type Product = {
  id: number | string;
  name: string;
  store: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
  badge?: {
    label: string;
    color: string;
  };
  orders?: number;
};

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Organic Vegetable Mix",
    store: "Fresh Market",
    price: "$12.99",
    originalPrice: "$17.99",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    badge: { label: "-25%", color: "bg-red-500" },
  },
  {
    id: 2,
    name: "Margherita Pizza",
    store: "Bella's Kitchen",
    price: "$18.50",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    badge: { label: "popular", color: "bg-yellow-500" },
  },
  {
    id: 3,
    name: "Vitamin C Tablets",
    store: "HealthPlus",
    price: "$24.99",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
  },
];

export default function ProductSliderVariant({
  title,
  viewAllLabel,
  payload,
  ui,
}: SliderVariantProps) {
  const items: Product[] =
    (payload as { items?: Product[] })?.items || defaultProducts;
  const limitedItems =
    ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;

  return (
    <SliderSection
      title={title}
      viewAllLabel={viewAllLabel}
      items={limitedItems}
      breakpoints={
        ui?.breakpoints || {
          640: { slidesPerView: 4 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 4 },
        }
      }
      renderItem={(p) => (
        <ProductCard
          key={p.id}
          id={Number(p.id)}
          name={p.name}
          store={p.store}
          price={p.price}
          originalPrice={p.originalPrice}
          rating={p.rating}
          image={p.image}
          badge={p.badge ? { label: p.badge.label, className: p.badge.color } : undefined}
          sold={p.orders}
          deliveryInfo={viewAllLabel ? undefined : undefined}
          onToggleFavorite={(id) => console.log("toggle fav", id)}
          onClick={(id) => console.log("open product", id)}
        />
      )}
    />
  );
}


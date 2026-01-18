import SliderSection from "../core/SliderSection";
import BestSellersCard from "@/shared/component/card/BestSellersCard";
import type { SliderVariantProps } from "./variant.types";

type SellerProduct = {
  id: number | string;
  name: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
  category?: string;
  badges?: Array<{ label: string; className?: string }>;
  topRightBadge?: { label: string; className?: string };
  sold?: number;
  savings?: string;
  buttonText?: string;
  buttonTextSecond?: string;
};

const defaultProducts: SellerProduct[] = [
  {
    id: 1,
    name: "Whistle, Wide Leg Cropped Jeans, Denim",
    price: "$26",
    originalPrice: "$30",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    category: "Clothes",
    badges: [
      { label: "new", className: "bg-green-500" },
      { label: "recommended", className: "bg-green-500" },
    ],
    topRightBadge: { label: "mostOrdered", className: "bg-yellow-400" },
    sold: 1238,
    savings: "You saved $180",
    buttonText: "Special Offer Today",
    buttonTextSecond: "Order Now",
  },
];

export default function ProductsFromSameSellerVariant({
  title,
  viewAllLabel,
  payload,
  ui,
}: SliderVariantProps) {
  const items: SellerProduct[] =
    (payload as { items?: SellerProduct[] })?.items || defaultProducts;
  const limitedItems =
    ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;

  return (
    <SliderSection
      title={title}
      viewAllLabel={viewAllLabel}
      items={limitedItems}
      breakpoints={
        ui?.breakpoints || {
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 4 },
        }
      }
      renderItem={(product) => (
        <BestSellersCard
          key={product.id}
          id={product.id as number}
          name={product.name}
          price={product.price}
          originalPrice={product.originalPrice}
          rating={product.rating}
          image={product.image}
          category={product.category}
          badges={product.badges}
          topRightBadge={product.topRightBadge}
          sold={product.sold}
          savings={product.savings}
          buttonText={product.buttonText}
          buttonTextSecond={product.buttonTextSecond}
          onToggleFavorite={(id) => console.log("toggle fav", id)}
          onClick={(id) => console.log("open product", id)}
        />
      )}
    />
  );
}


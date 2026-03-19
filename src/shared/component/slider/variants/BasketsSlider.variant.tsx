import SliderSection from"../core/SliderSection";
import BasketCard from"@/shared/component/card/BasketCard";
import type { SliderVariantProps } from"./variant.types";

type Basket = {
 id: number | string;
 name: string;
 description: string;
 price: string;
 originalPrice?: string;
 rating: number;
 image: string;
 saveAmount?: string;
 savings?: string;
 offerEndingDate?: string;
};

const defaultBaskets: Basket[] = [
 {
 id: 1,
 name:"Breakfast Essentials",
 description:"12 items • Fresh & Organic",
 price:"$45.99",
 originalPrice:"$57.99",
 rating: 4.8,
 image:"https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
 saveAmount:"Save $12",
 savings:"You saved $180",
 offerEndingDate:"Offer ending date: 11/1/2022",
 },
 {
 id: 2,
 name:"Breakfast Essentials",
 description:"12 items • Fresh & Organic",
 price:"$45.99",
 originalPrice:"$57.99",
 rating: 4.8,
 image:"https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600",
 saveAmount:"Save $12",
 savings:"You saved $180",
 offerEndingDate:"Offer ending date: 11/1/2022",
 },
];

export default function BasketsSliderVariant({
 title,
 viewAllLabel,
 payload,
 ui,
}: SliderVariantProps) {
 const items: Basket[] =
 (payload as { items?: Basket[] })?.items || defaultBaskets;
 const limitedItems =
 ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;

 return (
 <SliderSection
 title={title}
 viewAllLabel={viewAllLabel}
 items={limitedItems}
 breakpoints={
 ui?.breakpoints || {
 640: { slidesPerView: 1.2 },
 768: { slidesPerView: 2.2 },
 1024: { slidesPerView: 3 },
 }
 }
 renderItem={(basket) => (
 <BasketCard
 key={basket.id}
 id={basket.id as number}
 name={basket.name}
 description={basket.description}
 price={basket.price}
 originalPrice={basket.originalPrice}
 rating={basket.rating}
 image={basket.image}
 saveAmount={basket.saveAmount}
 savings={basket.savings}
 offerEndingDate={basket.offerEndingDate}
 onToggleFavorite={(id) => console.log("toggle fav", id)}
 onAddToCart={(id) => console.log("add to cart", id)}
 onClick={(id) => console.log("open basket", id)}
 />
 )}
 />
 );
}


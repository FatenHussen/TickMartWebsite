import SliderSection from"../core/SliderSection";
import StoreCard from"@/shared/component/StoreCard";
import type { SliderVariantProps } from"./variant.types";

type Store = {
 id: number | string;
 name: string;
 type: string;
 location: string;
 rating: number;
 image: string;
 status:"open"|"closed";
 deliveryFee: string;
 services: string[];
 logoText?: string;
};

const defaultStores: Store[] = [
 {
 id: 1,
 name:"Fresh Market",
 type:"Supermarket",
 location:"Downtown",
 rating: 4.8,
 image:"https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=900",
 status:"open",
 deliveryFee:"Free delivery",
 services: ["Delivery","Subscriptions"],
 logoText:"Grocerystore",
 },
 {
 id: 2,
 name:"Bella's Kitchen",
 type:"Italian Restaurant",
 location:"Midtown",
 rating: 4.6,
 image:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900",
 status:"open",
 deliveryFee:"$2.99 delivery",
 services: ["Delivery","Dine-in"],
 logoText:"Bella",
 },
];

export default function NearbyStoresSliderVariant({
 title,
 viewAllLabel,
 payload,
 ui,
}: SliderVariantProps) {
 const items: Store[] =
 (payload as { items?: Store[] })?.items || defaultStores;
 const limitedItems =
 ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;

 return (
 <SliderSection
 title={title}
 viewAllLabel={viewAllLabel}
 items={limitedItems}
 slidesPerView={1.2}
 breakpoints={
 ui?.breakpoints || {
 640: { slidesPerView: 1.2 },
 768: { slidesPerView: 2.2 },
 1024: { slidesPerView: 3 },
 }
 }
 renderItem={(store) => (
 <StoreCard
 key={store.id}
 name={store.name}
 type={store.type}
 location={store.location}
 rating={store.rating}
 image={store.image}
 status={store.status}
 statusLabel="Open"
 deliveryFee={store.deliveryFee}
 services={store.services}
 onClick={() => console.log("open store", store.id)}
 />
 )}
 />
 );
}


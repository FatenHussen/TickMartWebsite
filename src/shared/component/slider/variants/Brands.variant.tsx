import SliderSection from"../core/SliderSection";
import BrandCard from"@/shared/component/card/BrandCard";
import type { SliderVariantProps } from"./variant.types";

type Brand = {
 id: number | string;
 name: string;
 image: string;
 rating: number;
 orders_count?: number;
};

const defaultBrands: Brand[] = [
 {
 id: 1,
 name:"Nike",
 image:"https://logos-world.net/wp-content/uploads/2020/04/Nike-logo.png",
 rating: 4.8,
 },
 {
 id: 2,
 name:"Adidas",
 image:"https://logos-world.net/wp-content/uploads/2020/04/Adidas-logo.png",
 rating: 4.7,
 },
 {
 id: 3,
 name:"Apple",
 image:"https://logos-world.net/wp-content/uploads/2020/04/Apple-logo.png",
 rating: 4.9,
 },
 {
 id: 4,
 name:"Samsung",
 image:
"https://logos-world.net/wp-content/uploads/2020/06/Samsung-logo.png",
 rating: 4.8,
 },
 {
 id: 5,
 name:"Zara",
 image:"https://logos-world.net/wp-content/uploads/2020/04/Zara-logo.png",
 rating: 4.4,
 },
 {
 id: 6,
 name:"L'Oréal",
 image:
"https://logos-world.net/wp-content/uploads/2020/05/LOr%C3%A9al-logo.png",
 rating: 4.7,
 },
];

export default function BrandsVariant({
 title,
 viewAllLabel,
 payload,
 ui,
}: SliderVariantProps) {
 const items: Brand[] = (payload as { items?: Brand[] })?.items || defaultBrands;
 const limitedItems =
 ui?.limit && ui.limit > 0 ? items.slice(0, ui.limit) : items;

 return (
 <SliderSection
 title={title}
 viewAllLabel={viewAllLabel}
 items={limitedItems}
 slidesPerView={2.5}
 breakpoints={
 ui?.breakpoints || {
 640: { slidesPerView: 2.5 },
 768: { slidesPerView: 3.5 },
 1024: { slidesPerView: 6 },
 }
 }
 renderItem={(brand) => (
 <BrandCard
 key={brand.id}
 name={brand.name}
 image={brand.image}
 rating={brand.rating}
 ordersCount={brand.orders_count}
 onClick={() => console.log("Brand clicked:", brand.name)}
 />
 )}
 />
 );
}


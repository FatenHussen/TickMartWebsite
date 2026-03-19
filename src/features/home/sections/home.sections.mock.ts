import type { AppSection } from"@/shared/component/sections/section.types";

export const homeSections: AppSection[] = [
 {
 id:"home-brands",
 type:"slider",
 variant:"brands",
 titleKey:"home.brands",
 viewAllKey:"home.viewAll",
 ui: {
 breakpoints: {
 640: { slidesPerView: 2.5 },
 768: { slidesPerView: 3.5 },
 1024: { slidesPerView: 6 },
 },
 },
 },
 {
 id:"home-nearby-stores",
 type:"slider",
 variant:"nearby_stores",
 titleKey:"home.nearbyStores",
 viewAllKey:"home.viewAll",
 ui: {
 breakpoints: {
 640: { slidesPerView: 1.2 },
 768: { slidesPerView: 2.2 },
 1024: { slidesPerView: 3 },
 },
 },
 },
 {
 id:"home-products-suggested",
 type:"slider",
 variant:"products",
 titleKey:"home.suggestedForYou",
 viewAllKey:"home.viewAll",
 },
 {
 id:"home-products-search",
 type:"slider",
 variant:"products",
 titleKey:"home.basedOnSearches",
 viewAllKey:"home.viewAll",
 },
 {
 id:"home-best-sellers",
 type:"slider",
 variant:"best_sellers",
 titleKey:"home.bestSellers",
 viewAllKey:"home.viewAll",
 },
 {
 id:"home-baskets",
 type:"slider",
 variant:"baskets",
 titleKey:"home.suggestedBaskets",
 viewAllKey:"home.viewAll",
 },
];

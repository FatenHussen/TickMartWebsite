import type { ComponentType } from"react";
import {
 BrandsVariant,
 ProductSliderVariant,
 BasketsSliderVariant,
 BestSellersSliderVariant,
 NearbyStoresSliderVariant,
 TopRatedSliderVariant,
 NewArrivalsSliderVariant,
 SimilarProductsVariant,
 ProductsFromSameSellerVariant,
 SoldWithThisProductVariant,
 type SliderVariantProps,
} from"../variants";

export const sliderRegistry = {
 brands: BrandsVariant,
 products: ProductSliderVariant,
 baskets: BasketsSliderVariant,
 best_sellers: BestSellersSliderVariant,
 nearby_stores: NearbyStoresSliderVariant,
 top_rated: TopRatedSliderVariant,
 new_arrivals: NewArrivalsSliderVariant,
 similar_products: SimilarProductsVariant,
 products_from_same_seller: ProductsFromSameSellerVariant,
 sold_with_this_product: SoldWithThisProductVariant,
} as const;

export type SliderVariantKey = keyof typeof sliderRegistry;

export function getSliderVariant(key: string) {
 return (sliderRegistry as Record<string, ComponentType<SliderVariantProps>>)[
 key
 ] as ComponentType<SliderVariantProps> | null;
}

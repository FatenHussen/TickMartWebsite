import SliderSection from "../core/SliderSection";
import ProductCard from "@/shared/component/card/ProductCard";
import { useTranslation } from "react-i18next";
import type { ProductCardBadge } from "@/shared/component/card/ProductCard";
import type { SliderVariantProps } from "./variant.types";

type SellerProduct = {
    id: number | string;
    name: string;
    price: string;
    originalPrice?: string;
    rating: number;
    image: string;
    category?: string;
    badge?: ProductCardBadge | ProductCardBadge[];
    bottomBadges?: ProductCardBadge[];
    sold?: number;
    savings?: string;
    deliveryInfo?: string;
    isFavorite?: boolean;
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
        sold: 1238,
        savings: "You saved $180",
    },
];

export default function ProductsFromSameSellerVariant({
    title,
    viewAllLabel,
    payload,
    ui,
}: SliderVariantProps) {
    const { t } = useTranslation();
    const items: SellerProduct[] =
        (payload as { items?: SellerProduct[] })?.items || defaultProducts;
    const onProductClick =
        (payload as { onProductClick?: (id: number) => void })?.onProductClick;
    const onToggleFavorite =
        (payload as { onToggleFavorite?: (id: number) => void })?.onToggleFavorite;
    const favoriteIds =
        (payload as { favoriteIds?: number[] })?.favoriteIds ?? [];
    const onViewDetails =
        (payload as { onViewDetails?: (id: number) => void })?.onViewDetails;
    const viewDetailsLabel =
        (payload as { viewDetailsLabel?: string })?.viewDetailsLabel;
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
                <ProductCard
                    key={product.id}
                    id={product.id as number}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    image={product.image}
                    category={product.category}
                    badge={product.badge}
                    bottomBadges={product.bottomBadges}
                    sold={product.sold}
                    savings={product.savings}
                    deliveryInfo={product.deliveryInfo}
                    isFavorite={(product as { isFavorite?: boolean }).isFavorite ?? favoriteIds.includes(product.id as number)}
                    onToggleFavorite={(id) => onToggleFavorite?.(id)}
                    onClick={(id) => onProductClick?.(id)}
                    onViewDetails={onViewDetails}
                    viewDetailsLabel={viewDetailsLabel}
                    t={t}
                />
            )}
        />
    );
}

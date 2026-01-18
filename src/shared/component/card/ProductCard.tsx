import { cn } from "../../lib/utils";
import { HiHeart } from "react-icons/hi2";
import Button from "@/shared/ui/Button";
import Rating from "@/shared/component/Rating";
import AnimatedButton from "../../ui/AnimatedButton";
import Badge from "@/shared/component/Badge";

export type ProductCardProps = {
  id: number;
  name: string;
  store?: string; // Optional - not displayed in new design
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;

  badge?: { label: string; className?: string } | { label: string; className?: string }[]; // Single badge or array for multiple badges
  category?: string; // Category label like "Drinks"
  isFavorite?: boolean;
  sold?: number; // Quantity sold like 1238
  savings?: string; // Savings text like "You saved $180"
  deliveryInfo?: string; // Delivery info like "Free Delivery"

  onToggleFavorite?: (id: number) => void;
  onClick?: (id: number) => void;

  t?: (key: string) => string;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  store: _store, // Not used in new design but kept for backward compatibility
  price,
  originalPrice,
  rating,
  image,
  badge,
  category,
  isFavorite = true,
  sold,
  savings = "10",
  deliveryInfo,
  onToggleFavorite,
  onClick,
  t,
  className,
}: ProductCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-custom-primary shadow-sm transition hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={() => onClick?.(id)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick(id);
      }}
    >
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Badges */}
        {badge && (
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
            {Array.isArray(badge) ? (
              badge.map((b, idx) => (
                <Badge
                  key={idx}
                  label={t ? t(`home.${b.label}`) : b.label}
                  className={cn(
                    b.className || "bg-blue-500 text-white"
                  )}
                />
              ))
            ) : (
              <Badge
                label={t ? t(`home.${badge.label}`) : badge.label}
                className={cn(
                  badge.className || "bg-blue-500 text-white"
                )}
              />
            )}
          </div>
        )}

        {/* Favorite Button (top-right) - Light blue circular with white heart */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Toggle favorite"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          className="absolute right-3 top-3 z-10 h-9 w-9 p-0 rounded-full bg-white border-2 border-primary-light backdrop-blur-sm hover:bg-blue-400"
        >
          <HiHeart
            className={cn(
              "h-5 w-5",
              isFavorite
                ? "fill-primary-light text-primary-light"
                : "fill-none text-primary-light"
            )}
          />
        </Button>

        {/* Rating (bottom-left) - White text on image */}
        <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm">
          <Rating rating={rating} size="sm" className="px-2 py-1 " />
        </div>
      </div>

      {/* Info Section - Light blue-gray background */}
      <div className="bg-custom-secondary px-4 pb-4 pt-4">
        {/* Product Name */}
        <h3 className="text-base font-bold text-custom-primary line-clamp-1">
          {name}
        </h3>

        {/* Category */}
        {category && (
          <p className="mt-1 text-xs text-custom-secondary line-clamp-1">{category}</p>
        )}

        {/* Price Section */}
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-custom-primary">{price}</span>
            {originalPrice && (
              <span className="text-sm text-custom-tertiary line-through">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Savings and Sold */}
          {(savings || sold) && (
            <div className="flex justify-between items-center gap-2 mt-1">
              {savings && (
                <p className="text-sm font-medium" style={{ color: 'var(--color-green)' }}>
                  {savings}
                </p>
              )}
              {sold && (
                <p className="text-sm font-medium text-custom-secondary">
                  {sold.toLocaleString()} Sold
                </p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Delivery Button */}
        <div className="flex items-center justify-center mt-4">
          {deliveryInfo && (
            <AnimatedButton
              variant="primary"
              size="sm"
              onClick={(e) => e.stopPropagation()}
              className="bg-custom-accent hover:opacity-90 text-custom-inverse text-xs font-semibold px-4"
              note={{
                primary: deliveryInfo,
                secondary: "Order now",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

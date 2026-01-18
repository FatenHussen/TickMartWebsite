import { cn } from "@/shared/lib/utils";
import Rating from "@/shared/component/Rating";
import Badge from "@/shared/component/Badge";
import Button from "@/shared/ui/Button";

export type ProductInfoProps = {
  category?: string;
  brand?: string;
  name: string;
  sku?: string;
  origin?: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  sold?: number;
  rating?: number;
  badges?: Array<{ label: string; className?: string }>;
  className?: string;
};

export default function ProductInfo({
  category,
  brand,
  name,
  sku,
  origin,
  price,
  originalPrice,
  savings,
  sold,
  rating,
  badges = [],
  className,
}: ProductInfoProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge, idx) => (
            <Badge
              key={idx}
              label={badge.label}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                badge.className
              )}
            />
          ))}
        </div>
      )}

      {/* Category & Brand */}
      {(category || brand) && (
        <div className="flex flex-col  gap-2 text-sm text-gray">
          {category && <span>{category}</span>}
          {brand && <span>{brand}</span>}
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
        {name}
      </h1>

      {/* SKU & Origin (blue link-like) */}
      {(sku || origin) && (
        <div className="flex flex-col gap-1 text-sm">
          {sku && (
            <div className="flex items-center gap-2">
              <span className="text-gray">SKU:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium text-primary-light"
              >
                {sku}
              </Button>
            </div>
          )}

          {origin && (
            <div className="flex items-center gap-2">
              <span className="text-gray">Origin:</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-medium text-primary-light"
              >
                {origin}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Pricing */}
      <section className="flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-semibold text-text-primary">
              {price}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {originalPrice && (
              <span className="text-lg text-gray line-through">
                {originalPrice}
              </span>
            )}
            {savings && (
              <p className="text-sm font-semibold text-green">{savings}</p>
            )}
          </div>
        </div>

        {/* Sold + Rating aligned like screenshot */}
        {(sold !== undefined || rating !== undefined) && (
          <div className="flex items-center justify-between gap-4">
            {sold !== undefined && (
              <span className="text-sm text-slate-500">
                {sold.toLocaleString()} Sold
              </span>
            )}

            {rating !== undefined && (
              <div className="flex items-center gap-2">
                <Rating rating={rating} size="lg" />
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

import type { ReactNode } from"react";
import { cn } from"@/shared/lib/utils";
import Rating from"@/shared/component/Rating";
import Badge from"@/shared/component/Badge";

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
 topRightSlot?: ReactNode;
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
 topRightSlot,
 className,
}: ProductInfoProps) {
 return (
 <div className={cn("flex flex-col gap-3", className)}>
 {/* Top badges row */}
 {badges.length > 0 && (
 <div className="flex flex-wrap items-center gap-2">
 {badges.map((badge, idx) => (
 <Badge
 key={idx}
 label={badge.label}
 className={cn(
"rounded-full px-3 py-1 text-xs font-semibold",
 badge.className,
 )}
 />
 ))}
 </div>
 )}

 {/* Category / Brand row with optional top-right slot (e.g. ShopSelector) */}
 {(category || brand || topRightSlot) && (
 <div className="flex items-start justify-between gap-2">
 <div className="flex flex-col gap-0.5 text-sm text-gray">
 {category && <span>{category}</span>}
 {brand && <span>{brand}</span>}
 </div>
 {topRightSlot && <div className="shrink-0">{topRightSlot}</div>}
 </div>
 )}

 {/* Product Name */}
 <h1 className="text-2xl font-bold tracking-tight text-text-primary lg:text-3xl">
 {name}
 </h1>

 {/* SKU & Origin */}
 {(sku || origin) && (
 <div className="flex flex-col gap-1 text-sm">
 {sku && (
 <div className="flex items-center gap-1">
 <span className="text-gray">SKU:</span>
 <span className="font-medium text-primary-light">{sku}</span>
 </div>
 )}
 {origin && (
 <div className="flex items-center gap-1">
 <span className="text-gray">Origin:</span>
 <span className="font-medium text-primary-light">{origin}</span>
 </div>
 )}
 </div>
 )}

 {/* Pricing Row */}
 <div className="flex items-center justify-between">
 <div className="flex flex-col gap-1">
 <span className="text-2xl font-bold text-text-primary">{price}</span>
 {(originalPrice || savings) && (
 <div className="flex items-center gap-2">
 {originalPrice && (
 <span className="text-sm text-gray line-through">
 {originalPrice}
 </span>
 )}
 {savings && (
 <span className="text-sm font-semibold text-green">{savings}</span>
 )}
 </div>
 )}
 </div>

 {/* Sold + Rating */}
 {(sold !== undefined || rating !== undefined) && (
 <div className="flex items-center gap-2 text-sm">
 {sold !== undefined && (
 <span className="text-gray">{sold.toLocaleString()} Sold</span>
 )}
 {sold !== undefined && rating !== undefined && (
 <span className="text-gray">•</span>
 )}
 {rating !== undefined && <Rating rating={rating} size="sm"/>}
 </div>
 )}
 </div>

 {/* Secondary badges below price */}
 {badges.length > 0 && (
 <div className="flex flex-wrap items-center gap-2">
 {badges.map((badge, idx) => (
 <Badge
 key={idx}
 label={badge.label}
 className={cn(
"rounded-full px-3 py-1 text-xs font-semibold",
 badge.className,
 )}
 />
 ))}
 </div>
 )}

 {/* Dashed separator */}
 <hr className="border-dashed border-custom-primary"/>
 </div>
 );
}

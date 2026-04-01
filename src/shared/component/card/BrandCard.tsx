import Rating from"../Rating";
import Badge from"../Badge";
import LazyImage from"../LazyImage";
import AnimatedButton from"@/shared/ui/AnimatedButton";
import { cn } from"../../lib/utils";
import {
 type ProductCardBadge,
 resolveProductCardBadgeLabel,
} from"./ProductCard";

type BrandCardProps = {
 name: string;
 image: string;
 rating: number;
 /** Optional top badges (same layout as ProductCard) */
 badge?: ProductCardBadge | ProductCardBadge[];
 /** Bottom animated rows (API `bottom_badges`) */
 bottomBadges?: ProductCardBadge[];
 onClick?: () => void;
 className?: string;
};

export default function BrandCard({
 name,
 image,
 rating,
 badge,
 bottomBadges,
 onClick,
 className,
}: BrandCardProps) {
 const allBadges = badge
 ? Array.isArray(badge)
 ? badge
 : [badge]
 : [];
 const leftBadges = allBadges.filter((b) => (b.align ??"left") ==="left");
 const rightBadges = allBadges.filter((b) => b.align ==="right");

 return (
 <div
 role={onClick ?"button": undefined}
 tabIndex={onClick ? 0 : undefined}
 onClick={onClick}
 onKeyDown={(e) => {
 if (!onClick) return;
 if (e.key ==="Enter"|| e.key ==="") onClick();
 }}
 className={cn(
"relative rounded-xl border border-custom-primary bg-custom-secondary p-6 shadow-sm transition-shadow hover:shadow-md flex flex-col items-center h-full dark:ring-1 dark:ring-white/5",
 onClick &&"cursor-pointer",
 className
 )}
 >
 {leftBadges.length > 0 && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
 {leftBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={resolveProductCardBadgeLabel(b)}
 type={b.type}
 imageSrc={b.image}
 imageAlt={resolveProductCardBadgeLabel(b)}
 className={cn(b.className ||"bg-blue-500 text-white")}
 />
 ))}
 </div>
 )}
 {rightBadges.length > 0 && (
 <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-1">
 {rightBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={resolveProductCardBadgeLabel(b)}
 type={b.type}
 imageSrc={b.image}
 imageAlt={resolveProductCardBadgeLabel(b)}
 className={cn(b.className ||"bg-yellow-400 text-black")}
 />
 ))}
 </div>
 )}
 <div className="flex flex-1 flex-col items-center justify-center w-full min-h-0">
 {/* White circular logo area */}
 <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-custom-card p-2 mb-4 shadow-sm overflow-hidden">
 <LazyImage
 src={image}
 alt={name}
 effect=""
 className="max-h-full max-w-full h-auto w-auto object-contain object-center"
 />
 </div>

 {/* Brand name - medium weight, centered */}
 <h3 className="mb-2 text-center text-base font-medium text-custom-primary">
 {name}
 </h3>

 {/* Rating with yellow star */}
 <div className="flex justify-center">
 <Rating
 rating={rating}
 size="sm"
 className="gap-1 [&>span:first-child]:text-yellow-500 [&>span:last-child]:font-medium [&>span:last-child]:text-custom-primary"
 />
 </div>
 </div>

 {bottomBadges && bottomBadges.length > 0 && (
 <div className="mt-auto flex w-full flex-col gap-2 pt-3">
 {bottomBadges.slice(0, 1).map((b, idx) => {
 const text = resolveProductCardBadgeLabel(b);
 return (
 <AnimatedButton
 key={idx}
 variant="primary"
 size="sm"
 type="button"
 onClick={(e) => e.stopPropagation()}
 className={cn(
"w-full justify-center text-xs font-semibold",
 b.className
 )}
 note={{ primary: text, secondary: text }}
 />
 );
 })}
 </div>
 )}
 </div>
 );
}

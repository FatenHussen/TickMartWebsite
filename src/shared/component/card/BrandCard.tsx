import Rating from"../Rating";
import Badge from"../Badge";
import { cn } from"../../lib/utils";
import type { ProductCardBadge } from"./ProductCard";

type BrandCardProps = {
 name: string;
 image: string;
 rating: number;
 /** Optional top badges (same layout as ProductCard) */
 badge?: ProductCardBadge | ProductCardBadge[];
 onClick?: () => void;
 className?: string;
};

export default function BrandCard({
 name,
 image,
 rating,
 badge,
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
"relative bg-[#E4F0FB] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center h-full",
 onClick &&"cursor-pointer",
 className
 )}
 >
 {leftBadges.length > 0 && (
 <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
 {leftBadges.map((b, idx) => (
 <Badge
 key={idx}
 label={b.label}
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
 label={b.label}
 className={cn(b.className ||"bg-yellow-400 text-black")}
 />
 ))}
 </div>
 )}
 {/* White circular logo area */}
 <div className="w-24 h-24 rounded-full bg-custom-card flex items-center justify-center mb-4 shadow-sm">
 <img
 src={image}
 alt={name}
 className="max-w-[80%] max-h-[80%] object-contain"
 loading="lazy"
 />
 </div>

 {/* Brand name - medium weight, centered */}
 <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-center text-base">
 {name}
 </h3>

 {/* Rating with yellow star */}
 <div className="flex justify-center">
 <Rating
 rating={rating}
 size="sm"
 className="[&>span:first-child]:text-yellow-500 [&>span:last-child]:text-slate-800 [&>span:last-child]:font-medium gap-1"
 />
 </div>
 </div>
 );
}

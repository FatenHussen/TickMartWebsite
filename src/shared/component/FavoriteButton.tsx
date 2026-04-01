import { HiHeart, HiOutlineHeart } from"react-icons/hi2";
import { cn } from"../lib/utils";

export type FavoriteButtonProps = {
 isFavorite?: boolean;
 onToggle?: (e: React.MouseEvent) => void;
 size?:"sm"|"md"|"lg";
 className?: string;
 ariaLabel?: string;
};

export default function FavoriteButton({
 isFavorite = false,
 onToggle,
 size ="md",
 className,
 ariaLabel ="Toggle favorite",
}: FavoriteButtonProps) {
 const sizeClasses = {
 sm:"h-8 w-8",
 md:"h-10 w-10",
 lg:"h-12 w-12",
 };

 const iconSizes = {
 sm:"h-4 w-4",
 md:"h-5 w-5",
 lg:"h-6 w-6",
 };

 return (
 <button
 type="button"
 aria-label={ariaLabel}
 onClick={onToggle}
 className={cn(
"relative rounded-full p-0 transition-all duration-200",
"flex items-center justify-center",
"bg-white border-2 border-[#22BDE9]",
"shadow-[0_4px_14px_rgba(34,189,233,0.18)]",
"hover:shadow-[0_6px_18px_rgba(34,189,233,0.24)] hover:scale-105 active:scale-95",
 sizeClasses[size],
 className
 )}
 >
 {isFavorite ? (
 <HiHeart
 className={cn(
 iconSizes[size],
"text-[#22BDE9] transition-all duration-200"
 )}
 />
 ) : (
 <HiOutlineHeart
 className={cn(
 iconSizes[size],
"text-[#22BDE9] transition-all duration-200"
 )}
 />
 )}
 </button>
 );
}

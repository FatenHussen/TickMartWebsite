import { HiHeart } from"react-icons/hi2";
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
"bg-custom-card/95 border-2 border-blue-400/80",
"hover:bg-blue-400/10 hover:scale-110 active:scale-95 shadow-sm",
 sizeClasses[size],
 className
 )}
 >
 <HiHeart
 className={cn(
 iconSizes[size],
"transition-all duration-200",
 isFavorite
 ?"fill-blue-400 text-blue-400"
 :"fill-none stroke-2 stroke-blue-400 text-blue-400"
 )}
 />
 </button>
 );
}

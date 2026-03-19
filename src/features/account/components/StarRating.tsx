import { cn } from"@/shared/lib/utils";

type StarRatingProps = {
 rating: number;
 size?:"sm"|"md"|"lg";
 showNumber?: boolean;
 className?: string;
};

export default function StarRating({
 rating,
 size ="md",
 showNumber = true,
 className ="",
}: StarRatingProps) {
 const sizeClasses = {
 sm:"text-xs",
 md:"text-sm",
 lg:"text-base",
 };

 const starSizeClasses = {
 sm:"text-base",
 md:"text-lg",
 lg:"text-xl",
 };

 const roundedRating = Math.round(rating * 10) / 10;

 return (
 <div className={cn("flex items-center gap-1", className)}>
 <div className="flex items-center gap-0.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <span
 key={star}
 className={cn(
 starSizeClasses[size],
 star <= roundedRating
 ?"text-yellow-400"
 :"text-custom-tertiary"
 )}
 >
 ★
 </span>
 ))}
 </div>
 {showNumber && (
 <span className={cn(sizeClasses[size],"text-text-primary font-medium ml-1")}>
 {roundedRating.toFixed(1)}
 </span>
 )}
 </div>
 );
}

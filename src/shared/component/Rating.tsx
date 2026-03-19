type RatingProps = {
 rating: number | string;
 size?:"sm"|"md"|"lg";
 showStar?: boolean;
 className?: string;
};

export default function Rating({
 rating,
 size ="md",
 showStar = true,
 className ="",
}: RatingProps) {
 const sizeClasses = {
 sm:"text-xs",
 md:"text-sm",
 lg:"text-base",
 };

 const starSizeClasses = {
 sm:"text-xs",
 md:"text-sm",
 lg:"text-base",
 };

 return (
 <div className={`flex items-center gap-1 ${className}`}>
 {showStar && (
 <span className={`text-yellow-500 ${starSizeClasses[size]}`}>★</span>
 )}
 <span className={`${sizeClasses[size]} text-slate-600 font-medium`}>
 {rating}
 </span>
 </div>
 );
}


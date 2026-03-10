import Rating from "../Rating";
import { cn } from "../../lib/utils";

type BrandCardProps = {
  name: string;
  image: string;
  rating: number;
  onClick?: () => void;
  className?: string;
};

export default function BrandCard({
  name,
  image,
  rating,
  onClick,
  className,
}: BrandCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={cn(
        "bg-[#E4F0FB] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* White circular logo area */}
      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
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

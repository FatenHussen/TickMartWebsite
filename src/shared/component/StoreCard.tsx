import Button from "@/shared/ui/Button";
import Rating from "./Rating";
import { cn } from "../lib/utils";
import { HiHeart } from "react-icons/hi2";

export type StoreCardProps = {
  name: string;
  type: string;
  location: string;
  rating: number;
  image: string;

  status?: "open" | "closed";
  statusLabel?: string; // translated "Open" / "Closed"

  deliveryFee?: string; // "$1.99 delivery"
  services?: string[]; // ["Delivery", "Subscriptions"]
  discount?: string; // "30% OFF"
  isFavorite?: boolean;

  logoText?: string; // e.g. "Grocerystore"
  onClick?: () => void;
  onToggleFavorite?: () => void;

  // translate service keys (optional)
  t?: (key: string) => string;
  className?: string;
};

function serviceToKey(service: string) {
  if (service === "24/7") return "24_7";
  return service.toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
}

export default function StoreCard({
  name,
  type,
  location,
  rating,
  image,
  status = "open",
  statusLabel = "Open",
  deliveryFee,
  services = [],
  discount,
  isFavorite = false,
  onClick,
  onToggleFavorite,
  t,
  className,
}: StoreCardProps) {
  const isOpen = status === "open";

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
        "group w-full overflow-hidden rounded-2xl bg-custom-primary shadow-sm ring-1 ring-black/5 transition hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 w-full">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />

        {/* Status pill (top-left) - Green oval */}
        {isOpen && (
          <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            {statusLabel}
          </span>
        )}

        {/* Favorite Button (top-right) - White heart with light blue outline */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Toggle favorite"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className="absolute right-3 top-3 z-10 h-9 w-9 p-0 rounded-full bg-white border-2 border-blue-400/80 hover:bg-blue-400/10"
        >
          <HiHeart
            className={cn(
              "h-5 w-5",
              isFavorite
                ? "fill-blue-400 text-blue-400"
                : "fill-none text-blue-400"
            )}
          />
        </Button>

        {/* Rating badge (bottom-left) - Gray rectangular with yellow star */}
        <div className="absolute left-3 bottom-3 z-10 bg-blue-off rounded-sm">
          <Rating rating={rating} size="sm" className="px-2 py-1" />
        </div>
      </div>

      {/* Body - Light green background */}
      <div className="bg-green-50 px-5 pb-5 pt-4">
        {/* Restaurant Name */}
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>

        {/* Type and Location */}
        <p className="mt-1 text-sm text-slate-600">
          {type} <span className="mx-1">•</span> {location}
        </p>

        {/* Services and Discount badges */}
        <div className="flex flex-row justify-between mt-4">
          <div className=" flex flex-wrap items-center gap-2">
            {/* Services badges - Light blue oval for Delivery */}
            {services.map((service) => {
              const key = serviceToKey(service);
              const label = t ? t(`home.${key}`) : service;

              return (
                <span
                  key={service}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  {label || service}
                </span>
              );
            })}

            {/* Discount badge - Light pink oval */}
            {discount && (
              <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-red-600">
                {discount}
              </span>
            )}

            {/* Discount badge - Red rectangular */}
            {discount && (
              <span className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                {discount}
              </span>
            )}
          </div>

          {/* Delivery fee (bottom-right) */}
          {deliveryFee && (
            <div className="flex ">
              <span className="text-sm font-medium text-slate-600">
                {deliveryFee}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

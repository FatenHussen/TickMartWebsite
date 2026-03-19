import { HiLocationMarker } from"react-icons/hi";
import Rating from"@/shared/component/Rating";

type StoreHeaderProps = {
 logo: string;
 name: string;
 category: string;
 rating: number;
 city: string;
 address: string;
 onFavoriteClick?: () => void;
};

export default function StoreHeader({
 logo,
 name,
 category,
 rating,
 city,
 address,
 onFavoriteClick,
}: StoreHeaderProps) {
 return (
 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className="absolute -top-1 w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-custom-primary shadow-lg -mt-16 bg-custom-card">
 <img src={logo} alt={name} className="h-full w-full object-cover"/>
 </div>
 <div className="space-y-1">
 <h1 className="mt-4 text-2xl md:text-3xl font-bold text-custom-primary">
 {name}
 </h1>
 <div className="flex items-center gap-2 text-sm text-custom-secondary">
 <span>{category}</span>
 <Rating
 rating={rating.toFixed(1)}
 size="sm"
 className="text-custom-secondary [&_span:last-child]:font-semibold [&_span:last-child]:text-custom-primary [&_span:first-child]:text-amber-400"
 />
 </div>
 <div className="flex items-center gap-2 text-sm text-custom-secondary mt-4">
 <HiLocationMarker className="text-primary-light"/>
 <span>
 {city} · {address}
 </span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <button
 aria-label="Favorite"
 onClick={onFavoriteClick}
 className="p-3 rounded-full border border-custom-primary hover:bg-custom-primary transition-colors"
 >
 <span role="img"aria-hidden>
 💙
 </span>
 </button>
 </div>
 </div>
 );
}

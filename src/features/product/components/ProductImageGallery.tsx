import { useState } from"react";
import { HiShare } from"react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import Button from"@/shared/ui/Button";
import FavoriteButton from"@/shared/component/FavoriteButton";

export type ProductImageGalleryProps = {
 images: string[];
 isFavorite?: boolean;
 onToggleFavorite?: () => void;
 onShare?: () => void;
 className?: string;
};

export default function ProductImageGallery({
 images,
 isFavorite = false,
 onToggleFavorite,
 onShare,
 className,
}: ProductImageGalleryProps) {
 const [selectedIndex, setSelectedIndex] = useState(0);

 const thumbnailsToShow = 4;
 const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

 const canGoPrev = thumbnailStartIndex > 0;
 const canGoNext =
 thumbnailStartIndex + thumbnailsToShow < (images?.length || 0);

 const visibleThumbnails = images.slice(
 thumbnailStartIndex,
 thumbnailStartIndex + thumbnailsToShow
 );

 const handleThumbnailClick = (index: number) => setSelectedIndex(index);

 const handlePreviousThumbnails = () => {
 setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
 };

 const handleNextThumbnails = () => {
 setThumbnailStartIndex((prev) =>
 Math.min(images.length - thumbnailsToShow, prev + 1)
 );
 };

 return (
 <div className={cn("flex flex-col gap-4", className)}>
 {/* Main Image */}
 <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100">
 <div className="aspect-[1/1] w-full">
 <img
 src={images[selectedIndex]}
 alt={`Product view ${selectedIndex + 1}`}
 className="h-full w-full object-cover"
 loading="lazy"
 />
 </div>

 {/* Top-right icons */}
 <div className="absolute right-4 top-4 z-10 flex gap-2">
 {onShare && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 aria-label="Share product"
 onClick={onShare}
 className="h-10 w-10 rounded-xl bg-custom-card/95 p-0 shadow-sm ring-1 ring-slate-200 hover:bg-custom-card"
 >
 <HiShare className="h-5 w-5 text-slate-700"/>
 </Button>
 )}

 {onToggleFavorite && (
 <FavoriteButton
 isFavorite={isFavorite}
 onToggle={onToggleFavorite}
 size="md"
 ariaLabel="Toggle favorite"
 className="rounded-xl bg-custom-card/95 shadow-sm ring-1 ring-slate-200 hover:bg-custom-card border-0"
 />
 )}
 </div>
 </div>

 {/* Thumbnail Carousel */}
 {images.length > 1 && (
 <div className="relative flex items-center">
 {/* Prev */}
 {canGoPrev && (
 <button
 type="button"
 onClick={handlePreviousThumbnails}
 className="absolute left-0 z-10 grid h-9 w-9 place-items-center rounded-xl bg-custom-card shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
 aria-label="Previous thumbnails"
 >
 <HiChevronLeft className="h-5 w-5 text-slate-700"/>
 </button>
 )}

 {/* Thumbnails */}
 <div className="mx-auto flex w-full justify-center gap-3 px-12">
 {visibleThumbnails.map((image, idx) => {
 const actualIndex = thumbnailStartIndex + idx;
 const isSelected = selectedIndex === actualIndex;

 return (
 <button
 key={actualIndex}
 type="button"
 onClick={() => handleThumbnailClick(actualIndex)}
 className={cn(
"relative h-16 w-16 overflow-hidden rounded-xl ring-1 transition-all",
 isSelected
 ?"ring-slate-900"
 :"ring-slate-200 hover:ring-slate-300"
 )}
 aria-label={`Thumbnail ${actualIndex + 1}`}
 >
 <img
 src={image}
 alt={`Thumbnail ${actualIndex + 1}`}
 className="h-full w-full object-cover"
 loading="lazy"
 />
 </button>
 );
 })}
 </div>

 {/* Next */}
 {canGoNext && (
 <button
 type="button"
 onClick={handleNextThumbnails}
 className="absolute right-0 z-10 grid h-9 w-9 place-items-center rounded-xl bg-custom-card shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
 aria-label="Next thumbnails"
 >
 <HiChevronRight className="h-5 w-5 text-slate-700"/>
 </button>
 )}
 </div>
 )}
 </div>
 );
}

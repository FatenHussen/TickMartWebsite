import { AnimatePresence, motion } from"framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from"react";
import { HiShare } from"react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from"react-icons/hi";
import { cn } from"@/shared/lib/utils";
import Button from"@/shared/ui/Button";
import LazyImage from"@/shared/component/LazyImage";
import FavoriteButton from"@/shared/component/FavoriteButton";

export type ProductImageGalleryProps = {
 images: string[];
 isFavorite?: boolean;
 onToggleFavorite?: () => void;
 onShare?: () => void;
 className?: string;
};

const MAIN_IMAGE_TRANSITION_SECONDS = 0.38;
const THUMBNAILS_TO_SHOW = 4;

type ThumbnailButtonProps = {
 image: string;
 index: number;
 isSelected: boolean;
 onSelect: (index: number) => void;
};

const ThumbnailButton = memo(function ThumbnailButton({
 image,
 index,
 isSelected,
 onSelect,
}: ThumbnailButtonProps) {
 return (
  <button
   type="button"
   onClick={() => onSelect(index)}
   className={cn(
    "group relative shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-[color-mix(in_srgb,var(--color-api-second)_14%,#10121a)] ring-1 transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 dark:focus-visible:ring-[color-mix(in_srgb,var(--color-main)_45%,transparent)]",
    "h-16 w-16 sm:h-[72px] sm:w-[72px]",
    isSelected
     ?"scale-105 ring-2 ring-slate-900 dark:ring-[color-mix(in_srgb,var(--color-main)_45%,transparent)] shadow-sm"
     :"ring-slate-200 dark:ring-[color-mix(in_srgb,var(--color-main)_22%,#1f2230)] hover:-translate-y-0.5 hover:ring-slate-300 dark:hover:ring-[color-mix(in_srgb,var(--color-api-second)_30%,#22253a)] hover:shadow-sm"
   )}
   aria-label={`Thumbnail ${index + 1}`}
   aria-pressed={isSelected}
  >
   <div className="absolute inset-0">
    <LazyImage
     src={image}
     alt={`Thumbnail ${index + 1}`}
     className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
     wrapperClassName="h-full w-full"
     effect=""
    />
   </div>
   <span
    className={cn(
     "absolute inset-0 transition-colors duration-300",
     isSelected ?"bg-slate-900/5 dark:bg-[color-mix(in_srgb,var(--color-main)_18%,transparent)]":"bg-transparent group-hover:bg-slate-900/5 dark:group-hover:bg-[color-mix(in_srgb,var(--color-main)_14%,transparent)]"
    )}
   />
  </button>
 );
});

export default function ProductImageGallery({
 images,
 isFavorite = false,
 onToggleFavorite,
 onShare,
 className,
}: ProductImageGalleryProps) {
 const safeImages = useMemo(() => images.filter(Boolean), [images]);
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

 useEffect(() => {
  setSelectedIndex((prev) => {
   if (safeImages.length === 0) return 0;
   return Math.min(prev, safeImages.length - 1);
  });
 }, [safeImages.length]);

 useEffect(() => {
  setThumbnailStartIndex((prev) => {
   if (safeImages.length <= THUMBNAILS_TO_SHOW) return 0;
   return Math.min(prev, Math.max(0, safeImages.length - THUMBNAILS_TO_SHOW));
  });
 }, [safeImages.length]);

 useEffect(() => {
  if (selectedIndex < thumbnailStartIndex) {
   setThumbnailStartIndex(selectedIndex);
   return;
  }

  if (selectedIndex >= thumbnailStartIndex + THUMBNAILS_TO_SHOW) {
   setThumbnailStartIndex(selectedIndex - THUMBNAILS_TO_SHOW + 1);
  }
 }, [selectedIndex, thumbnailStartIndex]);

 const canGoPrev = thumbnailStartIndex > 0;
 const canGoNext =
 thumbnailStartIndex + THUMBNAILS_TO_SHOW < safeImages.length;

 const visibleThumbnails = safeImages.slice(
 thumbnailStartIndex,
  thumbnailStartIndex + THUMBNAILS_TO_SHOW
 );

 const handleThumbnailSelect = useCallback((nextIndex: number) => {
  if (!safeImages[nextIndex]) return;
  setSelectedIndex(nextIndex);
 }, [safeImages]);

 const handlePreviousThumbnails = useCallback(() => {
 setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
 }, []);

 const handleNextThumbnails = useCallback(() => {
 setThumbnailStartIndex((prev) =>
   Math.min(safeImages.length - THUMBNAILS_TO_SHOW, prev + 1)
 );
 }, [safeImages.length]);

 if (safeImages.length === 0) {
  return null;
 }

 return (
 <div className={cn("flex flex-col gap-4", className)}>
 {/* Main Image */}
 <div className="relative w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-[color-mix(in_srgb,var(--color-api-second)_14%,#10121a)]">
 <div className="aspect-[1/1] w-full">
  <div className="relative h-full w-full">
   <AnimatePresence mode="wait" initial={false}>
    <motion.div
     key={safeImages[selectedIndex]}
     className="absolute inset-0"
     initial={{ opacity: 0, scale: 1.02 }}
     animate={{ opacity: 1, scale: 1 }}
     exit={{ opacity: 0, scale: 0.985 }}
     transition={{ duration: MAIN_IMAGE_TRANSITION_SECONDS, ease:"easeOut" }}
    >
     <LazyImage
      src={safeImages[selectedIndex]}
      alt={`Product view ${selectedIndex + 1}`}
      className="h-full w-full object-cover"
      wrapperClassName="h-full w-full"
      effect=""
     />
    </motion.div>
   </AnimatePresence>
  </div>
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
 className="h-10 w-10 rounded-xl bg-custom-card/95 dark:bg-[color-mix(in_srgb,var(--color-main)_22%,#0e1017)]/90 p-0 shadow-sm ring-1 ring-slate-200 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)] hover:bg-custom-card dark:hover:bg-[color-mix(in_srgb,var(--color-main)_28%,#0e1017)]"
 >
 <HiShare className="h-5 w-5 text-slate-700 dark:text-[var(--color-text)]"/>
 </Button>
 )}

 {onToggleFavorite && (
 <FavoriteButton
 isFavorite={isFavorite}
 onToggle={onToggleFavorite}
 size="md"
 ariaLabel="Toggle favorite"
 className="rounded-xl bg-custom-card/95 dark:bg-[color-mix(in_srgb,var(--color-main)_22%,#0e1017)]/90 shadow-sm ring-1 ring-slate-200 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)] hover:bg-custom-card dark:hover:bg-[color-mix(in_srgb,var(--color-main)_28%,#0e1017)] border-0"
 />
 )}
 </div>
 </div>

 {/* Thumbnail Carousel */}
  {safeImages.length > 1 && (
 <div className="relative flex items-center">
 {/* Prev */}
 {canGoPrev && (
 <button
 type="button"
 onClick={handlePreviousThumbnails}
 className="absolute left-0 z-10 grid h-9 w-9 place-items-center rounded-xl bg-custom-card dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] shadow-sm ring-1 ring-slate-200 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)] hover:bg-slate-50 dark:hover:bg-[color-mix(in_srgb,var(--color-api-second)_18%,#10121a)]"
 aria-label="Previous thumbnails"
 >
 <HiChevronLeft className="h-5 w-5 text-slate-700 dark:text-[var(--color-text)]"/>
 </button>
 )}

 {/* Thumbnails */}
   <div className="mx-auto flex w-full justify-center gap-3 overflow-x-auto px-0 py-1 sm:px-12 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
 {visibleThumbnails.map((image, idx) => {
 const actualIndex = thumbnailStartIndex + idx;
 const isSelected = selectedIndex === actualIndex;

 return (
    <ThumbnailButton
    key={`${image}-${actualIndex}`}
    image={image}
    index={actualIndex}
    isSelected={isSelected}
    onSelect={handleThumbnailSelect}
    />
 );
 })}
 </div>

 {/* Next */}
 {canGoNext && (
 <button
 type="button"
 onClick={handleNextThumbnails}
 className="absolute right-0 z-10 grid h-9 w-9 place-items-center rounded-xl bg-custom-card dark:bg-[color-mix(in_srgb,var(--color-main)_18%,#13151c)] shadow-sm ring-1 ring-slate-200 dark:ring-[color-mix(in_srgb,var(--color-api-second)_28%,transparent)] hover:bg-slate-50 dark:hover:bg-[color-mix(in_srgb,var(--color-api-second)_18%,#10121a)]"
 aria-label="Next thumbnails"
 >
 <HiChevronRight className="h-5 w-5 text-slate-700 dark:text-[var(--color-text)]"/>
 </button>
 )}
 </div>
 )}
 </div>
 );
}

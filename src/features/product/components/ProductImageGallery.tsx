import { AnimatePresence, motion } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiShare } from "react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/shared/ui/Button";
import LazyImage from "@/shared/component/LazyImage";
import FavoriteButton from "@/shared/component/FavoriteButton";

export type ProductImageGalleryProps = {
    images: string[];
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
    onShare?: () => void;
    className?: string;
};

const MAIN_IMAGE_TRANSITION_SECONDS = 0.28;
const THUMBNAILS_TO_SHOW = 5;

type ThumbnailButtonProps = {
    image: string;
    index: number;
    isSelected: boolean;
    onSelect: (index: number) => void;
    label: string;
};

const ThumbnailButton = memo(function ThumbnailButton({
    image,
    index,
    isSelected,
    onSelect,
    label,
}: ThumbnailButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
                "group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] ring-1 transition duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-[4.5rem] sm:w-[4.5rem]",
                isSelected
                    ? "ring-2 ring-primary"
                    : "ring-black/8 hover:ring-black/20 dark:ring-white/10 dark:hover:ring-white/25",
            )}
            aria-label={label}
            aria-pressed={isSelected}
        >
            <LazyImage
                src={image}
                alt=""
                className="h-full w-full object-contain p-1"
                wrapperClassName="h-full w-full"
                effect=""
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
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const safeImages = useMemo(() => images.filter(Boolean), [images]);
    const imagesKey = safeImages.join("|");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(0);
        setThumbnailStartIndex(0);
    }, [imagesKey]);

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
        thumbnailStartIndex + THUMBNAILS_TO_SHOW,
    );

    const handleThumbnailSelect = useCallback(
        (nextIndex: number) => {
            if (!safeImages[nextIndex]) return;
            setSelectedIndex(nextIndex);
        },
        [safeImages],
    );

    const goTo = useCallback(
        (dir: -1 | 1) => {
            if (safeImages.length < 2) return;
            setSelectedIndex((prev) => {
                const next = prev + dir;
                if (next < 0) return safeImages.length - 1;
                if (next >= safeImages.length) return 0;
                return next;
            });
        },
        [safeImages.length],
    );

    useEffect(() => {
        if (safeImages.length < 2) return;
        const onKey = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
                return;
            }
            if (event.key === "ArrowLeft") goTo(isRTL ? 1 : -1);
            if (event.key === "ArrowRight") goTo(isRTL ? -1 : 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [goTo, isRTL, safeImages.length]);

    const actions = (
        <div className="absolute end-3 top-3 z-10 flex gap-2">
            {onShare && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={t("product.share", "Share product")}
                    onClick={onShare}
                    className="h-10 w-10 rounded-full bg-white/95 p-0 shadow-sm ring-1 ring-black/8 hover:bg-white dark:bg-[#121318]/90 dark:ring-white/10 dark:hover:bg-[#1a1b22]"
                >
                    <HiShare className="h-5 w-5 text-text-primary" />
                </Button>
            )}
            {onToggleFavorite && (
                <FavoriteButton
                    isFavorite={isFavorite}
                    onToggle={onToggleFavorite}
                    size="md"
                    ariaLabel={t("product.toggleFavorite", "Toggle favorite")}
                    className="rounded-full bg-white/95 shadow-sm ring-1 ring-black/8 hover:bg-white dark:bg-[#121318]/90 dark:ring-white/10 dark:hover:bg-[#1a1b22] border-0"
                />
            )}
        </div>
    );

    if (safeImages.length === 0) {
        return (
            <div className={cn("flex flex-col gap-3", className)}>
                <div className="relative w-full overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] ring-1 ring-black/6 dark:ring-white/8">
                    <div className="flex aspect-square w-full items-center justify-center text-sm text-custom-secondary">
                        {t("product.noImage", "No image")}
                    </div>
                    {actions}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="relative w-full overflow-hidden rounded-2xl bg-[color-mix(in_srgb,var(--color-api-second)_8%,var(--color-bg-card))] ring-1 ring-black/6 dark:ring-white/8">
                <div className="aspect-square w-full">
                    <div className="relative h-full w-full">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={safeImages[selectedIndex]}
                                className="absolute inset-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: MAIN_IMAGE_TRANSITION_SECONDS,
                                    ease: "easeOut",
                                }}
                            >
                                <LazyImage
                                    src={safeImages[selectedIndex]}
                                    alt={t("product.imageAlt", {
                                        current: selectedIndex + 1,
                                        total: safeImages.length,
                                        defaultValue: "Product image {{current}} of {{total}}",
                                    })}
                                    className="h-full w-full object-contain p-4 sm:p-6"
                                    wrapperClassName="h-full w-full"
                                    effect=""
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {actions}

                {safeImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(-1)}
                            className="absolute start-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-text-primary shadow-sm ring-1 ring-black/8 hover:bg-white dark:bg-[#121318]/90 dark:ring-white/10"
                            aria-label={t("product.previousImage", "Previous image")}
                        >
                            {isRTL ? (
                                <HiChevronRight className="h-5 w-5" />
                            ) : (
                                <HiChevronLeft className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(1)}
                            className="absolute end-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-text-primary shadow-sm ring-1 ring-black/8 hover:bg-white dark:bg-[#121318]/90 dark:ring-white/10"
                            aria-label={t("product.nextImage", "Next image")}
                        >
                            {isRTL ? (
                                <HiChevronLeft className="h-5 w-5" />
                            ) : (
                                <HiChevronRight className="h-5 w-5" />
                            )}
                        </button>
                        <span className="absolute bottom-3 start-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
                            {selectedIndex + 1} / {safeImages.length}
                        </span>
                    </>
                )}
            </div>

            {safeImages.length > 1 && (
                <div className="relative flex items-center">
                    {canGoPrev && (
                        <button
                            type="button"
                            onClick={() =>
                                setThumbnailStartIndex((prev) => Math.max(0, prev - 1))
                            }
                            className="absolute start-0 z-10 grid h-8 w-8 place-items-center rounded-full bg-custom-card shadow-sm ring-1 ring-black/8 dark:ring-white/10"
                            aria-label={t("product.previousThumbnails", "Previous thumbnails")}
                        >
                            {isRTL ? (
                                <HiChevronRight className="h-4 w-4" />
                            ) : (
                                <HiChevronLeft className="h-4 w-4" />
                            )}
                        </button>
                    )}

                    <div className="mx-auto flex w-full justify-center gap-2 overflow-x-auto px-10 py-0.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                        {visibleThumbnails.map((image, idx) => {
                            const actualIndex = thumbnailStartIndex + idx;
                            return (
                                <ThumbnailButton
                                    key={`${image}-${actualIndex}`}
                                    image={image}
                                    index={actualIndex}
                                    isSelected={selectedIndex === actualIndex}
                                    onSelect={handleThumbnailSelect}
                                    label={t("product.thumbnailAlt", {
                                        index: actualIndex + 1,
                                        defaultValue: "Thumbnail {{index}}",
                                    })}
                                />
                            );
                        })}
                    </div>

                    {canGoNext && (
                        <button
                            type="button"
                            onClick={() =>
                                setThumbnailStartIndex((prev) =>
                                    Math.min(
                                        safeImages.length - THUMBNAILS_TO_SHOW,
                                        prev + 1,
                                    ),
                                )
                            }
                            className="absolute end-0 z-10 grid h-8 w-8 place-items-center rounded-full bg-custom-card shadow-sm ring-1 ring-black/8 dark:ring-white/10"
                            aria-label={t("product.nextThumbnails", "Next thumbnails")}
                        >
                            {isRTL ? (
                                <HiChevronLeft className="h-4 w-4" />
                            ) : (
                                <HiChevronRight className="h-4 w-4" />
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

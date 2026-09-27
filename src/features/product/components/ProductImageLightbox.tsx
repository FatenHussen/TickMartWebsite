import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { HiChevronLeft, HiChevronRight, HiX } from "react-icons/hi";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";

type ProductImageLightboxProps = {
    images: string[];
    index: number;
    onIndexChange: (index: number) => void;
    onClose: () => void;
};

export default function ProductImageLightbox({
    images,
    index,
    onIndexChange,
    onClose,
}: ProductImageLightboxProps) {
    const { t } = useTranslation();
    const { isRTL } = useLanguage();
    const [zoomed, setZoomed] = useState(false);
    const safeIndex = images.length === 0 ? 0 : Math.min(index, images.length - 1);
    const src = images[safeIndex];

    useEffect(() => {
        setZoomed(false);
    }, [safeIndex]);

    useEffect(() => {
        const previousBody = document.body.style.overflow;
        const previousHtml = document.documentElement.style.overflow;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousBody;
            document.documentElement.style.overflow = previousHtml;
        };
    }, []);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
                return;
            }
            if (images.length < 2) return;
            if (event.key === "ArrowLeft") {
                event.stopPropagation();
                onIndexChange(step(safeIndex, isRTL ? 1 : -1, images.length));
            }
            if (event.key === "ArrowRight") {
                event.stopPropagation();
                onIndexChange(step(safeIndex, isRTL ? -1 : 1, images.length));
            }
        };
        window.addEventListener("keydown", onKey, true);
        return () => window.removeEventListener("keydown", onKey, true);
    }, [images.length, isRTL, onClose, onIndexChange, safeIndex]);

    if (!src) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/88 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t("product.zoomImage", "Zoom image")}
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-text-primary shadow-sm"
                aria-label={t("product.closeZoom", "Close zoom")}
            >
                <HiX className="h-6 w-6" />
            </button>

            {images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onIndexChange(step(safeIndex, -1, images.length));
                        }}
                        className="absolute start-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-text-primary shadow-sm"
                        aria-label={t("product.previousImage", "Previous image")}
                    >
                        {isRTL ? (
                            <HiChevronRight className="h-6 w-6" />
                        ) : (
                            <HiChevronLeft className="h-6 w-6" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onIndexChange(step(safeIndex, 1, images.length));
                        }}
                        className="absolute end-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-text-primary shadow-sm"
                        aria-label={t("product.nextImage", "Next image")}
                    >
                        {isRTL ? (
                            <HiChevronLeft className="h-6 w-6" />
                        ) : (
                            <HiChevronRight className="h-6 w-6" />
                        )}
                    </button>
                </>
            )}

            <div
                className="max-h-[90vh] max-w-[92vw] overflow-auto"
                onClick={(event) => event.stopPropagation()}
            >
                <img
                    src={src}
                    alt={t("product.imageAlt", {
                        current: safeIndex + 1,
                        total: images.length,
                        defaultValue: "Product image {{current}} of {{total}}",
                    })}
                    onClick={() => setZoomed((current) => !current)}
                    className={cn(
                        "object-contain",
                        zoomed
                            ? "h-auto w-[min(160vw,1400px)] max-w-none cursor-zoom-out"
                            : "max-h-[90vh] max-w-[92vw] cursor-zoom-in",
                    )}
                />
            </div>
        </div>,
        document.body,
    );
}

function step(index: number, dir: -1 | 1, length: number) {
    const next = index + dir;
    if (next < 0) return length - 1;
    if (next >= length) return 0;
    return next;
}

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { localize } from "../utils/localize";
import type { Language, PopupMedia as PopupMediaType } from "../types";

type Props = {
    media: PopupMediaType;
    lang: Language;
    title: string;
    isFullScreen?: boolean;
};

export function PopupMedia({ media, lang, title, isFullScreen }: Props) {
    const [loaded, setLoaded] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const alt = media.alt ? localize(media.alt, lang) : title;

    // Pause video when scrolled out of view (battery / CPU friendly)
    useEffect(() => {
        if (media.type !== "video" || !videoRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    videoRef.current?.play().catch(() => {});
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(videoRef.current);
        return () => observer.disconnect();
    }, [media.type]);

    if (!media.path) return null;

    const containerClass = isFullScreen
        ? "relative h-72 lg:h-full lg:col-span-7"
        : "relative h-64 md:h-full";

    return (
        <div ref={containerRef} className={containerClass}>
            {/* Skeleton shimmer while loading */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-white/10" />
            )}

            {(media.type === "image" || media.type === "gif") && (
                <motion.img
                    src={media.path}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setLoaded(true)}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 1.08 }}
                    transition={{ opacity: { duration: 0.4 }, scale: { duration: 6, ease: "easeOut" } }}
                    className="w-full h-full object-cover"
                />
            )}

            {media.type === "video" && (
                <video
                    ref={videoRef}
                    src={media.path}
                    poster={media.poster ?? undefined}
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setLoaded(true)}
                    className="w-full h-full object-cover"
                    aria-label={alt}
                />
            )}

            {/* Gradient overlays — legibility + a soft blend into the content panel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute inset-0 hidden md:block bg-gradient-to-l from-black/25 to-transparent rtl:bg-gradient-to-r" />
        </div>
    );
}

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type LazyImageProps = {
    src: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    /** Fires when the source fails to load, so callers can swap in their own fallback. */
    onError?: () => void;
    /** Pass `""` to skip the blur wrapper so the image can be centered with flex (e.g. logos). */
    effect?: "blur" | "opacity" | "black-and-white" | "";
};

export default function LazyImage({
    src,
    alt,
    className,
    wrapperClassName,
    onError,
    effect = "blur",
}: LazyImageProps) {
    /** Library types omit `""`; empty string disables blur wrapper (see BrandCard). */
    const effectProp =
        effect === "" ? undefined : (effect as "blur" | "opacity" | "black-and-white");
    return (
        <LazyLoadImage
            src={src}
            alt={alt}
            className={className}
            wrapperClassName={wrapperClassName}
            effect={effectProp}
            onError={onError}
            threshold={100}
        />
    );
}

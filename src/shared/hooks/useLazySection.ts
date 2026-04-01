import { useRef, useState, useEffect } from "react";

/**
 * Returns a ref and a boolean `isVisible`.
 * Attach the ref to a wrapper element; `isVisible` turns true once the element
 * enters the viewport (with an optional rootMargin for pre-loading).
 * Use `isVisible` as the `enabled` flag for React Query hooks so the API call
 * is deferred until the section is about to appear on screen.
 */
export function useLazySection(rootMargin = "200px") {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin, isVisible]);

    return { ref, isVisible };
}

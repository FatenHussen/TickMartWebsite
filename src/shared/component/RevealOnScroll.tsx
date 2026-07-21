import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type RevealOnScrollProps = {
    children: ReactNode;
    /** Stagger delay in ms applied to the fade/slide transition. */
    delayMs?: number;
    className?: string;
};

/**
 * Lightweight, transform+opacity-only entrance reveal.
 * Uses a single IntersectionObserver per item, unobserves once shown, and
 * fully yields to `prefers-reduced-motion` (handled in CSS). No layout shift:
 * the element occupies its final box from first paint — only opacity/transform animate.
 */
export default function RevealOnScroll({
    children,
    delayMs = 0,
    className,
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        io.unobserve(entry.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn("reveal-on-scroll", visible && "is-visible", className)}
            style={delayMs && !visible ? { transitionDelay: `${delayMs}ms` } : undefined}
        >
            {children}
        </div>
    );
}

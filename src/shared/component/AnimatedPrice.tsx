import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface AnimatedPriceProps {
    /** Numeric value to display (animated on change) */
    value: number;
    /** Prefix rendered before the number, e.g. "$" or "-$" */
    prefix?: string;
    /** Suffix rendered after the number */
    suffix?: string;
    /** Decimal places (default 2) */
    decimals?: number;
    /** Count-up duration in ms (default 240) */
    duration?: number;
    className?: string;
}

const EASE = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic

/**
 * Animates a price between values with a brief count-up and a subtle pulse.
 * Pure transform/opacity, ~240ms, honours prefers-reduced-motion.
 */
export default function AnimatedPrice({
    value,
    prefix = "",
    suffix = "",
    decimals = 2,
    duration = 240,
    className,
}: AnimatedPriceProps) {
    const [display, setDisplay] = useState(value);
    const [pulse, setPulse] = useState(false);
    const fromRef = useRef(value);
    const rafRef = useRef<number | null>(null);
    const firstRef = useRef(true);

    useEffect(() => {
        // Skip animating the very first render.
        if (firstRef.current) {
            firstRef.current = false;
            fromRef.current = value;
            setDisplay(value);
            return;
        }

        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const from = fromRef.current;
        const to = value;
        if (from === to) return;

        setPulse(true);
        const pulseTimer = window.setTimeout(() => setPulse(false), 260);

        if (reduce) {
            fromRef.current = to;
            setDisplay(to);
            return () => window.clearTimeout(pulseTimer);
        }

        let start: number | null = null;
        const tick = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setDisplay(from + (to - from) * EASE(p));
            if (p < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                fromRef.current = to;
            }
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.clearTimeout(pulseTimer);
            fromRef.current = to;
        };
    }, [value, duration]);

    return (
        <span
            className={cn(
                "inline-block tabular-nums transition-transform duration-200 ease-out will-change-transform",
                pulse && "scale-[1.06] motion-reduce:scale-100",
                className
            )}
        >
            {prefix}
            {display.toFixed(decimals)}
            {suffix}
        </span>
    );
}

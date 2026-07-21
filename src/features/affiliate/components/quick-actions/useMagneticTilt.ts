import { useRef } from "react";
import {
    useMotionValue,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";

type TiltOptions = {
    /** Maximum rotation in degrees on each axis. */
    max?: number;
    /** When false, pointer input is ignored and the surface stays flat. */
    enabled?: boolean;
    stiffness?: number;
    damping?: number;
};

export type MagneticTilt = {
    ref: React.RefObject<HTMLDivElement | null>;
    rotateX: MotionValue<number>;
    rotateY: MotionValue<number>;
    /** Cursor position (0–100%) for a light/glow that follows the pointer. */
    glowX: MotionValue<string>;
    glowY: MotionValue<string>;
    /** 0 → 1 spring that eases the glow in while the pointer is over the surface. */
    pointerActive: MotionValue<number>;
    handlers: {
        onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
        onPointerEnter: (event: React.PointerEvent<HTMLDivElement>) => void;
        onPointerLeave: () => void;
    };
};

/**
 * Pointer-driven 3D tilt with spring physics. Returns motion values for
 * `rotateX`/`rotateY` (apply to a `perspective` parent) plus a cursor-following
 * glow position. Children given `translateZ` parallax against the tilt.
 */
export function useMagneticTilt({
    max = 8,
    enabled = true,
    stiffness = 220,
    damping = 20,
}: TiltOptions = {}): MagneticTilt {
    const ref = useRef<HTMLDivElement | null>(null);

    const nx = useMotionValue(0.5);
    const ny = useMotionValue(0.5);
    const active = useMotionValue(0);

    const spring = { stiffness, damping, mass: 0.5 };
    const sx = useSpring(nx, spring);
    const sy = useSpring(ny, spring);
    const pointerActive = useSpring(active, { stiffness: 160, damping: 26 });

    // Invert X so the top edge leans away from the cursor (natural parallax).
    const rotateX = useTransform(sy, [0, 1], [max, -max]);
    const rotateY = useTransform(sx, [0, 1], [-max, max]);
    const glowX = useTransform(sx, [0, 1], ["0%", "100%"]);
    const glowY = useTransform(sy, [0, 1], ["0%", "100%"]);

    function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (!enabled || event.pointerType === "touch") return;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        nx.set((event.clientX - rect.left) / rect.width);
        ny.set((event.clientY - rect.top) / rect.height);
    }

    function onPointerEnter(event: React.PointerEvent<HTMLDivElement>) {
        if (!enabled || event.pointerType === "touch") return;
        active.set(1);
    }

    function onPointerLeave() {
        nx.set(0.5);
        ny.set(0.5);
        active.set(0);
    }

    return {
        ref,
        rotateX,
        rotateY,
        glowX,
        glowY,
        pointerActive,
        handlers: { onPointerMove, onPointerEnter, onPointerLeave },
    };
}

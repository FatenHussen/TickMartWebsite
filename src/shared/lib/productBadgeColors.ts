import type { CSSProperties } from "react";

import { hexToRgb, type RGB } from "@/shared/lib/colorUtils";

/** Maps API badge `color` keys to Tailwind classes (used for product cards, shop listings, etc.) */
export const productBadgeColorMap: Record<string, string> = {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    primary: "bg-blue-500 text-white",
    info: "bg-blue-500 text-white",
};

export type ProductBadgeAppearance = {
    className: string;
    style?: CSSProperties;
};

function parseRgbCss(value: string): RGB | null {
    const m = value
        .trim()
        .match(
            /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i,
        );
    if (!m) return null;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}

/** Normalize `#RGB` / `#RRGGBB` / `RRGGBB` / `rgb()` from the dashboard color picker. */
export function parseBadgeCssColor(raw: string): string | null {
    const s = raw.trim();
    if (!s) return null;

    if (/^rgba?\(/i.test(s) || /^hsla?\(/i.test(s)) return s;

    let hex = s.startsWith("#") ? s.slice(1) : s;
    if (/^[0-9a-f]{3}$/i.test(hex) || /^[0-9a-f]{6}$/i.test(hex) || /^[0-9a-f]{8}$/i.test(hex)) {
        if (hex.length === 8) hex = hex.slice(0, 6);
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((c) => c + c)
                .join("");
        }
        return `#${hex.toLowerCase()}`;
    }

    return null;
}

function contrastOn(background: string): string {
    const rgb = background.startsWith("#")
        ? hexToRgb(background)
        : parseRgbCss(background);
    if (!rgb || [rgb.r, rgb.g, rgb.b].some((n) => Number.isNaN(n))) {
        return "#ffffff";
    }
    const y = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return y > 160 ? "#1c1917" : "#ffffff";
}

/**
 * Resolve `color` from the API / database:
 * - named keys (`success`, `danger`, …) → Tailwind classes
 * - hex / rgb from the admin color picker → inline background
 * - already a utility class (`bg-red-500`) → used as-is
 */
export function resolveProductBadgeAppearance(
    color?: string | null,
): ProductBadgeAppearance {
    const raw = (color ?? "").trim();
    if (!raw) return { className: "bg-blue-500 text-white" };

    const key = raw.toLowerCase();
    if (productBadgeColorMap[key]) {
        return { className: productBadgeColorMap[key] };
    }

    if (/\b(bg-|text-|from-|to-)/.test(raw)) {
        return { className: raw };
    }

    const css = parseBadgeCssColor(raw);
    if (css) {
        return {
            className: "",
            style: {
                backgroundColor: css,
                color: contrastOn(css),
            },
        };
    }

    return { className: "bg-blue-500 text-white" };
}

/** Resolve `color` from API (case-insensitive) to badge `className` */
export function getProductBadgeClassName(color?: string | null): string {
    return resolveProductBadgeAppearance(color).className || "bg-blue-500 text-white";
}

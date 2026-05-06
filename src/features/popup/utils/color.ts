import type { PopupColors, PopupTheme } from "../types";

// ─── Color picker ─────────────────────────────────────────────────────────────

function pickFrom(source: unknown, keys: string[]): string | undefined {
    if (!source || typeof source !== "object") return undefined;
    const rec = source as Record<string, unknown>;
    for (const key of keys) {
        const v = rec[key];
        if (typeof v === "string" && v.trim()) return v.trim();
    }
    return undefined;
}

// ─── Luminance / contrast ─────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
    const clean = hex.replace("#", "");
    const full =
        clean.length === 3
            ? clean
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : clean;
    if (full.length !== 6) return null;
    const num = parseInt(full, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function relativeLuminance(r: number, g: number, b: number): number {
    const [sr, sg, sb] = [r / 255, g / 255, b / 255].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * sr + 0.7152 * sg + 0.0722 * sb;
}

/**
 * Returns "#ffffff" or "#000000" for maximum contrast against the given hex
 * background. Falls back to white when color can't be parsed.
 */
export function contrastText(background: string): string {
    const rgb = hexToRgb(background);
    if (!rgb) return "#ffffff";
    const lum = relativeLuminance(...rgb);
    // WCAG ratio: (lighter + 0.05) / (darker + 0.05)
    // white lum = 1, black lum = 0
    const whiteContrast = (1.05) / (lum + 0.05);
    const blackContrast = (lum + 0.05) / (0.05);
    return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

// ─── Theme resolver ───────────────────────────────────────────────────────────

const MAIN_KEYS = ["main", "primary", "main_color", "primary_color"];
const SECONDARY_KEYS = [
    "secondary",
    "secondary_color",
    "accent",
    "accent_color",
];
const TEXT_KEYS = ["text", "text_color", "foreground", "font_color"];

const DEFAULTS: PopupTheme = {
    main: "#0ea5e9",
    secondary: "#f59e0b",
    text: "#ffffff",
};

export function resolveTheme(
    colors?: PopupColors | null,
    theme?: PopupColors | null
): PopupTheme {
    const sources = [colors, theme];

    const main =
        sources.map((s) => pickFrom(s, MAIN_KEYS)).find(Boolean) ??
        DEFAULTS.main;
    const secondary =
        sources.map((s) => pickFrom(s, SECONDARY_KEYS)).find(Boolean) ??
        DEFAULTS.secondary;
    const text =
        sources.map((s) => pickFrom(s, TEXT_KEYS)).find(Boolean) ??
        contrastText(main);

    return { main, secondary, text };
}

/** Placeholder when a color attribute has no catalog `hex`. Names are labels only. */
export const MISSING_SWATCH_FILL = "rgb(161 161 170)";

export function isColorAttributeType(type: string | null | undefined): boolean {
    return String(type ?? "").trim().toLowerCase() === "color";
}

/**
 * A color attribute may stay stored as `type: "square"`.
 * Swatches still apply when the label is exactly `Color` or `اللون`.
 */
const COLOR_ATTRIBUTE_NAMES = new Set(["color", "اللون"]);

/** Swatch row: `type: "color"`, or the label `Color` / `اللون` with `type` left unchanged. */
export function isColorPickerAttribute(input: {
    type?: string | null;
    attribute?: string | null;
}): boolean {
    if (isColorAttributeType(input.type)) return true;
    const name = String(input.attribute ?? "").trim().toLowerCase();
    return COLOR_ATTRIBUTE_NAMES.has(name);
}

/**
 * `#RGB` / `#RRGGBB` → opaque `rgb(r g b)`.
 * An alpha digit (`#RGBA`, `#RRGGBBAA`) is dropped so the fill stays opaque.
 * Anything else — including a color name — is not a swatch color.
 */
export function opaqueRgbFromHex(hex: string | null | undefined): string | null {
    if (hex == null) return null;
    let s = hex.trim();
    if (!s) return null;
    if (s.startsWith("#")) s = s.slice(1);
    if (!/^[0-9a-fA-F]+$/.test(s)) return null;

    let r: number;
    let g: number;
    let b: number;
    if (s.length === 3 || s.length === 4) {
        r = parseInt(s[0] + s[0], 16);
        g = parseInt(s[1] + s[1], 16);
        b = parseInt(s[2] + s[2], 16);
    } else if (s.length === 6 || s.length === 8) {
        r = parseInt(s.slice(0, 2), 16);
        g = parseInt(s.slice(2, 4), 16);
        b = parseInt(s.slice(4, 6), 16);
    } else {
        return null;
    }
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return `rgb(${r} ${g} ${b})`;
}

/**
 * Swatch fill from `options[].hex` or `attributes[].hex` only.
 * A missing or invalid hex stays gray — the shade is not guessed from the name.
 */
export function cssColorForSwatch(options: { hex?: string | null }): string {
    return opaqueRgbFromHex(options.hex) ?? MISSING_SWATCH_FILL;
}

/** Light fills need a visible rim + dark check, not a white glyph. */
export function isLightSwatchFill(fill: string): boolean {
    const s = fill.toLowerCase();
    if (s.includes("255 255 255") || s.includes("255,255,255")) return true;
    const hsl = s.match(/hsl\(\s*[\d.]+\s+[\d.]+%\s+(\d+(?:\.\d+)?)%\s*\)/);
    if (hsl) return Number(hsl[1]) >= 78;
    const rgb = s.match(/rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*\)/);
    if (rgb) {
        const [r, g, b] = rgb.slice(1).map(Number);
        return (r * 299 + g * 587 + b * 114) / 1000 > 210;
    }
    return false;
}

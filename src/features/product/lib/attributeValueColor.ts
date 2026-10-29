/** Placeholder when a color attribute has no catalog `hex`. Names are labels only. */
export const MISSING_SWATCH_FILL = "rgb(161 161 170)";

export function isColorAttributeType(type: string | null | undefined): boolean {
    return String(type ?? "").trim().toLowerCase() === "color";
}

/**
 * A color attribute may stay stored as `type: "square"`.
 * Swatches still apply for these labels. The stored `type` is never rewritten.
 */
const COLOR_ATTRIBUTE_NAMES = new Set([
    "color",
    "colour",
    "اللون",
    "لون",
    "الالوان",
    "الألوان",
    "الوان",
    "ألوان",
]);

function colorNameCandidates(name: unknown): string[] {
    if (typeof name === "string") return [name];
    if (name && typeof name === "object" && !Array.isArray(name)) {
        const localized = name as { ar?: unknown; en?: unknown };
        return [localized.ar, localized.en].filter(
            (part): part is string => typeof part === "string",
        );
    }
    return [];
}

/** Swatch row: `type: "color"`, or a color label, with `type` left unchanged. */
export function isColorPickerAttribute(input: {
    type?: string | null;
    attribute?: unknown;
}): boolean {
    if (isColorAttributeType(input.type)) return true;
    return colorNameCandidates(input.attribute).some((part) =>
        COLOR_ATTRIBUTE_NAMES.has(part.trim().toLowerCase().normalize("NFC")),
    );
}

/**
 * `#RGB` / `#RRGGBB` → opaque `rgb(r g b)`.
 * A name, an empty value, or any other length is not a swatch color.
 */
export function opaqueRgbFromHex(hex: string | null | undefined): string | null {
    if (hex == null) return null;
    let s = hex.trim();
    if (!s) return null;
    if (s.startsWith("#")) s = s.slice(1);
    if (s.length === 3) s = s.split("").map((c) => `${c}${c}`).join("");
    if (s.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(s)) return null;
    const value = Number.parseInt(s, 16);
    if (!Number.isFinite(value)) return null;
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
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

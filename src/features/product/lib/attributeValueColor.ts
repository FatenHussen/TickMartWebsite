/** True if the label looks like a hex code — hide as text next to swatch */
export function isLikelyHexColorLabel(name: string): boolean {
    const s = name.trim();
    return /^#?[0-9a-fA-F]{3,8}$/.test(s);
}

/** Convert #RGB / #RRGGBB to `rgb(r g b)` (no hex in CSS value) */
function hexLabelToRgb(label: string): string | null {
    let s = label.trim();
    if (s.startsWith("#")) s = s.slice(1);
    if (s.length === 3) {
        const r = parseInt(s[0] + s[0], 16);
        const g = parseInt(s[1] + s[1], 16);
        const b = parseInt(s[2] + s[2], 16);
        return `rgb(${r} ${g} ${b})`;
    }
    if (s.length === 6) {
        const r = parseInt(s.slice(0, 2), 16);
        const g = parseInt(s.slice(2, 4), 16);
        const b = parseInt(s.slice(4, 6), 16);
        if ([r, g, b].some((n) => Number.isNaN(n))) return null;
        return `rgb(${r} ${g} ${b})`;
    }
    return null;
}

/**
 * CSS color for `type: "color"` swatches — prefers HSL / `rgb()` (no `#hex` in style).
 * Named colors (EN/AR); hex-like labels become `rgb()`; unknown text uses stable HSL from id.
 */
export function cssColorForAttributeLabel(id: number, label: string): string {
    if (isLikelyHexColorLabel(label)) {
        const rgb = hexLabelToRgb(label);
        if (rgb) return rgb;
    }

    const raw = label.trim().toLowerCase();

    const entries: { keys: string[]; hsl: string }[] = [
        { keys: ["gold", "ذهبي", "ذهب"], hsl: "hsl(43 74% 49%)" },
        { keys: ["silver", "فضي", "فضة"], hsl: "hsl(0 0% 75%)" },
        { keys: ["navy", "كحلي", "كحلي"], hsl: "hsl(222 47% 28%)" },
        { keys: ["beige", "بيج"], hsl: "hsl(39 43% 82%)" },
        { keys: ["cream", "كريمي", "عاجي"], hsl: "hsl(40 50% 90%)" },
        { keys: ["maroon", "نبيذي", "خمري"], hsl: "hsl(345 70% 28%)" },
        { keys: ["olive", "زيتي", "زيتوني"], hsl: "hsl(80 30% 36%)" },
        { keys: ["teal", "تركواز", "فيروزي"], hsl: "hsl(174 72% 40%)" },
        { keys: ["cyan", "سماوي"], hsl: "hsl(187 80% 42%)" },
        { keys: ["indigo", "نيلي"], hsl: "hsl(243 54% 49%)" },
        { keys: ["magenta", "فوشيا", "فوشي"], hsl: "hsl(300 76% 47%)" },
        { keys: ["copper", "نحاسي", "نحاسي"], hsl: "hsl(18 65% 48%)" },
        { keys: ["black", "أسود"], hsl: "hsl(0 0% 10%)" },
        { keys: ["white", "أبيض"], hsl: "hsl(0 0% 100%)" },
        { keys: ["red", "أحمر"], hsl: "hsl(4 90% 58%)" },
        { keys: ["blue", "أزرق"], hsl: "hsl(207 90% 54%)" },
        { keys: ["green", "أخضر"], hsl: "hsl(122 47% 49%)" },
        { keys: ["yellow", "أصفر"], hsl: "hsl(54 96% 58%)" },
        { keys: ["orange", "برتقال", "برتقالي"], hsl: "hsl(36 100% 50%)" },
        { keys: ["purple", "بنفسج", "بنفسجي"], hsl: "hsl(291 64% 42%)" },
        { keys: ["pink", "وردي", "زهري"], hsl: "hsl(340 82% 59%)" },
        { keys: ["brown", "بني"], hsl: "hsl(16 25% 38%)" },
        { keys: ["gray", "grey", "رمادي"], hsl: "hsl(0 0% 62%)" },
    ];

    for (const { keys, hsl } of entries) {
        if (keys.some((k) => raw.includes(k.toLowerCase()))) return hsl;
    }

    const hue = (id * 47) % 360;
    return `hsl(${hue} 58% 46%)`;
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

/**
 * Color manipulation utilities for dynamic theme generation.
 * Converts between hex/RGB and produces lighter/darker/alpha variants
 * from a single seed color provided by the API.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** Parse any 3-,4-,6-, or 8-digit hex string into RGB (ignores alpha). */
export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "");
  if (h.length === 3 || h.length === 4) {
    h = h
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(h.slice(0, 6), 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Convert RGB → HSL (h: 0-360, s: 0-100, l: 0-100). */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6;
  else if (max === gN) h = ((bN - rN) / d + 2) / 6;
  else h = ((rN - gN) / d + 4) / 6;

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Convert HSL → RGB. */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;

  let rN = 0,
    gN = 0,
    bN = 0;
  if (h < 60) [rN, gN, bN] = [c, x, 0];
  else if (h < 120) [rN, gN, bN] = [x, c, 0];
  else if (h < 180) [rN, gN, bN] = [0, c, x];
  else if (h < 240) [rN, gN, bN] = [0, x, c];
  else if (h < 300) [rN, gN, bN] = [x, 0, c];
  else [rN, gN, bN] = [c, 0, x];

  return {
    r: Math.round((rN + m) * 255),
    g: Math.round((gN + m) * 255),
    b: Math.round((bN + m) * 255),
  };
}

/**
 * Lighten a hex color by `amount` (0-100).
 * Works in HSL space for perceptually uniform results.
 */
export function lighten(hex: string, amount: number): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl.l = Math.min(100, hsl.l + amount);
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Darken a hex color by `amount` (0-100).
 */
export function darken(hex: string, amount: number): string {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl.l = Math.max(0, hsl.l - amount);
  return rgbToHex(hslToRgb(hsl));
}

/** Return `rgba(r,g,b,alpha)` string from a hex color. */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Mix a color toward white (tint) or black (shade) by a ratio 0-1.
 * ratio=0 → original, ratio=1 → pure white/black.
 */
export function tint(hex: string, ratio: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r + (255 - r) * ratio,
    g: g + (255 - g) * ratio,
    b: b + (255 - b) * ratio,
  });
}

export function shade(hex: string, ratio: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({
    r: r * (1 - ratio),
    g: g * (1 - ratio),
    b: b * (1 - ratio),
  });
}

const CURRENCY_TOKENS =
  /ل\.س|ر\.س|د\.إ|ج\.م|\$|€|£|USD|EUR|GBP|SYP|SAR|AED|EGP/gi;

/**
 * Convert an API value to a number.
 * Strip currency text first: the dot in `ل.س` is not a decimal point.
 * `"ل.س 585"` must stay 585, not 0.585.
 */
export function toNum(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  let s = String(v ?? "").trim();
  if (!s) return 0;
  if (s.includes(" / ")) s = s.split(/\s*\/\s*/)[0] ?? s;
  s = s.replace(CURRENCY_TOKENS, "");
  s = s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  s = s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  s = s.replace(/٫/g, ".").replace(/[,٬]/g, "");
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

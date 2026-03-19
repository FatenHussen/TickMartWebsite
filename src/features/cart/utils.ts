/** Convert API value (string or number) to number for safe .toFixed() */
export function toNum(v: unknown): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const s = String(v || 0).replace(/[^0-9.-]/g, "");
  return parseFloat(s) || 0;
}

type TFunction = (key: string, opts?: Record<string, unknown>) => string;

/**
 * Converts duration_days from the API into a human-readable duration string.
 *
 * Rules:
 * - duration_days < 30  → "X Days" (e.g. 15 → "15 Days")
 * - 30 ≤ duration_days < 360 → "X Month(s)" (months = duration_days / 30)
 * - duration_days ≥ 360 → "X Year(s)" (years = duration_days / 360)
 *
 * @example
 * formatPackageDuration(15, t)  → "15 Days"
 * formatPackageDuration(30, t)  → "1 Month"
 * formatPackageDuration(90, t)  → "3 Months"
 * formatPackageDuration(360, t) → "1 Year"
 * formatPackageDuration(720, t) → "2 Years"
 */
export function formatPackageDuration(days: number, t: TFunction): string {
  if (days < 30) {
    const key = days === 1 ? "packages.duration.day" : "packages.duration.days";
    return t(key, { count: days });
  }
  if (days < 360) {
    const months = Math.round(days / 30);
    const key = months === 1 ? "packages.duration.month" : "packages.duration.months";
    return t(key, { count: months });
  }
  const years = Math.round(days / 360);
  const key = years === 1 ? "packages.duration.year" : "packages.duration.years";
  return t(key, { count: years });
}

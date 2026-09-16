export function formatPointsRewardDate(value: string, locale?: string): string {
    try {
        const d = new Date(value);
        return isNaN(d.getTime())
            ? value
            : d.toLocaleDateString(locale || undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              });
    } catch {
        return value;
    }
}

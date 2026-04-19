export function formatPointsRewardDate(value: string): string {
    try {
        const d = new Date(value);
        return isNaN(d.getTime())
            ? value
            : d.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
              });
    } catch {
        return value;
    }
}

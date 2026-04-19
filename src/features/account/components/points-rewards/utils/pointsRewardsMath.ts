/** Parse next reward threshold from strings like "Next reward at 1,000 pts" */
export function parseNextRewardThreshold(text: string): number | null {
    const match = text?.match(/(\d[\d,]*)/);
    if (!match) return null;
    return parseInt(match[1].replace(/,/g, ""), 10) || null;
}

/** Parse point value multiplier from strings like "1 pt = 10 $" */
export function getPointValueMultiplier(value?: { point_value?: string }): number {
    if (!value?.point_value) return 10;
    const match = value.point_value.match(/=\s*([\d.,]+)/);
    return match ? parseFloat(match[1].replace(/,/g, "")) || 10 : 10;
}

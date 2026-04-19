export function formatReviewDate(createdAt: string): string {
    try {
        return new Date(createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    } catch {
        return createdAt;
    }
}

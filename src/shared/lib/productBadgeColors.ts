/** Maps API badge `color` keys to Tailwind classes (used for product cards, shop listings, etc.) */
export const productBadgeColorMap: Record<string, string> = {
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    primary: "bg-blue-500 text-white",
    info: "bg-blue-500 text-white",
};

/** Resolve `color` from API (case-insensitive) to badge `className` */
export function getProductBadgeClassName(color?: string | null): string {
    const key = (color ?? "").toLowerCase();
    return productBadgeColorMap[key] ?? "bg-blue-500 text-white";
}

/** Strips tags for plain display; SSR-safe fallback without DOM. */
export function stripHtmlTags(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (typeof document === "undefined") {
        return trimmed.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    }
    const el = document.createElement("div");
    el.innerHTML = trimmed;
    return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

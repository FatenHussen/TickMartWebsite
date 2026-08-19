/**
 * Backend storage root. Not derived from the axios `baseURL`: that is `/api`
 * behind the Vite proxy in dev, while storage paths live outside `/api` and are
 * always served from the backend host.
 */
const STORAGE_BASE = "https://tickdash.tickmartsy.com/storage";

/**
 * Absolute URL for an image path the API sent relative to its storage root
 * (e.g. `categories/image1.jpg`). Already-absolute URLs pass through untouched.
 */
export function toStorageUrl(path: string | null | undefined): string | null {
    const trimmed = path?.trim();
    if (!trimmed) return null;
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
        return trimmed;
    }
    return `${STORAGE_BASE}/${trimmed.replace(/^\/+/, "")}`;
}

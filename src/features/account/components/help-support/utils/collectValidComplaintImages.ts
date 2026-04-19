import {
    ALLOWED_COMPLAINT_IMAGE_MIME_TYPES,
    MAX_COMPLAINT_IMAGE_SIZE_MB,
    MAX_COMPLAINT_IMAGES,
} from "../constants";

const MAX_BYTES = MAX_COMPLAINT_IMAGE_SIZE_MB * 1024 * 1024;

function isAllowedImageFile(file: File): boolean {
    if (file.size > MAX_BYTES) return false;
    if (!/\.(jpe?g|png)$/i.test(file.name)) return false;
    return (ALLOWED_COMPLAINT_IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
}

/** Appends valid files to previous list, capped at {@link MAX_COMPLAINT_IMAGES}. */
export function mergeComplaintImageFiles(previous: File[], incoming: FileList | null): File[] {
    if (!incoming) return previous;
    const list = Array.from(incoming).filter(isAllowedImageFile);
    return [...previous, ...list].slice(0, MAX_COMPLAINT_IMAGES);
}

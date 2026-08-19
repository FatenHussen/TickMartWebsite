/**
 * Section items carry `link` as either an in-app path (`/product/12`) or an
 * absolute URL pointing somewhere else entirely (`https://…`). Handing an
 * absolute URL to react-router's `navigate` pushes it as a relative route and
 * lands on a 404, so external links have to leave the SPA instead.
 */
export function isExternalLink(link: string): boolean {
    const target = link.trim();
    if (!target) return false;
    // scheme-relative (`//host/…`), absolute (`https://host/…`) or an
    // action scheme the browser handles itself (`mailto:`, `tel:`, `whatsapp:`)
    return /^\/\//.test(target) || /^[a-z][a-z0-9+.-]*:/i.test(target);
}

/** Follow a section item's `link`, in-app or out. */
export function openSectionLink(
    link: string,
    navigate: (to: string) => void
): void {
    const target = link.trim();
    if (!target) return;
    if (isExternalLink(target)) {
        window.open(target, "_blank", "noopener,noreferrer");
        return;
    }
    navigate(target.startsWith("/") ? target : `/${target}`);
}
